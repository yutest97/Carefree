const rules = [
  {
    type: "input",
    field: "baseUrl" as const,
    title: "API 地址",
    value: "http://127.0.0.1:11434/v1",
    props: { placeholder: "http://127.0.0.1:11434/v1" },
  },
  {
    type: "input",
    field: "apiKey" as const,
    title: "API Key",
    value: "ollama",
    props: { type: "password", showPassword: true, autocomplete: "off", placeholder: "本地服务可填任意值，例如 ollama" },
  },
];

export default {
  id: "openaiCompatible" as const,
  label: "OpenAI 兼容 / 本地模型",
  icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cmVjdCB4PSIzIiB5PSI2IiB3aWR0aD0iMTgiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9IiM3Qzg3OTQiIHN0cm9rZS13aWR0aD0iMS42Ii8+PGNpcmNsZSBjeD0iOCIgY3k9IjEyIiByPSIxLjYiIGZpbGw9IiM3Qzg3OTQiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSIxLjYiIGZpbGw9IiM3Qzg3OTQiLz48cGF0aCBkPSJNMTAgMTJoNCIgc3Ryb2tlPSIjN0M4Nzk0IiBzdHJva2Utd2lkdGg9IjEuNiIvPjwvc3ZnPg==",
  version: "2.0.0",
  apiUrl: "http://127.0.0.1:11434/v1",
  protocol: "openai-completions",
  readme: `连接本地或任意 OpenAI 兼容接口（Ollama、LM Studio、vLLM、各类兼容云 API），文本生成不经过中转平台。

### 本地 Ollama

1. 安装并启动 Ollama，拉取模型，例如 \`ollama pull qwen2.5:7b\`。
2. API 地址填 \`http://127.0.0.1:11434/v1\`，API Key 填任意值（默认 \`ollama\`）。

### LM Studio / vLLM

- LM Studio 本地服务地址通常为 \`http://127.0.0.1:1234/v1\`。
- vLLM 默认地址通常为 \`http://127.0.0.1:8000/v1\`。
- API Key 按服务要求填写，本地服务通常填任意值。

### 云端兼容接口

填写服务商的基础地址（需包含 \`/v1\`）与真实 API Key。

> 模型列表通过 \`{地址}/models\` 获取，地址末尾不要带查询参数。`,
  rules,
  models: [],
} satisfies ProviderDefinition<typeof rules>;
