import { makeProfile } from "./profile-utils.mjs";

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
