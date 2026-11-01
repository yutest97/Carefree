<template>
  <div class="about">
    <div class="brand">
      <div class="brandMark"><img class="brandLogo" :src="logoUrl" alt="Carefree Logo" /></div>
      <div class="brandInfo">
        <h3>Carefree</h3>
        <div class="brandMeta">
          <span v-if="version">v{{ version }}</span>
        </div>
      </div>
    </div>

    <el-card class="infoCard" shadow="never">
      <p class="intro">基于无限画布的 AI 短剧与漫剧创作工具，支持自备模型 API 与本地 ComfyUI，所有生成能力均由你自行接入。</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import logoUrl from "@toonflow/assets/logo.svg";

const version = import.meta.env.appVersion;
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 4px 0 12px;

    .brandMark {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      border-radius: calc(var(--ui-radius) * 1.5);
      background: var(--el-fill-color-light);

      .brandLogo {
        width: 42px;
        height: 42px;
        object-fit: contain;
      }
    }

    .brandInfo {
      min-width: 0;

      h3 {
        margin: 0 0 8px;
        color: var(--el-text-color-primary);
        font-size: 20px;
        font-weight: 600;
      }

      .brandMeta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }
    }
  }

  .infoCard {
    min-width: 0;
    border-radius: calc(var(--ui-radius) * 1);

    :deep(.el-card__body) {
      padding: 14px;
    }

    .intro {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
      line-height: 1.7;
    }
  }
}
</style>
