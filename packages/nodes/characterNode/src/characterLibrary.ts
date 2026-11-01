export type CharacterReference = { path: string; mimeType: string };

export type CharacterRecord = {
  version: 1;
  name: string;
  identity: string;
  appearance: string;
  invariants: string;
  references: CharacterReference[];
  updatedAt: string;
};

export type CharacterSummary = { path: string; name: string };

type AssetEntry = { name: string; path: string; type: "file" | "directory"; children?: AssetEntry[] };

const imageMimeTypes: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
  gif: "image/gif", avif: "image/avif", bmp: "image/bmp", tif: "image/tiff", tiff: "image/tiff",
};

export function extensionForMimeType(mimeType: string) {
  const found = Object.entries(imageMimeTypes).find(([, value]) => value === mimeType);
  return found ? `.${found[0] === "jpeg" ? "jpg" : found[0]}` : ".png";
}

export function mimeTypeFromPath(path: string) {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return imageMimeTypes[extension] ?? "";
}

async function errorMessage(response: Response) {
  const message = await response.json().catch(() => undefined).then((value: { message?: unknown } | undefined) => value?.message);
  return typeof message === "string" && message.trim() ? message : `素材库请求失败（HTTP ${response.status}）`;
}

function flatten(entries: AssetEntry[]): AssetEntry[] {
  return entries.flatMap(entry => entry.type === "directory" ? [entry, ...flatten(entry.children ?? [])] : [entry]);
}

export async function listCharacters(): Promise<CharacterSummary[]> {
  const response = await fetch("/api/assets/list", { headers: { "Cache-Control": "no-cache" } });
  if (!response.ok) throw new Error(await errorMessage(response));
  const entries = flatten(((await response.json()) as { data?: { entries?: AssetEntry[] } }).data?.entries ?? [])
    .filter(entry => entry.type === "file" && /^characters\/[^/]+\.json$/.test(entry.path));
  const summaries: CharacterSummary[] = [];
  for (const entry of entries) {
    const name = await readCharacter(entry.path).then(record => record.name).catch(() => "");
    summaries.push({ path: entry.path, name: name || entry.name.replace(/\.json$/, "") });
  }
  return summaries;
}

export function normalizeCharacter(value: unknown, path: string): CharacterRecord {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const text = (field: string) => typeof record[field] === "string" ? record[field] as string : "";
  const references = Array.isArray(record.references) ? record.references.flatMap(item => {
    const reference = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
    const referencePath = typeof reference.path === "string" ? reference.path : "";
    return referencePath ? [{ path: referencePath, mimeType: typeof reference.mimeType === "string" && reference.mimeType ? reference.mimeType : mimeTypeFromPath(referencePath) || "image/png" }] : [];
  }) : [];
  return {
    version: 1,
    name: text("name") || path.split("/").pop()?.replace(/\.json$/, "") || "",
    identity: text("identity"),
    appearance: text("appearance"),
    invariants: text("invariants"),
    references,
    updatedAt: text("updatedAt"),
  };
}

export async function readCharacter(path: string): Promise<CharacterRecord> {
  const response = await fetch(`/api/assets/read?path=${encodeURIComponent(path)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(await errorMessage(response));
  return normalizeCharacter(await response.json().catch(() => undefined), path);
}

export async function readAsset(path: string): Promise<{ blob: Blob; mimeType: string }> {
  const response = await fetch(`/api/assets/read?path=${encodeURIComponent(path)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(await errorMessage(response));
  const blob = await response.blob();
  const mimeType = (response.headers.get("content-type") ?? "").split(";")[0].trim() || mimeTypeFromPath(path) || blob.type || "image/png";
  return { blob, mimeType };
}

export async function saveAsset(path: string, content: Blob, overwrite = false) {
  const response = await fetch(`/api/assets/save?path=${encodeURIComponent(path)}${overwrite ? "&overwrite=true" : ""}`, {
    method: "PUT",
    headers: { "Content-Type": "application/octet-stream" },
    body: content,
  });
  if (!response.ok) throw new Error(await errorMessage(response));
}

export async function ensureAssetDirectory(path: string) {
  const response = await fetch("/api/assets/mkdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (response.ok) return;
  // ACT: 目录已存在时继续写入，其余错误按接口返回提示。
  if (response.status === 409) return;
  const message = await errorMessage(response);
  if (message.includes("已存在")) return;
  throw new Error(message);
}

export async function removeAsset(path: string) {
  const response = await fetch("/api/assets/remove", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!response.ok) throw new Error(await errorMessage(response));
}
