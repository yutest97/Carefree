import { z } from "zod";
import type { GeneratedMedia, ToolDefinition, ToolPlugin } from "@toonflow/tools-scaffold/runtime";
import { audioGenerationSchema, batchGenerationSchema, imageGenerationSchema, listMediaModelsSchema, videoGenerationSchema } from "./runtime";

const configSchema = z.strictObject({
  allowImage: z.boolean().default(true),
  allowVideo: z.boolean().default(true),
  allowAudio: z.boolean().default(true),
});

function previewText(assets: GeneratedMedia[]) {
  return assets.map(asset => {
    const url = asset.path.replaceAll("\\", "/").split("/").map(encodeURIComponent).join("/");
    const preview = asset.mediaType === "image" ? `![生成图片](<${url}>)` : `[${asset.mediaType === "audio" ? "播放生成音频" : "查看生成视频"}](<${url}>)`;
    return `${preview}\n工作区文件：${asset.path}`;
  }).join("\n\n");
}

function shortPrompt(prompt: string) {
  return prompt.length > 60 ? `${prompt.slice(0, 60)}…` : prompt;
}

type BatchResult = { index: number; prompt: string; status: "success" | "failed"; assets: GeneratedMedia[]; error?: string };

const plugin: ToolPlugin = {
  validateConfig: config => configSchema.parse(config),
  createTools({ media, config }) {
    if (!media) return [];
    const permissions = configSchema.parse(config);
    const generationTools = ([
      { name: "generateImage", mediaType: "image", enabled: permissions.allowImage, label: "生成图片", parameters: imageGenerationSchema, description: "根据提示词和可选的工作区参考图生成图片。" },
      { name: "generateVideo", mediaType: "video", enabled: permissions.allowVideo, label: "生成视频", parameters: videoGenerationSchema, description: "根据提示词和可选的工作区图片、视频、音频、首尾帧生成视频。按模型能力设置生成模式、时长、分辨率和音频。使用 {{ref N}} 时通过 referenceOrder 指定对应素材，引用转换能力由供应商适配器决定；不支持转换时，按模型协议编写提示词。" },
      { name: "generateAudio", mediaType: "audio", enabled: permissions.allowAudio, label: "生成音频", parameters: audioGenerationSchema, description: "根据文本或提示词和可选的工作区参考图片和音频生成音频。按模型能力设置音色、语速、音量、语种、采样率和格式。" },
    ] as const).filter(operation => operation.enabled);
    if (!generationTools.length) return [];
    const listTool: ToolDefinition = {
      name: "listMediaModels",
      label: "查询媒体模型",
      description: "查询已允许生成的媒体模型，返回 providerId、modelId、类型、模式及支持的画幅、时长、分辨率或音色。生成前先查询，不能猜测模型 ID。",
      parameters: z.toJSONSchema(listMediaModelsSchema, { io: "input", target: "draft-07" }),
      async execute(_id, params, signal) {
        listMediaModelsSchema.parse(params);
        signal?.throwIfAborted();
        const result = (await media.listModels()).filter(model => generationTools.some(operation => operation.mediaType === model.type));
        return { content: [{ type: "text", text: JSON.stringify(result) }], details: result };
      },
    };
    const batchTool: ToolDefinition = {
      name: "generateMediaBatch",
      label: "批量生成媒体",
      description: "用同一个模型和同一组参考素材，按顺序为多个提示词批量生成图片、视频或音频。单项失败不会中断后续项，逐项返回文件或失败原因。providerId 和 modelId 必须来自 listMediaModels。",
      promptSnippet: "需要连续生成多个分镜或同一角色的多张图片时，先查询 listMediaModels，再用 prompts 数组批量提交。",
      parameters: z.toJSONSchema(batchGenerationSchema, { io: "input", target: "draft-07" }),
      executionMode: "sequential",
      async execute(_id, params, signal) {
        const { type, prompts, ...shared } = batchGenerationSchema.parse(params);
        signal?.throwIfAborted();
        if (!generationTools.some(operation => operation.mediaType === type)) {
          throw new Error(`当前配置不允许生成${type === "image" ? "图片" : type === "video" ? "视频" : "音频"}`);
        }
        const generate = type === "image" ? media.generateImage : type === "video" ? media.generateVideo : media.generateAudio;
        const results: BatchResult[] = [];
        for (const [index, prompt] of prompts.entries()) {
          if (signal?.aborted) {
            results.push({ index, prompt, status: "failed", assets: [], error: "已取消" });
            continue;
          }
          try {
            const assets = await generate({ ...shared, prompt }, signal);
            results.push({ index, prompt, status: "success", assets });
          } catch (error) {
            results.push({ index, prompt, status: "failed", assets: [], error: error instanceof Error ? error.message : String(error) });
          }
        }
        const succeeded = results.filter(result => result.status === "success").length;
        const details = { total: results.length, succeeded, failed: results.length - succeeded, results };
        const lines = results.map(result => result.status === "success"
          ? `${result.index + 1}. ${shortPrompt(result.prompt)}\n${previewText(result.assets)}`
          : `${result.index + 1}. ${shortPrompt(result.prompt)}\n失败：${result.error}`);
        const text = `批量${type === "image" ? "图片" : type === "video" ? "视频" : "音频"}生成完成：成功 ${succeeded} 项，失败 ${results.length - succeeded} 项。\n\n${lines.join("\n\n")}`;
        return { content: [{ type: "text", text }], details };
      },
    };
    return [listTool, ...generationTools.map<ToolDefinition>(operation => ({
      name: operation.name,
      label: operation.label,
      description: `${operation.description}providerId 和 modelId 必须来自 listMediaModels。引用素材的 path 及 outputDirectory 均为工作区相对路径；省略输出目录使用默认媒体目录。等待生成完成后返回已保存的文件路径，不返回 Base64。`,
      promptSnippet: "生成媒体前先查询 listMediaModels，复用实际模型和工作区参考素材。",
      parameters: z.toJSONSchema(operation.parameters, { io: "input", target: "draft-07" }),
      executionMode: "sequential",
      async execute(_id, params, signal) {
        signal?.throwIfAborted();
        const result = await media[operation.name](operation.parameters.parse(params), signal);
        return { content: [{ type: "text", text: previewText(result) }], details: result };
      },
    })), batchTool];
  },
};

export default plugin;
