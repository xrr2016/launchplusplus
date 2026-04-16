import { defineStore } from "pinia";
import { ref } from "vue";

export interface StartupItem {
  target: string;
  order: number;
  delay: number;
}

export const useItemsStore = defineStore("items", () => {
  const items = ref<StartupItem[]>([]);

  function addItem(item: StartupItem) {
    items.value.push(item);
  }

  function removeItem(item: StartupItem) {
    items.value = items.value.filter((i) => i !== item);
  }

  return { items, addItem, removeItem };
});
