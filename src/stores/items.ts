import { defineStore } from "pinia";
import { ref } from "vue";

export interface StartupItem {
  name: string;
  order: number;
  delay: number;
  target: string;
}

export const useItemsStore = defineStore("items", () => {
  const items = ref<StartupItem[]>([
    {
      name: "QQ",
      target: "C:\\Program Files\\Tencent\\QQ\\QQ.exe",
      order: 1,
      delay: 3,
    },
  ]);

  function addItem(item: StartupItem) {
    items.value.push(item);
  }

  function removeItem(item: StartupItem) {
    items.value = items.value.filter((i) => i !== item);
  }

  return { items, addItem, removeItem };
});
