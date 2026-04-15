import { defineStore } from "pinia";
import { ref } from "vue";

export interface StartupItem {
  name: string;
  path: string;
  order: number;
  delay: number;
}

export const useItemsStore = defineStore("items", () => {
  const items = ref<StartupItem[]>([
    {
      name: "QQ",
      path: "C:\\Program Files\\Tencent\\QQ\\QQ.exe",
      order: 1,
      delay: 3,
    },
    {
      name: "WeChat",
      path: "C:\\Program Files\\Tencent\\WeChat\\WeChat.exe",
      order: 2,
      delay: 4,
    },
  ]);

  function addItem(item: StartupItem) {
    items.value.push(item);
  }

  function removeItem(name: string) {
    const index = items.value.findIndex((i) => i.name === name);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  return { items, addItem, removeItem };
});