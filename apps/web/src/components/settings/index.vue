<template>
  <el-dialog v-model="visible" title="设置" width="min(1080px, calc(100vw - 32px))" alignCenter appendToBody>
    <div class="settings">
      <aside class="sidebar" aria-label="设置分类">
        <div class="settingsBrand" aria-hidden="true">
          <img :src="logoUrl" alt="" />
          <span>Carefree</span>
        </div>
        <template v-for="item in settingsPanels" :key="item.id">
          <h3 v-if="item.groupLabel" class="settingsGroupLabel">{{ item.groupLabel }}</h3>
          <button
            class="settingsItem"
            type="button"
            :aria-label="item.id === 'about' && hasDesktopUpdate ? `${item.label}，有新版本可用` : item.label"
            :aria-pressed="activePanel.id === item.id"
            @click="activePanel = item">
            <el-badge class="panelIcon" isDot :hidden="item.id !== 'about' || !hasDesktopUpdate">
              <component :is="item.icon" :size="18" aria-hidden="true" />
            </el-badge>
            <span>{{ item.label }}</span>
          </button>
        </template>
      </aside>
      <section class="content" :aria-label="activePanel.label" tabindex="0">
        <h2 class="panelTitle">{{ activePanel.label }}</h2>
        <div class="panelContent">
          <transition name="el-fade-in" mode="out-in">
            <keep-alive include="personalization">
              <component
                :is="activePanel.component"
                v-bind="['languageModel', 'mediaModel', 'personalization'].includes(activePanel.id) ? { visible } : {}" />
            </keep-alive>
          </transition>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from "vue";
import { hasDesktopUpdate } from "@/stores/desktopUpdate";
import logoUrl from "@toonflow/assets/logo.svg";
import {
  IconPalette,
  IconSettings,
  IconPhotoVideo,
  IconInfoCircle,
  IconCode,
  IconShieldLock,
  IconPlugConnected,
  IconUserCog,
  IconSubtitlesAi,
  IconNetwork,
  IconUsers,
} from "@tabler/icons-vue";

const settingsPanels = [
  { id: "ui", label: "界面设置", icon: IconPalette, component: defineAsyncComponent(() => import("./panels/ui.vue")) },
  { id: "general", label: "常规配置", icon: IconSettings, component: defineAsyncComponent(() => import("./panels/general/index.vue")) },
  {
    id: "languageModel",
    label: "文本模型",
    icon: IconSubtitlesAi,
    groupLabel: "模型",
    component: defineAsyncComponent(() => import("./panels/languageModel/index.vue")),
  },
  { id: "mediaModel", label: "媒体模型", icon: IconPhotoVideo, component: defineAsyncComponent(() => import("./panels/mediaModel/index.vue")) },
  { id: "characterLibrary", label: "角色库", icon: IconUsers, groupLabel: "素材", component: defineAsyncComponent(() => import("./panels/characterLibrary.vue")) },
  { id: "mcp", label: "MCP", icon: IconPlugConnected, groupLabel: "通讯", component: defineAsyncComponent(() => import("./panels/mcp/index.vue")) },
  { id: "network", label: "网络设置", icon: IconNetwork, component: defineAsyncComponent(() => import("./panels/network.vue")) },
  {
    id: "personalization",
    label: "个性化",
    icon: IconUserCog,
    groupLabel: "其他",
    component: defineAsyncComponent(() => import("./panels/personalization.vue")),
  },
  { id: "privacy", label: "隐私", icon: IconShieldLock, component: defineAsyncComponent(() => import("./panels/privacy.vue")) },
  { id: "developer", label: "开发者选项", icon: IconCode, component: defineAsyncComponent(() => import("./panels/developer/index.vue")) },
  { id: "about", label: "关于", icon: IconInfoCircle, component: defineAsyncComponent(() => import("./panels/about.vue")) },
];
const activePanel = shallowRef(settingsPanels[0]!);
const visible = defineModel<boolean>({ default: false });
</script>

<style lang="scss" scoped>
.settings {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  height: min(72vh, calc(100dvh - 140px));
  overflow: hidden;

  .sidebar {
    min-height: 0;
    overflow-y: auto;
    padding: 2px;

    .settingsBrand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 10px 12px;
      margin-bottom: 2px;
      border-bottom: 1px solid color-mix(in srgb, var(--el-color-primary) 12%, var(--el-border-color-lighter));

      img {
        width: 26px;
        height: 26px;
        flex-shrink: 0;
        border-radius: 8px;
      }

      span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--el-text-color-primary);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }
    }

    .settingsGroupLabel {
      margin: 14px 12px 6px;
      color: var(--el-text-color-secondary);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }

    .settingsItem {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      margin-bottom: 4px;
      border: 0;
      border-radius: var(--el-border-radius-base);
      background: transparent;
      color: var(--el-text-color-regular);
      font: inherit;
      text-align: start;
      cursor: pointer;

      .panelIcon {
        display: inline-flex;
        flex-shrink: 0;
      }

      > span {
        min-width: 0;
        overflow-wrap: anywhere;
      }

      &:hover {
        background: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
      }

      &[aria-pressed="true"] {
        background: linear-gradient(90deg, color-mix(in srgb, var(--el-color-primary) 16%, transparent), color-mix(in srgb, var(--el-color-primary) 5%, transparent));
        color: var(--el-color-primary);
        box-shadow: inset 2px 0 0 var(--el-color-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--el-color-primary);
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0 20px;
    overflow: hidden;

    .panelTitle {
      flex-shrink: 0;
      margin: 0 0 20px;
      font-size: 18px;
    }

    .panelContent {
      flex: 1;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-left: 5px;
      padding-right: 5px;
      padding-bottom: 50px;

      > :deep(.el-fade-in-enter-active),
      > :deep(.el-fade-in-leave-active) {
        transition-duration: 100ms;
      }
    }
  }

  @media (max-width: 700px) {
    grid-template-columns: 44px minmax(0, 1fr);

    .sidebar {
      .settingsBrand {
        justify-content: center;
        padding: 2px 0 10px;

        span { display: none; }
      }

      .settingsGroupLabel {
        margin: 12px 0 6px;
        text-align: center;
      }

      .settingsItem {
        justify-content: center;
        padding: 12px;
        span {
          display: none;
        }
      }
    }

    .content {
      padding: 0 8px 0 16px;
    }
  }
}
</style>
