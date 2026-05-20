# 玩家定制特效库

为 Foundry VTT 的玩家角色提供非侵入式电影级特效叠加。模块以角色配置为核心，识别角色的物品、法术、武技和特性，在自动化结算后播放 Sequencer/JB2A 风格的演出效果。

当前版本：`1.0.32`

## 功能概览

- 为指定玩家角色建立独立特效档案，避免通用自动识别动画千篇一律。
- 支持法术、武器、武技、防护、召唤、治疗、状态、光环等多种效果分类。
- 自动监听 `midi-qol`、DnD5e activity 和聊天卡触发，也支持控制面板手动播放。
- 提供场景工具栏控制面板，可切换角色、查看匹配状态、开关单项特效、改浮字。
- 固定只播放电影级特效，支持镜头移动、镜头震动、Token 动势残影、浮字和音效设置。
- 新增不绑定角色的通用戏法基础库，玩家可按条目在“自动/定制/通用/关闭”之间切换。
- 角色卡会为存在电影级特效的条目标记“影:定 / 影:通 / 影:关”，方便玩家识别。
- 可与 `player-custom-automation-effects` 联动，让规则自动化接管特定动作的触发时机。

## 已适配角色

目前仓库内置以下角色档案：

- 福伦斯：`scripts/profiles/florence.mjs`
- 格蕾丝：`scripts/profiles/grace.mjs`
- L.：`scripts/profiles/lawrence.mjs`
- 卡吕普索：`scripts/profiles/calypso.mjs`
- Sapphire：`scripts/profiles/sapphire.mjs`
- 银蔼：`scripts/profiles/yinai.mjs`
- 勒奎因：`scripts/profiles/lequin.mjs`
- 格里黙：`scripts/profiles/grim.mjs`
- 艾斯兰：`scripts/profiles/aislan.mjs`
- 星海：`scripts/profiles/xinghai.mjs`

## 角色档案维护边界

每个角色的物品映射、actor 名称、主题描述和默认序列都放在自己的 `scripts/profiles/<角色>.mjs` 文件里。多人协作时，只把对应角色文件交给维护者；除非是在整理共享解析规则，不要修改其他角色文件。

`scripts/profiles/profile-utils.mjs` 只放共享的档案生成与行解析逻辑。新增角色专属序列时，需要在 `scripts/main.mjs` 的 `PROFILE_SEQUENCE_PREFIXES` 中登记该角色自己的前缀，并在 `SEQUENCE_PLAYERS` 中提供播放器，或让它走对应角色的签名特效回退。

`scripts/profiles/backlog.mjs` 只保留旧导入兼容，不再作为维护入口。模块启动时会检查角色档案隔离性；发现问题时会在 GM 控制台提示重复角色名、重复物品 id、跨角色序列前缀和缺失播放器，避免一个角色的改动污染另一个角色。

公共消耗品序列目前只保留 `rationUse`、`brewUse` 和药水/神莓语义下的 `healerKit` 复用。其他跨角色复用都应当先确认不会影响角色专属表现。

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
5. 在条目行中按需要切换自动、定制、通用或关闭模式。
6. 根据客户端偏好调整镜头震动、音效和浮字。

## 联动说明

本模块会暴露 `game.modules.get("player-custom-cinematic-effects").api` 和 `globalThis.PlayerCustomCinematicEffects`，供自动化模块调用。自动化模块可以在规则处理完成后调用特效库播放对应动画，避免动画早于规则结算或 Token 移动。

常用入口：

- `playItemEffect(context)`：按 actor、item、source、targets 播放当前模式下的电影级特效。
- `playEffectStage(context)`：供自动化 MOD 按阶段触发同一个效果，支持传入 `stage`、`damage`、`attackRoll` 等上下文。
- `getActorEffect(actor, item)`：查看某个条目当前命中的定制/通用效果。
- `getUniversalEffects()`：查看通用基础特效库摘要。

## 开发

主要文件：

- `module.json`：Foundry 模块清单
- `scripts/main.mjs`：主逻辑、控制面板、触发监听、特效播放
- `scripts/universal/`：不绑定角色的通用基础特效库，目前先覆盖戏法层
- `scripts/profiles/`：逐角色档案与条目映射
- `styles/module.css`：控制面板样式
- `lang/zh-CN.json`：中文设置文案
- `docs/development/CINEMATIC_EFFECTS_DIRECTIVE.md`：后续电影级特效库开发指令
- `docs/updates/`：每次更新说明，文件名带时间戳

提交前可以做基础语法检查：

```bash
node --check scripts/main.mjs
node --check scripts/profiles/profile-utils.mjs
node --check scripts/universal/cantrips.mjs
```
