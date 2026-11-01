const rules = [
  {
    type: "input",
    field: "baseUrl" as const,
    title: "ComfyUI 地址",
    value: "http://127.0.0.1:8188",
    props: { placeholder: "http://127.0.0.1:8188" },
  },
  {
    type: "input",
    field: "workflow" as const,
    title: "图像工作流 JSON（API 格式）",
    value: `{
  "3": {
    "class_type": "KSampler",
    "inputs": {
      "seed": __SEED__,
      "steps": 20,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": ["4", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["5", 0]
    }
  },
  "4": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": { "ckpt_name": "v1-5-pruned-emaonly.safetensors" }
  },
  "5": {
    "class_type": "EmptyLatentImage",
    "inputs": { "width": __WIDTH__, "height": __HEIGHT__, "batch_size": __BATCH__ }
  },
  "6": {
    "class_type": "CLIPTextEncode",
    "inputs": { "text": "__PROMPT__", "clip": ["4", 1] }
  },
  "7": {
    "class_type": "CLIPTextEncode",
    "inputs": { "text": "__NEGATIVE_PROMPT__", "clip": ["4", 1] }
  },
  "8": {
    "class_type": "VAEDecode",
    "inputs": { "samples": ["3", 0], "vae": ["4", 2] }
  },
  "9": {
    "class_type": "SaveImage",
    "inputs": { "filename_prefix": "carefree", "images": ["8", 0] }
  }
}`,
    props: { type: "textarea", rows: 12, autocomplete: "off" },
  },
  {
    type: "input",
    field: "videoWorkflow" as const,
    title: "视频工作流 JSON（API 格式）",
    value: "",
    props: {
      type: "textarea",
      rows: 12,
      autocomplete: "off",
      placeholder: "粘贴 SVD、Wan、AnimateDiff 等视频工作流，支持 __PROMPT__、__WIDTH__、__HEIGHT__、__FRAMES__、__FPS__、__IMAGE__、__FIRST_FRAME__ 等占位符",
    },
  },
  {
    type: "input",
    field: "negativePrompt" as const,
    title: "负面提示词",
    value: "",
    props: { placeholder: "填入后会替换工作流中的 __NEGATIVE_PROMPT__" },
  },
  {
    type: "input-number",
    field: "width" as const,
    title: "默认宽度",
    value: 512,
    props: { min: 64, max: 4096, step: 64 },
  },
  {
    type: "input-number",
    field: "height" as const,
    title: "默认高度",
    value: 512,
    props: { min: 64, max: 4096, step: 64 },
  },
  {
    type: "input-number",
    field: "videoFps" as const,
    title: "视频帧率",
    value: 8,
    props: { min: 1, max: 60, step: 1 },
  },
  {
    type: "input-number",
    field: "videoFrames" as const,
    title: "默认帧数",
    value: 25,
    props: { min: 1, max: 1000, step: 1, placeholder: "未选择时长时使用" },
  },
] as const;

const version = "1.2.0";

type ComfyFile = { filename: string; subfolder?: string; type?: string };
type ComfyOutput = { images?: ComfyFile[]; gifs?: ComfyFile[]; videos?: ComfyFile[] };
type ComfyHistory = Record<string, {
  outputs?: Record<string, ComfyOutput>;
  status?: { status_str?: string; completed?: boolean; messages?: unknown };
}>;

const imageExtensions = /\.(png|jpe?g|webp|gif)$/i;
const videoExtensions = /\.(mp4|webm|mkv|mov|avi|m4v)$/i;

function jsonString(value: string) {
  return JSON.stringify(value).slice(1, -1);
}

function wait(signal: AbortSignal, ms: number) {
  signal.throwIfAborted();
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function positiveInteger(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

function extensionOf(mimeType?: string) {
  if (/jpe?g/i.test(mimeType ?? "")) return ".jpg";
  if (/webp/i.test(mimeType ?? "")) return ".webp";
  if (/gif/i.test(mimeType ?? "")) return ".gif";
  return ".png";
}

async function mediaBlob(fetcher: typeof fetch, input: MediaInput): Promise<Blob> {
  if (input.type === "url") {
    const response = await fetcher(input.url);
    if (!response.ok) throw new Error(`读取参考图失败：HTTP ${response.status}`);
    return response.blob();
  }
  const bytes = input.type === "base64"
    ? Buffer.from(input.data.replace(/^data:[^;]+;base64,/, ""), "base64")
    : Buffer.from(input.data);
  return new Blob([bytes], { type: input.mimeType || "image/png" });
}

// ACT: 参考图先上传到 ComfyUI 的 input 目录，工作流里的 LoadImage 直接用返回的文件名。
async function uploadImage(fetcher: typeof fetch, baseUrl: string, input: MediaInput, signal: AbortSignal) {
  const form = new FormData();
  form.append("image", await mediaBlob(fetcher, input), `carefree-${Math.random().toString(36).slice(2)}${extensionOf(input.mimeType)}`);
  form.append("type", "input");
  form.append("overwrite", "true");
  const response = await fetcher(`${baseUrl}/upload/image`, { method: "POST", body: form, signal });
  if (!response.ok) throw new Error(`上传参考图失败：HTTP ${response.status}`);
  const result = await response.json() as { name?: string; subfolder?: string };
  if (!result.name) throw new Error("ComfyUI 未返回参考图文件名");
  return result.subfolder ? `${result.subfolder}/${result.name}` : result.name;
}

function renderWorkflow(template: string, values: Record<string, string | number>) {
  let filled = template;
  for (const [key, value] of Object.entries(values)) filled = filled.replaceAll(`__${key}__`, String(value));
  return filled;
}

function parseWorkflow(template: string, values: Record<string, string | number>) {
  const filled = renderWorkflow(template, values);
  const leftover = filled.match(/__[A-Z0-9_]+__/);
  if (leftover) throw new Error(`工作流中的 ${leftover[0]} 没有被替换，请检查占位符或参数`);
  try { return JSON.parse(filled) as unknown; }
  catch { throw new Error("工作流 JSON 无法解析，请检查模板格式并保留占位符"); }
}

// ACT: 取消时同时删除排队任务和中断正在执行的任务，避免 ComfyUI 继续占用显卡。
async function interruptPrompt(fetcher: typeof fetch, baseUrl: string, promptId: string) {
  const init = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delete: [promptId], prompt_id: promptId }),
    signal: AbortSignal.timeout(5000),
  };
  await Promise.allSettled([
    fetcher(`${baseUrl}/queue`, init),
    fetcher(`${baseUrl}/interrupt`, init),
  ]);
}

async function submitPrompt(fetcher: typeof fetch, baseUrl: string, workflow: unknown, signal: AbortSignal) {
  const response = await fetcher(`${baseUrl}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow, client_id: `carefree-${Math.random().toString(36).slice(2)}` }),
    signal,
  });
  if (!response.ok) throw new Error(`提交工作流失败：HTTP ${response.status}`);
  const submitted = await response.json() as { prompt_id?: string; node_errors?: Record<string, unknown> };
  if (submitted.node_errors && Object.keys(submitted.node_errors).length) {
    throw new Error(`工作流节点校验失败：${JSON.stringify(submitted.node_errors).slice(0, 300)}`);
  }
  if (!submitted.prompt_id) throw new Error("提交工作流未返回任务 ID");
  return submitted.prompt_id;
}

async function waitForPrompt(fetcher: typeof fetch, cleanupFetch: typeof fetch, baseUrl: string, promptId: string, signal: AbortSignal) {
  try {
    for (;;) {
      const response = await fetcher(`${baseUrl}/history/${promptId}`, { signal });
      if (!response.ok) throw new Error(`查询任务失败：HTTP ${response.status}`);
      const entry = ((await response.json()) as ComfyHistory)?.[promptId];
      if (entry) {
        if (entry.status?.status_str === "error") throw new Error(`ComfyUI 工作流执行失败：${JSON.stringify(entry.status.messages ?? "").slice(0, 200)}`);
        return entry;
      }
      await wait(signal, 1000);
    }
  } catch (error) {
    // ACT: 中断需绕过已中止的生成信号，否则请求在发出前就被取消，ComfyUI 会继续占用显卡。
    if (signal.aborted) await interruptPrompt(cleanupFetch, baseUrl, promptId);
    throw error;
  }
}

function filesOf(entry: ComfyHistory[string]) {
  const outputs = Object.values(entry.outputs ?? {});
  return outputs.flatMap(output => [...(output.images ?? []), ...(output.gifs ?? []), ...(output.videos ?? [])]);
}

async function downloadFiles(fetcher: typeof fetch, baseUrl: string, entry: ComfyHistory[string], signal: AbortSignal, kind: "image" | "video") {
  const extensions = kind === "image" ? imageExtensions : videoExtensions;
  const files = filesOf(entry).filter(file => extensions.test(file.filename));
  const assets: MediaAsset[] = [];
  for (const file of files.slice(0, 64)) {
    const query = new URLSearchParams({ filename: file.filename, subfolder: file.subfolder ?? "", type: file.type ?? "output" });
    const response = await fetcher(`${baseUrl}/view?${query}`, { signal });
    if (!response.ok) throw new Error(`读取生成文件失败：HTTP ${response.status}`);
    const mimeType = kind === "image"
      ? (/\.(jpe?g)$/i.test(file.filename) ? "image/jpeg" : /\.webp$/i.test(file.filename) ? "image/webp" : /\.gif$/i.test(file.filename) ? "image/gif" : "image/png")
      : (/\.webm$/i.test(file.filename) ? "video/webm" : /\.mkv$/i.test(file.filename) ? "video/x-matroska" : /\.mov$/i.test(file.filename) ? "video/quicktime" : /\.avi$/i.test(file.filename) ? "video/x-msvideo" : "video/mp4");
    assets.push({
      mediaType: kind,
      type: "binary",
      data: new Uint8Array(await response.arrayBuffer()),
      mimeType,
      name: file.filename,
    });
  }
  return assets;
}

function referenceSlots(template: string) {
  return [...template.matchAll(/__IMAGE(_\d+)?__/g)].map(match => match[1] ? Number(match[1]) : 0);
}

function checkSlots(template: string, count: number, options: { mask?: boolean; firstFrame?: boolean; lastFrame?: boolean }) {
  const slots = referenceSlots(template);
  if (count && !slots.length) throw new Error("工作流未包含 __IMAGE__ 占位符，无法使用参考图");
  if (!count && slots.length) throw new Error("工作流包含 __IMAGE__ 占位符，请先提供参考图");
  const missing = slots.find(index => index >= count);
  if (missing !== undefined) throw new Error(`工作流引用了 __IMAGE_${missing}__，但只提供了 ${count} 张参考图`);
  if (options.mask && !template.includes("__MASK__")) throw new Error("工作流未包含 __MASK__ 占位符，无法使用遮罩");
  if (options.firstFrame && !template.includes("__FIRST_FRAME__")) throw new Error("工作流未包含 __FIRST_FRAME__ 占位符，无法使用首帧");
  if (options.lastFrame && !template.includes("__LAST_FRAME__")) throw new Error("工作流未包含 __LAST_FRAME__ 占位符，无法使用尾帧");
  if (template.includes("__FIRST_FRAME__") && !options.firstFrame) throw new Error("工作流包含 __FIRST_FRAME__ 占位符，请先提供首帧");
  if (template.includes("__LAST_FRAME__") && !options.lastFrame) throw new Error("工作流包含 __LAST_FRAME__ 占位符，请先提供尾帧");
}

function baseAddress(config: { baseUrl?: string }) {
  return (config.baseUrl?.trim() || "http://127.0.0.1:8188").replace(/\/+$/, "");
}

function imageSize(request: { size?: string; ratio?: string }, config: { width?: unknown; height?: unknown }, template: string): [number, number] {
  const parsed = request.size?.match(/(\d+)\s*x\s*(\d+)/i)?.slice(1).map(Number);
  const fallbackWidth = positiveInteger(config.width, 512);
  const fallbackHeight = positiveInteger(config.height, 512);
  if (parsed) return [parsed[0], parsed[1]];
  // ACT: 宽高占位符存在时按画幅比例换算，避免 9:16 等竖屏模板被拉成横屏。
  if (template.includes("__WIDTH__") || template.includes("__HEIGHT__")) {
    const portrait = ["9:16", "3:4", "2:3", "1:2"].includes(request.ratio ?? "");
    return portrait ? [fallbackHeight, fallbackWidth] : [fallbackWidth, fallbackHeight];
  }
  return [fallbackWidth, fallbackHeight];
}

function videoSize(request: VideoRequest, config: { width?: unknown; height?: unknown }): [number, number] {
  const parsed = request.resolution?.match(/(\d+)\s*x\s*(\d+)/i)?.slice(1).map(Number);
  if (parsed) return [parsed[0], parsed[1]];
  const width = positiveInteger(config.width, 512);
  const height = positiveInteger(config.height, 512);
  const portrait = ["9:16", "3:4", "2:3", "1:2"].includes(request.ratio ?? "");
  return portrait ? [height, width] : [width, height];
}

export default {
  id: "comfyui",
  label: "ComfyUI（本地）",
  version,
  readme: `连接本地 ComfyUI，用自己搭建的工作流生成图片或视频，不经过任何中转平台。

### 使用步骤

1. 启动 ComfyUI（默认 \`http://127.0.0.1:8188\`），如需远程访问请开启 API 并确保端口可连。
2. 在 ComfyUI 中搭好工作流，点击「保存（API格式）」导出 JSON，分别粘贴到「图像工作流」或「视频工作流」。
3. 在 JSON 中用占位符标记需要替换的位置，生成时会自动替换：

| 占位符 | 替换内容 |
| --- | --- |
| \`__PROMPT__\` | 正向提示词 |
| \`__NEGATIVE_PROMPT__\` | 负面提示词 |
| \`__SEED__\` | 随机种子 |
| \`__WIDTH__\` / \`__HEIGHT__\` | 画面宽高 |
| \`__BATCH__\` | 图片生成数量 |
| \`__FRAMES__\` / \`__FPS__\` / \`__DURATION__\` | 视频帧数、帧率、时长（秒） |
| \`__IMAGE__\` | 第一张参考图 |
| \`__IMAGE_0__\`、\`__IMAGE_1__\`… | 第 1、2… 张参考图，序号从 0 开始 |
| \`__FIRST_FRAME__\` / \`__LAST_FRAME__\` | 首帧 / 尾帧 |
| \`__MASK__\` | 遮罩图 |

占位符放在字符串里需要保留引号，例如 \`"text": "__PROMPT__"\`；放在数字位置则不加引号，例如 \`"seed": __SEED__\`。

图生图需要在工作流里加一个 \`LoadImage\` 节点，并把它的 \`image\` 值写成 \`"__IMAGE__"\`；参考图会先上传到 ComfyUI 的 input 目录再替换成文件名。SVD 等工作流用 \`__IMAGE__\` 或 \`__FIRST_FRAME__\` 接收起始图。

视频输出支持 \`SaveVideo\` / \`VHS_VideoCombine\`，返回 mp4、webm、mkv、mov 等格式；图片节点需为 \`SaveImage\`。

> 生成过程中取消节点会同时删除排队任务并中断执行，ComfyUI 不会再继续占用显卡。`,
  rules,
  models: [
    {
      id: "comfyui",
      label: "ComfyUI 图像工作流",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
      imageSizes: ["512x512", "768x768", "1024x1024", "1344x768", "768x1344"],
      imageRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    },
    {
      id: "comfyuiVideo",
      label: "ComfyUI 视频工作流",
      type: "video",
      mode: ["text", "singleImage"],
      durationResolutionMap: [
        { duration: [2, 3, 4, 5, 6, 8, 10, 12, 15], resolution: ["1280x720", "720x1280", "832x480", "480x832"] },
      ],
    },
  ],
  async generateImage(request: ImageRequest): Promise<MediaAsset[]> {
    const baseUrl = baseAddress(this.config);
    const template = this.config.workflow?.trim();
    if (!template) throw new Error("请填写 ComfyUI 图像工作流 JSON");
    const references = request.images ?? [];
    if (references.length > 8) throw new Error("ComfyUI 适配最多支持 8 张参考图");
    if (request.mask && !references.length) throw new Error("使用遮罩时请先提供参考图");
    checkSlots(template, references.length, { mask: Boolean(request.mask) });
    const count = Math.max(1, Math.min(16, positiveInteger(request.n, 1)));
    const [width, height] = imageSize(request, this.config, template);

    // ACT: 单次生成最多等待 10 分钟。
    const signal = AbortSignal.any([AbortSignal.timeout(10 * 60_000), ...(this.signal ? [this.signal] : [])]);
    const uploaded = await Promise.all(references.map(input => uploadImage(this.tool.fetch, baseUrl, input, signal)));
    const maskName = request.mask ? await uploadImage(this.tool.fetch, baseUrl, request.mask, signal) : "";
    const values: Record<string, string | number> = {
      SEED: Math.floor(Math.random() * 4294967296),
      WIDTH: width,
      HEIGHT: height,
      BATCH: count,
      NEGATIVE_PROMPT: jsonString(this.config.negativePrompt?.trim() ?? ""),
      PROMPT: jsonString(request.prompt),
    };
    uploaded.forEach((name, index) => { values[`IMAGE_${index}`] = jsonString(name); });
    if (uploaded.length) values.IMAGE = jsonString(uploaded[0]);
    if (maskName) values.MASK = jsonString(maskName);
    const workflow = parseWorkflow(template, values);

    const promptId = await submitPrompt(this.tool.fetch, baseUrl, workflow, signal);
    const entry = await waitForPrompt(this.tool.fetch, this.queryFetch, baseUrl, promptId, signal);
    const assets = await downloadFiles(this.tool.fetch, baseUrl, entry, signal, "image");
    if (!assets.length) throw new Error("工作流执行完成但未返回图片，请确认输出节点为 SaveImage");
    return assets;
  },
  async generateVideo(request: VideoRequest): Promise<MediaAsset[]> {
    const baseUrl = baseAddress(this.config);
    const template = this.config.videoWorkflow?.trim();
    if (!template) throw new Error("请填写 ComfyUI 视频工作流 JSON");
    const references = request.images ?? [];
    if (references.length > 4) throw new Error("ComfyUI 视频适配最多支持 4 张参考图");
    if (request.videos?.length || request.audios?.length) throw new Error("ComfyUI 视频适配暂不支持视频或音频参考");
    checkSlots(template, references.length, { firstFrame: Boolean(request.firstFrame), lastFrame: Boolean(request.lastFrame) });
    const fps = positiveInteger(this.config.videoFps, 8);
    const frames = request.duration
      ? Math.max(1, Math.round(request.duration * fps))
      : positiveInteger(this.config.videoFrames, 25);
    const [width, height] = videoSize(request, this.config);

    // ACT: 本地视频工作流可能包含采样和插帧，最长等待 30 分钟。
    const signal = AbortSignal.any([AbortSignal.timeout(30 * 60_000), ...(this.signal ? [this.signal] : [])]);
    const uploaded = await Promise.all(references.map(input => uploadImage(this.tool.fetch, baseUrl, input, signal)));
    const firstFrame = request.firstFrame ? await uploadImage(this.tool.fetch, baseUrl, request.firstFrame, signal) : "";
    const lastFrame = request.lastFrame ? await uploadImage(this.tool.fetch, baseUrl, request.lastFrame, signal) : "";
    const values: Record<string, string | number> = {
      SEED: Math.floor(Math.random() * 4294967296),
      WIDTH: width,
      HEIGHT: height,
      FRAMES: frames,
      FPS: fps,
      DURATION: Math.round(frames / fps * 100) / 100,
      BATCH: 1,
      NEGATIVE_PROMPT: jsonString(this.config.negativePrompt?.trim() ?? ""),
      PROMPT: jsonString(request.prompt),
    };
    uploaded.forEach((name, index) => { values[`IMAGE_${index}`] = jsonString(name); });
    if (uploaded.length) values.IMAGE = jsonString(uploaded[0]);
    if (firstFrame) values.FIRST_FRAME = jsonString(firstFrame);
    if (lastFrame) values.LAST_FRAME = jsonString(lastFrame);
    const workflow = parseWorkflow(template, values);

    const promptId = await submitPrompt(this.tool.fetch, baseUrl, workflow, signal);
    const entry = await waitForPrompt(this.tool.fetch, this.queryFetch, baseUrl, promptId, signal);
    const assets = await downloadFiles(this.tool.fetch, baseUrl, entry, signal, "video");
    if (!assets.length) throw new Error("工作流执行完成但未返回视频，请确认输出节点为 SaveVideo 或 VHS_VideoCombine");
    return assets;
  },
} satisfies ProviderDefinition<typeof rules>;
