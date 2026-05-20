# 2026-05-20 16:16 热修：Token 残影贴图比例

## 本次目标

修正 Token 外观页“比例”放大后，残影仍按 Token 网格尺寸显示的问题。

## 已完成改动

- 为 `copySprite(source)` 生成的 Token 残影增加贴图比例补偿。
- 读取 TokenDocument 的 `texture.scaleX`、`texture.scaleY`，兼容可能存在的统一 `texture.scale` 字段。
- 统一修正通用 `addTokenAfterimage` 残影和狂热冲锋中的直线冲刺残影。

## 验证方式

- `node --check scripts/main.mjs`

## 已知风险

- 本次只修正复制 Token 贴图的残影。普通 JB2A 光效仍沿用原来的 `scaleToObject(..., { considerTokenScale: true })`。
- 若个别旧版 Foundry 或第三方 Token 数据不写入 `texture.scaleX/scaleY`，会回退为 `1`，保持原行为。
