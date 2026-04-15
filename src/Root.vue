<script setup lang="ts">
import { onMounted } from "vue";
import App from "./App.vue";
import { useAppStore } from "./stores/app";

const appStore = useAppStore();

onMounted(async () => {
  await appStore.$tauri.start();
});
</script>

<template>
  <n-config-provider :theme="appStore.theme">
    <n-message-provider>
      <App />
    </n-message-provider>
  </n-config-provider>
</template>
