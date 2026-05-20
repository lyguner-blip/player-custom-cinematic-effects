// Shared parser helpers for individual character profile files.
export function makeProfile(config) {
  return {
    id: config.id,
    displayName: config.displayName,
    actorNames: config.actorNames,
    theme: config.theme,
    palette: config.palette,
    concept: config.concept,
    effects: parseRows(config.rows, config)
  };
}

function parseRows(rows, config) {
  return rows.trim().split(/\n+/).map((line, index) => {
    const [itemId, itemName, sequence, flags = ""] = line.split("\t");
    const guardedByCrp = flags.includes("c");
    const requiresTarget = flags.includes("t");
    const tier = sequenceTier(sequence);
    return {
      id: `${config.id}-${index + 1}-${itemId}`,
      label: `${config.labelPrefix}${shortTitle(itemName)}`,
      itemIds: [itemId],
      itemNames: [itemName],
      sequence,
      tier,
      defaultEnabled: !guardedByCrp,
      requiresTarget,
      selfTarget: !requiresTarget,
      crpMode: guardedByCrp ? "crp-animation-disabled" : "overlay-safe",
      notes: guardedByCrp
        ? `${itemName} 已检测到 CRP 动画，默认不叠加；启用本库时只关闭动画开关，不影响自动化。`
        : `${config.displayName} 的 ${config.theme} 定制特效。`
    };
  });
}

function sequenceTier(sequence) {
  if (/^(calypsoCloud|sapphireStar|yinaiSilver|lequinShadow|grimAbyss|aislanFey|xinghaiTide)(Utility|Aura|Defense|Condition|Summon|Weapon|Projectile|Healing|Passive)$/u.test(String(sequence ?? ""))) return 2;
  if (/^grimManyHands(?:Unarmed|Dagger)$/u.test(String(sequence ?? ""))) return 2;
  if (/^xinghaiLegacy[A-Z]/u.test(String(sequence ?? ""))) return 2;
  if (["guidingBolt", "graceRayOfFrost", "graceMagicMissile", "xinghaiMagicMissile", "xinghaiWitchBolt", "xinghaiTideDefense", "xinghaiTideSummon", "xinghaiTideCondition", "graceFindFamiliar", "graceShield", "graceTashaLaughter", "shieldOfFaith", "healingWord", "healerKit"].includes(sequence)) return 2;
  if (["radianceOfTheDawn", "channelDivinity", "lawrenceActionSurge"].includes(sequence)) return 3;
  return 1;
}

function shortTitle(name) {
  const value = String(name ?? "").trim();
  if (!/[\u3400-\u9fff]/.test(value)) return value;
  return value
    .replace(/\s*\|.*$/u, "")
    .replace(/\s*\(.+?\)\s*$/u, "")
    .replace(/\s+[A-Za-z][\s\S]*$/u, "")
    .trim();
}
