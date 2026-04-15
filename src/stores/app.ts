import type { GlobalTheme } from "naive-ui";
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
const theme = ref<GlobalTheme | null>(null);

  return { theme };
});