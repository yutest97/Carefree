// ACT: 局域网 HTTP 等非安全上下文没有 crypto.randomUUID，启动前补一个 UUID v4 兜底。
if (globalThis.crypto && typeof globalThis.crypto.randomUUID !== "function") {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    configurable: true,
    value: () => {
      const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 4)}-${hex.slice(4, 6)}-${hex.slice(6, 8)}-${hex.slice(8, 10)}-${hex.slice(10)}`;
    },
  });
}

// ACT: 此函数也会被序列化到原生壳的预检页面，必须保持自包含，不依赖模块变量。
export function getMissingBrowserFeatures(): string[] {
  const browser = globalThis as typeof globalThis & {
    ResizeObserver?: unknown;
    CSS?: { supports?: (property: string, value: string) => boolean };
  };
  const features: [string, unknown][] = [
    ["Map.groupBy", browser.Map?.groupBy],
    ["URL.canParse", browser.URL?.canParse],
    ["Promise.withResolvers", browser.Promise?.withResolvers],
    ["Intl.Segmenter", browser.Intl?.Segmenter],
    ["crypto.randomUUID", browser.crypto?.randomUUID],
    ["TextDecoderStream", browser.TextDecoderStream],
    ["ReadableStream", browser.ReadableStream],
    ["ResizeObserver", browser.ResizeObserver],
    ["AbortSignal.any", browser.AbortSignal?.any],
    ["AbortSignal.timeout", browser.AbortSignal?.timeout],
    ["structuredClone", browser.structuredClone],
  ];
  const missing = features.filter(([, method]) => typeof method !== "function").map(([name]) => name);
  if (!browser.CSS?.supports?.("color", "color-mix(in srgb, red, blue)")) missing.push("CSS color-mix");
  return missing;
}
