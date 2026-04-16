<script setup lang="ts">
import { useItemsStore, type StartupItem } from "@/stores/items";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { NButton, NCard, NIcon, NInputNumber, NSpace, NTable, useMessage } from "naive-ui";
import { reboot } from "tauri-plugin-power-manager-api";
import { reactive, ref } from "vue";

const message = useMessage();

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
  target: "",
  delay: 5,
  order: 0,
});

function addStartupItem() {
  itemsStore.addItem({
    target: "",
    delay: 5,
    order: itemsStore.items.length + 1,
  });
}

function editItem(item: StartupItem) {
  editingIndex.value = itemsStore.items.indexOf(item);
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

async function useConfig() {
  try {
    const sortedItems = [...itemsStore.items].sort((a, b) => a.order - b.order);

    let batchContent = "@echo off\n";
    for (const item of sortedItems) {
      if (item.target && item.delay > 0) {
        batchContent += `timeout /t ${item.delay} /nobreak > nul\n`;
        batchContent += `start "" "${item.target}"\n`;
      } else if (item.target) {
        batchContent += `start "" "${item.target}"\n`;
      }
    }
    batchContent += `exit\n`;

    // \Roaming\Microsoft\Windows\Start Menu\Programs\Startup
    const startupPath =
      "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\startup.bat";
    console.log(batchContent, startupPath);

    await writeTextFile(startupPath, batchContent, {
      baseDir: BaseDirectory.Home,
    });
    message.success("配置已应用到启动文件夹");
  } catch (error) {
    message.error(`应用配置失败: ${error}`);
    console.error(error);
  }
}

async function deleteConfig() {
  try {
    const startupPath =
      "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\startup.bat";

    await remove(startupPath, {
      baseDir: BaseDirectory.Home,
    });
    message.success("配置已删除");
  } catch (error) {
    message.error(`删除配置失败: ${error}`);
    console.error(error);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function restartComputer() {
  message.success("5 秒后重启电脑");
  await sleep(5000);
  try {
    await reboot();
  } catch (error) {
    message.error(`重启电脑失败: ${error}`);
    console.error(error);
  }
}

// const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

// function noSideSpace(value: string) {
//   return !value.startsWith(" ") && !value.endsWith(" ");
// }
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

    <n-card v-for="item in itemsStore.items" :key="item.target">
      <div
        v-if="editingIndex > -1 && editingIndex === itemsStore.items.indexOf(item)"
        class="card-row"
      >
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
  <footer>
    下载地址：<a
      href="https://github.com/launchplusplus/launchplusplus/releases/latest"
      target="_blank"
    >
      https://github.com/launchplusplus/launchplusplus/releases/latest
    </a>
    <br />
    联系：<a href="mailto:contact@launchplusplus.com">contact@launchplusplus.com</a>
    作者：ColdStoneBoy 赞助：<a href="https://github.com/sponsors/ColdStoneBoy" target="_blank">
      https://github.com/sponsors/ColdStoneBoy
    </a>
  </footer>
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
