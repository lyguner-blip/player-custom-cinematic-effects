# 2026-05-20 14:09:26 更新说明

## 本次目标

明确 `player-custom-cinematic-effects` 的产品边界：本 MOD 只做电影级特效，并为后续通用基础特效库建立开发指令和更新说明规范。

## 已完成改动

- 将特效质量收束为唯一的电影级规格，取消轻量/标准档位入口。
- 控制面板中改为显示固定的“电影级”标记，不再提供质量下拉选择。
- 新增长期开发指令：`docs/development/CINEMATIC_EFFECTS_DIRECTIVE.md`。
- 建立更新说明固定目录：`docs/updates/`。
- 更新 README，补充开发指令和更新说明入口。

## 验证方式

- 已运行 `node --check scripts/main.mjs`。
- 已运行全部 `scripts/profiles/*.mjs` 语法检查。
- 已检查仓库中无私人部署地址、局域网地址和占位下载地址残留。
- 已检查代码中无 `QUALITY.light`、`QUALITY.standard`、`default: "standard"` 残留。

## 已知风险

- 本次只建立开发方向，并完成电影级唯一档位的收束。
- 通用基础特效库、玩家切换定制/通用特效、角色卡标记、Boss Loot FX 优先级抑制仍需后续分阶段实现。

## 资源反馈

本次未新增具体动画资源调用，因此暂无新增资源缺失反馈。
