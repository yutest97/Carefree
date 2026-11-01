const rules = [
  {
    type: "input",
    field: "baseUrl" as const,
    title: "API 地址",
    value: "http://127.0.0.1:8880/v1",
    props: { placeholder: "http://127.0.0.1:8880/v1，需包含 /v1" },
  },
  {
    type: "input",
    field: "model" as const,
    title: "模型名",
    value: "tts-1",
    props: { placeholder: "本地服务通常忽略，需要指定时填服务端的模型名" },
  },
];

const version = "1.0.0";

// ACT: 只发 OpenAI 语音合成标准字段（model、input、voice、response_format、speed），语种和采样率由服务端按音色决定。
const speechFormats: Record<string, { api: string; mimeType: string; extension: string }> = {
  wav: { api: "wav", mimeType: "audio/wav", extension: "wav" },
  mp3: { api: "mp3", mimeType: "audio/mpeg", extension: "mp3" },
  pcm: { api: "pcm", mimeType: "audio/pcm", extension: "pcm" },
  ogg_opus: { api: "opus", mimeType: "audio/ogg", extension: "ogg" },
  opus: { api: "opus", mimeType: "audio/ogg", extension: "opus" },
  flac: { api: "flac", mimeType: "audio/flac", extension: "flac" },
  aac: { api: "aac", mimeType: "audio/aac", extension: "aac" },
};

function baseAddress(config: { baseUrl?: string }) {
  return (config.baseUrl?.trim() || "http://127.0.0.1:8880/v1").replace(/\/+$/, "");
}

export default {
  id: "localTts",
  label: "本地语音合成（OpenAI 兼容）",
  version,
  readme: `连接本地或自建的 OpenAI 兼容语音服务，配音不经过中转平台。

### 支持的本地服务

- Kokoro-FastAPI：默认 \`http://127.0.0.1:8880/v1\`，音色如 \`af_heart\`、\`zm_yunxi\`。
- Fish Speech、CosyVoice、IndexTTS、GPT-SoVITS（OpenAI 兼容模式）：填服务实际地址，需包含 \`/v1\`。
- openedai-speech、LocalAI 等：默认端口多为 \`8000\` 或 \`8080\`。

### 参数说明

- 请求路径固定为 \`{API 地址}/audio/speech\`。
- 音色、语速在节点参数中设置；音色名取决于所用服务的音色列表，留空使用服务默认音色。
- 语种和采样率由服务端按音色决定，不会随节点选择下发。
- 输出格式支持 wav、mp3、pcm、ogg_opus、flac、aac，实际编码以服务返回为准。

> 使用参考音频复刻音色的服务，请先在服务端注册音色，再在节点中填写对应音色名。`,
  rules,
  models: [
    {
      id: "localTts",
      label: "本地语音合成",
      type: "audio",
      rules: [
        {
          type: "input",
          field: "voice",
          title: "音色",
          value: "",
          props: { placeholder: "留空使用服务默认音色，例如 af_heart、zh_female_xiaoxiao" },
        },
        {
          type: "input-number",
          field: "speed",
          title: "语速",
          value: 1,
          props: { min: 0.25, max: 4, step: 0.05, placeholder: "0.25 ~ 4，1 为正常语速" },
        },
      ],
    },
  ],
  async generateAudio(request: AudioRequest): Promise<MediaAsset[]> {
    const text = (request.text ?? request.prompt ?? "").trim();
    if (!text) throw new Error("请输入待朗读的文本");
    if (request.audios?.length) throw new Error("本地语音合成暂不支持参考音频复刻，请先在服务端注册音色并填写音色名");
    if (request.images?.length) throw new Error("本地语音合成不支持参考图片");
    const format = speechFormats[request.format ?? "mp3"];
    if (!format) throw new Error(`本地语音合成不支持 ${request.format} 格式，请使用 wav、mp3、pcm、ogg_opus、flac 或 aac`);
    const other = request.other ?? {};
    const voiceValue = request.voice ?? other.voice;
    const voice = typeof voiceValue === "string" ? voiceValue.trim() : "";
    const speed = Number(request.speed ?? other.speed ?? 1);
    if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) throw new Error("语速须在 0.25 到 4 之间");
    const model = (typeof this.config.model === "string" && this.config.model.trim()) || "tts-1";

    // ACT: 本地服务合成一段对白通常在数秒到数分钟，最长等待 10 分钟。
    const signal = AbortSignal.any([AbortSignal.timeout(10 * 60_000), ...(this.signal ? [this.signal] : [])]);
    const body: Record<string, unknown> = { model, input: text, response_format: format.api };
    if (voice) body.voice = voice;
    if (speed !== 1) body.speed = speed;
    const response = await this.tool.fetch(`${baseAddress(this.config)}/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(this.tool.errorMessage(detail) || `语音合成失败：HTTP ${response.status}`);
    }
    const data = new Uint8Array(await response.arrayBuffer());
    if (!data.byteLength) throw new Error("语音合成返回了空音频");
    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    return [{
      mediaType: "audio",
      type: "binary",
      data,
      mimeType: contentType.startsWith("audio/") ? contentType : format.mimeType,
      name: `speech.${format.extension}`,
    }];
  },
} satisfies ProviderDefinition<typeof rules>;
