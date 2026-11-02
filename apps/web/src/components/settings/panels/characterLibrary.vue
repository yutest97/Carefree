<template>
  <div class="characterLibrary">
    <section class="settingSection" aria-labelledby="characterLibraryTitle">
      <div class="libraryHeader">
        <div class="settingInfo">
          <h3 id="characterLibraryTitle">角色库</h3>
          <p class="description">角色保存在全局素材库的 <code>characters/</code> 目录，可被任意工作区的角色卡复用。导入角色包会新增角色，不覆盖现有角色。</p>
        </div>
        <div class="libraryActions">
          <el-button :icon="IconRefresh" :loading="loading" :disabled="busy" @click="load">刷新</el-button>
          <el-button type="primary" :icon="IconUpload" :loading="importing" :disabled="loading || busy" @click="fileInput?.click()">导入角色包</el-button>
          <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importPack" />
        </div>
      </div>

      <el-alert v-if="error" :title="error" type="error" :closable="false" showIcon />
      <el-empty v-if="!loading && !error && !characters.length" description="素材库还没有角色" :imageSize="72" />

      <div v-else v-loading="loading" class="characterList">
        <el-card v-for="item in characters" :key="item.path" class="characterItem" shadow="never">
          <div class="characterMain">
            <div class="characterThumb" aria-hidden="true">
              <img v-if="item.primaryReference" :src="assetUrl(item.primaryReference.path)" alt="" loading="lazy" />
              <IconUser v-else :size="30" stroke="1.25" />
            </div>
            <div class="characterInfo">
              <div class="characterHeading">
                <el-text tag="strong">{{ item.name }}</el-text>
                <el-tag size="small" type="info" effect="plain">{{ item.referenceCount }} 张参考图</el-tag>
              </div>
              <el-text v-if="item.identity" size="small" type="info">{{ item.identity }}</el-text>
              <el-text class="characterPath" size="small" type="info" :title="item.path">{{ item.path }}</el-text>
            </div>
            <div class="characterActions">
              <el-button text :icon="IconPencil" :loading="renamingPath === item.path" :disabled="busy" @click="rename(item)">重命名</el-button>
              <el-button text :icon="IconDownload" :loading="exportingPath === item.path" :disabled="busy" @click="exportPack(item)">导出</el-button>
              <el-popconfirm
                title="删除后所有工作区的角色卡都无法再选用该角色，确定删除？"
                confirmButtonText="删除"
                cancelButtonText="取消"
                @confirm="remove(item)">
                <template #reference>
                  <el-button text type="danger" :icon="IconTrash" :loading="deletingPath === item.path" :disabled="busy">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { IconDownload, IconPencil, IconRefresh, IconTrash, IconUpload, IconUser } from "@tabler/icons-vue";
import {
  assetUrl,
  deleteCharacter,
  exportCharacterPack,
  importCharacterPack,
  listCharacters,
  renameCharacter,
  type CharacterSummary,
} from "@/lib/characterLibrary";

const characters = ref<CharacterSummary[]>([]);
const loading = ref(false);
const error = ref("");
const importing = ref(false);
const exportingPath = ref("");
const deletingPath = ref("");
const renamingPath = ref("");
const fileInput = ref<HTMLInputElement>();
const busy = computed(() => importing.value || !!exportingPath.value || !!deletingPath.value || !!renamingPath.value);

async function load() {
  if (loading.value) return;
  loading.value = true;
  error.value = "";
  try {
    characters.value = await listCharacters();
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : "角色列表读取失败";
  } finally {
    loading.value = false;
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function importPack(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || importing.value || loading.value) return;
  if (!/\.json$/i.test(file.name)) return void ElMessage.error("请选择角色包 JSON 文件");
  importing.value = true;
  try {
    const result = await importCharacterPack(file);
    await load();
    ElMessage.success(`已导入角色「${result.name}」，含 ${result.referenceCount} 张参考图`);
  } catch (failure) {
    ElMessage.error(failure instanceof Error ? failure.message : "角色包导入失败");
  } finally {
    importing.value = false;
  }
}

async function rename(item: CharacterSummary) {
  if (busy.value) return;
  const result = await ElMessageBox.prompt("请输入新的角色名", "重命名角色", {
    inputValue: item.name,
    inputPattern: /\S/,
    inputErrorMessage: "角色名不能为空",
    confirmButtonText: "保存",
    cancelButtonText: "取消",
    closeOnClickModal: false,
  }).then(value => value, () => null);
  if (!result) return;
  renamingPath.value = item.path;
  try {
    await renameCharacter(item.path, result.value);
    await load();
    ElMessage.success("角色名已更新");
  } catch (failure) {
    ElMessage.error(failure instanceof Error ? failure.message : "角色重命名失败");
  } finally {
    renamingPath.value = "";
  }
}

async function exportPack(item: CharacterSummary) {
  if (busy.value) return;
  exportingPath.value = item.path;
  try {
    const { blob, filename, referenceCount } = await exportCharacterPack(item.path);
    downloadBlob(blob, filename);
    ElMessage.success(`角色包已导出，含 ${referenceCount} 张参考图`);
  } catch (failure) {
    ElMessage.error(failure instanceof Error ? failure.message : "角色包导出失败");
  } finally {
    exportingPath.value = "";
  }
}

async function remove(item: CharacterSummary) {
  if (busy.value) return;
  deletingPath.value = item.path;
  try {
    await deleteCharacter(item.path);
    await load();
    ElMessage.success("角色已删除");
  } catch (failure) {
    ElMessage.error(failure instanceof Error ? failure.message : "角色删除失败");
  } finally {
    deletingPath.value = "";
  }
}

onMounted(load);
</script>

<style lang="scss" scoped>
.characterLibrary {
  padding: 0 4px 8px;

  .settingSection {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .libraryHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .settingInfo {
    min-width: 0;

    h3 {
      margin: 0 0 12px;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    .description {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
      line-height: 1.6;

      code {
        padding: 1px 4px;
        border-radius: 4px;
        background: var(--el-fill-color-light);
        font-size: 12px;
      }
    }
  }

  .libraryActions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .characterList {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 80px;
  }

  .characterItem {
    :deep(.el-card__body) {
      padding: 12px 14px;
    }
  }

  .characterMain {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .characterThumb {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 10px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-placeholder);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .characterInfo {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;

    .characterHeading {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;

      :deep(.el-text) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .characterPath {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
    }
  }

  .characterActions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  @media (max-width: 700px) {
    .libraryHeader {
      flex-direction: column;
    }

    .characterMain {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .characterActions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
