<template>
  <img v-if="url" :src="url" :alt="alt ?? '图片'" draggable="false" />
</template>

<script setup lang="ts">
import { useNodeFiles, type NodeMediaValue } from "@toonflow/nodes-scaffold/runtime";

const props = defineProps<{ file: NodeMediaValue; alt?: string }>();
const { useFileUrl } = useNodeFiles();
const url = useFileUrl(() => props.file, () => {});
</script>
