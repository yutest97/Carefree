<template>
  <div class="privacy">
    <section class="settingSection" aria-labelledby="localTitle">
      <h3 id="localTitle">本地运行</h3>
      <p class="description">Carefree 在本机运行，项目、提示词、对话与生成内容只保存在你的设备上。</p>
    </section>

    <section class="settingSection" aria-labelledby="collectionTitle">
      <h3 id="collectionTitle">匿名使用统计</h3>
      <p class="description">本版本不收集、不上报任何匿名使用统计或遥测数据。</p>
    </section>

    <section class="settingSection" aria-labelledby="networkTitle">
      <h3 id="networkTitle">网络请求</h3>
      <p class="description">只有在你配置模型供应商后，才会向对应的接口地址发送生成请求；请求内容由该供应商的服务条款约束。</p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.privacy {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 4px 8px;

  .settingSection {
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
    }
  }
}
</style>
