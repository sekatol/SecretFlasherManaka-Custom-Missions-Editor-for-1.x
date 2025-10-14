# SecretFlasherManaka Custom Missions Editor for 1.x


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

[![Electron](https://img.shields.io/badge/electron-28.1.0-blue)](https://www.electronjs.org/)







## ✨ 特性



- 🎨 **可视化节点编辑** - 基于 ReactFlow 的直观拖拽式节点编辑器Mod Station v2.0 是一个基于 React + ReactFlow 的现代化任务编辑器，专为 Secret or Lie 游戏的复杂任务系统设计。通过直观的节点连线方式，让任务制作变得简单高效。---

- 📦 **多标签页工作区** - 支持同时编辑多个任务，带有工作区持久化

- 🗂️ **文件浏览器** - Windows 风格的文件浏览器，支持历史记录

- 🎯 **智能条件库** - 177+ 预定义条件表达式，支持中文显示和搜索

- 🔄 **JSON 导入/导出** - 完整支持游戏任务格式的导入和导出### 核心特性## 🚀 快速开始

- 🎭 **可视化标签系统** - 动作节点中的代码自动转换为彩色标签

- 🌐 **子条件支持** - SubCondition 引用的智能解析和展开

- 💾 **自动保存** - 工作区状态自动保存，刷新不丢失

- 🎨 **现代化 UI** - VSCode 风格的深色主题界面- 🎨 **可视化编辑**: 拖拽式节点操作，所见即所得### 安装依赖



## 📋 系统要求- 



- **Node.js**: >= 16.0.0- 🔄 **节点合并**: 优化后的动作节点，更简洁易用

- **npm**: >= 8.0.0

- **操作系统**: Windows 10/11, macOS 10.15+, Linux



## 🚀 快速开始- 



### 1. 克隆仓库- 💾 **完整兼容**: 支持导入导出原生 JSON 格式



```bash### 启动应用

git clone https://github.com/felixchaos/SecretFlasherManaka-Custom-Missions-Editor-for-1.x.git

cd SecretFlasherManaka-Custom-Missions-Editor-for-1.x## 🚀 快速开始

```

```powershell

### 2. 安装依赖

### 安装依赖npm run dev

```bash

npm install# 或双击 启动.bat

```

```bash```

**核心依赖**:

- `electron` (^28.1.0) - 应用框架npm install

- `react` (^18.2.0) - UI 框架

- `react-dom` (^18.2.0) - React DOM 渲染·访问: http://localhost:3000 或等待Electron窗口自动打开

- `reactflow` (^11.10.4) - 节点流编辑器

- `zustand` (^4.4.7) - 状态管理



**开发依赖**:### 启动开发服务器---

- `vite` (^5.0.8) - 构建工具

- `@vitejs/plugin-react` (^4.2.1) - React 插件

- `concurrently` (^8.2.2) - 并发运行脚本

- `wait-on` (^7.2.0) - 等待服务启动

- `electron-builder` (^24.9.1) - 应用打包



### 3. 启动开发模式

```
npm run dev
```


这将同时启动：

- Vite 开发服务器 (http://localhost:3000)

- Electron 应用窗口

### 访问应用- ✅ JSON结构详解

**首次启动后，编辑器将自动打开。**

- ✅ 节点类型说明

### 4. 构建生产版本



```bash
# 构建前端资源
npm run build
# 打包桌面应用
npm run build:electron
```


打包后的应用将输出到 `release/` 目录。



## 📖 使用指南

#### 基础节点---

### 基础操作

- **任务信息 (MissionInfo)**: 设置任务标题和描述

#### 创建新任务

1. 点击 **文件** → **新建任务**- **检查点 (Checkpoint)**: 定义任务流程的关键节点

2. 或使用快捷键 `Ctrl+N` (Windows/Linux) / `Cmd+N` (macOS)

3. 在新标签页中开始编辑- **区域 (Zone)**: 定义游戏世界中的地理区域



#### 导入现有任务- **条件模块 (Condition)**: 设置触发条件### 可视化编辑

1. 点击 **文件** → **打开文件**

2. 选择 `.json` 任务文件- **传送点 (Teleport)**: 快速传送位置设置

3. 任务将被解析为可视化节点流

- 🔗 直观的连线方式

#### 编辑节点

1. 从左侧工具栏拖拽节点到画布#### 动作节点

2. 单击节点，在右侧属性面板编辑详细信息

3. 双击描述节点可直接编辑文本- **ManageCosplay**: 统一管理服装穿脱 



####  **ManageAdultToy**: 

1. 拖拽节点的**输出句柄**（右侧圆点）

2. 连接到另一个节点的**输入句柄**（左侧圆点）- **SetStage**: 切换游戏场景

3. 不同颜色的句柄代表不同的连接类型

- **SetVibrator**: 设置振动器强度 (5档)

#### 导出任务

1. 点击 **文件** → **导出任务**- **SetPiston**: 设置活塞强度 (5档)

2. 选择保存位置

3. 生成符合游戏格式的 JSON 文件- **DropItem**: 在指定位置放置物品）



### 节点类型说明- **SetPlayerPosition**: 设置玩家位置和旋转



| 节点类型 | 图标 | 颜色 | 说明 |
| --- | ---: | :---: | --- |
| 检查点节点 | 📍 | 橙色 | 任务的主要进度点，定义地点和完成条件（Checkpoint） |
| 条件模块 | ✓ | 绿色 | 检查点的完成条件（condition） |
| 移动条件模块 | 🚶 | 蓝色 | 检查点的移动/路径条件（travelcondition） |
| 动作节点 | ⚡ | 紫色 | 执行游戏内动作（装备、传送等） |
| 描述节点 | 📝 | 灰色 | 任务描述文本节点（可编辑） |
| 失败描述节点 | ❌ | 红色 | 失败时显示的描述（仅 UI 显示） |
| 地点容器 | 📦 | 青色 | 管理任务中的地点/区域（单击高亮，双击选择） |
| 子条件容器 | 🔧 | 黄色 | 管理可重用的子条件（SubCondition） |

#### 完整指令分类
### 条件表达式库



编辑器内置 **177+ 条件表达式**，全部支持中文显示和智能搜索：

**服装系统 (40+ 部件)**### JSON支持

#### 状态类 (13个)

- `Naked` - 裸体状态- 头部、上衣、下装、鞋子、饰品等- 📥 导入现有任务（100+示例文件）

- `Orgasm` - 高潮状态

- `Peeing` - 排尿状态- 支持搜索和分类浏览- 💾 导出标准格式

- `Sitting` - 坐下状态

- `Crouching` - 蹲下状态- 自动检测互斥配置- 🔄 双向转换

- `Blindfolded` - 蒙眼状态

- ... 等- 📍 位置保存



#### 束缚类 (7个)**成人玩具 (6种)**

- `HandcuffsObject` - 手铐物体

- `TimedHandcuffs` - 计时手铐- Vibrator, TitRotor, KuriRotor---

- `KeyedHandcuffs` - 钥匙手铐

- `NoHandcuffs` - 无手铐- PistonAnal, PistonPussy, EyeMask

- ... 等

## 🎯 节点类型

#### 振动器/活塞强度 (7个)

- `VibrationOff` - 振动器关闭**游戏场景 (12个)**

- `VibrationLow` - 低强度

- `VibrationHigh` - 高强度- Apart, Residence, Park, Mall等| 图标 | 名称 | 用途 |

- `VibrationRandom` - 随机强度

- `PistonMedium` - 活塞中强度|-----|------|------|

- ... 等

**强度等级 (5档)**| 📋 | 任务信息 | 任务元数据 |

#### 陶醉度条件 (8个)

- `Ecstasy==0` - 陶醉度为0- Off, Low, Medium, High, Random| 🌀 | 传送点 | 起始位置 |

- `Ecstasy==1` - 陶醉度最大

- `Ecstasy<0.5` - 陶醉度小于0.5| 🗺️ | 地点容器 | 所有zone定义 |

- ... 等

**条件表达式 (20+)**| 🔀 | 子条件容器 | 所有subcondition定义 |

#### 动作条件 (48个)

- `Action_OnaniNormal` - 普通自慰- 状态、束缚、时间、位置等| ✅ | 检查点 | 任务目标（15个字段） |

- `Action_PeeStand` - 站立排尿

- `Action_SitDildo` - 坐假阳具| 💬 | 对话 | 剧情文本 |

- `Action_UseBuyMachine` - 使用自动售货机

- ... 等#### 使用指令库| 🏁 | 结束 | 任务完成 |



#### 技能条件 (11个)

- `Skill_AutoSlow` - 自动慢动作

- `Skill_TimeStop` - 时间停止1. 点击输入框旁的 **📚** 按钮---

- `Skill_NoReinforceEffect` - 装备效果无效

- ... 等（使用 `!` 前缀表示关闭）2. 浏览分类或使用搜索



#### 物品条件 (7个)3. 多选需要的指令## 🛠️ 技术栈

- `Item_Water` - 水

- `Item_Dildo` - 假阳具4. 系统自动检测冲突并高亮警告

- `Item_HandcuffKey` - 手铐钥匙

- `Item_VibeRemocon` - 振动器遥控5. 确认应用到字段- **Electron** 28.1.0 - 桌面应用框架

- ... 等

- **React** 18.2.0 - UI框架


## 🏗️ 项目结构---



```3. **添加检查点**

SecretFlasherManaka-Custom-Missions-Editor/

├── src/   - 创建 Checkpoint 节点## 🎮 使用示例

│   ├── main.js                    # Electron 主进程

│   ├── preload.js                 # Electron 预加载脚本   - 连接 zone 引用

│   └── renderer/                  # React 渲染进程

│       ├── index.jsx              # React 入口   - 添加 Condition 模块### 1. 导入任务

│       ├── App.jsx                # 主应用组件

│       ├── components/            # React 组件```

│       │   ├── ActionNode.jsx     # 动作节点组件

│       │   ├── CheckpointNode.jsx # 检查点节点组件4. **设置动作**点击 "📂 导入任务" → 选择JSON文件 → 自动生成节点

│       │   ├── CheckpointModuleNode.jsx # 条件模块节点

│       │   ├── DescriptionNode.jsx # 描述节点组件   - 添加 ManageCosplay 节点```

│       │   ├── PropertyPanel.jsx  # 属性编辑面板

│       │   ├── Sidebar.jsx        # 左侧工具栏   - 选择动作类型 (穿上/脱下)

│       │   ├── TabBar.jsx         # 标签页栏

│       │   ├── FileExplorer.jsx   # 文件浏览器   - 点击 📚 按钮选择服装部件### 2. 编辑节点

│       │   ├── ZoneContainer.jsx  # 地点容器

│       │   └── SubConditionContainer.jsx # 子条件容器   - 连接到 oncomplete 锚点```

│       ├── config/                # 配置文件

│       │   ├── actionLibrary.js   # 条件/动作/服装/物品库点击节点 → 右侧属性面板 → 编辑字段 → 自动保存

│       │   └── nodeTypes.js       # 节点类型定义

│       ├── utils/                 # 工具函数5. **导出 JSON**```

│       │   ├── taskConverter.js   # JSON ↔ 节点流转换

│       │   └── workspaceManager.js # 工作区状态管理   - 点击"导出 JSON"按钮

│       └── styles/                # 样式文件

│           └── App.css            # 全局样式   - 保存到游戏目录### 3. 选择地点

├── index.html                     # HTML 入口

├── package.json                   # 项目配置和依赖```

├── vite.config.js                 # Vite 构建配置

├── .gitignore                     # Git 忽略文件### ManageCosplay 示例点击检查点 → 双击"地点引用"字段 → 搜索选择 → 确认

└── README.md                      # 项目文档（本文件）

``````








## 作者

晓卡



