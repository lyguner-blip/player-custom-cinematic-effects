import { makeProfile } from "./profile-utils.mjs";

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
