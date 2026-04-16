<script setup lang="ts">
import { useItemsStore, type StartupItem } from "@/stores/items";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { NButton, NCard, NEmpty, NInput, NInputNumber, useMessage } from "naive-ui";
import { storeToRefs } from "pinia";
import { reboot } from "tauri-plugin-power-manager-api";
import { ref } from "vue";

const message = useMessage();

async function openFileDialog(item: StartupItem) {
  const file = await open({
    multiple: false,
    directory: false,
  });
  console.log(file);

  if (file) {
    item.target = file;
  }
}

const itemsStore = useItemsStore();
const { items } = storeToRefs(itemsStore);

function addStartupItem() {
  itemsStore.addItem({
    delay: 5,
    order: itemsStore.items.length + 1,
    target: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  });
}

const startupPath =
  "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\startup.bat";
const vbsPath = "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\startup.vbs";

async function useConfig() {
  try {
    const sortedItems = items.value.sort((a, b) => a.order - b.order);

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

    const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "startup.bat", 0, False
`;

    await writeTextFile(startupPath, batchContent, {
      baseDir: BaseDirectory.Home,
    });

    await writeTextFile(vbsPath, vbsContent, {
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
    await remove(startupPath, {
      baseDir: BaseDirectory.Home,
    });
    await remove(vbsPath, {
      baseDir: BaseDirectory.Home,
    });
    message.success("配置已删除");
  } catch (error) {
    message.error(`删除配置失败: ${error}`);
    console.error(error);
  }
}

let timeout = ref(10);

function restartComputer() {
  message.success(`${timeout.value} 秒后重启电脑`);

  setInterval(async () => {
    timeout.value--;
    message.success(`${timeout.value} 秒后重启电脑`);
    if (timeout.value <= 0) {
      try {
        await reboot();
      } catch (error) {
        message.error(`重启电脑失败: ${error}`);
      }
    }
  }, 1000);
}

// const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

// function noSideSpace(value: string) {
//   return !value.startsWith(" ") && !value.endsWith(" ");
// }
</script>

<template>
  <header class="header">
    <n-button size="small" class="add-btn" type="primary" @click="addStartupItem"
      >添加启动项</n-button
    >
    <n-button size="small" type="info" secondary @click="useConfig">使用配置</n-button>
    <n-button size="small" type="error" secondary @click="deleteConfig">取消配置</n-button>
    <n-button size="small" type="warning" secondary @click="restartComputer">重启电脑</n-button>
  </header>

  <main class="container">
    <div class="list-header">
      <div class="header-item target">启动项</div>
      <div class="header-item order">启动顺序</div>
      <div class="header-item delay">启动延迟(秒)</div>
      <div class="header-item">操作</div>
    </div>

    <TransitionGroup v-if="items.length > 0" name="list" tag="div" class="item-list">
      <n-card v-for="(item, index) in items" :key="item.target" class="item-card" size="small">
        <div class="card-row">
          <n-input
            v-model:value="item.target"
            class="input-target"
            type="text"
            clearable
            placeholder="启动项路径"
            @click.stop="() => openFileDialog(item)"
          />

          <div class="input-order">{{ item.order }}</div>

          <n-input-number
            class="input-number"
            :default-value="item.delay"
            :min="0"
            :max="60"
            :step="1"
            clearable
            placeholder="启动延迟"
          />

          <n-button size="tiny" quaternary type="error" @click="() => itemsStore.removeItem(index)"
            >删除</n-button
          >
        </div>
      </n-card>
    </TransitionGroup>
    <div v-else class="empty">
      <n-empty size="huge" description="没有任何启动项"> </n-empty>
    </div>
  </main>

  <footer class="app-footer">
    <div class="footer-item">
      <span class="footer-label">作者:</span>
      <a href="https://space.bilibili.com/24653681" target="_blank" class="footer-link">冷石Boy</a>
    </div>
    <div class="footer-item">
      <span class="footer-label">下载地址:</span>
      <a
        href="https://github.com/xrr2016/launchplusplus/releases"
        target="_blank"
        class="footer-link"
      >
        GitHub
      </a>
    </div>
  </footer>
</template>

<style scoped></style>
<style>
:root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-weight: 400;
  color: #0f0f0f;
  font-synthesis: none;
  background-color: #f6f6f6;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;

  .add-btn {
    flex: 1;
  }
}

.container {
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  overflow: hidden;

  .list-header {
    display: flex;
    gap: 12px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: rgba(250, 250, 252, 1);

    .header-item {
      padding: 6px 0;
      text-align: center;
    }

    .header-item.target {
      flex: 1;
    }

    .header-item.order {
      width: 80px;
      text-align: center;
    }

    .header-item.delay {
      width: 120px;
      text-align: center;
    }
  }

  .item-list {
    height: calc(100vh - 130px);
    overflow: hidden auto;
    box-sizing: border-box;

    .item-card {
      margin-bottom: 4px;
      .card-row {
        display: flex;
        gap: 12px;
        align-items: center;

        .input-target {
          flex: 1;
          overflow: clip;
          white-space: nowrap;
        }

        .input-order {
          width: 80px;
          text-align: center;
        }

        .input-number {
          width: 120px;
          text-align: center;
        }
      }
    }
  }

  .empty {
    height: calc(100vh - 130px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.list-enter-from {
  opacity: 0;
}

.list-leave-to {
  opacity: 0;
}

.list-move {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

@media (prefers-reduced-motion: reduce) {
  .list-enter-active,
  .list-leave-active,
  .list-move {
    transition: none;
  }
}

.app-footer {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-label {
  color: #666;
  font-weight: 500;
}

.footer-link {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}
</style>
