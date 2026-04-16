import { defineStore } from "pinia";
import { ref } from "vue";

export interface StartupItem {
  target: string;
  args: string;
  order: number;
  delay: number;
}

export const useItemsStore = defineStore("items", () => {
  const items = ref<StartupItem[]>([]);

  function addItem(item: StartupItem) {
    items.value.push(item);
  }

  function removeItem(index: number) {
    items.value.splice(index, 1);
    items.value.forEach((item, i) => {
      item.order = i + 1;
    });
  }

  return { items, addItem, removeItem };
});
