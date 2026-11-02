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

export type CharacterSummary = {
  path: string;
  name: string;
  identity: string;
  referenceCount: number;
  primaryReference?: CharacterReference;
};

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

export function createCharacterId() {
  return `character-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

async function errorMessage(response: Response) {
  const message = await response.json().catch(() => undefined).then((value: { message?: unknown } | undefined) => value?.message);
  return typeof message === "string" && message.trim() ? message : `素材库请求失败（HTTP ${response.status}）`;
}

function flatten(entries: AssetEntry[]): AssetEntry[] {
  return entries.flatMap(entry => entry.type === "directory" ? [entry, ...flatten(entry.children ?? [])] : [entry]);
}

export function assetUrl(path: string) {
  return `/api/assets/read?path=${encodeURIComponent(path)}`;
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

export async function listCharacters(): Promise<CharacterSummary[]> {
  const response = await fetch("/api/assets/list", { headers: { "Cache-Control": "no-cache" } });
  if (!response.ok) throw new Error(await errorMessage(response));
  const entries = flatten(((await response.json()) as { data?: { entries?: AssetEntry[] } }).data?.entries ?? [])
    .filter(entry => entry.type === "file" && /^characters\/[^/]+\.json$/.test(entry.path));
  const summaries: CharacterSummary[] = [];
  for (const entry of entries) {
    const fallback = { path: entry.path, name: entry.name.replace(/\.json$/, ""), identity: "", referenceCount: 0 };
    try {
      const record = await readCharacter(entry.path);
      summaries.push({ ...fallback, name: record.name || fallback.name, identity: record.identity, referenceCount: record.references.length, primaryReference: record.references[0] });
    } catch {
      summaries.push(fallback);
    }
  }
  return summaries;
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

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("参考图读取失败"));
    reader.readAsDataURL(blob);
  });
}

function safeFilename(name: string) {
  return (name || "character").replace(/[\\/:*?"<>|]/g, "_").trim() || "character";
}

export async function renameCharacter(path: string, name: string) {
  const target = name.trim();
  if (!target) throw new Error("角色名不能为空");
  const record = await readCharacter(path);
  const saved = normalizeCharacter({ ...record, name: target, updatedAt: new Date().toISOString() }, path);
  await saveAsset(path, new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" }), true);
  return saved;
}

export async function deleteCharacter(path: string) {
  const characterId = path.match(/^characters\/([^/]+)\.json$/)?.[1];
  const record = await readCharacter(path).catch(() => undefined);
  for (const reference of record?.references ?? []) await removeAsset(reference.path).catch(() => {});
  await removeAsset(path);
  if (characterId) await removeAsset(`characters/${characterId}`).catch(() => {});
}

export async function exportCharacterPack(path: string) {
  const record = await readCharacter(path);
  const references: { mimeType: string; data: string }[] = [];
  for (const item of record.references) {
    const { blob, mimeType } = await readAsset(item.path);
    references.push({ mimeType: item.mimeType || mimeType, data: await blobToDataUrl(blob) });
  }
  const pack = { carefreeCharacter: 1, ...record, references };
  return {
    blob: new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" }),
    filename: `${safeFilename(record.name)}.carefree-character.json`,
    referenceCount: references.length,
  };
}

export async function importCharacterPack(file: File) {
  const pack = JSON.parse(await file.text()) as Record<string, unknown> | null;
  if (!pack || typeof pack !== "object" || pack.carefreeCharacter !== 1) throw new Error("不是 Carefree 角色包");
  const record = normalizeCharacter(pack, "");
  if (!record.name.trim()) throw new Error("角色包缺少角色名");
  const characterId = createCharacterId();
  const references: CharacterReference[] = [];
  const items = Array.isArray(pack.references) ? pack.references : [];
  await ensureAssetDirectory("characters");
  await ensureAssetDirectory(`characters/${characterId}`);
  for (const [index, value] of items.entries()) {
    const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
    if (typeof item.data !== "string" || !/^data:image\/[a-z0-9.+-]+;base64,/i.test(item.data)) continue;
    const blob = await (await fetch(item.data)).blob();
    if (!blob.size || blob.size > 100 * 1024 * 1024) throw new Error(`第 ${index + 1} 张参考图无效或超过 100 MB`);
    const mimeType = /^image\//i.test(blob.type) ? blob.type : typeof item.mimeType === "string" && /^image\//i.test(item.mimeType) ? item.mimeType : "image/png";
    const target = `characters/${characterId}/ref-${index}${extensionForMimeType(mimeType)}`;
    await saveAsset(target, new Blob([await blob.arrayBuffer()], { type: mimeType }), true);
    references.push({ path: target, mimeType });
  }
  const saved = normalizeCharacter({ ...pack, version: 1, references, updatedAt: new Date().toISOString() }, `characters/${characterId}.json`);
  await saveAsset(`characters/${characterId}.json`, new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" }), true);
  return { path: `characters/${characterId}.json`, name: saved.name, referenceCount: references.length };
}
