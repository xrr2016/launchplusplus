<script setup lang="ts">
import { useItemsStore, type StartupItem } from "@/stores/items";
import { NButton, NCard, NIcon, NInput, NInputNumber, NSpace, NTable } from "naive-ui";
import { reactive, ref } from "vue";

import { open } from "@tauri-apps/plugin-dialog";

async function openFileDialog() {
  const file = await open({
    multiple: false,
    directory: false,
  });
  console.log(file);

  if (file) {
    editingItem.target = file;
  }
}

const itemsStore = useItemsStore();
const editingIndex = ref<number>(-1);
const editingItem = reactive<StartupItem>({
  name: "",
  target: "",
  delay: 5,
  order: 0,
});

function addStartupItem() {
  itemsStore.addItem({
    name: "新启动项",
    target: "",
    delay: 5,
    order: itemsStore.items.length + 1,
  });
}

function editItem(item: StartupItem) {
  editingIndex.value = itemsStore.items.indexOf(item);
  editingItem.name = item.name;
  editingItem.delay = item.delay;
  editingItem.order = item.order;
  editingItem.target = item.target;
  console.log(editingIndex.value, editingItem);
}

function saveItem() {
  console.log(editingItem);
  itemsStore.items[editingIndex.value] = {
    ...editingItem,
  };
  editingIndex.value = -1;
}

function handleChange() {
  console.log(editingItem);
}

async function useConfig() {
  console.log("使用配置");
}

async function deleteConfig() {
  console.log("删除配置");
}

async function restartComputer() {
  console.log("重启电脑");
}

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

function noSideSpace(value: string) {
  return !value.startsWith(" ") && !value.endsWith(" ");
}
</script>

<template>
  <header class="header">
    <n-button size="small" type="success" @click="addStartupItem">添加启动项</n-button>

    <n-space>
      <n-button size="small" type="info" secondary @click="useConfig">使用配置</n-button>
      <n-button size="small" type="error" secondary @click="deleteConfig">删除配置</n-button>
      <n-button size="small" type="warning" secondary @click="restartComputer">重启电脑</n-button>
    </n-space>
  </header>
  <main class="container">
    <n-table>
      <thead>
        <tr>
          <th>启动项</th>
          <th>目标</th>
          <th>顺序</th>
          <th>延迟</th>
          <th>操作</th>
        </tr>
      </thead>
    </n-table>

    <n-card v-for="item in itemsStore.items" :key="item.name">
      <div
        v-if="editingIndex > -1 && editingIndex === itemsStore.items.indexOf(item)"
        class="card-row"
      >
        <n-input
          class="input w-72"
          v-model:value="editingItem.name"
          type="text"
          @input="handleChange"
          :default-value="item.name"
          placeholder="启动项名称"
        />

        <div v-if="editingItem.target">
          {{ editingItem.target }}
          <n-button size="tiny" ghost @click="editingItem.target = ''">
            <n-icon>x</n-icon>
          </n-button>
        </div>
        <n-button v-else @click="openFileDialog">选择文件</n-button>

        <n-input-number
          class="input w-72"
          v-model:value="editingItem.order"
          :default-value="item.order"
          clearable
          placeholder="启动顺序"
        />

        <n-input-number
          class="input w-72"
          v-model:value="editingItem.delay"
          :default-value="item.delay"
          clearable
          placeholder="启动延迟"
        />

        <n-space :size="4">
          <n-button size="tiny" quaternary type="success" @click="saveItem">保存</n-button>

          <n-button size="tiny" quaternary type="error" @click="itemsStore.removeItem(item)"
            >删除</n-button
          >
        </n-space>
      </div>
      <div v-else class="card-row">
        <div>{{ item.name }}</div>
        <div>{{ item.target }}</div>
        <div>{{ item.order }}</div>
        <div>{{ item.delay }}秒</div>
        <n-space :size="4">
          <n-button size="tiny" quaternary type="info" @click="editItem(item)">编辑</n-button>
          <n-button size="tiny" quaternary type="error" @click="itemsStore.removeItem(item)"
            >删除</n-button
          >
        </n-space>
      </div>
    </n-card>
  </main>
</template>

<style scoped></style>
<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  padding: 12px;
  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  padding: 12px 0;
  overflow: hidden auto;
}

.card-row {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-110 {
  width: 110px !important;
}

.w-72 {
  width: 72px !important;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}
</style>
