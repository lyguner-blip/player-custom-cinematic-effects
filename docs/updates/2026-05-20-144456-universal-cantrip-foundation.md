# 2026-05-20 14:44:56 更新说明

## 本次目标

按电影级特效库总纲改造 `player-custom-cinematic-effects`，建立第一轮不绑定角色的通用戏法基础库，并让玩家可以在定制、通用和关闭模式之间切换。

## 已完成改动

- 新增 `scripts/universal/`，注册通用戏法基础特效，当前覆盖酸液飞溅、火焰箭、冰冻射线、魔法伎俩、舞光术、光亮术、神导术、法师之手、恶言相加等戏法。
- 新增 `universalCantrip` 播放器，支持施法前摇、投射、落点爆发、近战、目标命中、短促地面层、浮字和音效。
- 酸液飞溅按 PHB 2024 描述改为“落点酸性气泡爆开”的瞬发效果，不生成持续性循环。
- 控制面板增加“定制/通用/关闭”统计和单条目模式切换。
- 角色卡为已配置条目增加电影级特效标记，区分定制、通用和关闭。
- 对 `player-custom-automation-effects` 暴露 `playEffectStage(context)`，便于多段自动化按阶段触发动画。
- 物品匹配新增 Babele 兼容：除当前名称外，也读取 `flags.babele.originalName`、`flags.babele.originalPayload.name` 和 `system.identifier`，降低汉化后无法命中特效的概率。
- 外部动画优先级改为本库优先；存在定制或通用电影级效果时，默认关闭 AA/CRP 的动画开关，保留规则自动化。
- 开发指令补充资源基准：以维护者本地安装的 `dnd-players-handbook` 为法术描述准绳，`dnd5e-animations` 只作预设参考。

## 验证方式

- `node --check scripts/main.mjs`
- `node --check scripts/universal/cantrips.mjs`
- `node --check scripts/universal/registry.mjs`
- `node --check scripts/profiles/*.mjs`

## 已知风险与后续待办

- 当前是第一轮通用戏法框架，视觉表现已按主题区分，但仍需要逐个戏法继续对照 PHB 描述细化独特动作。
- `dnd-players-handbook` 的法术包是 LevelDB；本次通过本地二进制检索确认可读取关键描述，后续如要批量校验应补一个 Foundry 运行时或 LevelDB 抽取工具。
- 通用基础库下一阶段应继续覆盖 1 环及以上法术，并沉淀更细的 `cast/projectile/impact/area/sustain/cleanup` 扩展点。
