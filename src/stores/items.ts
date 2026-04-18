import { defineStore } from "pinia";
import { ref } from "vue";

export type ItemType = "app" | "web";

export interface StartupItem {
  name: string;
  args: string;
  target: string;
  order: number;
  delay: number;
  type: ItemType;
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
