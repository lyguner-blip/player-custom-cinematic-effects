function cantrip(config) {
  const names = [
    config.label,
    ...(config.names ?? [])
  ].filter(Boolean);
  return {
    id: `cantrip-${config.id}`,
    label: `通用·${config.label}`,
    itemNames: [...new Set(names)],
    sequence: "universalCantrip",
    category: config.category ?? (config.requiresTarget ? "projectile" : "utility"),
    durationType: config.durationType ?? "instant",
    templateType: config.templateType ?? "",
    defaultEnabled: true,
    requiresTarget: Boolean(config.requiresTarget),
    selfTarget: config.selfTarget ?? !config.requiresTarget,
    rulesReference: {
      module: "dnd-players-handbook",
      pack: "spells",
      source: "PHB 2024",
      cue: config.rulesCue ?? ""
    },
    universal: {
      family: "cantrip",
      theme: config.theme ?? "arcane",
      motion: config.motion ?? (config.requiresTarget ? "projectile" : "pulse"),
      stages: config.stages ?? ["cast", "impact"],
      floatingText: config.floatingText ?? config.label
    },
    notes: `通用电影级戏法：${config.label}。${config.rulesCue ? `规则表现：${config.rulesCue}` : "以 PHB 2024 法术描述为表现基准。"}`
  };
}

export const UNIVERSAL_CANTRIP_EFFECTS = [
  cantrip({
    id: "acid-splash",
    label: "酸液飞溅",
    names: ["Acid Splash"],
    theme: "acid",
    category: "template",
    templateType: "circle",
    motion: "point-burst",
    requiresTarget: true,
    rulesCue: "酸性气泡在落点爆开，形成短促的 5 尺酸液飞溅。"
  }),
  cantrip({ id: "blade-ward", label: "剑刃防护", names: ["Blade Ward"], theme: "ward", category: "defense", durationType: "sustained" }),
  cantrip({ id: "booming-blade", label: "轰雷剑", names: ["Booming Blade", "雷鸣剑", "轰鸣剑"], theme: "thunder", motion: "melee", requiresTarget: true }),
  cantrip({ id: "chill-touch", label: "冻寒之触", names: ["寒冷之触", "Chill Touch"], theme: "necrotic", requiresTarget: true }),
  cantrip({ id: "control-flames", label: "控火术", names: ["Control Flames"], theme: "fire", category: "utility" }),
  cantrip({ id: "create-bonfire", label: "创造篝火", names: ["Create Bonfire"], theme: "fire", category: "template", templateType: "circle", durationType: "sustained", requiresTarget: true }),
  cantrip({ id: "dancing-lights", label: "舞光术", names: ["Dancing Lights"], theme: "light", category: "aura", durationType: "sustained" }),
  cantrip({ id: "druidcraft", label: "德鲁伊伎俩", names: ["Druidcraft"], theme: "nature", category: "utility" }),
  cantrip({ id: "eldritch-blast", label: "魔能爆", names: ["Eldritch Blast", "魔能冲击"], theme: "force", requiresTarget: true }),
  cantrip({ id: "elementalism", label: "四象法门", names: ["Elementalism"], theme: "elemental", category: "utility" }),
  cantrip({ id: "encode-thoughts", label: "思想编码", names: ["Encode Thoughts"], theme: "psychic", category: "utility" }),
  cantrip({ id: "fire-bolt", label: "火焰箭", names: ["Fire Bolt"], theme: "fire", requiresTarget: true }),
  cantrip({ id: "friends", label: "交友术", names: ["Friends", "交友"], theme: "enchantment", category: "condition", durationType: "sustained", requiresTarget: true }),
  cantrip({ id: "frostbite", label: "冻寒术", names: ["Frostbite"], theme: "cold", motion: "point-burst", requiresTarget: true }),
  cantrip({ id: "green-flame-blade", label: "绿焰刃", names: ["绿焰剑", "Green-Flame Blade"], theme: "fire", motion: "melee", requiresTarget: true }),
  cantrip({ id: "guidance", label: "神导术", names: ["Guidance"], theme: "radiant", category: "healing", durationType: "sustained" }),
  cantrip({ id: "gust", label: "阵风术", names: ["Gust", "造风术"], theme: "air", category: "utility", requiresTarget: true }),
  cantrip({ id: "infestation", label: "虫群侵扰", names: ["Infestation"], theme: "poison", category: "condition", requiresTarget: true }),
  cantrip({ id: "light", label: "光亮术", names: ["Light"], theme: "light", category: "aura", durationType: "sustained" }),
  cantrip({ id: "lightning-lure", label: "闪电牵引", names: ["Lightning Lure"], theme: "lightning", requiresTarget: true }),
  cantrip({ id: "mage-hand", label: "法师之手", names: ["Mage Hand"], theme: "arcane", category: "summon", durationType: "sustained" }),
  cantrip({ id: "magic-stone", label: "魔法石", names: ["Magic Stone"], theme: "earth", category: "weapon" }),
  cantrip({ id: "mending", label: "修复术", names: ["Mending"], theme: "transmutation", category: "utility" }),
  cantrip({ id: "message", label: "传讯术", names: ["Message"], theme: "arcane", category: "utility", requiresTarget: true }),
  cantrip({ id: "mind-sliver", label: "心灵之楔", names: ["Mind Sliver"], theme: "psychic", category: "condition", requiresTarget: true }),
  cantrip({ id: "minor-illusion", label: "次级幻象", names: ["Minor Illusion"], theme: "illusion", category: "condition", durationType: "sustained" }),
  cantrip({ id: "mold-earth", label: "塑土术", names: ["Mold Earth"], theme: "earth", category: "utility" }),
  cantrip({ id: "poison-spray", label: "毒气喷溅", names: ["Poison Spray"], theme: "poison", motion: "point-burst", requiresTarget: true }),
  cantrip({ id: "prestidigitation", label: "魔法伎俩", names: ["Prestidigitation"], theme: "arcane", category: "utility" }),
  cantrip({ id: "primal-savagery", label: "原始野性", names: ["Primal Savagery"], theme: "acid", motion: "melee", requiresTarget: true }),
  cantrip({ id: "produce-flame", label: "燃火术", names: ["产火术", "Produce Flame"], theme: "fire", requiresTarget: true }),
  cantrip({ id: "ray-of-frost", label: "冰冻射线", names: ["霜冻射线", "Ray of Frost"], theme: "cold", requiresTarget: true }),
  cantrip({ id: "resistance", label: "抗力术", names: ["Resistance"], theme: "ward", category: "defense", durationType: "sustained" }),
  cantrip({ id: "sacred-flame", label: "圣火术", names: ["Sacred Flame"], theme: "radiant", motion: "point-burst", requiresTarget: true }),
  cantrip({ id: "sapping-sting", label: "衰弱刺击", names: ["Sapping Sting"], theme: "necrotic", category: "condition", requiresTarget: true }),
  cantrip({ id: "shape-water", label: "塑水术", names: ["Shape Water"], theme: "water", category: "utility" }),
  cantrip({ id: "shillelagh", label: "橡棍术", names: ["木棍术", "Shillelagh"], theme: "nature", category: "weapon", durationType: "sustained" }),
  cantrip({ id: "shocking-grasp", label: "电爪", names: ["Shocking Grasp"], theme: "lightning", motion: "melee", requiresTarget: true }),
  cantrip({ id: "spare-the-dying", label: "稳定伤势", names: ["Spare the Dying"], theme: "healing", category: "healing", motion: "point-burst", requiresTarget: true }),
  cantrip({ id: "starry-wisp", label: "点点星芒", names: ["Starry Wisp"], theme: "radiant", requiresTarget: true }),
  cantrip({ id: "sword-burst", label: "剑刃爆发", names: ["Sword Burst"], theme: "force", motion: "burst" }),
  cantrip({ id: "thaumaturgy", label: "奇术", names: ["Thaumaturgy"], theme: "radiant", category: "utility" }),
  cantrip({ id: "thorn-whip", label: "荆棘鞭", names: ["Thorn Whip"], theme: "nature", requiresTarget: true }),
  cantrip({ id: "thunderclap", label: "雷鸣爆", names: ["Thunderclap"], theme: "thunder", motion: "burst" }),
  cantrip({ id: "toll-the-dead", label: "丧钟", names: ["亡者丧钟", "Toll the Dead"], theme: "necrotic", motion: "point-burst", requiresTarget: true }),
  cantrip({ id: "true-strike", label: "克敌机先", names: ["克敌先机", "True Strike"], theme: "divination", category: "weapon", requiresTarget: true }),
  cantrip({ id: "vicious-mockery", label: "恶言相加", names: ["Vicious Mockery"], theme: "psychic", category: "condition", requiresTarget: true }),
  cantrip({ id: "virtue", label: "美德", names: ["Virtue"], theme: "ward", category: "defense", durationType: "sustained" }),
  cantrip({ id: "word-of-radiance", label: "光耀祷词", names: ["Word of Radiance"], theme: "radiant", motion: "burst" })
];
