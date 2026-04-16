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

  function removeItem(index: number) {
    console.log(index);
  }

  return { items, addItem, removeItem };
});
