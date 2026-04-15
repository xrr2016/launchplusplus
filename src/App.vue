<script setup lang="ts">
import { useItemsStore } from "@/stores/items";
import { NButton, NSpace, NTable } from "naive-ui";
import { computed } from "vue";

const itemsStore = useItemsStore();
const startupItems = computed(() => itemsStore.items);

function addStartupItem() {
  itemsStore.addItem({
    name: "新启动项",
    target: "C:\\Program Files\\Tencent\\QQ\\QQ.exe",
    order: 1,
    delay: 3,
  });
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
    <n-table class="table" striped>
      <thead>
        <tr>
          <th>启动项</th>
          <th>目标</th>
          <th>顺序</th>
          <th>延迟</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="item in startupItems" class="table-row" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.target }}</td>
          <td>{{ item.order }}</td>
          <td>{{ item.delay }}秒</td>
          <td>
            <n-space :size="4">
              <n-button size="tiny" quaternary type="info">编辑</n-button>
              <n-button size="tiny" quaternary type="error" @click="itemsStore.removeItem(item)"
                >删除</n-button
              >
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
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
  /* height: calc(100vh - 28px); */
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}
</style>
