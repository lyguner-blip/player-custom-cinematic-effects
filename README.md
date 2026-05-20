# 玩家定制特效库

为 Foundry VTT 的玩家角色提供非侵入式电影级特效叠加。模块以角色配置为核心，识别角色的物品、法术、武技和特性，在自动化结算后播放 Sequencer/JB2A 风格的演出效果。

当前版本：`1.0.26`

## 功能概览

- 为指定玩家角色建立独立特效档案，避免通用自动识别动画千篇一律。
- 支持法术、武器、武技、防护、召唤、治疗、状态、光环等多种效果分类。
- 自动监听 `midi-qol`、DnD5e activity 和聊天卡触发，也支持控制面板手动播放。
- 提供场景工具栏控制面板，可切换角色、查看匹配状态、开关单项特效、改浮字。
- 支持客户端画质档位、镜头移动、镜头震动、Token 动势残影、浮字和音效设置。
- 默认避让 Chris Premades 和 Auto Animations 已有动画，降低重复播放的概率。
- 可与 `player-custom-automation-effects` 联动，让规则自动化接管特定动作的触发时机。

## 已适配角色

目前仓库内置以下角色档案：

- 福伦斯：洛山达晨曦
- 格蕾丝：银蓝奥术冰环
- L.：墓园石像守卫
- 卡吕普索：云巨血脉游荡者
- Sapphire：天界星图德鲁伊
- 银蔼：银弦造物诗人
- 勒奎因：天界深影剑士
- 格里黙：深渊多臂武僧
- 艾斯兰：妖精女巫集群
- 星海：酸潮奥术师

## 安装

在 Foundry VTT 的“安装模块”中使用 Manifest URL：

```text
https://github.com/lyguner-blip/player-custom-cinematic-effects/raw/main/module.json
```

也可以将仓库克隆到 Foundry 数据目录：

```bash
cd /path/to/FoundryVTT/Data/modules
git clone https://github.com/lyguner-blip/player-custom-cinematic-effects.git
```

## 依赖

必需：

- Sequencer

推荐：

- JB2A Patreon
- PSFX
- BLFX Assets Pack 01
- JAA Mod
- DnD5e Animations
- Auto Animations
- Midi-QOL
- Chris Premades

缺少部分推荐资源时，模块会尽量使用可用资源回退；但视觉完整度会下降。

## 使用方式

1. 在世界中启用本模块及依赖模块。
2. 进入场景后，从场景工具栏打开“玩家定制特效库”控制面板。
3. 选择当前角色，查看条目匹配状态。
4. 使用自动播放，或在面板内手动测试单个特效。
5. 根据客户端性能调整画质、镜头震动、音效和浮字。

## 联动说明

本模块会暴露 `game.modules.get("player-custom-cinematic-effects").api` 和 `globalThis.PlayerCustomCinematicEffects`，供自动化模块调用。自动化模块可以在规则处理完成后调用特效库播放对应动画，避免动画早于规则结算或 Token 移动。

## 开发

主要文件：

- `module.json`：Foundry 模块清单
- `scripts/main.mjs`：主逻辑、控制面板、触发监听、特效播放
- `scripts/profiles/`：角色档案与条目映射
- `styles/module.css`：控制面板样式
- `lang/zh-CN.json`：中文设置文案

提交前可以做基础语法检查：

```bash
node --check scripts/main.mjs
```

## 隐私与发布

仓库中的 `manifest` 和 `download` 字段使用 GitHub 地址，不包含私人服务器 IP 或本地部署路径。
