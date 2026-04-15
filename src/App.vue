<script setup lang="ts">
import { useItemsStore, type StartupItem } from "@/stores/items";
import { NButton, NCard, NSpace, NTable } from "naive-ui";
import { ref } from "vue";

const itemsStore = useItemsStore();
const editingItem = ref<StartupItem | null>(null);

function addStartupItem() {
  itemsStore.addItem({
    name: "新启动项",
    target: "",
    delay: 5,
    editing: false,
    order: itemsStore.items.length + 1,
  });
}

function editItem(item: StartupItem) {
  item.editing = true;
  editingItem.value = item;
  console.log(editingItem.value);
}

function saveItem(item: StartupItem) {
  if (!editingItem.value) {
    return;
  }

  console.log(editingItem.value);
  item.editing = false;
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
      <div v-if="item.editing && editingItem === item" class="card-row">
        <n-input
          class="input"
          :default-value="item.name"
          v-model="editingItem!.name"
          type="text"
          placeholder="启动项名称"
        />

        <n-input
          class="input"
          :default-value="item.target"
          v-model="editingItem!.target"
          type="text"
        />

        <n-input
          :default-value="item.order.toString()"
          class="input w-72"
          type="text"
          placeholder="启动顺序"
        />

        <n-input
          :default-value="item.delay.toString()"
          v-model="item.delay"
          class="input w-72"
          type="text"
          placeholder="启动延迟"
        />

        <n-space :size="4">
          <n-button size="tiny" quaternary type="success" @click="saveItem(item)">保存</n-button>

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

.input {
  background-color: aquamarine;
}

.w-110 {
  width: 110px;
}

.w-72 {
  width: 72px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}
</style>
