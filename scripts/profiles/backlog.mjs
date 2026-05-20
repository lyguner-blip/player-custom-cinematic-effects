function makeProfile(config) {
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

export const CALYPSO_PROFILE = makeProfile({
  id: "calypso-cloud-rogue",
  displayName: "卡吕普索",
  actorNames: ["卡吕普索", "Calypso"],
  theme: "云巨血脉游荡者",
  palette: ["云白", "钢蓝", "酒馆暖光", "盗贼暗影"],
  concept: "巨人血脉与游荡者身法并存，特效基调为云雾闪身、精准突袭、酒馆即兴和轻量器械戏法。",
  labelPrefix: "云步·",
  rows: `
L12ooC9lej1nIeWq	查询声望	calypsoCloudUtility
2hFWMCIOPvU6u7vO	今日报纸	calypsoCloudUtility
aTnUL6pAq5i3lFD7	巨人先祖 Giant Ancestry	calypsoCloudPassive
VpIRn3TjxfMl7QwC	身强力壮 Powerful Build	calypsoCloudPassive
Hs1kVSA5j7bw3hS2	云之远迹 Cloud's Jaunt	calypsoCloudAura
C0nqLBvuedmJlwbu	专精 Expertise	calypsoCloudPassive
p41XWwTsqEFPSrHb	偷袭 Sneak Attack	calypsoCloudWeapon	c
rOHmh4RbzFyv37OU	盗贼黑话 Thieves' Cant	calypsoCloudUtility
dEhYuPwJESMnH68H	武器精通 Weapon Mastery	calypsoCloudPassive
YPmLVSVzhWw1Jlle	箭矢 Arrows	calypsoCloudProjectile
9ikZPN2BmIryXJq3	短弓 Shortbow	calypsoCloudProjectile
HQuecQTWSjTZGmEL	附盖提灯 Hooded Lantern	calypsoCloudAura
yg4AgAFLgO9B5OOl	燃油 Oil	calypsoCloudUtility
8Od8cCZosFCOWje7	滚珠 Ball Bearings	calypsoCloudUtility
xJSiVUspEJxNEo9y	水（品脱） Water (Pint)	rationUse
6XksYV8vAStpVh6g	口粮 Rations	rationUse
JsABMEfzPKGT3mA6	蜡烛 Candle	calypsoCloudAura
bjjBQ8JHXZPkWtic	绳索 Rope	calypsoCloudUtility
FJoysFqhBwwFF4Cb	匕首 Dagger	calypsoCloudWeapon
sL86WOfrBalSQiWg	绳索 Rope	calypsoCloudUtility
S5u3ibdtvxsPZEFO	酒馆殴斗者 Tavern Brawler	calypsoCloudPassive
WtiDzmXduatMI22T	啤酒 (品脱) Beer (Pint)	rationUse
6XUf4J7jPsfVpSh5	纸鹤 Paper Bird	calypsoCloudUtility
67odVITnrqT9JoJR	灵巧动作 Cunning Action	calypsoCloudPassive
95JU9qm073cDGuqf	徒手打击 Unarmed Strike	calypsoCloudWeapon
AawQ230cuiZkF3gy	莎尔秘密据点情报	calypsoCloudUtility
QNe2ugkcMX2SwcMx	手稳就准 Steady Aim	calypsoCloudPassive
Qe6t9aB3XNsyBFvk	梦幻舞步 Fancy Footwork	calypsoCloudAura
SVqdiOpsLb0Ds4Ne	无畏无惧 Rakish Audacity	calypsoCloudPassive
lnkwJsCe2Duj1lvK	硬头锤 Mace	calypsoCloudWeapon
JjP5MlMr4ZXnvvj0	重弩 Heavy Crossbow	calypsoCloudProjectile
mzDEGcv5xexGoe5n	短剑 Shortsword	calypsoCloudWeapon`
});

export const SAPPHIRE_PROFILE = makeProfile({
  id: "sapphire-celestial-stardruid",
  displayName: "Sapphire",
  actorNames: ["Sapphire", "sapphire"],
  theme: "天界星图德鲁伊",
  palette: ["星白", "月蓝", "草木绿", "天界金"],
  concept: "天界血脉与星图德鲁伊交织，特效基调为星芒、月华、自然脉动、治愈与召唤。",
  labelPrefix: "星图·",
  rows: `
sGlJ82TrUSacOuUs	查询声望	sapphireStarUtility
8AL1wxRL0Z7kzDDM	今日报纸	sapphireStarUtility
LXisU3y0gN46AzWA	天界抗性 Celestial Resistance	sapphireStarDefense
yHpuIfct1S48ZQZs	治愈之手 Healing Hands	sapphireStarHealing
4kQN6NA69bglQLa8	光辉掌者 Light Bearer	sapphireStarDefense
wWmHfUKwtZ6PGivR	光亮术 Light	sapphireStarAura
plarn5uLnDNHrJuz	水（品脱） Water (Pint)	rationUse
nXdvvgWDjCjAdE7Q	绳索 Rope	sapphireStarUtility
lHLpPm6Mp9wCQ1a6	口粮 Rations	rationUse
V5N48FClMo3CPvIC	火把 Torch	sapphireStarAura
gC8kjD15p2CtQ73E	铁蒺藜 Caltrops	sapphireStarUtility
Ot2lrhYhZb7sXWhW	燃油 Oil	sapphireStarUtility
ZRkMhQany1ujXOau	动物交谈 Speak with Animals	sapphireStarSummon
3cOEzIXVO0ZcXjJH	施法 Spellcasting	sapphireStarPassive
ReBcVajtWcKRQQF5	德鲁伊语 Druidic	sapphireStarPassive
OCnchJIsOGMdj6Oq	原初誓约 Primal Order	sapphireStarPassive
tJwaxCbqx3ehJU09	原初誓约：术师 Primal Order: Magician	sapphireStarPassive
iAehn0c9Kdxx4Eey	匕首 Dagger	sapphireStarWeapon
5wFBqsoqfVPkTVMA	镰刀 Sickle	sapphireStarWeapon
B2lDOUe0MPnX7cIj	绳索 Rope	sapphireStarUtility
1BPBVsOhomv25wY1	水（品脱） Water (Pint)	rationUse
gcmOv19McRj7vgSb	火把 Torch	sapphireStarAura
sIl2gYFNcRgPK6v6	燃油 Oil	sapphireStarUtility
uGzltsCUzc4A9KB1	口粮 Rations	rationUse
N7h3wD097hCwOmfW	木质法杖 Wooden staff	sapphireStarWeapon
dcXERmPFqgoofOi0	四象法门 Elementalism	sapphireStarUtility
X9Au0luw7OnNGFT9	纠缠术 Entangle	sapphireStarCondition
SgasPLM0Uk3t63qk	警戒 Alert	sapphireStarPassive
69rV4dTzX7Eki6Eh	冰刃 Ice Knife	sapphireStarProjectile
7pmJV4W0Yk4zTkkO	治愈真言 Healing Word	sapphireStarHealing
MKab7aJeyxS0OU6r	妖火 Faerie Fire	sapphireStarCondition	c
kVA9PoAxraXt9ESx	神莓术 Goodberry	sapphireStarHealing
YaaWVmKb3tWNxD57	大步奔行 Longstrider	sapphireStarAura
x4frjAdaMljQPp3N	防护善恶 Protection from Evil and Good	sapphireStarDefense
PpvVYLcGrO8sg8wz	化兽为友 Animal Friendship	sapphireStarSummon
iZTxCGeLyAsckXxU	净化饮食 Purify Food and Drink	sapphireStarUtility
fBbR34XV3Hrp91oO	雷鸣波 Thunderwave	sapphireStarProjectile
yxbaTb3DVrZxC6qE	魅惑类人 Charm Person	sapphireStarCondition
MuUrmaIQaeP3UL4H	跳跃术 Jump	sapphireStarAura
6H3gp5GlXYjTvEP7	造水术/枯水术 Create or Destroy Water	sapphireStarAura
t1EJBGw1AXgLygLc	侦测毒性和疾病 Detect Poison and Disease	sapphireStarAura
nBWwh08fVauT2Q8h	侦测魔法 Detect Magic	sapphireStarAura	c
m9SErEsC4nDObA26	荒野形态 Wild Shape	sapphireStarSummon
7YDcwL8YwvNJvxzN	荒野伙伴 Wild Companion	sapphireStarSummon
kxH0AtwWTcQ79O5Y	点点星芒 Starry Wisp	sapphireStarProjectile
Kl2ZvfJj0FGnonc8	毒气喷溅 Poison Spray	sapphireStarProjectile
UJBi2r1sJBjOrwNU	治疗药水 Potion of Healing	healerKit
l6DIvD8K7HouptLU	莎尔秘密据点情报	sapphireStarUtility
gcFvp051M1rk1ZUQ	天启 Celestial Revelation	sapphireStarProjectile
pcX5A8iSMVmtWZkv	光导箭 Guiding Bolt	sapphireStarProjectile
VqDlyc99wFvUwPKe	神导术 Guidance	sapphireStarAura
qQkt8OtwSalJmuGj	星图 Star Map	sapphireStarAura
gWIcAfgKoT6GP11T	星耀形态 Starry Form	sapphireStarAura
CbsbuLnRYEwzS9pc	变巨术/缩小术 Enlarge/Reduce	sapphireStarAura	c
150klKs3qkqF6qUV	卜筮术 Augury	sapphireStarAura
CMGR2nH1zNVLerGC	炽焰法球 Flaming Sphere	sapphireStarProjectile	c
uOWggIoBUSaoBn8R	次等复原术 Lesser Restoration	sapphireStarHealing
1bD6sIQXMAlQ3aaA	定身类人 Hold Person	sapphireStarCondition
isqjSTbghoMEBTUR	动物信使 Animal Messenger	sapphireStarSummon
jkggXAROYXyiGIUS	动植物定位术 Locate Animals or Plants	sapphireStarAura
sUOQmAZr8f9UVaST	防护毒素 Protection from Poison	sapphireStarDefense
MV6MLPsyRf5YOYpU	黑暗视觉 Darkvision	sapphireStarAura
Qff5BC00gEyjw8M3	火焰刀 Flame Blade	sapphireStarWeapon
VisIBUKWhXcAamij	荆棘丛生 Spike Growth	sapphireStarCondition
EFLTR9RoZflblVdc	强化属性 Enhance Ability	sapphireStarAura
Dwl1AVAzvFF8OAVy	树肤术 Barkskin	sapphireStarDefense
RLbh2Lxz5i3JVAMW	物件定位术 Locate Object	sapphireStarAura
4s2jCRl8Yst82kAK	行动无踪 Pass without Trace	sapphireStarAura
nIoQ2YBO7FI5a83M	寻找陷阱 Find Traps	sapphireStarAura
ThboAaRoZa374nt4	野兽感官 Beast Sense	sapphireStarSummon
0NiD0izKsFUc84Ow	野兽召唤术 Summon Beast	sapphireStarSummon	c
7yWnoihEuQjjJSI2	援助术 Aid	sapphireStarHealing
rA2OskQIImRmFeWs	月华之光 Moonbeam	sapphireStarProjectile
gUXcL5wP1uTqjEsP	造风术 Gust of Wind	sapphireStarAura
HqzZKcLJ4Yh1snAq	灼热金属 Heat Metal	sapphireStarProjectile
FvZaxhlDc6pgkqXh	南瓜王之锤 (Mace of the Pumpkin King)	sapphireStarWeapon`
});

export const YINAI_PROFILE = makeProfile({
  id: "yinai-silver-bard",
  displayName: "银蔼",
  actorNames: ["银蔼", "Yinai"],
  theme: "银弦造物诗人",
  palette: ["银白", "暮紫", "乐谱金", "舞台蓝"],
  concept: "造物学院吟游诗人，特效基调为银色音符、舞台幻光、潜能微尘与语言/心灵魔法。",
  labelPrefix: "银弦·",
  rows: `
IzEtQEknjQD1tEfF	查询声望	yinaiSilverUtility
PvZswNC0CJYo96h6	今日报纸	yinaiSilverUtility
WMR9zA9eyejtKtya	适应力 Resourceful	yinaiSilverPassive
C14GGY9ZrkfvPL0t	技能 Skillful	yinaiSilverPassive
JxNbtnkBJZlz1se6	多才多艺 Versatile	yinaiSilverPassive
69FnaETSIM8Kqoub	音乐家 Musician	yinaiSilverAura
wRClv9PDNM7MaUQC	吟游诗人激励 Bardic Inspiration	yinaiSilverAura
LVaeqauWyn9c8wS9	施法 Spellcasting	yinaiSilverPassive
0c5XodfjFHxuujCj	恶言相加 Vicious Mockery	yinaiSilverProjectile
SObu53Q2b5ig1KIn	法师之手 Mage Hand	yinaiSilverSummon
u4bisIzXyyZtjBda	Silvery Barbs	yinaiSilverCondition
XJQ6GveOcaTff3OB	羽落术 Feather Fall	yinaiSilverAura
xyAI5ZgG1tmZzUZY	不谐低语 Dissonant Whispers	yinaiSilverCondition
ZYsOykLmaMU2LZq7	疗伤术 Cure Wounds	yinaiSilverHealing
5BmzKOeAaXwF0OL4	匕首 Dagger	yinaiSilverWeapon
ARbdENnGJbC1UmQd	牛眼提灯 Bullseye Lantern	yinaiSilverAura
6tMrK2pcjVHBlIss	水（品脱） Water (Pint)	rationUse
OPj262mGsOkBR34W	燃油 Oil	yinaiSilverUtility
dkginZOfQLH4Mlaa	口粮 Rations	rationUse
WbYEogqxD4Jsmpvt	警戒 Alert	yinaiSilverPassive
StBedRCtFayIG9xm	新人啤酒	rationUse
TPcQHDpBfO0yBC2G	专精 Expertise	yinaiSilverPassive
4fxeTPmwLgcViLqx	万事通 Jack of All Trades	yinaiSilverPassive
qt5gwpcIWyZVUyHm	命令术 Command	yinaiSilverCondition
1wrVgaN4KExM8P9z	莎尔秘密据点情报	yinaiSilverUtility
n9XroNu7dx70P1xO	潜能微尘 Mote of Potential	yinaiSilverAura
rYpYXewmDOOoC0dR	造物表演 Performance Of Creation	yinaiSilverAura
OvSb0lpbVz8OTQ8v	侦测魔法 Detect Magic	yinaiSilverAura	c
BpE2jw6iGjEqeq8R	援助术 Aid	yinaiSilverHealing
5qHAUusJPEYqQDKK	隐形术 Invisibility	yinaiSilverCondition
v3e8Sf0GOqkKactB	暗示术 Suggestion	yinaiSilverCondition`
});

export const LEQUIN_PROFILE = makeProfile({
  id: "lequin-shadow-celestial",
  displayName: "勒奎因",
  actorNames: ["勒奎因·普拉谢西德", "勒奎因", "Lequin"],
  theme: "天界深影剑士",
  palette: ["冷白", "深紫", "骨灰", "暗金"],
  concept: "天界余辉与深影武器并存，特效基调为骨盾、暗影刻印、冷白治愈与沉重剑击。",
  labelPrefix: "深影·",
  rows: `
rtcLMeuyLVFepn1S	口味欠佳的杂烩	rationUse
N7rwBFrSMovRsg7G	猎兽猎手 Hunter of Hunters	lequinShadowCondition
KhlLkz7mXmFlsrxT	天界抗性 Celestial Resistance	lequinShadowDefense
mK2am5TSFsm2antE	治愈之手 Healing Hands	lequinShadowHealing
aepnhHqj8dC9wisZ	光辉掌者 Light Bearer	lequinShadowDefense
sWIBnOl6vvoYEm7u	光亮术 Light	lequinShadowAura
JrqB4vsPow6zij7n	毁灭之触 Ruinous Touch	lequinShadowProjectile
3RxLveF5zc9jT3O1	深影武器 Shadowed Weapon	lequinShadowWeapon
q7gZlN3CeKHL3TjG	巨剑 Greatsword	lequinShadowWeapon
RhlPZJ2RAI3jrm7b	长剑 Longsword	lequinShadowWeapon
Ej9ELBDTZs577Yc6	短剑 Shortsword	lequinShadowWeapon
w1D1lAVt8cPiKE8H	火把 Torch	lequinShadowAura
c3g8IqOjrADhlypG	口粮 Rations	rationUse
xduqJHSGK43McE7P	麻绳 (50 尺) Hempen Rope (50 ft.)	lequinShadowUtility
cMeajj5jqXBSU6gl	水袋 Waterskin	rationUse
IFWBGOhMUytvbwk0	奥罗斯泰德冰茶（普通）(Orostead Iced Tea (Common))	rationUse
3xKo3nhs3fRDQNyj	施法 Spellcasting	lequinShadowPassive
4JRLTdUH7jsYcMdu	崩裂深影 Sundering Shadow	lequinShadowProjectile
gitTbLdDFGTca8FX	护盾术 Shield	lequinShadowDefense
lIUrKal7VaiXMbY8	骨盾术 | Bone Shield	lequinShadowDefense
JU1YufKmMYbjbCiE	痛苦印记 | Agonizing Mark	lequinShadowCondition
slFvdr8AMwzhI9kA	热蛋鱼汤	rationUse`
});

export const GRIM_PROFILE = makeProfile({
  id: "grim-abyssal-monk",
  displayName: "格里黙",
  actorNames: ["格里黙.普罗斯特", "格里黙", "Grim", "Grimm"],
  theme: "深渊多臂武僧",
  palette: ["墨黑", "暗红", "骨白", "铁链灰"],
  concept: "多手异相与武僧身法结合，特效基调为深渊眼印、链影、残拳与器械捕缚。",
  labelPrefix: "多臂·",
  rows: `
maBeBVFoxUOstcaI	警戒 Alert	grimAbyssPassive
qoz42EyPKSdF8TOB	武艺 Martial Arts	grimManyHandsUnarmed
TDNHjs5TsQCRSp07	无甲防御 Unarmored Defense	grimAbyssDefense
hotdGKrXuQR7wY4X	徒手打击 Unarmed Strike	grimManyHandsUnarmed
2ttQfzio9OgsCj2V	多手 | Polychiral	grimAbyssAura
4gbgxIGtG306Ot0B	手多好办事 | Many Hands Make Light Work	grimAbyssPassive
rTk2QZaB3zVLjCTi	深渊抗性 | Abyssal Resilience	grimAbyssDefense
DTt2WxeulaemeNFv	第三目 | Third Eye	grimAbyssAura
aJbwTsmpC4UOmyuX	滑轮组 Block and Tackle	grimAbyssUtility
wpfIQKGO9oYitmCd	链条（10尺）Chain (10 feet)	grimAbyssUtility
rqTPuzOglNVOEjWO	狩猎陷阱 Hunting Trap	grimAbyssUtility
QIfgRmn1qA6EpYQk	捕网 Net	grimAbyssProjectile
i5jsDAoUmMPkei5G	口粮 Rations	rationUse
DzdanjMeSRqYNh3O	长棍 Quarterstaff	grimAbyssWeapon
s6UGGqWrfcDLCLhG	匕首 Dagger	grimManyHandsDagger
pSxfXMvkWz2nTBPK	麻绳（50尺）Hempen Rope (50 ft.)	grimAbyssUtility
WjbM2rgA1WYDZ2t5	火把 Torch	grimAbyssAura
ZyrcEDQjKChMeNDb	水袋 Waterskin	rationUse
a5OKvc5S0N0RQyRf	口粮 Rations	rationUse
PmrJSk8yHVIxTcrC	热红酒（一瓶）	rationUse
ZXCe08PPywCB4MWf	芝士青蔬派	rationUse
ZrTLFUZoKOiEVeMu	蜜南瓜	rationUse
pEbbixrz52MouKxX	带刃长鞭（非普通）v3 Bladed Whip (Uncommon) v3	grimAbyssWeapon
8YOLsGMuPManzLkm	武僧武功 Monk's Focus	grimAbyssAura
gFbBKM8lVIVz6WzA	无甲移动 Unarmored Movement	grimAbyssAura
SopIq1xqSQbLoXrl	运转周天 Uncanny Metabolism	grimAbyssHealing`
});

export const AISLAN_PROFILE = makeProfile({
  id: "aislan-fey-coven",
  displayName: "艾斯兰",
  actorNames: ["“艾斯兰”丽塔·彗尾", "_艾斯兰_丽塔·彗尾", "艾斯兰", "丽塔·彗尾", "Aislan", "Rita"],
  theme: "妖精女巫集群",
  palette: ["妖精粉", "藤绿", "星白", "女巫紫"],
  concept: "妖精血统、女巫施法与集群纽带交织，特效基调为翼影、心灵棘刺、祝福护幕和群体导能。",
  labelPrefix: "妖集·",
  rows: `
2uXHymQ1ZoWYZnRJ	荒野精魄 Spirit of the Wild	aislanFeySummon
tqZSf636ImpwISTT	精类血统 Fey Ancestry	aislanFeyDefense
6O6Ydf6mNGc0qrp7	精类魅惑 Fey Charm	aislanFeyCondition
0s938vz6ZGFRxlVM	精类抗性 Fey Resistance	aislanFeyDefense
4HH8JurWRZf0HZL2	妖精之翼 Faerie Wings	aislanFeyAura
R6HNMj2tbVDRJhzb	集群纽带 Communal Binding	aislanFeyUtility
V0mZL4HK4oUTiPpN	女巫施法 Wychlaran Spellcasting	aislanFeyPassive
ueph8QW8se7ukS5q	心灵之楔 Mind Sliver	aislanFeyProjectile
EsmUyrkfS1soDMG2	次级幻象 Minor Illusion	aislanFeyCondition
TryuuDGA9fhrbi1j	祝福术 Bless	aislanFeyDefense
bUxsHte7iF28VCJ5	治愈真言 Healing Word	aislanFeyHealing
yy2iIkVhvGw30VEo	护盾术 Shield	aislanFeyDefense
pcvUUBDGT8xQ3IhF	碎物散射 Scatterspray	aislanFeyProjectile
2Xz36huYuaPkqIL4	火把 Torch	aislanFeyAura
VynWtGzA53imsGHT	口粮 Rations	rationUse
lk7AkjhVo3u3k7NQ	麻绳 (50 尺) Hempen Rope (50 ft.)	aislanFeyUtility
3P2fpuGUnKfTChq8	水袋 Waterskin	rationUse
58qjVmvIDEPXsXBg	轻弩 Light Crossbow	aislanFeyProjectile
EqJjR2NDuQztiwSx	弩矢 Bolts	aislanFeyProjectile
khVETJu3fHVa11vf	水袋 Waterskin	rationUse
LYzOlSr6UduVKE6I	短剑 Shortsword	aislanFeyWeapon
CAKmREOdOtNW3d0r	寻获魔宠 Find Familiar	aislanFeySummon
yq5bTxa9KVGquSdV	魔法学徒 Magic Initiate	aislanFeyPassive
re2KASsTKyWVOvcn	火焰箭 Fire Bolt	aislanFeyProjectile
fpkfbYO4SoePBp9O	传讯术 Message	aislanFeyUtility
GNC5L5KIIIsD1QZy	法师护甲 Mage Armor	aislanFeyDefense
Ggy3pjEVMohh6bxJ	醋栗干	rationUse
tY2gvRJ3CJNpApBR	麦酒（一杯）	rationUse
mFDVlsDbkFKUjfdR	联结施法 Bonded Casting	aislanFeyUtility
CluqqGQIblgdIryl	集群导能 Communal Channeling	aislanFeyUtility
G903NOxX5zK6ZWEO	神导术 Guidance	aislanFeyAura
fUuQAE81N8hoBb7z	疗伤术 Cure Wounds	aislanFeyHealing
2ynF91dxpduFz3Gu	虔诚护盾 Shield of Faith	aislanFeyDefense
Wto1WzHw9hIexGCK	命令术 Command	aislanFeyCondition
WhCK2cnaN01znYo0	疗伤术 Cure Wounds	aislanFeyHealing
05GKTGL164rBRb4i	治愈真言 Healing Word	aislanFeyHealing
Gb2rPCxpqChueaGT	虔诚护盾 Shield of Faith	aislanFeyDefense
Wp70zQILLl4Q1vDV	塔莎狂笑术 Tasha's Hideous Laughter	aislanFeyCondition`
});

export const XINGHAI_PROFILE = makeProfile({
  id: "xinghai-acid-tide-arcana",
  displayName: "星海",
  actorNames: ["星海·普罗斯特", "星海", "Xinghai"],
  theme: "酸潮奥术师",
  palette: ["海青", "酸绿", "星蓝", "墨紫"],
  concept: "水裔体质与学院奥术混合，特效基调为酸潮、星雾、护盾与睡眠幻术。",
  labelPrefix: "星海·",
  rows: `
kObytQXUVj2fxAhj	酸液飞溅 Acid Splash	xinghaiAcidSplash	t
7bHkBIAWhgMgyR9M	强酸抗性 (元素裔)	xinghaiLegacyDancingLights
7PfwpohDQvDtbV1g	水陆两栖 (元素裔)	xinghaiLegacyDancingLights
KWuoFOWG7Oon4R21	呼唤波浪 (MPMM元素裔)	xinghaiLegacyDancingLights
y5ogNeqRUR6PJymV	黑暗视觉 (通用)	xinghaiLegacyArcaneUtility
4UYdChl2SGxQt5pG	魔法学徒 Magic Initiate	xinghaiLegacyArcaneUtility
hY5aq0FJZtIQuFum	施法 Spellcasting	xinghaiLegacyArcaneUtility
qsi3ozBJ5cgzC2H6	仪式学家 Ritual Adept	xinghaiLegacyRitualAdept
urjEeK37zqxvDPol	奥术回想 Arcane Recovery	xinghaiLegacyArcaneRecovery
08r2FSl7TsHSKZ8h	魔法伎俩 Prestidigitation	xinghaiLegacyPrestidigitation
DdsyORIszkzB46yi	心灵之楔 Mind Sliver	xinghaiMindSliver	t
PNApwFfOVDreG0rV	护盾术 Shield	xinghaiLegacyShield
IemLErtAYsj5XZuF	寻获魔宠 Find Familiar	xinghaiLegacyFindFamiliar	c
Qxab3rk7YYAUJjfZ	魔法飞弹 Magic Missile	xinghaiMagicMissile	ct
uQLEF5DT8yqM3rR8	法师护甲 Mage Armor	xinghaiLegacyMageArmor
yfVRNCU0QT2RBxPu	巫术箭 Witch Bolt	xinghaiWitchBolt	t
TTGez8v6vji9BOqB	火焰箭 Fire Bolt	xinghaiFireBolt	t
SYCUEyi1g9cvOJjY	次级幻象 Minor Illusion	xinghaiMinorIllusion
vsfEM328YNKVbNfT	舞光术 Dancing Lights	xinghaiLegacyDancingLights
m7qUNc3a08hcGeCg	水（品脱） Water (Pint)	rationUse
Z2M9hFlnwzxulYNF	法杖 Staff	xinghaiLegacyGreatsword
6qXVOrN0GKGavGyH	墨水 Ink	xinghaiLegacyArcaneStudy
jSW8u5g6XLPhi8kU	燃油 Oil	xinghaiLegacyPoisonUse
PaFeLUl0I8UPM1hi	匕首 Dagger	xinghaiLegacyGreatsword
ay1Ub2NIcVJAw0pw	轻锤 Light Hammer	xinghaiLegacyGreatsword
UxSbyWh5Hv3c8i0s	燃油 Oil	xinghaiLegacyPoisonUse
9k6zBciQK56hi0Rz	羽落术 Feather Fall	xinghaiLegacyDancingLights
qZ9R8Sku28ytLm0a	睡眠术 Sleep	xinghaiLegacySleep
qoczcuRmpwPZSsVv	学者 Scholar	xinghaiLegacyArcaneStudy
4JSJdyJLHCbsfX3c	侦测魔法 Detect Magic	xinghaiLegacyDetectMagic	c
vrYb5cN2GpX0aKBF	通晓语言 Comprehend Languages	xinghaiLegacyComprehendLanguages`
});
