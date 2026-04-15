# LaunchPlusPlus

Windows 系统启动项管理工具

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Naive UI
- **状态管理**: Pinia
- **包管理器**: Bun

### 后端
- **框架**: Tauri 2 (Rust)
- **插件**: 
  - tauri-plugin-pinia (状态共享)
  - tauri-plugin-opener (打开外部链接)

## 项目结构

```
launchplusplus/
├── src/                      # 前端 Vue 代码
│   ├── assets/               # 静态资源
│   ├── stores/               # Pinia 状态管理
│   │   └── app.ts            # 应用状态 store
│   ├── App.vue               # 主组件
│   ├── Root.vue              # 根组件
│   └── main.ts               # 入口文件
├── src-tauri/                # Tauri 后端代码
│   ├── src/
│   │   ├── lib.rs            # Tauri 核心逻辑
│   │   └── main.rs           # 入口文件
│   ├── capabilities/         # Tauri 权限配置
│   ├── icons/                # 应用图标
│   ├── Cargo.toml            # Rust 依赖
│   └── tauri.conf.json       # Tauri 配置
├── public/                   # 公共资源
├── package.json              # Node 依赖
└── vite.config.ts            # Vite 配置
```

## 核心功能

1. **启动项管理**
   - 添加新启动项
   - 编辑启动项配置（名称、路径、顺序、延迟）
   - 删除启动项

2. **配置管理**
   - 保存当前配置
   - 加载已有配置
   - 删除配置

3. **系统操作**
   - 重启计算机

## 数据模型

### StartupItem (启动项)
| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 启动项名称 |
| path | string | 可执行文件路径 |
| order | number | 启动顺序 |
| delay | number | 启动延迟（秒） |

## 运行命令

```bash
# 开发模式
bun run dev

# 构建前端
bun run build

# Tauri 开发
bun run tauri dev

# Tauri 构建
bun run tauri build
```