import { makeProfile } from "./profile-utils.mjs";

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
