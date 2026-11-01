<template>
  <nodeSkeleton
    v-bind="nodeProps"
    v-model:bottomVisible="node.selected"
    :topVisible="node.selected"
    topWidth="max-content"
    :bottomWidth="660"
    :style="{ width: '280px' }">
    <div class="characterContent">
      <refThumb v-if="primaryImage" :file="primaryImage" alt="角色参考图" class="characterImage" />
      <div v-else class="emptyState" role="img" aria-label="暂无角色参考图">
        <icon-user :size="42" stroke="1.25" aria-hidden="true" />
        <span>暂无角色参考图</span>
      </div>
      <div class="characterLabel">
        <span class="characterName">{{ data.name.trim() || "未命名角色" }}</span>
        <span v-if="data.identity.trim()" class="characterIdentity">{{ data.identity.trim() }}</span>
      </div>
    </div>
    <template #bottom>
      <el-card class="editorCard" shadow="never" :bodyStyle="{ padding: '14px 16px 12px' }">
        <div class="libraryRow">
          <el-select
            v-model="selectedPath"
            size="small"
            filterable
            clearable
            placeholder="选择已保存的角色"
            noDataText="素材库还没有角色"
            @change="chooseCharacter">
            <el-option v-for="item in characters" :key="item.path" :label="item.name" :value="item.path" />
          </el-select>
          <el-button size="small" :icon="IconRefresh" :loading="loadingList" @click="refreshCharacters">刷新</el-button>
        </div>
        <div class="fieldGrid">
          <el-input v-model="data.name" size="small" placeholder="角色名" />
          <el-input v-model="data.identity" size="small" placeholder="身份 / 年龄阶段 / 物种" />
        </div>
        <el-input
          v-model="data.appearance"
          class="fieldInput"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="固定外观：五官、发型发色、瞳色、体型、服装与配饰" />
        <el-input
          v-model="data.invariants"
          class="fieldInput"
          type="textarea"
          :rows="2"
          resize="none"
          placeholder="不变项：疤、纹身、标志性配饰等，可留空" />
        <div class="referenceRow">
          <el-button size="small" :icon="IconUpload" :loading="uploading" :disabled="saving" @click.stop="fileInput?.click()">上传参考图</el-button>
          <el-button size="small" :icon="IconFolderPlus" :disabled="saving || uploading" @click="pickFromLibrary">从素材库选择</el-button>
          <span class="referenceCount">参考图 {{ references.length }} 张</span>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="uploadReference" />
        </div>
        <div v-if="references.length" class="referenceList">
          <div v-for="(item, index) in references" :key="item.url" class="referenceThumb">
            <refThumb :file="item" alt="角色参考图" />
            <el-button
              class="removeButton"
              :icon="IconX"
              text
              size="small"
              aria-label="移除参考图"
              :disabled="saving"
              @click.stop="removeReferenceAt(index)" />
          </div>
        </div>
        <div class="actions">
          <el-button size="small" type="primary" :loading="saving" :disabled="!data.name.trim()" @click="saveCharacter">保存到素材库</el-button>
          <el-button v-if="data.characterPath" size="small" type="danger" plain :disabled="saving" @click="deleteCharacter">删除角色</el-button>
          <span v-if="data.characterPath" class="savedPath">{{ data.characterPath }}</span>
        </div>
      </el-card>
    </template>
  </nodeSkeleton>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { ElButton, ElCard, ElInput, ElMessage, ElMessageBox, ElOption, ElSelect } from "element-plus";
import { IconFolderPlus, IconRefresh, IconUpload, IconUser, IconX } from "@tabler/icons-vue";
import { nodeSkeleton, nodeTools, useNode, z, type NodeHandle, type NodeMediaValue } from "@toonflow/nodes-scaffold/runtime";
import { useNodeReferences } from "@toonflow/node-shared/useNodeReferences";
import {
  ensureAssetDirectory,
  extensionForMimeType,
  listCharacters,
  mimeTypeFromPath,
  normalizeCharacter,
  readAsset,
  readCharacter,
  removeAsset,
  saveAsset,
  type CharacterReference,
  type CharacterSummary,
} from "./characterLibrary";
import refThumb from "./refThumb.vue";

defineOptions({
  inheritAttrs: false,
  icon: IconUser,
  handles: [
    { id: "in", type: "target", dataType: ["IMAGE", "STRING"], label: "参考图、文本输入" },
    { id: "text", type: "source", dataType: "STRING", label: "角色提示词输出" },
    { id: "image", type: "source", dataType: "IMAGE", label: "角色参考图输出" },
  ] satisfies NodeHandle[],
});

const { id, node, nodeProps, outputs, files, nodeEvent } = useNode({
  label: "角色卡",
});
type CharacterData = {
  name: string;
  identity: string;
  appearance: string;
  invariants: string;
  characterPath: string;
  references: CharacterReference[];
};
const data = computed(() => node.data as CharacterData);
data.value.name ??= "";
data.value.identity ??= "";
data.value.appearance ??= "";
data.value.invariants ??= "";
data.value.characterPath ??= "";
data.value.references ??= [];
const { refList, selectAssetReference } = useNodeReferences();
const characters = ref<CharacterSummary[]>([]);
const selectedPath = ref("");
const loadingList = ref(false);
const uploading = ref(false);
const saving = ref(false);
const fileInput = ref<HTMLInputElement>();

const connectedImages = computed(() => refList.value.filter(item => item.dataType === "IMAGE" && item.value)
  .map(item => item.value as NodeMediaValue));
const references = computed<NodeMediaValue[]>(() => (data.value.references ?? []).map(item => ({ url: item.path, mimeType: item.mimeType })));
const primaryImage = computed(() => connectedImages.value[0] ?? references.value[0]);

watchEffect(() => {
  const text = characterPrompt(data.value);
  const current = outputs.value.text;
  if (!current || current.dataType !== "STRING" || current.value !== text) {
    outputs.value.text = { dataType: "STRING", value: text };
  }
  const image = primaryImage.value;
  const currentImage = outputs.value.image;
  const changed = image
    ? !currentImage || currentImage.dataType !== "IMAGE" || currentImage.value.url !== image.url || currentImage.value.mimeType !== image.mimeType
    : !!currentImage;
  if (image && changed) outputs.value.image = { dataType: "IMAGE", value: { url: image.url, mimeType: image.mimeType } };
  if (!image && currentImage) outputs.value.image = undefined;
});

function characterPrompt(value: CharacterData) {
  const name = (value.name ?? "").trim();
  const identity = (value.identity ?? "").trim();
  const appearance = (value.appearance ?? "").trim();
  const invariants = (value.invariants ?? "").trim();
  if (!name && !identity && !appearance && !invariants) return "";
  const lines = [`角色「${name || "未命名"}」`];
  if (identity) lines.push(`身份：${identity}`);
  if (appearance) lines.push(`固定外观：${appearance}`);
  if (invariants) lines.push(`不变项：${invariants}`);
  lines.push("所有使用该角色的画面必须保持以上五官、发型、发色、瞳色、体型、服装与配饰一致；只改变动作、表情、姿态和镜头角度，不得出现第二个相同角色。");
  return lines.join("\n");
}

function ignoreExists(error: unknown) {
  const failure = error as { message?: string; response?: { data?: { message?: string; data?: { code?: string } } } };
  const text = [failure?.message, failure?.response?.data?.message, failure?.response?.data?.data?.code].filter(Boolean).join(" ");
  if (!/EEXIST|已存在|already exists/i.test(text)) throw error;
}

async function refreshCharacters() {
  if (loadingList.value) return;
  loadingList.value = true;
  try {
    characters.value = await listCharacters();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "角色列表读取失败");
  } finally {
    loadingList.value = false;
  }
}

async function chooseCharacter(path?: string) {
  if (!path) {
    data.value.characterPath = "";
    return;
  }
  if (!node.id || /[\\/]/.test(node.id) || node.id === "." || node.id === "..") return;
  try {
    const record = await readCharacter(path);
    data.value.name = record.name;
    data.value.identity = record.identity;
    data.value.appearance = record.appearance;
    data.value.invariants = record.invariants;
    data.value.characterPath = path;
    selectedPath.value = path;
    const imported = await importReferences(record.references);
    data.value.references = imported;
    ElMessage.success(`已载入角色「${record.name || "未命名"}」`);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "角色读取失败");
  }
}

async function importReferences(items: CharacterReference[]) {
  if (!items.length) return [];
  const workspace = files.getWorkspaceFiles();
  const directory = `assets/${node.id}/character`;
  await workspace.mkdir("assets").catch(ignoreExists);
  await workspace.mkdir(directory).catch(ignoreExists);
  const imported: CharacterReference[] = [];
  for (const [index, item] of items.entries()) {
    const { blob, mimeType } = await readAsset(item.path);
    const target = `${directory}/${index}${extensionForMimeType(mimeType)}`;
    await workspace.write(target, blob, true);
    imported.push({ path: target, mimeType });
  }
  return imported;
}

async function uploadReference(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || saving.value || uploading.value) return;
  if (!file.type.startsWith("image/")) return void ElMessage.error("请选择图片文件");
  if (!file.size || file.size > 100 * 1024 * 1024) return void ElMessage.error("图片不能为空且不能超过 100 MB");
  uploading.value = true;
  try {
    const path = await files.uploadFile(file);
    data.value.references = [...(data.value.references ?? []), { path, mimeType: file.type || mimeTypeFromPath(path) || "image/png" }];
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "参考图上传失败");
  } finally {
    uploading.value = false;
  }
}

async function pickFromLibrary() {
  if (saving.value || uploading.value) return;
  try {
    await selectAssetReference();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "素材选择失败");
  }
}

function removeReferenceAt(index: number) {
  if (saving.value) return;
  data.value.references = (data.value.references ?? []).filter((_, itemIndex) => itemIndex !== index);
}

async function saveCharacter() {
  if (saving.value) return;
  const name = data.value.name.trim();
  if (!name) return void ElMessage.error("请先填写角色名");
  saving.value = true;
  try {
    if (!node.id || /[\\/]/.test(node.id) || node.id === "." || node.id === "..") throw new Error("节点 ID 不能作为文件夹名称");
    const existing = data.value.characterPath.match(/^characters\/([^/]+)\.json$/)?.[1];
    const characterId = existing ?? `character-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const workspace = files.getWorkspaceFiles();
    const sources = [...connectedImages.value.map(item => ({ path: item.url, mimeType: item.mimeType })), ...(data.value.references ?? [])]
      .filter((item, index, list) => list.findIndex(candidate => candidate.path === item.path) === index);
    await ensureAssetDirectory("characters");
    await ensureAssetDirectory(`characters/${characterId}`);
    const stored: CharacterReference[] = [];
    for (const [index, item] of sources.entries()) {
      const bytes = await workspace.read(item.path);
      const mimeType = item.mimeType || mimeTypeFromPath(item.path) || "image/png";
      const target = `characters/${characterId}/ref-${index}${extensionForMimeType(mimeType)}`;
      await saveAsset(target, new Blob([bytes], { type: mimeType }));
      stored.push({ path: target, mimeType });
    }
    const record = normalizeCharacter({
      version: 1,
      name,
      identity: data.value.identity,
      appearance: data.value.appearance,
      invariants: data.value.invariants,
      references: stored,
      updatedAt: new Date().toISOString(),
    }, `characters/${characterId}.json`);
    await saveAsset(`characters/${characterId}.json`, new Blob([JSON.stringify(record, null, 2)], { type: "application/json" }));
    data.value.characterPath = `characters/${characterId}.json`;
    selectedPath.value = data.value.characterPath;
    await refreshCharacters();
    ElMessage.success("角色已保存到素材库");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "角色保存失败");
  } finally {
    saving.value = false;
  }
}

async function deleteCharacter() {
  const path = data.value.characterPath;
  if (!path || saving.value) return;
  const confirmed = await ElMessageBox.confirm("删除后其他画布将无法再选用该角色，已载入节点的参考图不受影响。", "删除角色", {
    confirmButtonText: "删除", cancelButtonText: "取消", type: "warning", closeOnClickModal: false,
  }).then(() => true, () => false);
  if (!confirmed) return;
  saving.value = true;
  try {
    const characterId = path.match(/^characters\/([^/]+)\.json$/)?.[1];
    await removeAsset(path);
    if (characterId) await removeAsset(`characters/${characterId}`).catch(() => {});
    data.value.characterPath = "";
    selectedPath.value = "";
    await refreshCharacters();
    ElMessage.success("角色已删除");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "角色删除失败");
  } finally {
    saving.value = false;
  }
}

nodeEvent.on("delete", async () => {
  await files.removeNodeFiles();
});

nodeTools.register({
  name: "getCharacter",
  description: "读取角色卡的名称、身份、固定外观、不变项、参考图数量和输出提示词；不启动任何生成",
  parameters: z.strictObject({}),
  execute() {
    return {
      characterPath: data.value.characterPath ?? "",
      name: data.value.name ?? "",
      identity: data.value.identity ?? "",
      appearance: data.value.appearance ?? "",
      invariants: data.value.invariants ?? "",
      references: (data.value.references ?? []).map(item => item.path),
      prompt: characterPrompt(data.value),
    };
  },
});

nodeTools.register({
  name: "setCharacter",
  description: "修改角色卡的角色名、身份、固定外观或不变项；不修改参考图，不保存到素材库，不启动生成",
  parameters: z.strictObject({
    name: z.string().optional(),
    identity: z.string().optional(),
    appearance: z.string().optional(),
    invariants: z.string().optional(),
  }).refine(args => Object.values(args).some(value => value !== undefined), "至少提供一项角色字段"),
  execute(args) {
    for (const key of ["name", "identity", "appearance", "invariants"] as const) {
      const value = args[key];
      if (typeof value === "string") data.value[key] = value;
    }
    return {
      characterPath: data.value.characterPath ?? "",
      name: data.value.name ?? "",
      identity: data.value.identity ?? "",
      appearance: data.value.appearance ?? "",
      invariants: data.value.invariants ?? "",
      prompt: characterPrompt(data.value),
    };
  },
});

nodeTools.register({
  name: "loadCharacter",
  description: "从全局素材库加载已保存的角色到当前节点，会更新角色字段并把参考图导入工作区；不启动生成",
  parameters: z.strictObject({ path: z.string().min(1) }),
  async execute({ path }) {
    await chooseCharacter(path);
    return {
      characterPath: data.value.characterPath ?? "",
      name: data.value.name ?? "",
      references: (data.value.references ?? []).map(item => item.path),
      prompt: characterPrompt(data.value),
    };
  },
});

nodeTools.register({
  name: "saveCharacter",
  description: "把当前角色字段和参考图保存到全局素材库 characters 目录，返回保存路径；不启动生成",
  parameters: z.strictObject({}),
  async execute() {
    await saveCharacter();
    return { characterPath: data.value.characterPath ?? "", prompt: characterPrompt(data.value) };
  },
});

onMounted(() => {
  selectedPath.value = data.value.characterPath ?? "";
  void refreshCharacters();
});
</script>

<style scoped lang="scss">
.characterContent {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px;

  .characterImage {
    width: 100%;
    max-height: 220px;
    object-fit: contain;
    border-radius: 6px;
    background: var(--el-fill-color-light);
  }

  .emptyState {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 140px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .characterLabel {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;

    .characterName {
      overflow: hidden;
      color: var(--el-text-color-primary);
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .characterIdentity {
      overflow: hidden;
      color: var(--el-text-color-secondary);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.editorCard {
  .libraryRow {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;

    .el-select {
      flex: 1;
      min-width: 0;
    }
  }

  .fieldGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }

  .fieldInput {
    margin-bottom: 8px;
  }

  .referenceRow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .referenceCount {
      margin-left: auto;
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }

  .referenceList {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;

    .referenceThumb {
      position: relative;
      width: 64px;
      height: 64px;
      overflow: hidden;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .removeButton {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        padding: 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.45);
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;

    .savedPath {
      overflow: hidden;
      color: var(--el-text-color-secondary);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
