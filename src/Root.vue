<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useItemsStore } from "@/stores/items";
import { NConfigProvider, NMessageProvider } from "naive-ui";
import { onMounted } from "vue";
import App from "./App.vue";

const appStore = useAppStore();
const itemsStore = useItemsStore();

const themeOverrides = {
  // common: {
  //   primaryColor: "#276FC0FF",
  // },
};

onMounted(async () => {
  await appStore.$tauri.start();
  await itemsStore.$tauri.start();
});
</script>

<template>
  <n-config-provider :theme="appStore.theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <App />
    </n-message-provider>
  </n-config-provider>
</template>
