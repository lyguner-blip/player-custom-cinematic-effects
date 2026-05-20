import { makeProfile } from "./profile-utils.mjs";

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
