import { FLORENCE_PROFILE } from "./profiles/florence.mjs";
import { AISLAN_PROFILE } from "./profiles/aislan.mjs";
import { CALYPSO_PROFILE } from "./profiles/calypso.mjs";
import { GRIM_PROFILE } from "./profiles/grim.mjs";
import { GRACE_PROFILE } from "./profiles/grace.mjs";
import { LAWRENCE_PROFILE } from "./profiles/lawrence.mjs";
import { LEQUIN_PROFILE } from "./profiles/lequin.mjs";
import { SAPPHIRE_PROFILE } from "./profiles/sapphire.mjs";
import { XINGHAI_PROFILE } from "./profiles/xinghai.mjs";
import { YINAI_PROFILE } from "./profiles/yinai.mjs";
import { UNIVERSAL_EFFECTS } from "./universal/registry.mjs";

const MODULE_ID = "player-custom-cinematic-effects";
const MODULE_TITLE = "玩家定制特效库";
const AUTOMATION_MODULE_ID = "player-custom-automation-effects";
const PANEL_ID = "pcce-panel";
const RECENT_LIMIT = 7;
const AA_AUTOREC_MENUS = ["melee", "range", "ontoken", "templatefx", "aura", "preset", "aefx"];
const EFFECT_CATEGORY_LABELS = {
  projectile: "投射",
  weapon: "武技",
  healing: "治疗",
  defense: "防护",
  aura: "光环",
  template: "模板",
  condition: "状态",
  summon: "召唤",
  utility: "功能",
  passive: "被动"
};
const EFFECT_DURATION_LABELS = {
  instant: "瞬发",
  sustained: "持续",
  persistent: "常驻"
};
const EFFECT_TEMPLATE_LABELS = {
  cone: "锥形",
  circle: "圆形",
  line: "线形",
  aura: "光环"
};
const SUSTAINED_DURATION_TYPES = new Set(["sustained", "persistent"]);
const SHARED_CONSUMABLE_SEQUENCES = new Set(["rationUse", "brewUse"]);
const FOOD_OR_POTION_PATTERN = /ration|water|pint|beer|ale|wine|tea|stew|soup|pie|pumpkin|berry|goodberry|food|drink|meal|potion|口粮|水袋|品脱|啤酒|麦酒|红酒|冰茶|杂烩|汤|芝士|青蔬派|南瓜|神莓|饮食|食物|饮料|药水/u;
const UNIVERSAL_PROFILE = {
  id: "universal",
  displayName: "通用电影级特效",
  theme: "基础特效库",
  concept: "不绑定角色的通用电影级特效层。"
};
const EFFECT_MODE_LABELS = {
  auto: "自动",
  custom: "定制",
  universal: "通用",
  off: "关闭"
};
const EFFECT_MODE_VALUES = new Set(Object.keys(EFFECT_MODE_LABELS));
const ACTOR_SHEET_MARKER_HOOKS = [
  "renderActorSheet",
  "renderActorSheetV2",
  "renderApplicationV2",
  "renderBaseActorSheet",
  "renderCharacterActorSheet",
  "renderNPCActorSheet",
  "renderVehicleActorSheet",
  "renderGroupActorSheet"
];
const actorSheetMarkerTimers = new WeakMap();

const QUALITY = {
  cinematic: {
    label: "电影级",
    targetLimit: 6,
    casterScale: 1.55,
    targetScale: 1.32,
    radiusScale: 2.6,
    extraLayers: true,
    stagger: 115,
    shakeStrength: 12
  }
};

const ASSETS = {
  dawnCircleIntro: [
    "jb2a.magic_signs.circle.02.conjuration.intro.yellow",
    "jb2a.magic_signs.circle.02.conjuration.intro.dark_yellow",
    "jb2a.magic_signs.circle.02.abjuration.intro.yellow"
  ],
  dawnCircleLoop: [
    "jb2a.magic_signs.circle.02.conjuration.loop.yellow",
    "jb2a.magic_signs.circle.02.abjuration.loop.yellow",
    "jb2a.magic_signs.circle.02.conjuration.complete.yellow"
  ],
  abjurationCircle: [
    "jb2a.magic_signs.circle.02.abjuration.intro.yellow",
    "jb2a.magic_signs.circle.02.abjuration.complete.yellow",
    "jb2a.magic_signs.rune.abjuration.intro.yellow"
  ],
  enchantmentCircle: [
    "jb2a.magic_signs.circle.02.enchantment.intro.yellow",
    "jb2a.magic_signs.rune.enchantment.intro.yellow",
    "jb2a.magic_signs.circle.02.abjuration.intro.yellow"
  ],
  guidingBolt: [
    "jb2a.guiding_bolt.01.blueyellow.60ft",
    "jb2a.guiding_bolt.01.blueyellow.30ft",
    "jb2a.guiding_bolt.01.blueyellow.15ft",
    "jb2a.energy_beam.normal.blue.01.60ft"
  ],
  divineCaster: [
    "jb2a.divine_smite.caster.yellowwhite",
    "jb2a.divine_smite.caster.standard.yellowwhite",
    "jb2a.divine_smite.caster.blueyellow"
  ],
  divineTarget: [
    "jb2a.divine_smite.target.yellowwhite",
    "jb2a.divine_smite.target.blueyellow",
    "jb2a.impact.012.yellow"
  ],
  impactRadiant: [
    "blfx.spell.impact.damage.radiant.1.color1",
    "jb2a.impact.012.yellow",
    "jb2a.impact.011.blue02"
  ],
  sacredSource: [
    "jb2a.sacred_flame.source.yellow",
    "jb2a.sacred_flame.source.white"
  ],
  sacredTarget: [
    "jb2a.sacred_flame.target.yellow",
    "jb2a.sacred_flame.target.white"
  ],
  healingLoop: [
    "jb2a.healing_generic.loop.yellowwhite",
    "jb2a.healing_generic.loop.greenorange",
    "jb2a.healing_generic.400px.yellow02"
  ],
  healingBurst: [
    "jb2a.healing_generic.burst.yellowwhite",
    "jb2a.healing_generic.burst.greenorange",
    "jb2a.healing_generic.03.burst.yellow"
  ],
  lightBloom: [
    "jb2a.healing_generic.400px.yellow02",
    "jb2a.healing_generic.400px.yellow",
    "jb2a.extras.tmfx.outpulse.circle.02.normal"
  ],
  outpulse: [
    "jb2a.extras.tmfx.outpulse.circle.02.fast",
    "jb2a.extras.tmfx.outpulse.circle.03.fast",
    "jb2a.extras.tmfx.outpulse.circle.01.normal"
  ],
  thunderwave: [
    "jb2a.thunderwave.center.orange",
    "jb2a.thunderwave.center.blue",
    "jb2a.extras.tmfx.outpulse.circle.04.fast"
  ],
  sunburst: [
    "jaamod.spells_effects.sunburst",
    "jaamod.spells_effects.sunbeam",
    "jb2a.explosion.03.blueyellow"
  ],
  dawnStars: [
    "jb2a.markers.circle_of_stars.yellowblue",
    "jb2a.markers.circle_of_stars.greenorange",
    "jb2a.markers.light_orb.complete.yellow"
  ],
  lightOrb: [
    "jb2a.markers.light_orb.complete.yellow",
    "jb2a.markers.light_orb.complete.white",
    "jb2a.markers.light_orb.loop.yellow"
  ],
  particlesOutward: [
    "jb2a.particles.outward.orange.01.03",
    "jb2a.particles.outward.greenyellow.01.03",
    "jb2a.particles.outward.orange.02.03"
  ],
  flare: [
    "jb2a.impact.012.yellow",
    "jb2a.sacred_flame.source.yellow",
    "jb2a.divine_smite.caster.yellowwhite"
  ],
  lightFlare: [
    "blfx.spell.cast.light_flare.1.center.color1",
    "blfx.spell.cast.light_flare.2.center.color1",
    "blfx.spell.cast.light_flare.1.side.color1",
    "jb2a.extras.tmfx.outpulse.circle.02.fast"
  ],
  chainMarker: [
    "jb2a.markers.chain.spike.complete.02.yellow",
    "jb2a.markers.chain.diamond.complete.02.yellow",
    "jb2a.markers.chain.standard.complete.02.yellow",
    "jb2a.markers.chain.spectral_standard.complete.02.green",
    "jb2a.extras.tmfx.outpulse.circle.02.fast"
  ],
  chainMarkerLoop: [
    "jb2a.markers.chain.spike.loop.02.yellow",
    "jb2a.markers.chain.diamond.loop.02.yellow",
    "jb2a.markers.chain.standard.loop.02.yellow",
    "jb2a.markers.chain.spectral_standard.loop.02.green"
  ],
  burningHands: [
    "jb2a.burning_hands.01.orange",
    "jb2a.burning_hands.02.orange",
    "blfx.spell.template.cone.fire.burning_hands1.orange"
  ],
  burningHandsTemplate: [
    "blfx.spell.template.cone.fire.burning_hands3.orange",
    "blfx.spell.template.cone.fire.burning_hands2.orange",
    "blfx.spell.template.cone.fire.burning_hands1.orange",
    "jaamod.spells_effects.burning_hands"
  ],
  faerieFire: [
    "jaamod.spells_effects.faerie_fire.green",
    "jaamod.spells_effects.faerie_fire_blue",
    "jaamod.spells_effects.faerie_fire.violet"
  ],
  scorchingRay: [
    "jb2a.scorching_ray.01.orange.60ft",
    "jb2a.scorching_ray.01.orange.30ft",
    "jb2a.scorching_ray.02.orange.60ft"
  ],
  detectMagicCircle: [
    "jb2a.detect_magic.circle.yellow",
    "jb2a.detect_magic.circle.greenorange",
    "jb2a.magic_signs.circle.02.divination.intro.yellow"
  ],
  detectMagicCone: [
    "jb2a.detect_magic.cone.yellow.30ft",
    "jb2a.detect_magic.cone.greenorange.30ft",
    "jb2a.detect_magic.cone.blue.30ft"
  ],
  tokenMaskRadiant: [
    "jb2a.markers.on_token_mask.loop.01.yellow02",
    "jb2a.markers.on_token_mask.loop.01.yellow",
    "jb2a.bless.400px.loop.yellow"
  ],
  tokenMaskArcane: [
    "jb2a.markers.on_token_mask.loop.01.blue",
    "jb2a.markers.on_token_mask.loop.01.purple",
    "jb2a.bless.400px.loop.blue"
  ],
  tokenMaskStone: [
    "jb2a.markers.on_token_mask.loop.01.yellow",
    "jb2a.markers.shield_rampart.loop.03.white",
    "jb2a.aura_themed.01.inward.loop.metal.01.grey"
  ],
  blessLoopRadiant: [
    "jb2a.bless.400px.loop.yellow",
    "jb2a.bless.200px.loop.yellow",
    "jb2a.markers.on_token_mask.loop.01.yellow02"
  ],
  shieldLoopRadiant: [
    "jb2a.shield.01.loop.yellow",
    "jb2a.shield.01.loop.white",
    "jb2a.markers.shield_rampart.loop.03.yellow"
  ],
  shieldLoopArcane: [
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue",
    "blfx.spell.misc.shield2.arcane3.mage-armor.loop.color1",
    "jb2a.shield.01.loop.blue"
  ],
  shieldLoopStone: [
    "jb2a.markers.shield_rampart.loop.03.white",
    "jb2a.markers.shield_rampart.loop.01.white",
    "jb2a.aura_themed.01.inward.loop.metal.01.grey"
  ],
  auraRadiantLoop: [
    "blfx.spell.template.circle.emanating.aura8.loop.light_rays.color1",
    "blfx.spell.template.circle.emanating.aura6.loop.rays.color1",
    "jb2a.template_circle.aura.03.inward.001.loop.combined.orangeyellow",
    "jb2a.template_circle.aura.01.loop.large.yellow"
  ],
  auraArcaneLoop: [
    "blfx.spell.template.circle.emanating.aura4.loop.light.color1",
    "blfx.spell.template.circle.emanating.aura3.loop.radial.color4",
    "jb2a.template_circle.aura.03.inward.001.loop.combined.blueteal",
    "jb2a.aura_themed.01.inward.loop.cold.01.blue"
  ],
  auraStoneLoop: [
    "jb2a.aura_themed.01.inward.loop.metal.01.grey",
    "blfx.spell.template.circle.emanating.aura2.loop.radial.color5",
    "jb2a.template_circle.aura.03.inward.001.loop.combined.white"
  ],
  lightOrbLoop: [
    "jb2a.markers.light_orb.loop.yellow",
    "jb2a.markers.light_orb.loop.white",
    "jb2a.bless.200px.loop.yellow"
  ],
  detectMagicLoop: [
    "jb2a.detect_magic.circle.yellow",
    "jb2a.detect_magic.circle.greenorange",
    "jb2a.magic_signs.circle.02.divination.loop.yellow"
  ],
  arcaneWispLoop: [
    "blfx.token.wisp.dancing_lights.color1.animated",
    "blfx.token.wisp.spirit.blue.animated",
    "jb2a.dancing_light.blueteal",
    "jb2a.dancing_light.purplegreen"
  ],
  scrollSigil: [
    "blfx.misc.enchantment.3.paper_scroll_signet_sigil.1.color1",
    "blfx.misc.enchantment.3.paper_scroll_signet_sigil.2.color1",
    "jb2a.extras.tmfx.runes.circle.simple.divination"
  ],
  insightEye: [
    "blfx.misc.enchantment.12.eye.see_invisibility.color1",
    "jb2a.eyes.01.single.orangeyellow",
    "jb2a.ioun_stones.01.blue.insight"
  ],
  runeDivination: [
    "jb2a.extras.tmfx.runes.circle.inpulse.divination",
    "jb2a.extras.tmfx.runes.circle.outpulse.divination",
    "jb2a.extras.tmfx.runes.circle.simple.divination"
  ],
  runeTransmutation: [
    "jb2a.extras.tmfx.runes.circle.inpulse.transmutation",
    "jb2a.extras.tmfx.runes.circle.outpulse.transmutation",
    "jb2a.extras.tmfx.runes.circle.simple.transmutation"
  ],
  runeNecromancy: [
    "jb2a.extras.tmfx.runes.circle.inpulse.necromancy",
    "jb2a.extras.tmfx.runes.circle.outpulse.necromancy",
    "jb2a.extras.tmfx.runes.circle.simple.necromancy"
  ],
  holyLightImpact: [
    "blfx.spell.cast.impact.holy_light1.color1",
    "blfx.spell.cast.impact.holy_light2.color1",
    "blfx.spell.impact.holy.sacred_flame1.color1"
  ],
  holyCone: [
    "jb2a.breath_weapons02.burst.cone.holy.yellow.01",
    "jb2a.breath_weapons02.burst.cone.holy.yellow.02",
    "jb2a.breath_weapons02.loop.cone.holy.yellow.01"
  ],
  dart: [
    "jb2a.dart.01.throw.physical.white.60ft",
    "jb2a.dart.01.throw.physical.white.30ft",
    "blfx.weapon.range.dart_1.color1.60ft"
  ],
  holyWaterSplash: [
    "jb2a.liquid.splash.bright_blue",
    "jb2a.water_splash.circle.01.blue",
    "jb2a.liquid.splash02.blue"
  ],
  poisonSplash: [
    "jb2a.liquid.splash.green",
    "jb2a.liquid.splash02.green",
    "jb2a.liquid.splash.bright_green"
  ],
  poisonProjectile: [
    "jb2a.arrow.poison.green.01.60ft",
    "jb2a.arrow.poison.green.01.30ft",
    "jb2a.arrow.poison.blue.60ft"
  ],
  lawrenceShield: [
    "jb2a.markers.shield_rampart.complete.01.white",
    "jb2a.markers.shield_rampart.complete.03.white",
    "jb2a.markers.shield.blue.01"
  ],
  lawrenceAura: [
    "jb2a.template_circle.aura.04.inward.001.complete.combined.refraction",
    "jb2a.template_circle.aura.04.inward.002.complete.combined.refraction",
    "jb2a.condition.boon.02.001.refraction"
  ],
  lawrenceDust: [
    "jaamod.assets.dust_particles",
    "blfx.spell.misc.puff_smoke_dust_mist.2.center1.color1",
    "blfx.spell.misc.puff_smoke_dust_mist.1.side.color1"
  ],
  lawrenceStoneImpact: [
    "modules/blfx-assets-pack01/artwork/08-misc/puff-smoke-dust-mist/Puff_Smoke_Dust_2_Center_1_COLOR_1_1200x1200.webm",
    "modules/jaamod/AnimatedArt/Misc/dustPoof.webm",
    "modules/jaamod/AnimatedArt/Misc/dustFountain.webm",
    "blfx.spell.template.circle.explosion3.dust.smoke.puff.color1",
    "jb2a.impact.005.white"
  ],
  lawrenceGreatsword: [
    "blfx.weapon.melee.greatsword2.color1.attack1",
    "blfx.weapon.melee.greatsword1.attack2.swing.trail1.yellow",
    "jb2a.greatsword.melee.standard.white"
  ],
  lawrenceFlail: [
    "blfx.weapon.melee.flail2.color1.attack1",
    "blfx.weapon.melee.flail1.attack1.trail1.green",
    "jb2a.impact.005.white"
  ],
  lawrenceJavelin: [
    "jb2a.javelin.01.throw.60ft",
    "jb2a.javelin.throw.60ft",
    "blfx.weapon.range.javelin1.throw1.color1.60ft"
  ],
  lawrenceCharge: [
    "modules/blfx-assets-pack01/artwork/05-spell/range/ray/Spray_Smoke_Mist_1_RANGE_1_COLOR_1_60ft_2800x400.webm",
    "jb2a.boulder.toss.02.01.stone.brown.30ft",
    "modules/jaamod/AnimatedArt/Misc/dustStorm.webm"
  ],
  lawrenceChargeRunes: [
    "modules/blfx-assets-pack01/artwork/08-misc/enchantment/Enchantment_15_Sigil_Glyph_Rune_Symbol_Seal_1_LOOP_COLOR_1_1200x1200.webm",
    "jb2a.magic_signs.rune.abjuration.complete.white",
    "modules/jaamod/AnimatedArt/Runes/runeCircle3.webm"
  ],
  lawrenceChargeWake: [
    "modules/blfx-assets-pack01/artwork/05-spell/homebrew/shock/wave/Shockwave_2_Smoke_1_AZURE_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/08-misc/puff-smoke-dust-mist/Puff_Smoke_Dust_2_Center_1_COLOR_1_1200x1200.webm",
    "modules/jaamod/AnimatedArt/Misc/dustPoof.webm"
  ],
  lawrenceChargeImpact: [
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Radiant_Impact_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Impact_Hit_1_Light_Blast_1_COLOR_1_1200x1200.webm",
    "jb2a.impact.012.yellow"
  ],
  lawrenceChargeWeaponFlash: [
    "modules/blfx-assets-pack01/artwork/01-weapon/lance/Lance_1_Trail_ATTACK_1_COLOR_1_10ft_2400x2400.webm",
    "modules/blfx-assets-pack01/artwork/01-weapon/warhammer/Warhammer_2_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm",
    "jb2a.greatsword.melee.standard.white"
  ],
  solarSpear: [
    "jb2a.guiding_bolt.01.dark_bluewhite.60ft",
    "jb2a.guiding_bolt.01.blueyellow.60ft",
    "blfx.weapon.range.arrow4.arcane.energy.impact1.color1.60ft"
  ],
  solarSeal: [
    "jb2a.magic_signs.rune.divination.complete.yellow",
    "jb2a.magic_signs.rune.divination.complete.blue",
    "jb2a.markers.circle_of_stars.yellowblue"
  ],
  solarShield: [
    "jb2a.shield.01.complete.01.yellow",
    "jb2a.shield.01.complete.01.white",
    "jb2a.markers.shield_rampart.complete.03.yellow"
  ],
  solarRadiance: [
    "jaamod.spells_effects.sunbeam",
    "jaamod.spells_effects.sunburst",
    "jb2a.explosion.05.yellowwhite"
  ],
  graceRayOfFrost: [
    "jb2a.ray_of_frost.blue.60ft",
    "jb2a.ray_of_frost.purpleteal.60ft",
    "blfx.weapon.range.bolt1.ice1.frost.impact1.color1.60ft"
  ],
  graceFrostImpact: [
    "jb2a.impact.frost.blue.01",
    "blfx.spell.impact.frost.ice.color1",
    "jb2a.ice_spikes.radial.burst.blue"
  ],
  graceSnowSigil: [
    "jb2a.markers.snowflake.blue.01",
    "jb2a.template_circle.symbol.normal.snowflake.blue",
    "blfx.spell.template.circle.ice.frost.snowflakes.ground2.blue"
  ],
  graceArcaneCircle: [
    "jb2a.magic_signs.circle.02.divination.intro.blue",
    "jb2a.magic_signs.circle.02.evocation.intro.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.divination"
  ],
  graceAbjurationCircle: [
    "jb2a.magic_signs.circle.02.abjuration.intro.blue",
    "jb2a.magic_signs.circle.02.abjuration.complete.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.abjuration"
  ],
  graceConjurationCircle: [
    "jb2a.magic_signs.circle.02.conjuration.intro.blue",
    "jb2a.magic_signs.circle.02.conjuration.complete.blue",
    "jaamod.runes.teleportation_circle.teleportation_circle2"
  ],
  graceIllusionCircle: [
    "jb2a.magic_signs.circle.02.illusion.intro.purple",
    "jb2a.magic_signs.circle.02.illusion.complete.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.illusion"
  ],
  graceDancingLights: [
    "jb2a.dancing_light.blueteal",
    "jb2a.dancing_light.purplegreen",
    "blfx.token.wisp.dancing_lights.color1.animated"
  ],
  graceStars: [
    "jb2a.markers.circle_of_stars.blue",
    "jb2a.particle_burst.01.star.bluepurple",
    "jb2a.twinkling_stars.points05.white"
  ],
  graceMagicMissile: [
    "jb2a.magic_missile.blue.60ft",
    "jb2a.magic_missile.purple.60ft",
    "jb2a.magic_missile.green.60ft"
  ],
  xinghaiAcidCast: [
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Liquid_1_Swirl_1_CAST_COLOR_3_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Liquid_1_Swirl_1_CAST_COLOR_5_1200x1200.webm",
    "modules/jaamod/AnimatedArt/Spells-Effects/acidSpray.webm"
  ],
  xinghaiAcidProjectile: [
    "modules/jb2a_patreon/Library/Generic/Liquid/LiquidSplashSide01_Bright_Green_600x600.webm",
    "jb2a.liquid.splash_side.bright_green",
    "jb2a.liquid.splash_side.green"
  ],
  xinghaiAcidImpact: [
    "modules/jb2a_patreon/Library/Generic/Liquid/LiquidSplash01_Bright_Green_400x400.webm",
    "jb2a.liquid.splash.bright_green",
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Acid_Impact_1_1200x1200.webm"
  ],
  xinghaiFireCast: [
    "modules/blfx-assets-pack01/artwork/05-spell/homebrew/cast/Spell_Cast_2_Fire_1_ORANGE_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/homebrew/cast/Spell_Cast_2_Fire_1_YELLOW_1200x1200.webm",
    "jb2a.magic_signs.circle.02.evocation.intro.orange"
  ],
  xinghaiFireBolt: [
    "modules/jb2a_patreon/Library/Cantrip/Fire_Bolt/FireBolt_01_Regular_Orange_60ft_2800x400.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/range/throw/Throw_Flame_1_RANGE_COLOR_1_60ft_2800x400.webm",
    "modules/jaamod/AnimatedArt/SequencerFXMaster/fireBolt2.webm"
  ],
  xinghaiFireImpact: [
    "modules/jaamod/AnimatedArt/SequencerFXMaster/fireImpact.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Fire_Impact_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Explosion_7_Fire_Flames_Particles_2_COLOR_1_1200x1200.webm"
  ],
  xinghaiWitchBolt: [
    "modules/blfx-assets-pack01/artwork/05-spell/range/beam/Beam_3_Witch_Bolt_1_Lightning_Strike_COLOR_2_60ft_2800x400.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/range/beam/Beam_3_Witch_Bolt_1_Lightning_Strike_COLOR_1_60ft_2800x400.webm",
    "modules/jb2a_patreon/Library/1st_Level/Witch_Bolt/WitchBolt_01_Regular_Blue_60ft_2800x400.webm",
    "modules/jb2a_patreon/Library/1st_Level/Witch_Bolt/WitchBolt_01_Dark_Purple_60ft_2800x400.webm"
  ],
  xinghaiWitchCast: [
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Electric_Lightning_2_IMPACT_CAST_COLOR_2_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Electric_Lightning_3_IMPACT_CAST_COLOR_2_1200x1200.webm",
    "modules/jb2a_patreon/Library/Generic/Magic_Signs/EvocationCircleIntro_02_Regular_Blue_800x800.webm"
  ],
  xinghaiLightningImpact: [
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Lightning_Impact_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Radial_Lightning_Shock_COLOR_2_1200x1200.webm",
    "modules/jb2a_patreon/Library/Generic/Impact/Impact_011_Regular_Blue_400x400.webm"
  ],
  xinghaiMindProjectile: [
    "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Purple_60ft_2800x400.webm",
    "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Blue_60ft_2800x400.webm",
    "modules/jaamod/AnimatedArt/SequencerFXMaster/projectilePurple.webm"
  ],
  xinghaiPsychicImpact: [
    "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Psychic_Impact_1_1200x1200.webm",
    "modules/jaamod/AnimatedArt/SequencerFXMaster/vectorBoomPurple.webm",
    "jb2a.impact.011.purple"
  ],
  xinghaiIllusion: [
    "modules/jb2a_patreon/Library/Generic/Magic_Signs/IllusionCircleIntro_02_Dark_Purple_800x800.webm",
    "modules/jb2a_patreon/Library/TMFX/Runes/Circle/IllusionOutPulse_01_Circle_Normal_500.webm",
    "modules/jaamod/AnimatedArt/Misc/mirrorCrystal.webm"
  ],
  xinghaiStarCast: [
    "modules/jb2a_patreon/Library/Generic/Magic_Signs/DivinationCircleIntro_02_Regular_Blue_800x800.webm",
    "modules/jb2a_patreon/Library/Generic/Magic_Signs/AbjurationCircleIntro_02_Regular_Blue_800x800.webm",
    "modules/jb2a_patreon/Library/Generic/Marker/MarkerCircleOfStars_Regular_YellowBlue_400x400.webm"
  ],
  xinghaiStarProjectile: [
    "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_BlueYellow_60ft_2800x400.webm",
    "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Blue_60ft_2800x400.webm",
    "modules/jb2a_patreon/Library/1st_Level/Magic_Missile/MagicMissile_01_Regular_Blue_60ft_01_2800x400.webm"
  ],
  xinghaiStarImpact: [
    "modules/jb2a_patreon/Library/Generic/Particles/ParticleBurstStar01_01_Regular_BluePurple_600x600.webm",
    "modules/jb2a_patreon/Library/Generic/Marker/MarkerCircleOfStars_Regular_YellowBlue_400x400.webm",
    "modules/jb2a_patreon/Library/Generic/Energy/DodecahedronStarAbove_01_Regular_BlueYellow_600x600.webm"
  ],
  xinghaiStarLoop: [
    "modules/jb2a_patreon/Library/Generic/Magic_Signs/DivinationCircleLoop_02_Regular_Blue_800x800.webm",
    "modules/jb2a_patreon/Library/Generic/Marker/MarkerCircleOfStars_Regular_Blue_400x400.webm",
    "modules/jb2a_patreon/Library/Generic/Twinkling_Stars/TwinklingStars_05_100x100.webm"
  ],
  xinghaiWaterCast: [
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Liquid_1_Swirl_1_CAST_COLOR_10_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Liquid_1_Swirl_1_CAST_COLOR_8_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/cast/Liquid_1_Swirl_1_CAST_COLOR_5_1200x1200.webm"
  ],
  xinghaiWaterImpact: [
    "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Liquid_Water_1_Splatter_1_COLOR_2_1200x1200.webm",
    "modules/jb2a_patreon/Library/Generic/Liquid/LiquidSplash01_Bright_Blue_400x400.webm",
    "modules/jaamod/AnimatedArt/Misc/waterSplash3.webm"
  ],
  xinghaiWaterLoop: [
    "modules/jb2a_patreon/Library/Generic/Liquid/WaterSplashLoop_01_01_Regular_Blue_600x600.webm",
    "modules/jb2a_patreon/Library/Generic/Liquid/Bubble/BubbleLoop002_002_BlueTeal_3x3_600x600.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Aura_4_Light_Circles_Emanating_Inwards_LOOP_COLOR_4_1200x1200.webm"
  ],
  xinghaiDetectMagicAura: [
    "jb2a.detect_magic.circle.blue",
    "modules/jb2a_patreon/Library/1st_Level/Detect_Magic/DetectMagicCircle_01_Regular_Blue_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/08-misc/enchantment/Enchantment_21_Arcanists_Magic_Aura_1_COLOR_1_1200x1200.webm"
  ],
  xinghaiDetectMagicPulse: [
    "modules/jb2a_patreon/Library/TMFX/Runes/Circle/DivinationOutPulse_01_Circle_Normal_500.webm",
    "modules/jb2a_patreon/Library/TMFX/Radar/Circle/RadarPulse_02_Circle_Normal_500x500.webm",
    "jb2a.extras.tmfx.runes.circle.outpulse.divination"
  ],
  xinghaiDetectMagicLoop: [
    "modules/jb2a_patreon/Library/Generic/Template/Circle/Radar/RadarLoop_002_003_BlueTeal_15ft_800x800.webm",
    "modules/jb2a_patreon/Library/Generic/Template/Circle/Aura/Aura003/Aura003_Outward_Loop_002_BlueTeal_1400x1400.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Aura_4_Light_Circles_Emanating_Inwards_LOOP_COLOR_4_1200x1200.webm"
  ],
  xinghaiBubbles: [
    "modules/jb2a_patreon/Library/Generic/Liquid/Bubble/BubbleLoop002_002_BlueTeal_3x3_600x600.webm",
    "modules/jb2a_patreon/Library/Generic/Liquid/Bubble/BubbleLoop002_002_Blue_3x3_600x600.webm",
    "modules/jb2a_patreon/Library/Generic/Liquid/Bubble/BubbleComplete002_002_BlueTeal_3x3_600x600.webm"
  ],
  xinghaiMagicMissile: [
    "modules/jb2a_patreon/Library/1st_Level/Magic_Missile/MagicMissile_01_Regular_Blue_60ft_01_2800x400.webm",
    "modules/jb2a_patreon/Library/1st_Level/Magic_Missile/MagicMissile_01_Regular_Blue_60ft_02_2800x400.webm",
    "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Blue_60ft_2800x400.webm",
    "modules/jaamod/AnimatedArt/Spells-Effects/magicMissile.webm"
  ],
  xinghaiShield: [
    "modules/blfx-assets-pack01/artwork/05-spell/homebrew/arcane/shield/Shield_Arcane_2_Mage_Armor_LOOP_MULTICOLOR_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/05-spell/homebrew/arcane/shield/Shield_Arcane_2_Mage_Armor_LOOP_BLUE_1_1200x1200.webm",
    "modules/blfx-assets-pack01/artwork/08-misc/protective/Shield_Magic_Frost_1_Loop_COLOR_5_1200x1200.webm"
  ],
  xinghaiWaterWeapon: [
    "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Quarterstaff04_01_Liquid_Blue_400x400.webm",
    "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Liquid_Blue_400x400.webm",
    "modules/blfx-assets-pack01/artwork/01-weapon/quarterstaff/Quarterstaff_2_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
  ],
  graceSleepCloud: [
    "jb2a.sleep.cloud.02.blue",
    "jb2a.sleep.cloud.01.dark_purple",
    "blfx.misc.enchantment.8.sleep1.color1"
  ],
  graceSleepSymbol: [
    "jb2a.sleep.symbol.blue",
    "jb2a.sleep.symbol.dark_purple",
    "jaamod.condition.rings.asleep"
  ],
  graceTeleport: [
    "jb2a.misty_step.02.blue",
    "jb2a.misty_step.01.purple",
    "jb2a.teleport.01.blue"
  ],
  graceShield: [
    "jb2a.shield.01.complete.01.blue",
    "jb2a.markers.shield.blue.03",
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue"
  ],
  graceMageArmor: [
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue",
    "blfx.spell.misc.shield2.arcane3.mage-armor.loop.color1",
    "blfx.spell.misc.armor1.arcane.color1"
  ],
  graceLaughter: [
    "blfx.misc.enchantment.10.mask.hideous_laughter1.color1",
    "blfx.ability.madness.head1.laughter1.green",
    "jb2a.magic_signs.circle.02.enchantment.intro.purple"
  ],
  graceServant: [
    "jb2a.arcane_hand.blue",
    "jb2a.arcane_hand.purple",
    "jb2a.magic_signs.circle.02.conjuration.complete.blue"
  ],
  graceArcaneProjectile: [
    "blfx.weapon.range.arrow4.arcane.energy.impact1.color1.60ft",
    "blfx.spell.weapon.range.snipe.bullet1.arrow1.arcane.impact1.blue.60ft",
    "jb2a.dart.01.throw.physical.white.60ft"
  ],
  sounds: {
    cast: [
      "psfx.casting.generic.002.001",
      "psfx.casting.generic.001",
      "psfx.casting.generic-v2.001.01"
    ],
    divineCaster: [
      "psfx.class-features.divine-smite.v1.001.caster",
      "psfx.casting.generic.002.001"
    ],
    divineTarget: [
      "psfx.class-features.divine-smite.v1.001.target",
      "blfx.sound.misc.impact.radiant1.1"
    ],
    radiantExplosion: [
      "blfx.sound.misc.explosion.radiant.1",
      "psfx.class-features.divine-smite.v1.001.target"
    ],
    sacredCaster: [
      "psfx.cantrips.sacred-flame.v1.001.caster",
      "blfx.sound.spell.sacred_flame1.cast.1"
    ],
    sacredTarget: [
      "psfx.cantrips.sacred-flame.v1.001.target",
      "blfx.sound.spell.sacred_flame1.impact.1"
    ],
    burningHands: [
      "psfx.1st-level-spells.burning-hands.v1.001",
      "blfx.sound.spell.cast.burning_hands.1"
    ],
    detectMagic: [
      "blfx.sound.spell.cast.detect_magic.1",
      "psfx.casting.generic.001"
    ],
    dartThrow: [
      "blfx.sound.weapon.range.dart_throw1.1",
      "blfx.sound.weapon.range.dart_throw1.2"
    ],
    dartHit: [
      "blfx.sound.weapon.range.dart_hit1.1",
      "blfx.sound.weapon.range.dart_hit1.2",
      "blfx.sound.weapon.range.dart_hit1.3"
    ],
    greatsword: [
      "blfx.sound.weapon.melee.greatsword.attack1",
      "blfx.sound.weapon.melee.greatsword.attack2",
      "blfx.sound.weapon.melee.greatsword.attack3"
    ],
    flail: [
      "blfx.sound.weapon.melee.flail.long_swing.attack1",
      "blfx.sound.weapon.melee.flail.long_swing.attack2",
      "blfx.sound.weapon.melee.flail.long_swing.attack3"
    ],
    chargeStart: [
      "modules/psfx/library/weapon-swooshes/light/v1/group06/meleeattack-swoosh-light-group06-00.ogg",
      "modules/psfx/library/weapon-swooshes/light/v1/group05/meleeattack-swoosh-light-group05-00.ogg",
      "blfx.sound.weapon.melee.greatsword.attack1"
    ],
    chargeImpact: [
      "modules/blfx-assets-pack01/sounds/pack8/blfx-radiant-explosion-1.ogg",
      "modules/blfx-assets-pack01/sounds/pack8/blfx-impact-radiant-1.ogg",
      "blfx.sound.misc.impact.radiant1.1"
    ],
    frost: [
      "psfx.cantrips.ray-of-frost.v1",
      "psfx.cantrips.ray-of-frost.v2"
    ],
    magicMissile: [
      "psfx.1st-level-spells.magic-missile.v1.60ft",
      "psfx.ranged-magic.generic.missile.complete.001.60ft",
      "psfx.casting.generic.001"
    ],
    acid: [
      "modules/psfx/library/cantrips/acid-splash/v1/acid-splash-003-60ft.ogg",
      "modules/blfx-assets-pack01/sounds/pack8/blfx-impact-liquid-1.ogg",
      "modules/magic-mu/Archive/Corrosive%20Splash.wav",
      "psfx.casting.generic.001"
    ],
    fireBolt: [
      "modules/psfx/library/cantrips/fire-bolt/v2/fire-bolt-002-60ft.ogg",
      "modules/blfx-assets-pack01/sounds/pack1/blfx_fire_bolt_1.ogg",
      "modules/blfx-assets-pack01/sounds/pack1/blfx_fire_bolt_3.ogg",
      "psfx.casting.generic.001"
    ],
    witchBolt: [
      "psfx.casting.generic-v2.001.01",
      "modules/blfx-assets-pack01/sounds/pack2/blfx_female_vocal_witch_chanting_spell_1.ogg"
    ],
    mind: [
      "modules/psfx/library/cantrips/mind-sliver/v1/mind-sliver-001.ogg",
      "modules/magic-mu/Archive3/Mind%20Sliver.wav",
      "psfx.casting.generic.002.001"
    ],
    sleep: [
      "psfx.1st-level-spells.sleep.v1.001",
      "psfx.casting.generic.002.001"
    ],
    teleport: [
      "blfx.sound.misc.teleport1.conjure1.summon1.1",
      "blfx.sound.misc.teleport1.conjure1.summon1.2",
      "psfx.casting.generic-v2.001.01"
    ],
    mageArmor: [
      "blfx.sound.spell.cast.mage_armor.1",
      "psfx.casting.generic.001"
    ],
    identify: [
      "blfx.sound.spell.cast.identify.1",
      "psfx.casting.generic.001"
    ],
    laughter: [
      "blfx.sound.misc.laughter.madness.1",
      "psfx.casting.generic.002.001"
    ]
  }
};

const XINGHAI_1_0_10 = {
  scrollSigil: [
    "blfx.misc.enchantment.3.paper_scroll_signet_sigil.1.color1",
    "blfx.misc.enchantment.3.paper_scroll_signet_sigil.2.color1",
    "jb2a.extras.tmfx.runes.circle.simple.divination"
  ],
  insightEye: [
    "blfx.misc.enchantment.12.eye.see_invisibility.color1",
    "jb2a.eyes.01.single.orangeyellow",
    "jb2a.ioun_stones.01.blue.insight"
  ],
  auraArcaneLoop: [
    "blfx.spell.template.circle.emanating.aura4.loop.light.color1",
    "blfx.spell.template.circle.emanating.aura3.loop.radial.color4",
    "jb2a.template_circle.aura.03.inward.001.loop.combined.blueteal",
    "jb2a.aura_themed.01.inward.loop.cold.01.blue"
  ],
  arcaneWispLoop: [
    "blfx.token.wisp.dancing_lights.color1.animated",
    "blfx.token.wisp.spirit.blue.animated",
    "jb2a.dancing_light.blueteal",
    "jb2a.dancing_light.purplegreen"
  ],
  lightOrb: [
    "jb2a.markers.light_orb.complete.yellow",
    "jb2a.markers.light_orb.complete.white",
    "jb2a.markers.light_orb.loop.yellow"
  ],
  shieldLoopArcane: [
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue",
    "blfx.spell.misc.shield2.arcane3.mage-armor.loop.color1",
    "jb2a.shield.01.loop.blue"
  ],
  poisonSplash: [
    "jb2a.liquid.splash.green",
    "jb2a.liquid.splash02.green",
    "jb2a.liquid.splash.bright_green"
  ],
  poisonProjectile: [
    "jb2a.arrow.poison.green.01.60ft",
    "jb2a.arrow.poison.green.01.30ft",
    "jb2a.arrow.poison.blue.60ft"
  ],
  lawrenceStoneImpact: [
    "blfx.spell.range.snipe.burst1.dust.impact1.intro.white.15ft",
    "blfx.spell.template.circle.explosion3.dust.smoke.puff.color1",
    "jb2a.impact.005.white"
  ],
  lawrenceGreatsword: [
    "blfx.weapon.melee.greatsword2.color1.attack1",
    "blfx.weapon.melee.greatsword1.attack2.swing.trail1.yellow",
    "jb2a.greatsword.melee.standard.white"
  ],
  graceArcaneCircle: [
    "jb2a.magic_signs.circle.02.divination.intro.blue",
    "jb2a.magic_signs.circle.02.evocation.intro.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.divination"
  ],
  graceAbjurationCircle: [
    "jb2a.magic_signs.circle.02.abjuration.intro.blue",
    "jb2a.magic_signs.circle.02.abjuration.complete.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.abjuration"
  ],
  graceConjurationCircle: [
    "jb2a.magic_signs.circle.02.conjuration.intro.blue",
    "jb2a.magic_signs.circle.02.conjuration.complete.blue",
    "jaamod.runes.teleportation_circle.teleportation_circle2"
  ],
  graceIllusionCircle: [
    "jb2a.magic_signs.circle.02.illusion.intro.purple",
    "jb2a.magic_signs.circle.02.illusion.complete.blue",
    "jb2a.extras.tmfx.runes.circle.inpulse.illusion"
  ],
  graceDancingLights: [
    "jb2a.dancing_light.blueteal",
    "jb2a.dancing_light.purplegreen",
    "blfx.token.wisp.dancing_lights.color1.animated"
  ],
  graceStars: [
    "jb2a.markers.circle_of_stars.blue",
    "jb2a.particle_burst.01.star.bluepurple",
    "jb2a.twinkling_stars.points05.white"
  ],
  graceMagicMissile: [
    "jb2a.magic_missile.blue.60ft",
    "jb2a.magic_missile.purple.60ft",
    "jb2a.magic_missile.green.60ft"
  ],
  graceTeleport: [
    "jb2a.misty_step.02.blue",
    "jb2a.misty_step.01.purple",
    "jb2a.teleport.01.blue"
  ],
  graceServant: [
    "jb2a.arcane_hand.blue",
    "jb2a.arcane_hand.purple",
    "jb2a.magic_signs.circle.02.conjuration.complete.blue"
  ],
  graceSleepCloud: [
    "jb2a.sleep.cloud.02.blue",
    "jb2a.sleep.cloud.01.dark_purple",
    "blfx.misc.enchantment.8.sleep1.color1"
  ],
  graceSleepSymbol: [
    "jb2a.sleep.symbol.blue",
    "jb2a.sleep.symbol.dark_purple",
    "jaamod.condition.rings.asleep"
  ],
  graceMageArmor: [
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue",
    "blfx.spell.misc.shield2.arcane3.mage-armor.loop.color1",
    "blfx.spell.misc.armor1.arcane.color1"
  ],
  graceShield: [
    "jb2a.shield.01.complete.01.blue",
    "jb2a.markers.shield.blue.03",
    "blfx.spell.misc.shield2.arcane2.mage-armor.loop.blue"
  ]
};

const ACTIONABLE_TYPES = new Set(["spell", "feat", "weapon", "consumable"]);
const BUILTIN_PROFILES = [
  FLORENCE_PROFILE,
  GRACE_PROFILE,
  LAWRENCE_PROFILE,
  CALYPSO_PROFILE,
  SAPPHIRE_PROFILE,
  YINAI_PROFILE,
  LEQUIN_PROFILE,
  GRIM_PROFILE,
  AISLAN_PROFILE,
  XINGHAI_PROFILE
];

const FLORENCE_OWNED_SEQUENCES = new Set([
  "guidingBolt",
  "healingWord",
  "radianceOfTheDawn",
  "sacredFlame",
  "light",
  "shieldOfFaith",
  "guidance",
  "channelDivinity",
  "wardingFlare",
  "holdPerson",
  "burningHands",
  "faerieFire",
  "scorchingRay",
  "detectMagic",
  "utilityPulse",
  "passiveSigil",
  "scrollIntel",
  "healerKit",
  "holyWater",
  "dartThrow",
  "daylightScroll",
  "seeInvisibility",
  "gentleRepose",
  "poisonUse"
]);

const PROFILE_SEQUENCE_PREFIXES = {
  [CALYPSO_PROFILE.id]: ["calypso"],
  [SAPPHIRE_PROFILE.id]: ["sapphire"],
  [YINAI_PROFILE.id]: ["yinai"],
  [LEQUIN_PROFILE.id]: ["lequin"],
  [GRIM_PROFILE.id]: ["grim"],
  [AISLAN_PROFILE.id]: ["aislan"],
  [GRACE_PROFILE.id]: ["grace"],
  [LAWRENCE_PROFILE.id]: ["lawrence"],
  [XINGHAI_PROFILE.id]: ["xinghai"]
};
const PROFILE_SEQUENCE_OWNERS = Object.entries(PROFILE_SEQUENCE_PREFIXES).flatMap(([profileId, prefixes]) =>
  prefixes.map((prefix) => ({ profileId, prefix }))
);
const XINGHAI_POLLUTED_FLOATING_TEXT = /潮星|霜晶/u;
const XINGHAI_LEGACY_FLOATING_TEXT = /星灯环舞|星辉回想|仪式钟环|棱镜小戏法|星使召来|月眠星尘|银蓝法甲|星矢齐发|星矢命中|瞬发银盾|星影拟声|午夜毒露|墓卫巨剑/u;
const CROSS_PROFILE_FLOATING_TEXT_MARKERS = [
  {
    owner: GRACE_PROFILE.id,
    pattern: /霜晶|星矢|星灯|仪式钟环|星辉|银刃|法杖点星|棱镜|星使|月眠星尘|银蓝法甲|塔莎镜笑|镜幕易容|星雾折步/u
  },
  {
    owner: LAWRENCE_PROFILE.id,
    pattern: /墓卫|墓链|墓钉|破碑|石躯|猎手凝视|银辉壁垒/u
  }
];
const SIGNATURE_SEQUENCE_PLAYERS = {
  ...buildSignaturePlayers("calypsoCloud", playProfileSignatureEffect),
  ...buildSignaturePlayers("sapphireStar", playProfileSignatureEffect),
  ...buildSignaturePlayers("yinaiSilver", playProfileSignatureEffect),
  ...buildSignaturePlayers("lequinShadow", playLequinSignatureEffect),
  ...buildSignaturePlayers("grimAbyss", playGrimSignatureEffect),
  ...buildSignaturePlayers("aislanFey", playAislanSignatureEffect),
  ...buildSignaturePlayers("xinghaiTide", playProfileSignatureEffect)
};

const PROFILE_SIGNATURES = {
  [CALYPSO_PROFILE.id]: {
    tag: "云影",
    cast: [
      "modules/jaamod/AnimatedArt/Spells-Effects/fogCloud.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeWhiteTopDown.webm",
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Smoke_1_Mist_1_Storm_1_RADIUS_COLOR_1_1200x1200.webm"
    ],
    projectile: [
      "modules/blfx-assets-pack01/artwork/05-spell/range/ray/Spray_Smoke_Mist_1_RANGE_1_COLOR_1_60ft_2800x400.webm",
      "modules/jaamod/AnimatedArt/Misc/gray_arrow.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Light_Blue_400x400.webm"
    ],
    impact: [
      "modules/jaamod/AnimatedArt/Smoke/smokeWhiteTopDown.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/puff-smoke-dust-mist/Puff_Smoke_Dust_2_Center_1_COLOR_1_1200x1200.webm",
      "modules/jb2a_patreon/Library/TMFX/OutPulse/Circle/OutPulse_04_Circle_Fast_500.webm"
    ],
    ring: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Aura_9_Air_Wind_2_Jump_LOOP_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/gustOfWind.webm",
      "modules/jb2a_patreon/Library/TMFX/Radar/Circle/RadarPulse_02_Circle_Normal_500x500.webm"
    ],
    loop: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Smoke_2_Mist_2_Storm_2_LOOP_RADIUS_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/fogCloud.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeCyanTopDown.webm"
    ],
    weapon: [
      "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Swift_Strike_1_Trail_Shortsword_ATTACK_1_COLOR_1_05ft_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Shortsword_3_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Simple_400x400.webm"
    ],
    sound: [
      "modules/blfx-assets-pack01/sounds/pack1/blfx_arrow_swoosh_3.ogg",
      "modules/magic-mu/Archive5/Archive%205/Wind%27s%20Breath%20(5)/Wind%27s%20Breath_Clothing%20Ripple.wav",
      ...ASSETS.sounds.dartThrow
    ]
  },
  [SAPPHIRE_PROFILE.id]: {
    tag: "星图",
    cast: [
      "modules/jaamod/AnimatedArt/Misc/starfield.webm",
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Particles_Rise_Star_1_CIRCLE_LOOP_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Misc/starfieldWnebula.webm"
    ],
    projectile: [
      "modules/jaamod/AnimatedArt/Misc/ArrowBlue.webm",
      "modules/jb2a_patreon/Library/Generic/RangedSpell/ProjectileMusicNote01_01_Regular_GreenYellow_60ft_2800x400.webm",
      "jb2a.guiding_bolt.01.blueyellow.60ft"
    ],
    impact: [
      "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Radiant_Impact_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/moonbeam4.webm",
      ...ASSETS.impactRadiant
    ],
    ring: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Moonbeam_1_LOOP_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/moonbeam8.webm",
      "jb2a.markers.circle_of_stars.yellowblue"
    ],
    loop: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Aura_8_Light_Rays_1_Emanating_CIRCLE_LOOP_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Misc/starfieldWnebula.webm",
      ...ASSETS.auraRadiantLoop
    ],
    healing: [
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_Magic_Petals_1_COLOR_5_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_Rings_Particles_1_COLOR_5_1200x1200.webm",
      ...ASSETS.healingBurst
    ],
    weapon: [
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Flaming_Yellow_200x200.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/mace/Mace_1_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
    ],
    sound: [
      "modules/blfx-assets-pack01/sounds/pack8/blfx-impact-radiant-1.ogg",
      "modules/blfx-assets-pack01/sounds/pack1/blfx_cure_magic_1.ogg",
      ...ASSETS.sounds.divineCaster
    ]
  },
  [YINAI_PROFILE.id]: {
    tag: "银弦",
    cast: [
      "modules/blfx-assets-pack01/artwork/08-misc/audio-animation/Music_Notes_1_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Misc/bardSongColor.webm",
      "jb2a.magic_signs.circle.02.enchantment.intro.purple"
    ],
    projectile: [
      "modules/jb2a_patreon/Library/Generic/RangedSpell/ProjectileMusicNote01_01_Regular_Pink_60ft_2800x400.webm",
      "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Purple_60ft_2800x400.webm"
    ],
    impact: [
      "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Psychic_Impact_1_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/audio-animation/Music_Notes_1_COLOR_1_1200x1200.webm",
      "jb2a.particle_burst.01.star.bluepurple"
    ],
    ring: [
      "modules/blfx-assets-pack01/artwork/08-misc/audio-animation/Music_Notes_1_COLOR_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Misc/bardSongColor.webm",
      "jb2a.twinkling_stars.points05.white"
    ],
    loop: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Aura_4_Light_Circles_Emanating_Inwards_LOOP_COLOR_4_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/audio-animation/Music_Notes_1_COLOR_1_1200x1200.webm",
      ...ASSETS.auraArcaneLoop
    ],
    healing: [
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_Rings_Particles_1_COLOR_4_1200x1200.webm",
      ...ASSETS.healingBurst
    ],
    weapon: [
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Rapier01_01_Astral_Purple_400x400.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Shortsword_1_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
    ],
    sound: [
      "modules/blfx-assets-pack01/sounds/pack2/blfx_lute_melodic_string_5.ogg",
      "modules/magic-mu/Archive3/Minor%20Enchantment%20(16)/Minor%20Enchantment_Musical%20Notes.wav",
      ...ASSETS.sounds.mind
    ]
  },
  [LEQUIN_PROFILE.id]: {
    tag: "深影",
    cast: [
      "modules/jaamod/AnimatedArt/Spells-Effects/darkness.webm",
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_1_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
      ...ASSETS.runeNecromancy
    ],
    projectile: [
      "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
    ],
    impact: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_1_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/set/sword-shield/Obsidian_Set_Animation_1_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
    ],
    ring: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_2_LOOP_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
      ...ASSETS.runeNecromancy
    ],
    loop: [
      "modules/blfx-assets-pack01/artwork/08-misc/protective/Shield_Magic_Frost_1_Loop_COLOR_6_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_2_LOOP_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
      ...ASSETS.shieldLoopStone
    ],
    healing: [
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_3_Arcane_Vigor_1_COLOR_1_1200x1200.webm",
      ...ASSETS.healingLoop
    ],
    shadowMark: [
      "modules/jb2a_patreon/Library/TMFX/Runes/Circle/NecromancyOutPulse_01_Circle_Normal_500.webm",
      "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_1_CIRCLE_RADIUS_COLOR_1_1200x1200.webm"
    ],
    boneShield: [
      "modules/blfx-assets-pack01/artwork/08-misc/protective/Shield_Magic_Sanctuary_1_LOOP_COLOR_1_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/08-misc/protective/Shield_Magic_Frost_1_Loop_COLOR_6_1200x1200.webm",
      ...ASSETS.shieldLoopStone
    ],
    shadowBlade: [
      "modules/blfx-assets-pack01/artwork/08-misc/set/sword-shield/Obsidian_Set_Animation_1_1200x1200.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Purple_400x400.webm"
    ],
    ruinImpact: [
      "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_1_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
      "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
    ],
    weapon: [
      "modules/blfx-assets-pack01/artwork/08-misc/set/sword-shield/Obsidian_Set_Animation_1_1200x1200.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_LongSword01_01_Astral_Purple_400x400.webm"
    ],
    sound: [
      "modules/psfx/library/weapon-swooshes/necrotic/v1/group01/meleeattack-swoosh-magicaleffect-group01-necrotic-02.ogg",
      "modules/magic-mu/Archive4/Spirit%20Shield%20(2)/Spirit%20Shield_Touch.wav",
      ...ASSETS.sounds.greatsword
    ]
  },
  [GRIM_PROFILE.id]: {
    tag: "多臂",
    cast: [
      "modules/jaamod/AnimatedArt/Misc/chainFigure8.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_3_Round_1_METAL_1200x1200.webm",
      ...ASSETS.chainMarker
    ],
    projectile: [
      "modules/jaamod/AnimatedArt/Spells-Effects/chain1.webm",
      "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_1_Line_1_METAL_1200x100.webm"
    ],
    impact: [
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_3_ATTACK_1_COLOR_1_2400x2400_05ft.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_2_Round_1_METAL_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Claw_1_ATTACK_1_COLOR_2_2400x2400_05ft.webm"
    ],
    ring: [
      "modules/jaamod/AnimatedArt/Misc/chainFigure8.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_3_Round_1_METAL_1200x1200.webm",
      ...ASSETS.chainMarker
    ],
    loop: [
      "modules/jaamod/AnimatedArt/Spells-Effects/chain2.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_3_Round_1_METAL_1200x1200.webm",
      ...ASSETS.chainMarkerLoop
    ],
    fist: [
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_3_ATTACK_2_COLOR_1_2400x2400_05ft.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_2_ATTACK_1_COLOR_3_1200x1200_05ft.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Claw_1_ATTACK_1_COLOR_2_2400x2400_05ft.webm"
    ],
    manyHandPunch: [
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_3_ATTACK_2_COLOR_1_2400x2400_05ft.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_2_ATTACK_1_COLOR_3_1200x1200_05ft.webm",
      "modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrike_01_Dark_Purple_Magical01_800x600.webm"
    ],
    manyHandClaw: [
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Claw_1_ATTACK_1_COLOR_2_2400x2400_05ft.webm",
      "modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrike_01_Dark_Purple_Magical02_800x600.webm",
      "modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrike_01_Dark_Purple_Physical01_800x600.webm"
    ],
    manyHandDagger: [
      "modules/blfx-assets-pack01/artwork/01-weapon/dagger/Dagger_2_Magic_Trail_ATTACK_1_COLOR_4_05ft_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/dagger/Dagger_2_Magic_Trail_ATTACK_2_COLOR_4_05ft_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/dagger/Dagger_1_Trail_ATTACK_1_COLOR_1_05ft_1200x1200.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/dagger/Dagger_1_Trail_ATTACK_2_COLOR_1_05ft_1200x1200.webm"
    ],
    manyHandKnifeBurst: [
      "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Dark_Purple_400x400.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Cloud_Of_Daggers/CloudOfDaggers_Kunai_01_Dark_Red_400x400.webm",
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Dagger02_01_Astral_Purple_400x400.webm"
    ],
    whip: [
      "modules/blfx-assets-pack01/artwork/01-weapon/whip/Whip_Bladed_ATTACK_1_COLOR_4_2400x2400_10ft.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/whip/Whip_Bladed_ATTACK_1_COLOR_3_2400x2400_10ft.webm",
      "modules/jaamod/AnimatedArt/Misc/chainFigure8.webm"
    ],
    chainNet: [
      "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/chain1.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_1_Line_1_METAL_1200x100.webm"
    ],
    abyssMark: [
      "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Red_400x400.webm",
      "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm",
      ...ASSETS.insightEye
    ],
    weapon: [
      "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_3_ATTACK_2_COLOR_1_2400x2400_05ft.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/whip/Whip_Bladed_ATTACK_1_COLOR_4_2400x2400_10ft.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_2_Round_1_METAL_1200x1200.webm"
    ],
    sound: [
      "modules/blfx-assets-pack01/sounds/pack2/blfx_unarmed_strike_6.ogg",
      "modules/blfx-assets-pack01/sounds/pack4/blfx_electric_chain_lightning_2.ogg",
      ...ASSETS.sounds.flail
    ],
    manyHandSound: [
      "modules/blfx-assets-pack01/sounds/pack1/blfx_unarmed_strike_1.ogg",
      "modules/blfx-assets-pack01/sounds/pack2/blfx_unarmed_strike_6.ogg",
      "modules/blfx-assets-pack01/sounds/pack4/blfx_electric_chain_lightning_2.ogg"
    ],
    daggerSound: [
      "modules/blfx-assets-pack01/sounds/pack7/blfx_melee_shortsword_attack_1.ogg",
      "modules/blfx-assets-pack01/sounds/pack6/blfx_melee_rapier_attack_1.ogg",
      ...ASSETS.sounds.dartThrow
    ]
  },
  [AISLAN_PROFILE.id]: {
    tag: "妖集",
    cast: [
      "modules/blfx-assets-pack01/artwork/06-ability/wings/Wings_1_FADE_IN_OUT_COLOR_4_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/FaerieFireViolet.webm",
      "jb2a.magic_signs.circle.02.illusion.intro.purple"
    ],
    projectile: [
      "modules/jb2a_patreon/Library/Generic/RangedSpell/ProjectileMusicNote01_01_Regular_GreenYellow_60ft_2800x400.webm",
      "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Green_60ft_2800x400.webm"
    ],
    impact: [
      "modules/jaamod/AnimatedArt/Spells-Effects/faerieFireViolet2.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/wings/Wings_1_FADE_IN_OUT_COLOR_3_1200x1200.webm",
      ...ASSETS.faerieFire
    ],
    ring: [
      "modules/blfx-assets-pack01/artwork/06-ability/wings/Wings_1_LOOP_COLOR_4_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Spells-Effects/FaerieFireGreen.webm",
      "modules/blfx-assets-pack01/artwork/06-ability/wings/Wings_1_FADE_IN_OUT_COLOR_3_1200x1200.webm"
    ],
    loop: [
      "modules/blfx-assets-pack01/artwork/06-ability/wings/Wings_1_LOOP_COLOR_3_1200x1200.webm",
      "modules/jaamod/AnimatedArt/Misc/rainbow.webm",
      ...ASSETS.arcaneWispLoop
    ],
    healing: [
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_Magic_Petals_1_COLOR_3_1200x1200.webm",
      ...ASSETS.healingBurst
    ],
    weapon: [
      "modules/jb2a_patreon/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Shortsword01_01_Astral_Purple_400x400.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Shortsword_3_Trail_ATTACK_2_COLOR_1_05ft_2400x2400.webm",
      "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Shortsword_1_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
    ],
    sound: [
      "modules/blfx-assets-pack01/sounds/pack8/blfx-summon-fey-complete-1.ogg",
      "modules/psfx/library/creature/movement/flight/wings/beating-wings-small-001.ogg",
      ...ASSETS.sounds.cast
    ]
  },
  [XINGHAI_PROFILE.id]: {
    tag: "星海",
    cast: [
      ...ASSETS.xinghaiStarCast,
      ...ASSETS.xinghaiWaterCast
    ],
    projectile: [
      ...ASSETS.xinghaiMagicMissile
    ],
    impact: [
      ...ASSETS.xinghaiStarImpact
    ],
    ring: [
      ...ASSETS.xinghaiStarLoop,
      ...ASSETS.xinghaiIllusion
    ],
    loop: [
      ...ASSETS.xinghaiStarLoop,
      ...ASSETS.xinghaiBubbles
    ],
    defense: ASSETS.xinghaiShield,
    condition: [
      ...ASSETS.xinghaiIllusion,
      ...ASSETS.xinghaiStarImpact
    ],
    healing: [
      "modules/blfx-assets-pack01/artwork/08-misc/heal/Heal_Rings_Particles_1_COLOR_2_1200x1200.webm",
      ...ASSETS.xinghaiStarImpact,
      ...ASSETS.xinghaiBubbles
    ],
    weapon: ASSETS.xinghaiWaterWeapon,
    sound: [
      "modules/blfx-assets-pack01/sounds/pack1/blfx_wave_1.ogg",
      "modules/magic-mu/Archive5/Archive%205/Water%20Shape%20(4)/Water%20Shape_Flow%20Change.wav",
      ...ASSETS.sounds.cast
    ]
  }
};

let panelElement = null;
let panelTimer = null;
let recentEvents = [];
let preparedProfiles = new Map();
let preparedUniversalEffects = [];
let duplicateEvents = new Map();
let externalSyncStamps = new Map();

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", async () => {
  await runMigrations();

  for (const profile of BUILTIN_PROFILES) registerProfile(profile);
  registerUniversalEffects(UNIVERSAL_EFFECTS);
  validateProfileIsolation(BUILTIN_PROFILES);

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  globalThis.PlayerCustomCinematicEffects = api;

  if (setting("autoOpenPanel") && canOpenPanel()) openPanel();
  maybePreloadAssets();
  reportMissingDependencies();
});

Hooks.on("canvasReady", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("controlToken", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("targetToken", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("createActor", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("deleteActor", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("updateActor", () => refreshPanel({ rerender: true, preserveScroll: true }));
Hooks.on("deleteActiveEffect", (activeEffect) => {
  window.setTimeout(() => cleanupPersistentEffectsForActiveEffect(activeEffect), 0);
});
Hooks.on("getSceneControlButtons", addSceneControlButton);

Hooks.on("midi-qol.RollComplete", async (workflow) => {
  await handleMidiRollComplete(workflow);
});

Hooks.on("dnd5e.postUseActivity", (activity, usageConfig, results) => {
  window.setTimeout(() => handleDnd5ePostUseActivity(activity, usageConfig, results), 120);
});

Hooks.on("createChatMessage", (message) => {
  window.setTimeout(() => handleChatMessage(message), 120);
});

for (const hookName of ACTOR_SHEET_MARKER_HOOKS) {
  Hooks.on(hookName, (app, html) => scheduleActorSheetEffectMarkers(app, html));
}

const api = {
  openPanel,
  closePanel,
  togglePanel,
  refreshPanel,
  scanActor,
  playItemEffect,
  playEffectStage,
  previewItem,
  createOpenPanelMacro,
  registerProfile,
  assignProfileToActor,
  clearActorProfileAssignment,
  getActorProfile,
  getActorEffect,
  getUniversalEffects: () => preparedUniversalEffects.map(cloneEffectSummary),
  validateProfileIsolation: () => validateProfileIsolation(BUILTIN_PROFILES),
  getProfiles: () => Array.from(preparedProfiles.values()).map(cloneProfileSummary),
  getRecentEvents: () => foundry.utils.deepClone(recentEvents)
};

function registerSettings() {
  game.settings.register(MODULE_ID, "autoPlayEnabled", {
    name: game.i18n.localize("PCCE.Settings.AutoPlay.Name"),
    hint: game.i18n.localize("PCCE.Settings.AutoPlay.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "gmOnlyAutoplay", {
    name: game.i18n.localize("PCCE.Settings.GMOnlyAutoplay.Name"),
    hint: game.i18n.localize("PCCE.Settings.GMOnlyAutoplay.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "allowPlayerPanel", {
    name: game.i18n.localize("PCCE.Settings.AllowPlayerPanel.Name"),
    hint: game.i18n.localize("PCCE.Settings.AllowPlayerPanel.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "respectCrpAnimations", {
    name: game.i18n.localize("PCCE.Settings.RespectCRP.Name"),
    hint: game.i18n.localize("PCCE.Settings.RespectCRP.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "respectAaAnimations", {
    name: game.i18n.localize("PCCE.Settings.RespectAA.Name"),
    hint: game.i18n.localize("PCCE.Settings.RespectAA.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "fallbackChatHook", {
    name: game.i18n.localize("PCCE.Settings.ChatFallback.Name"),
    hint: game.i18n.localize("PCCE.Settings.ChatFallback.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "quality", {
    name: game.i18n.localize("PCCE.Settings.Quality.Name"),
    hint: game.i18n.localize("PCCE.Settings.Quality.Hint"),
    scope: "world",
    config: false,
    type: String,
    choices: {
      cinematic: "电影级"
    },
    default: "cinematic",
    onChange: () => refreshPanel({ rerender: true, preserveScroll: true })
  });

  game.settings.register(MODULE_ID, "clientAutoPlayEnabled", {
    scope: "client",
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "clientQuality", {
    scope: "client",
    config: false,
    type: String,
    default: "cinematic"
  });

  game.settings.register(MODULE_ID, "effectModeOverrides", {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "personalEffectModeOverrides", {
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "enableCameraPan", {
    name: game.i18n.localize("PCCE.Settings.CameraPan.Name"),
    hint: game.i18n.localize("PCCE.Settings.CameraPan.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "enableScreenShake", {
    name: game.i18n.localize("PCCE.Settings.ScreenShake.Name"),
    hint: game.i18n.localize("PCCE.Settings.ScreenShake.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "enableTokenMotion", {
    name: game.i18n.localize("PCCE.Settings.TokenMotion.Name"),
    hint: game.i18n.localize("PCCE.Settings.TokenMotion.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "showFloatingText", {
    name: game.i18n.localize("PCCE.Settings.FloatingText.Name"),
    hint: game.i18n.localize("PCCE.Settings.FloatingText.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "playSounds", {
    name: game.i18n.localize("PCCE.Settings.PlaySounds.Name"),
    hint: game.i18n.localize("PCCE.Settings.PlaySounds.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "soundVolume", {
    name: game.i18n.localize("PCCE.Settings.SoundVolume.Name"),
    hint: game.i18n.localize("PCCE.Settings.SoundVolume.Hint"),
    scope: "client",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05
    },
    default: 0.55
  });

  game.settings.register(MODULE_ID, "autoOpenPanel", {
    name: game.i18n.localize("PCCE.Settings.AutoOpen.Name"),
    hint: game.i18n.localize("PCCE.Settings.AutoOpen.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "debug", {
    name: game.i18n.localize("PCCE.Settings.Debug.Name"),
    hint: game.i18n.localize("PCCE.Settings.Debug.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "panelPosition", {
    scope: "client",
    config: false,
    type: Object,
    default: {
      left: 124,
      top: 128,
      compact: false
    }
  });

  game.settings.register(MODULE_ID, "selectedActorId", {
    scope: "client",
    config: false,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_ID, "actorProfileAssignments", {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "effectOverrides", {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "personalEffectOverrides", {
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "migrationVersion", {
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
}

function registerProfile(profile, options = {}) {
  if (!profile?.id) {
    console.warn(`${MODULE_TITLE} | 无法注册没有 id 的角色特效配置`, profile);
    return null;
  }
  if (preparedProfiles.has(profile.id) && !options.replace) {
    const existing = preparedProfiles.get(profile.id);
    warnProfileIsolation("角色档案 id 重复，已保留先注册的档案", {
      profileId: profile.id,
      existing: existing?.displayName,
      incoming: profile.displayName
    });
    return existing;
  }

  const prepared = {
    ...profile,
    normalizedActorNames: new Set((profile.actorNames ?? []).map(normalizeText)),
    effects: (profile.effects ?? []).map((effect) => prepareEffect(profile, effect))
  };
  prepared.effectById = new Map(prepared.effects.map((effect) => [effect.id, effect]));
  preparedProfiles.set(prepared.id, prepared);
  refreshPanel({ rerender: true, preserveScroll: true });
  return prepared;
}

function registerUniversalEffects(effects = []) {
  preparedUniversalEffects = effects.map((effect) => ({
    ...prepareEffect(UNIVERSAL_PROFILE, effect),
    sourceType: "universal"
  }));
  debugLog("通用电影级特效库已注册", {
    count: preparedUniversalEffects.length,
    cantrips: preparedUniversalEffects.filter((effect) => effect.universal?.family === "cantrip").length
  });
  return preparedUniversalEffects;
}

function validateProfileIsolation(sourceProfiles = []) {
  const profiles = Array.from(preparedProfiles.values());
  const report = {
    duplicateProfileIds: duplicateProfileIds(sourceProfiles),
    duplicateActorNames: duplicateActorNames(profiles),
    duplicateEffectIds: duplicateEffectIds(profiles),
    duplicateItemIds: duplicateItemIds(profiles),
    sequenceOwnershipMismatches: sequenceOwnershipMismatches(profiles),
    missingSequencePlayers: missingSequencePlayers(profiles)
  };
  emitProfileIsolationReport(report);
  return report;
}

function duplicateProfileIds(sourceProfiles) {
  const index = new Map();
  for (const profile of sourceProfiles ?? []) {
    const id = String(profile?.id ?? "").trim();
    if (!id) continue;
    addIndexedEntry(index, id, {
      profileId: id,
      displayName: profile.displayName ?? id
    });
  }
  return repeatedIndexEntries(index);
}

function duplicateActorNames(profiles) {
  const index = new Map();
  for (const profile of profiles) {
    for (const actorName of profile.actorNames ?? []) {
      const normalized = normalizeText(actorName);
      if (!normalized) continue;
      addIndexedEntry(index, normalized, {
        profileId: profile.id,
        displayName: profile.displayName,
        actorName
      });
    }
  }
  return repeatedIndexEntries(index, true);
}

function duplicateEffectIds(profiles) {
  const duplicates = [];
  for (const profile of profiles) {
    const index = new Map();
    for (const effect of profile.effects ?? []) {
      const id = String(effect.id ?? "").trim();
      if (!id) continue;
      addIndexedEntry(index, id, {
        profileId: profile.id,
        displayName: profile.displayName,
        effectId: id,
        label: effect.label
      });
    }
    duplicates.push(...repeatedIndexEntries(index));
  }
  return duplicates;
}

function duplicateItemIds(profiles) {
  const index = new Map();
  for (const profile of profiles) {
    for (const effect of profile.effects ?? []) {
      for (const itemId of effect.itemIds ?? []) {
        const id = String(itemId ?? "").trim();
        if (!id) continue;
        addIndexedEntry(index, id, {
          profileId: profile.id,
          displayName: profile.displayName,
          effectId: effect.id,
          label: effect.label,
          sequence: effect.sequence,
          shared: isFoodOrPotionReusableEffect(effect)
        });
      }
    }
  }
  return repeatedIndexEntries(index).filter((entry) => !entry.entries.every((item) => item.shared));
}

function sequenceOwnershipMismatches(profiles) {
  const issues = [];
  for (const profile of profiles) {
    for (const effect of profile.effects ?? []) {
      const ownerProfileId = sequenceOwnerProfileId(effect.sequence);
      if (!ownerProfileId || ownerProfileId === profile.id || isFoodOrPotionReusableEffect(effect)) continue;
      issues.push({
        profileId: profile.id,
        displayName: profile.displayName,
        effectId: effect.id,
        label: effect.label,
        sequence: effect.sequence,
        ownerProfileId
      });
    }
  }
  return issues;
}

function missingSequencePlayers(profiles) {
  const issues = [];
  for (const profile of profiles) {
    for (const effect of profile.effects ?? []) {
      if (!effect.sequence) continue;
      if (SEQUENCE_PLAYERS[effect.sequence] || shouldUseProfileSignature(profile, effect)) continue;
      issues.push({
        profileId: profile.id,
        displayName: profile.displayName,
        effectId: effect.id,
        label: effect.label,
        sequence: effect.sequence
      });
    }
  }
  return issues;
}

function addIndexedEntry(index, key, entry) {
  if (!index.has(key)) index.set(key, []);
  index.get(key).push(entry);
}

function repeatedIndexEntries(index, acrossProfilesOnly = false) {
  const repeated = [];
  for (const [key, entries] of index.entries()) {
    if (entries.length < 2) continue;
    const profileIds = new Set(entries.map((entry) => entry.profileId).filter(Boolean));
    if (acrossProfilesOnly && profileIds.size < 2) continue;
    repeated.push({ key, entries });
  }
  return repeated;
}

function emitProfileIsolationReport(report) {
  if (!game.user?.isGM) return;
  const warnings = [
    ["角色档案 id 重复", report.duplicateProfileIds],
    ["角色匹配名称跨档案重复", report.duplicateActorNames],
    ["同一档案内 effect id 重复", report.duplicateEffectIds],
    ["物品 id 跨档案重复", report.duplicateItemIds],
    ["序列前缀属于其他角色", report.sequenceOwnershipMismatches],
    ["序列没有可用播放器", report.missingSequencePlayers]
  ].filter(([, entries]) => entries.length);

  if (!warnings.length) {
    debugLog("角色档案隔离检查通过", { profileCount: preparedProfiles.size });
    return;
  }
  for (const [message, entries] of warnings) {
    warnProfileIsolation(message, entries);
  }
}

function warnProfileIsolation(message, detail) {
  console.warn(`${MODULE_TITLE} | 角色档案隔离检查 | ${message}`, detail);
}

function prepareEffect(profile, effect) {
  const category = effect.category ?? inferEffectCategory(effect);
  const durationType = effect.durationType ?? inferEffectDuration(effect, category);
  const templateType = effect.templateType ?? inferEffectTemplateType(effect, category);
  return {
    ...effect,
    category,
    durationType,
    templateType,
    key: `${profile.id}.${effect.id}`,
    normalizedNames: new Set((effect.itemNames ?? []).map(normalizeText)),
    itemIds: new Set(effect.itemIds ?? [])
  };
}

function inferEffectCategory(effect) {
  const sequence = String(effect?.sequence ?? "");
  const sequenceKey = sequenceToDash(sequence);
  const id = normalizeText(`${sequenceKey} ${effect?.id ?? ""} ${effect?.label ?? ""} ${(effect?.itemNames ?? []).join(" ")}`);
  if (effect?.usesMeasuredTemplate || ["burningHands", "daylightScroll"].includes(sequence)) return "template";
  if (/hold|faerie|sleep|laughter|hunter|charm|command|suggestion|invisibility|bind|mark|fear|定身|妖火|睡眠|狂笑|猎手|魅惑|命令|暗示|隐形|束缚|印记/.test(id)) return "condition";
  if (/shield|armor|bulwark|ward|aegis|protect|protection|resistance|barkskin|护盾|护甲|壁垒|防护|保护|抗性|树肤/.test(id)) return "defense";
  if (/heal|healer|healing|restoration|aid|grace|guidance|bless|cure|goodberry|治愈|疗伤|医疗|恢复|复原|援助|回气|神导|祝福|恩泽|神莓/.test(id)) return "healing";
  if (/detect|see|identify|comprehend|intel|ledger|augury|locate|darkvision|starry-form|wild-shape|light|侦测|识破|鉴定|洞察|情报|名册|卜筮|定位|黑暗视觉|星耀形态|荒野形态|光亮/.test(id)) return "aura";
  if (/familiar|servant|summon|companion|beast|animal|魔宠|仆役|召唤|伙伴|野兽|动物/.test(id)) return "summon";
  if (/guiding-bolt|ray|missile|wisp|spray|scorch|witch|acid|fire-bolt|thunder|moonbeam|poison|mind-sliver|projectile|光导|射线|飞弹|星芒|毒气|喷溅|酸液|火焰箭|雷鸣|月华|心灵之楔|冰刃/.test(id)) return "projectile";
  if (/sword|flail|javelin|dart|dagger|staff|weapon|charge|bow|crossbow|arrow|net|trap|whip|mace|hammer|strike|unarmed|martial|monk|巨剑|链枷|标枪|飞镖|匕首|法杖|武器|冲锋|短弓|重弩|轻弩|弩矢|箭矢|捕网|陷阱|鞭|锤|徒手|武艺|武僧|长棍|短剑|长剑/.test(id)) return "weapon";
  if (/spellcasting|savant|skill|resourceful|versatile|alert|passive|expertise|mastery|recovery|施法|学者|技能|熟练|适应|多才|警戒|专精|精通|回想/.test(id)) return "passive";
  if (effect?.requiresTarget) return "projectile";
  return "utility";
}

function inferEffectDuration(effect, category = "") {
  if (effect?.persistent === true) return "persistent";
  const sequence = String(effect?.sequence ?? "");
  const id = normalizeText(`${effect?.id ?? ""} ${effect?.label ?? ""} ${(effect?.itemNames ?? []).join(" ")}`);
  if (/light|shield-of-faith|guidance|detect-magic|faerie-fire|hold-person|dancing-lights|mage-armor|disguise-self|unseen-servant|find-familiar/.test(sequenceToDash(sequence))) {
    return "sustained";
  }
  if (/光亮术|虔诚护盾|神导术|侦测魔法|妖火|定身|舞光术|法师护甲|易容术|隐形仆役|魔宠/.test(id)) return "sustained";
  if (["aura", "condition", "summon"].includes(category)) return "sustained";
  return "instant";
}

function inferEffectTemplateType(effect, category = "") {
  const sequence = String(effect?.sequence ?? "");
  const id = normalizeText(`${effect?.id ?? ""} ${effect?.label ?? ""} ${(effect?.itemNames ?? []).join(" ")}`);
  if (sequence === "burningHands" || /cone|锥|燃烧之手/.test(id)) return "cone";
  if (sequence === "daylightScroll" || /daylight|昼明|光域|光环|aura/.test(id)) return "circle";
  if (category === "aura") return "aura";
  return "";
}

function sequenceToDash(value) {
  return String(value ?? "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function cloneProfileSummary(profile) {
  return {
    id: profile.id,
    displayName: profile.displayName,
    theme: profile.theme,
    concept: profile.concept,
    effectCount: profile.effects.length
  };
}

function cloneEffectSummary(effect) {
  if (!effect) return null;
  return {
    id: effect.id,
    key: effect.key,
    label: effect.label,
    sequence: effect.sequence,
    category: effect.category,
    durationType: effect.durationType,
    templateType: effect.templateType,
    requiresTarget: Boolean(effect.requiresTarget),
    selfTarget: Boolean(effect.selfTarget),
    itemIds: Array.from(effect.itemIds ?? []),
    itemNames: Array.from(effect.itemNames ?? []),
    sourceType: effect.sourceType ?? "",
    rulesReference: effect.rulesReference ? foundry.utils.deepClone(effect.rulesReference) : null,
    universal: effect.universal ? foundry.utils.deepClone(effect.universal) : null
  };
}

function getActorProfile(actor) {
  const profile = findProfileForActor(actor);
  return profile ? cloneProfileSummary(profile) : null;
}

function getActorEffect(actor, item) {
  const resolution = resolveItemEffect(actor, item);
  return {
    profile: resolution.profile ? cloneProfileSummary(resolution.profile) : null,
    effect: resolution.effect ? cloneEffectSummary(resolution.effect) : null,
    customEffect: resolution.customEffect ? cloneEffectSummary(resolution.customEffect) : null,
    universalEffect: resolution.universalEffect ? cloneEffectSummary(resolution.universalEffect) : null,
    mode: resolution.mode,
    source: resolution.source
  };
}

async function handleMidiRollComplete(workflow) {
  if (!canvas?.ready) return;

  const item = workflow?.item ?? workflow?.activity?.item;
  const actor = workflow?.actor ?? item?.actor ?? workflow?.activity?.actor;
  if (!actor || !item) return;
  if (!shouldHandleAutoplay(actor)) return;

  const resolution = resolveItemEffect(actor, item);
  const effect = resolution.effect;
  if (effectUsesMeasuredTemplate(effect)) return;

  const key = eventKey(actor, item, workflow?.activity);
  const duplicateWindow = duplicateWindowForContext(effect, { item, workflow, trigger: "midi" });
  if (duplicateWindow > 0 && isDuplicateEvent(key, duplicateWindow)) return;

  const source = normalizeToken(workflow.token) ?? tokenForActor(actor);
  const targets = workflowTargets(workflow);
  await playItemEffect({ actor, item, source, targets, workflow, trigger: "midi" });
}

async function handleDnd5ePostUseActivity(activity, usageConfig, results) {
  if (!canvas?.ready) return;

  const item = activity?.item;
  const actor = item?.actor ?? activity?.actor;
  if (!actor || !item) return;
  if (!shouldHandleLocalActivity(actor)) return;

  const activityType = String(activity?.type ?? "");
  const midiActive = Boolean(game.modules.get("midi-qol")?.active);
  const resolution = resolveItemEffect(actor, item);
  const effect = resolution.effect;
  const templateAware = effectUsesMeasuredTemplate(effect);
  if (midiActive && !templateAware && !["utility", "cast", "enchant", "summon", "forward"].includes(activityType)) return;

  const key = eventKey(actor, item, activity);
  const duplicateWindow = duplicateWindowForContext(effect, { item, activity, usageConfig, results, trigger: "activity" }, 1800);
  if (duplicateWindow > 0 && isDuplicateEvent(key, duplicateWindow)) return;

  const source = tokenForActor(actor);
  const targets = activityTargets(activity, usageConfig, results);
  await playItemEffect({ actor, item, source, targets, activity, usageConfig, results, trigger: "activity" });
}

async function handleChatMessage(message) {
  if (!setting("fallbackChatHook")) return;
  if (game.modules.get("midi-qol")?.active) return;
  if (!canvas?.ready) return;

  const actor = actorFromSpeaker(message?.speaker);
  if (!actor) return;
  if (!shouldHandleAutoplay(actor)) return;

  const item = itemFromChatMessage(message, actor);
  if (!item) return;

  const key = eventKey(actor, item);
  if (isDuplicateEvent(key, 1800)) return;

  const source = tokenFromSpeaker(message?.speaker) ?? tokenForActor(actor);
  const targets = Array.from(game.user?.targets ?? []).map(normalizeToken).filter(Boolean);
  await playItemEffect({ actor, item, source, targets, message, trigger: "chat" });
}

async function playItemEffect(context = {}) {
  const actor = context.actor ?? context.item?.actor;
  const item = context.item;
  if (!actor || !item) return false;

  const resolution = resolveItemEffect(actor, item, context);
  const { profile, effect, source: effectSource } = resolution;
  if (!effect) {
    debugLog("未找到匹配的电影级特效配置", {
      actor: actor.name,
      item: item.name,
      mode: resolution.mode,
      custom: Boolean(resolution.customEffect),
      universal: Boolean(resolution.universalEffect)
    });
    return false;
  }

  if (!context.skipAutomationGuard && shouldDeferAnimationToAutomation(effect, { ...context, actor, item })) {
    debugLog("自动化模块接管此条目的动画触发", {
      actor: actor.name,
      item: item.name,
      effect: effect.label,
      source: effectSource,
      trigger: context.trigger
    });
    return false;
  }

  if (shouldSkipCprMagicMissileController(effect, { ...context, item })) {
    debugLog("跳过 CPR 魔法飞弹主活动，等待 CPR 按实际飞弹数量触发子活动", {
      actor: actor.name,
      item: item.name,
      activity: activityIdentifier(context.workflow?.activity ?? context.activity)
    });
    return false;
  }

  if (!context.ignoreRules && isEffectConfiguredEnabled(effect, item)) {
    await ensureExternalAnimationsMuted(effect, item);
  }

  if (!context.ignoreRules && !isEffectPlayable(profile, effect, item)) {
    debugLog("特效已停用或被外部动画保护", {
      actor: actor.name,
      item: item.name,
      effect: effect.label,
      source: effectSource,
      guard: externalAnimationGuard(effect, item)
    });
    if (context.manual) notify("warn", effectBlockedMessage(effect, item));
    return false;
  }

  const resolved = resolvePlaybackContext(profile, effect, context);
  if (!resolved) return false;

  const player = resolveSequencePlayer(profile, effect, item);
  if (!player) {
    notify("warn", `没有找到 ${effect.label} 的播放器。`);
    return false;
  }

  if (!ensureReady(context.manual || context.ignoreRules ? "manual" : "auto")) return false;

  try {
    const playbackProfile = effectSource === "universal" ? UNIVERSAL_PROFILE : profile;
    return await player({
      profile: playbackProfile,
      actorProfile: profile,
      effect,
      effectSource,
      effectMode: resolution.mode,
      customEffect: resolution.customEffect,
      universalEffect: resolution.universalEffect,
      ...resolved,
      trigger: context.trigger ?? "manual"
    });
  } catch (error) {
    console.error(`${MODULE_TITLE} | 播放 ${effect.label} 失败`, error);
    notify("error", `${effect.label} 播放失败，详情请查看控制台。`);
    return false;
  }
}

async function playEffectStage(context = {}) {
  return playItemEffect({
    ...context,
    trigger: context.trigger ?? "automation",
    skipAutomationGuard: true
  });
}

function shouldDeferAnimationToAutomation(effect, context = {}) {
  if (context.trigger === "automation" || context.manual || context.ignoreRules) return false;
  const automationApi = game.modules.get(AUTOMATION_MODULE_ID)?.api ?? globalThis.PlayerCustomAutomationEffects;
  if (typeof automationApi?.shouldOwnAnimation !== "function") return false;
  try {
    return Boolean(automationApi.shouldOwnAnimation({ effect, ...context }));
  } catch (error) {
    debugLog("自动化动画接管检测失败", { effect: effect?.label, error });
    return false;
  }
}

async function previewItem(actorId, itemId) {
  const actor = game.actors?.get(actorId);
  const item = actor?.items?.get(itemId);
  if (!actor || !item) {
    notify("warn", "没有找到要预览的角色或条目。");
    return false;
  }

  const resolution = resolveItemEffect(actor, item);
  const effect = resolution.effect;
  if (!effect) {
    notify("warn", "这个条目还没有可播放的电影级特效。");
    return false;
  }

  const source = tokenForActor(actor) ?? selectedSource();
  const targets = resolveManualTargets(effect, source);
  return playItemEffect({ actor, item, source, targets, trigger: "preview", manual: true });
}

function resolvePlaybackContext(profile, effect, context) {
  const source = normalizeToken(context.source) ?? tokenForActor(context.actor) ?? selectedSource();
  if (!source) {
    if (context.force) notify("warn", "请先进入场景，并确保角色有可用 Token。");
    return null;
  }

  const quality = getQualityProfile();
  const initialTargets = (context.targets ?? []).map(normalizeToken).filter(Boolean);
  let targets = uniqueTokens(initialTargets);

  if (!targets.length && effect.selfTarget) targets = [source];
  if (!targets.length && !effect.requiresTarget) targets = [source];

  if (!targets.length && effect.requiresTarget) {
    if (context.force) notify("warn", `${effect.label} 需要至少一个目标 Token。`);
    return null;
  }

  targets = targets.slice(0, quality.targetLimit);
  return {
    actor: context.actor,
    item: context.item,
    source,
    targets,
    templates: measuredTemplatesFromContext(context),
    quality,
    workflow: context.workflow,
    activity: context.activity,
    usageConfig: context.usageConfig,
    results: context.results,
    message: context.message,
    charge: context.charge,
    stage: context.stage,
    damage: context.damage,
    attackRoll: context.attackRoll
  };
}

function resolveManualTargets(effect, source) {
  const targeted = selectedTargets();
  if (targeted.length) return targeted;
  if (effect.selfTarget || !effect.requiresTarget) return source ? [source] : [];
  return [];
}

function resolveItemEffect(actor, item, context = {}) {
  const profile = findProfileForActor(actor);
  const customEffect = profile ? findEffectForItem(profile, item) : null;
  const universalEffect = findUniversalEffectForItem(item);
  const mode = normalizeEffectMode(context.effectMode ?? getItemEffectMode(actor, item));
  let effect = null;
  let source = "";

  if (mode === "custom") {
    effect = customEffect;
    source = effect ? "custom" : "";
  } else if (mode === "universal") {
    effect = universalEffect;
    source = effect ? "universal" : "";
  } else if (mode !== "off") {
    effect = customEffect ?? universalEffect;
    source = customEffect ? "custom" : universalEffect ? "universal" : "";
  }

  return {
    actor,
    item,
    profile,
    customEffect,
    universalEffect,
    effect,
    mode,
    source,
    hasAny: Boolean(customEffect || universalEffect)
  };
}

function findUniversalEffectForItem(item) {
  if (!item) return null;
  const normalizedNames = normalizedItemNames(item);
  return preparedUniversalEffects.find((effect) => universalEffectMatchesItem(effect, item, normalizedNames)) ?? null;
}

function universalEffectMatchesItem(effect, item, normalizedNames) {
  if (effect.universal?.family === "cantrip" && !isCantripItem(item)) return false;
  return effectMatchesNormalizedNames(effect, normalizedNames);
}

function isCantripItem(item) {
  return item?.type === "spell" && Number(item.system?.level ?? 0) === 0;
}

function normalizeEffectMode(value) {
  const mode = String(value ?? "auto");
  return EFFECT_MODE_VALUES.has(mode) ? mode : "auto";
}

function scanActor(actor) {
  if (!actor) return { actor: null, profile: null, rows: [], summary: emptySummary() };
  const profile = findProfileForActor(actor);
  const items = Array.from(actor.items ?? [])
    .filter((item) => ACTIONABLE_TYPES.has(item.type))
    .filter((item) => item.type !== "consumable" || resolveItemEffect(actor, item).hasAny)
    .sort(sortActionableItems);

  const rows = items.map((item) => rowForItem(actor, profile, item));
  return {
    actor,
    profile,
    rows,
    summary: summarizeRows(rows)
  };
}

function rowForItem(actor, profile, item) {
  const resolution = resolveItemEffect(actor, item);
  const effect = resolution.effect;
  const crp = crpStatus(item);
  const autoanimations = autoAnimationStatus(item);
  const configuredEnabled = effect ? isEffectConfiguredEnabled(effect, item) : false;
  const playable = effect ? isEffectPlayable(resolution.profile, effect, item) : false;
  const override = effect ? getEffectOverride(effect.key) : null;
  const guard = effect ? externalAnimationGuard(effect, item) : { guarded: false };
  const statusLabel = resolution.mode === "off"
    ? "已关闭"
    : effect
      ? effectStatusLabel(effect, configuredEnabled, playable, guard)
      : resolution.hasAny ? "需切换" : "未配置";
  const statusClass = resolution.mode === "off"
    ? "disabled"
    : effect
      ? effectStatusClass(effect, configuredEnabled, playable, guard)
      : "not-configured";
  return {
    actorId: actor.id,
    itemId: item.id,
    name: item.name,
    type: item.type,
    level: itemLevel(item),
    activation: item.system?.activation?.type ?? "",
    crp,
    autoanimations,
    effect,
    customEffect: resolution.customEffect,
    universalEffect: resolution.universalEffect,
    effectSource: resolution.source,
    effectMode: resolution.mode,
    hasAnyEffect: resolution.hasAny,
    configured: Boolean(effect),
    configuredEnabled,
    playable,
    enabled: configuredEnabled,
    override,
    guard,
    statusLabel,
    statusClass
  };
}

function sortActionableItems(a, b) {
  const typeOrder = { spell: 0, feat: 1, weapon: 2, consumable: 3 };
  const aType = typeOrder[a.type] ?? 9;
  const bType = typeOrder[b.type] ?? 9;
  if (aType !== bType) return aType - bType;
  const aLevel = Number(itemLevel(a) ?? 0);
  const bLevel = Number(itemLevel(b) ?? 0);
  if (aLevel !== bLevel) return aLevel - bLevel;
  return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
}

function summarizeRows(rows) {
  const configured = rows.filter((row) => row.configured).length;
  const enabled = rows.filter((row) => row.configuredEnabled).length;
  const playable = rows.filter((row) => row.playable).length;
  const sustained = rows.filter((row) => SUSTAINED_DURATION_TYPES.has(row.effect?.durationType)).length;
  const crpAnimation = rows.filter((row) => row.crp.hasAnimation).length;
  const crpAny = rows.filter((row) => row.crp.present).length;
  const aaActive = rows.filter((row) => row.autoanimations.active).length;
  const custom = rows.filter((row) => row.effectSource === "custom").length;
  const universal = rows.filter((row) => row.effectSource === "universal").length;
  const off = rows.filter((row) => row.effectMode === "off").length;
  return {
    total: rows.length,
    configured,
    enabled,
    playable,
    sustained,
    custom,
    universal,
    off,
    crpAny,
    crpAnimation,
    aaActive,
    missing: Math.max(0, rows.length - configured)
  };
}

function emptySummary() {
  return {
    total: 0,
    configured: 0,
    enabled: 0,
    playable: 0,
    sustained: 0,
    custom: 0,
    universal: 0,
    off: 0,
    crpAny: 0,
    crpAnimation: 0,
    aaActive: 0,
    missing: 0
  };
}

function openPanel() {
  if (panelElement) {
    refreshPanel({ rerender: true });
    return panelElement;
  }

  const position = setting("panelPosition") ?? {};
  panelElement = document.createElement("div");
  panelElement.id = PANEL_ID;
  panelElement.className = position.compact ? "pcce-panel is-compact" : "pcce-panel";
  panelElement.style.left = `${Number(position.left) || 124}px`;
  panelElement.style.top = `${Number(position.top) || 128}px`;
  panelElement.innerHTML = renderPanel();
  document.body.append(panelElement);

  bindPanelEvents(panelElement);
  makeDraggable(panelElement);
  startPanelTimer();
  refreshPanel();
  return panelElement;
}

function closePanel() {
  if (panelTimer) window.clearInterval(panelTimer);
  panelTimer = null;
  panelElement?.remove();
  panelElement = null;
}

function togglePanel() {
  return panelElement ? closePanel() : openPanel();
}

function renderPanel() {
  const actor = panelActor();
  const scan = scanActor(actor);
  const position = setting("panelPosition") ?? {};
  const autoPlaySetting = game.user?.isGM ? "autoPlayEnabled" : "clientAutoPlayEnabled";
  const autoPlay = setting(autoPlaySetting);
  const actorOptions = actorSelectOptions(actor?.id);
  const assignmentControl = renderAssignmentControl(actor, scan.profile);
  const automationSections = renderExternalPanelSections(actor, scan, { compact: Boolean(position.compact) });
  const compactClass = position.compact ? " is-compact" : "";
  const macroButton = game.user?.isGM
    ? `<button type="button" data-action="macro" title="创建打开面板宏"><i class="fas fa-scroll"></i></button>`
    : `<button type="button" disabled title="玩家使用场景工具栏打开"><i class="fas fa-scroll"></i></button>`;

  return `
    <header class="pcce-header" data-drag-handle>
      <div class="pcce-title">
        <strong>玩家定制特效库</strong>
        <span>${escapeHTML(scan.profile?.theme ?? "未匹配角色配置")}</span>
      </div>
      <div class="pcce-window-actions">
        <button type="button" data-action="compact" title="折叠/展开"><i class="fas fa-minus"></i></button>
        <button type="button" data-action="close" title="关闭"><i class="fas fa-times"></i></button>
      </div>
    </header>
    <section class="pcce-top${compactClass}">
      <div class="pcce-statusbar">
        ${statusPill("Sequencer", isSequencerReady())}
        ${statusPill("JB2A", hasVisualPacks())}
        ${statusPill("AA", game.modules.get("autoanimations")?.active)}
        ${statusPill("CRP", game.modules.get("chris-premades")?.active)}
      </div>
      <div class="pcce-controls">
        <label>
          <span>角色</span>
          <select data-setting="selectedActorId">${actorOptions}</select>
        </label>
        <span class="pcce-quality-lock" title="本模块固定只播放电影级特效">电影级</span>
        <button type="button" data-action="use-selected" title="使用当前选中 Token"><i class="fas fa-crosshairs"></i></button>
        ${macroButton}
      </div>
      ${assignmentControl}
      <label class="pcce-switch">
        <input type="checkbox" data-setting="${autoPlaySetting}" ${autoPlay ? "checked" : ""}>
        <span>${game.user?.isGM ? "全局自动叠加电影特效" : "本机自动叠加电影特效"}</span>
      </label>
    </section>
    <section class="pcce-summary${compactClass}">
      ${summaryCard("总条目", scan.summary.total)}
      ${summaryCard("定制", scan.summary.custom)}
      ${summaryCard("通用", scan.summary.universal)}
      ${summaryCard("关闭", scan.summary.off)}
      ${summaryCard("可自动", scan.summary.playable)}
      ${summaryCard("AA动画", scan.summary.aaActive)}
      ${summaryCard("CRP动画", scan.summary.crpAnimation)}
    </section>
    ${automationSections}
    <section class="pcce-list${compactClass}">
      ${scan.rows.length ? scan.rows.map(renderRow).join("") : renderEmptyActor()}
    </section>
    <section class="pcce-recent${compactClass}">
      <div class="pcce-section-title">最近触发</div>
      ${recentEvents.length ? recentEvents.map(renderRecent).join("") : "<p>暂无记录</p>"}
    </section>
  `;
}

function renderExternalPanelSections(actor, scan, options = {}) {
  const sections = [];
  try {
    Hooks.callAll("pcce.renderPanelSections", sections, {
      actor,
      scan,
      options,
      panelId: PANEL_ID
    });
  } catch (error) {
    console.warn(`${MODULE_TITLE} | 渲染外部面板区块失败`, error);
  }
  return sections.filter(Boolean).join("");
}

function renderAssignmentControl(actor, profile) {
  if (!actor || !game.user?.isGM) return "";
  const assignedProfileId = getAssignedProfileId(actor);
  const selectedId = assignedProfileId || profile?.id || "";
  const mode = assignedProfileId ? "手动匹配" : "自动匹配";
  return `
    <div class="pcce-profile-match">
      <label>
        <span>角色特效库</span>
        <select data-profile-assignment="${escapeAttribute(actor.id)}">
          ${profileSelectOptions(selectedId, { includeAuto: true, autoSelected: !assignedProfileId })}
        </select>
      </label>
      <span>${escapeHTML(mode)} · ${escapeHTML(profile?.displayName ?? "未匹配")}</span>
    </div>
  `;
}

function renderRow(row) {
  const type = itemTypeLabel(row);
  const crp = row.crp.label;
  const aa = row.autoanimations;
  const effectName = row.effect?.label ?? (row.hasAnyEffect ? "当前模式无特效" : "未配置");
  const notes = row.effect?.notes ?? (row.hasAnyEffect ? "切换模式以启用可用电影级特效。" : "这个条目还没有电影级特效。");
  const previewDisabled = row.effect ? "" : "disabled";
  const toggleDisabled = row.hasAnyEffect ? "" : "disabled";
  const action = rowEffectAction(row);
  const floatingText = row.effect ? effectFloatingText(row.effect, row.effect.floatingText ?? row.effect.label) : "";
  const metadataBadges = row.effect ? renderEffectMetadataBadges(row.effect) : "";
  const sourceBadge = renderEffectSourceBadge(row);
  const modeSelect = row.hasAnyEffect ? renderEffectModeSelect(row) : "";
  const textInput = row.effect ? `
    <label class="pcce-row-text">
      <span>浮字</span>
      <input type="text" value="${escapeAttribute(floatingText)}" data-floating-text="true" data-actor-id="${escapeAttribute(row.actorId)}" data-item-id="${escapeAttribute(row.itemId)}" placeholder="${escapeAttribute(row.effect.floatingText ?? row.effect.label)}">
    </label>
  ` : "";

  return `
    <article class="pcce-row ${row.statusClass}" title="${escapeAttribute(notes)}">
      <div class="pcce-row-main">
        <strong>${escapeHTML(row.name)}</strong>
        <span>${escapeHTML(type)} · ${escapeHTML(effectName)}</span>
      </div>
      <div class="pcce-badges">
        ${sourceBadge}
        ${metadataBadges}
        <span class="pcce-badge crp-${row.crp.level}">${escapeHTML(crp)}</span>
        <span class="pcce-badge aa-${aa.level}" title="${escapeAttribute(aa.hint)}">${escapeHTML(aa.label)}</span>
        <span class="pcce-badge ${row.statusClass}">${escapeHTML(row.statusLabel)}</span>
      </div>
      ${modeSelect}
      <div class="pcce-row-actions">
        <button type="button" data-action="preview" data-actor-id="${escapeAttribute(row.actorId)}" data-item-id="${escapeAttribute(row.itemId)}" ${previewDisabled} title="预览"><i class="fas fa-play"></i></button>
        <button type="button" class="pcce-effect-action pcce-action-${action.kind}" data-action="toggle-effect" data-actor-id="${escapeAttribute(row.actorId)}" data-item-id="${escapeAttribute(row.itemId)}" ${toggleDisabled} title="${escapeAttribute(action.title)}" aria-label="${escapeAttribute(action.title)}">
          <span class="pcce-toggle-text">${escapeHTML(action.label)}</span>
        </button>
      </div>
      ${textInput}
    </article>
  `;
}

function renderEffectSourceBadge(row) {
  if (row.effectMode === "off") return `<span class="pcce-badge pcce-source-off">关闭</span>`;
  if (row.effectSource === "custom") return `<span class="pcce-badge pcce-source-custom">定制</span>`;
  if (row.effectSource === "universal") return `<span class="pcce-badge pcce-source-universal">通用</span>`;
  return "";
}

function renderEffectModeSelect(row) {
  const options = [
    ["auto", "自动", true],
    ["custom", "定制", Boolean(row.customEffect)],
    ["universal", "通用", Boolean(row.universalEffect)],
    ["off", "关闭", true]
  ];
  return `
    <label class="pcce-row-mode">
      <span>模式</span>
      <select data-effect-mode="true" data-actor-id="${escapeAttribute(row.actorId)}" data-item-id="${escapeAttribute(row.itemId)}">
        ${options.map(([value, label, enabled]) => `
          <option value="${value}" ${row.effectMode === value ? "selected" : ""} ${enabled ? "" : "disabled"}>${label}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function renderEffectMetadataBadges(effect) {
  const entries = [
    ["category", EFFECT_CATEGORY_LABELS[effect.category] ?? "未分类"],
    ["duration", EFFECT_DURATION_LABELS[effect.durationType] ?? "瞬发"]
  ];
  if (effect.templateType) entries.push(["template", EFFECT_TEMPLATE_LABELS[effect.templateType] ?? effect.templateType]);
  return entries.map(([kind, label]) => `<span class="pcce-badge pcce-meta-${kind}">${escapeHTML(label)}</span>`).join("");
}

function rowEffectAction(row) {
  if (!row.hasAnyEffect) {
    return { kind: "none", label: "--", title: "这个条目还没有电影级特效。" };
  }
  if (row.effectMode === "off") {
    return { kind: "enable", label: "开", title: "恢复这个条目的电影级特效。" };
  }
  if (!row.effect) {
    return { kind: "none", label: "--", title: "当前模式没有可用特效，请切换模式。" };
  }
  if (!row.configuredEnabled) {
    return { kind: "enable", label: "启", title: "启用这个电影级特效。" };
  }
  if (row.guard?.type === "aa") {
    return { kind: "aa", label: "AA", title: "关闭这个条目的 AA 动画，并使用本特效库。" };
  }
  if (row.guard?.type === "crp") {
    return { kind: "crp", label: "CRP", title: "关闭这个条目的 CRP 动画，并使用本特效库。" };
  }
  return { kind: "disable", label: "关", title: "关闭这个条目的电影级特效。" };
}

function renderRecent(event) {
  return `
    <div class="pcce-recent-line">
      <strong>${escapeHTML(event.effectLabel)}</strong>
      <span>${escapeHTML(event.actorName)} · ${escapeHTML(event.itemName)} · ${escapeHTML(event.triggerLabel)}</span>
    </div>
  `;
}

function renderEmptyActor() {
  return `
    <div class="pcce-empty">
      <strong>没有可显示的角色条目</strong>
      <span>选择一个角色，或在场景中选中对应 Token。</span>
    </div>
  `;
}

function addActorSheetEffectMarkers(app, html) {
  const actor = app?.actor ?? app?.document;
  if (!actor?.items) return;
  const root = html?.[0] ?? html;
  if (!root?.querySelectorAll) return;

  for (const item of actor.items) {
    if (!ACTIONABLE_TYPES.has(item.type)) continue;
    const resolution = resolveItemEffect(actor, item);
    if (!resolution.hasAny) continue;
    const row = root.querySelector(`[data-item-id="${escapeCssIdentifier(item.id)}"]`);
    if (!row || row.querySelector(".pcce-sheet-marker")) continue;
    const marker = document.createElement("span");
    marker.className = `pcce-sheet-marker pcce-sheet-${resolution.source || resolution.mode}`;
    marker.title = actorSheetMarkerTitle(resolution);
    marker.textContent = actorSheetMarkerText(resolution);
    const title = row.querySelector(".name-stacked > .title, .item-name .title, .item-title, h4, .name-stacked, .item-name, .name") ?? row;
    title.append(marker);
  }
}

function scheduleActorSheetEffectMarkers(app, html) {
  if (!isActorSheetApplication(app)) return;
  const current = actorSheetMarkerTimers.get(app);
  if (current) window.clearTimeout(current);
  actorSheetMarkerTimers.set(app, window.setTimeout(() => {
    actorSheetMarkerTimers.delete(app);
    addActorSheetEffectMarkers(app, html);
  }, 0));
}

function isActorSheetApplication(app) {
  const actor = app?.actor ?? app?.document ?? app?.object;
  return actor?.documentName === "Actor" && actor?.items;
}

function actorSheetMarkerText(resolution) {
  if (resolution.mode === "off") return "影:关";
  if (resolution.source === "custom") return "影:定";
  if (resolution.source === "universal") return "影:通";
  return "影";
}

function actorSheetMarkerTitle(resolution) {
  if (resolution.mode === "off") return "本条目电影级特效已关闭";
  if (resolution.source === "custom") return `定制电影级特效：${resolution.effect?.label ?? ""}`;
  if (resolution.source === "universal") return `通用电影级特效：${resolution.effect?.label ?? ""}`;
  return "存在可用电影级特效";
}

function statusPill(label, ok) {
  return `<span class="pcce-pill ${ok ? "is-ok" : "is-bad"}">${label}：${ok ? "就绪" : "未就绪"}</span>`;
}

function summaryCard(label, value) {
  return `
    <div class="pcce-summary-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function bindPanelEvents(element) {
  element.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button || !element.contains(button) || button.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    const action = button.dataset.action;
    if (action === "close") {
      closePanel();
    } else if (action === "compact") {
      const compact = element.classList.toggle("is-compact");
      await savePanelPosition({ compact });
      refreshPanel({ rerender: true });
    } else if (action === "use-selected") {
      await selectControlledActor();
      refreshPanel({ rerender: true });
    } else if (action === "macro") {
      await createOpenPanelMacro();
    } else if (action === "preview") {
      await previewItem(button.dataset.actorId, button.dataset.itemId);
    } else if (action === "toggle-effect") {
      await toggleItemEffect(button.dataset.actorId, button.dataset.itemId);
    }
  });

  element.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("button, input, select, textarea")) return;
    event.stopPropagation();
  }, true);

  element.addEventListener("change", async (event) => {
    const input = event.target;
    if (input?.dataset?.effectMode) {
      await setItemEffectMode(input.dataset.actorId, input.dataset.itemId, input.value);
      refreshPanel({ rerender: true, preserveScroll: true });
      return;
    }

    if (input?.dataset?.floatingText) {
      await setItemFloatingText(input.dataset.actorId, input.dataset.itemId, input.value);
      refreshPanel({ rerender: true, preserveScroll: true });
      return;
    }

    if (input?.dataset?.profileAssignment) {
      await assignProfileToActor(input.dataset.profileAssignment, input.value);
      refreshPanel({ rerender: true, preserveScroll: true });
      return;
    }

    if (!input?.dataset?.setting) return;
    const key = input.dataset.setting;
    const value = input.type === "checkbox" ? input.checked : input.value;
    await game.settings.set(MODULE_ID, key, value);
    refreshPanel({ rerender: true, preserveScroll: true });
  });
}

function makeDraggable(element) {
  let dragging = null;
  element.addEventListener("mousedown", (event) => {
    const handle = event.target.closest("[data-drag-handle]");
    if (!handle || !element.contains(handle)) return;
    if (event.button !== 0 || event.target.closest("button")) return;
    dragging = {
      startX: event.clientX,
      startY: event.clientY,
      left: element.offsetLeft,
      top: element.offsetTop
    };
    document.body.classList.add("pcce-dragging");
    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragging) return;
    const left = clamp(dragging.left + event.clientX - dragging.startX, 8, window.innerWidth - 88);
    const top = clamp(dragging.top + event.clientY - dragging.startY, 8, window.innerHeight - 44);
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  });

  window.addEventListener("mouseup", async () => {
    if (!dragging) return;
    dragging = null;
    document.body.classList.remove("pcce-dragging");
    await savePanelPosition({ left: element.offsetLeft, top: element.offsetTop });
  });
}

function startPanelTimer() {
  if (panelTimer) window.clearInterval(panelTimer);
  panelTimer = window.setInterval(() => refreshPanel(), 1800);
}

function refreshPanel(options = {}) {
  if (!panelElement) return;
  if (!options.rerender) return;

  const list = panelElement.querySelector(".pcce-list");
  const recent = panelElement.querySelector(".pcce-recent");
  const scrollTop = options.preserveScroll ? list?.scrollTop ?? 0 : 0;
  const recentScrollTop = options.preserveScroll ? recent?.scrollTop ?? 0 : 0;

  panelElement.innerHTML = renderPanel();

  if (options.preserveScroll) {
    const nextList = panelElement.querySelector(".pcce-list");
    const nextRecent = panelElement.querySelector(".pcce-recent");
    if (nextList) nextList.scrollTop = scrollTop;
    if (nextRecent) nextRecent.scrollTop = recentScrollTop;
  }
}

async function savePanelPosition(update) {
  const current = setting("panelPosition") ?? {};
  await game.settings.set(MODULE_ID, "panelPosition", { ...current, ...update });
}

async function selectControlledActor() {
  const actor = canvas?.tokens?.controlled?.[0]?.actor;
  if (!actor) {
    notify("warn", "请先在场景中选中一个 Token。");
    return;
  }
  await game.settings.set(MODULE_ID, "selectedActorId", actor.id);
}

async function toggleItemEffect(actorId, itemId) {
  try {
    const actor = game.actors?.get(actorId);
    const item = actor?.items?.get(itemId);
    const resolution = actor && item ? resolveItemEffect(actor, item) : {};
    const effect = resolution.effect;
    if (!actor || !item) {
      notify("warn", "没有找到要修改的角色或条目，请重新选择角色。");
      return false;
    }
    if (!resolution.hasAny) {
      notify("warn", `${item.name} 还没有电影级特效配置，暂时不能启用。`);
      return false;
    }
    if (!canControlActor(actor)) {
      notify("warn", "你没有权限修改这个角色的定制特效。");
      return false;
    }
    if (resolution.mode === "off") {
      await writeItemEffectMode(actor, item, "auto");
      const nextResolution = resolveItemEffect(actor, item, { effectMode: "auto" });
      if (nextResolution.effect) await syncExternalAnimationToggles(item, true, nextResolution.effect);
      notify("info", `${item.name} 已恢复电影级特效。`);
      return true;
    }
    if (!effect) {
      notify("warn", `${item.name} 当前模式没有可用特效，请切换到自动或通用模式。`);
      return false;
    }

    const enabledNow = isEffectConfiguredEnabled(effect, item);
    const guard = externalAnimationGuard(effect, item);
    const next = !enabledNow || Boolean(enabledNow && guard.guarded);
    if (enabledNow && !guard.guarded) {
      await writeItemEffectMode(actor, item, "off");
      await syncExternalAnimationToggles(item, false, effect);
      await endPersistentEffectsForItem(effect, item);
      notify("info", `${item.name} 已关闭本特效库演出。`);
      return true;
    }

    const settingKey = editableOverrideSettingKey();
    const overrides = cloneObject(setting(settingKey) ?? {});
    overrides[effect.key] = {
      ...(overrides[effect.key] ?? {}),
      enabled: next
    };
    await game.settings.set(MODULE_ID, settingKey, overrides);
    await syncExternalAnimationToggles(item, next, effect);
    if (!next) await endPersistentEffectsForItem(effect, item);
    notify("info", `${effect.label} 已${next ? "启用，本条目的 AA/CRP 动画已关闭" : "停用，AA/CRP 动画已恢复"}。`);
    return true;
  } catch (error) {
    console.error(`${MODULE_TITLE} | 修改特效开关失败`, error);
    notify("error", "修改特效开关失败，详情请查看控制台。");
    return false;
  } finally {
    refreshPanel({ rerender: true, preserveScroll: true });
  }
}

async function setItemEffectMode(actorId, itemId, mode) {
  const actor = game.actors?.get(actorId);
  const item = actor?.items?.get(itemId);
  if (!actor || !item) return false;
  if (!canControlActor(actor)) {
    notify("warn", "你没有权限修改这个角色的特效模式。");
    return false;
  }

  const nextMode = normalizeEffectMode(mode);
  const before = resolveItemEffect(actor, item);
  await writeItemEffectMode(actor, item, nextMode);
  const after = resolveItemEffect(actor, item, { effectMode: nextMode });
  if (nextMode === "off") {
    if (before.effect) await endPersistentEffectsForItem(before.effect, item);
    await syncExternalAnimationToggles(item, false, before.effect);
  } else if (after.effect) {
    await syncExternalAnimationToggles(item, true, after.effect);
  }
  notify("info", `${item.name} 已切换为${EFFECT_MODE_LABELS[nextMode]}模式。`);
  return true;
}

async function setItemFloatingText(actorId, itemId, value) {
  const actor = game.actors?.get(actorId);
  const item = actor?.items?.get(itemId);
  const resolution = actor && item ? resolveItemEffect(actor, item) : {};
  const effect = resolution.effect;
  if (!effect) return;
  if (!canControlActor(actor)) {
    notify("warn", "你没有权限修改这个角色的定制浮字。");
    return;
  }

  const settingKey = editableOverrideSettingKey();
  const overrides = cloneObject(setting(settingKey) ?? {});
  const entry = { ...(overrides[effect.key] ?? {}) };
  const text = String(value ?? "").trim();
  if (text) {
    entry.floatingText = text;
    overrides[effect.key] = entry;
  } else {
    delete entry.floatingText;
    if (Object.keys(entry).length) overrides[effect.key] = entry;
    else delete overrides[effect.key];
  }
  await game.settings.set(MODULE_ID, settingKey, overrides);
}

async function assignProfileToActor(actorId, profileId) {
  if (!game.user?.isGM) {
    notify("warn", "只有 GM 可以指定角色特效库。");
    return false;
  }

  const actor = game.actors?.get(actorId);
  if (!actor) {
    notify("warn", "没有找到要指定的角色。");
    return false;
  }

  const id = String(profileId ?? "").trim();
  if (!id) return clearActorProfileAssignment(actorId);
  const profile = preparedProfiles.get(id);
  if (!profile) {
    notify("warn", "没有找到这个角色特效库。");
    return false;
  }

  const assignments = cloneObject(setting("actorProfileAssignments") ?? {});
  assignments[actorAssignmentKey(actor)] = id;
  await game.settings.set(MODULE_ID, "actorProfileAssignments", assignments);
  notify("info", `已将 ${actor.name} 手动匹配到 ${profile.displayName}。`);
  return true;
}

async function clearActorProfileAssignment(actorId) {
  if (!game.user?.isGM) return false;
  const actor = game.actors?.get(actorId);
  if (!actor) return false;

  const assignments = cloneObject(setting("actorProfileAssignments") ?? {});
  delete assignments[actorAssignmentKey(actor)];
  delete assignments[actor.id];
  if (actor.uuid) delete assignments[actor.uuid];
  await game.settings.set(MODULE_ID, "actorProfileAssignments", assignments);
  notify("info", `${actor.name} 已恢复自动匹配特效库。`);
  return true;
}

async function syncExternalAnimationToggles(item, customEnabled, effect = null) {
  if (!item?.update) return;

  const updateData = {};
  const moduleFlagBase = `flags.${MODULE_ID}`;
  const aa = autoAnimationStatus(item);
  const crp = crpStatus(item);

  if (customEnabled) {
    if (game.modules.get("autoanimations")?.active && aa.level !== "disabled" && !effect?.ignoreAaGuard) {
      updateData["flags.autoanimations.killAnim"] = true;
      updateData["flags.autoanimations.isEnabled"] = false;
      updateData[`${moduleFlagBase}.aaDisabledByLibrary`] = true;
    }
    if (crp.hasAnimation && !effect?.ignoreCrpGuard) {
      updateData["flags.chris-premades.config.playAnimation"] = false;
      updateData[`${moduleFlagBase}.crpAnimationDisabledByLibrary`] = true;
    }
  } else {
    if (foundry.utils.getProperty(item, `flags.${MODULE_ID}.aaDisabledByLibrary`)) {
      updateData["flags.autoanimations.killAnim"] = false;
      updateData["flags.autoanimations.isEnabled"] = true;
      updateData[`${moduleFlagBase}.aaDisabledByLibrary`] = false;
    }
    if (foundry.utils.getProperty(item, `flags.${MODULE_ID}.crpAnimationDisabledByLibrary`)) {
      updateData["flags.chris-premades.config.playAnimation"] = true;
      updateData[`${moduleFlagBase}.crpAnimationDisabledByLibrary`] = false;
    }
  }

  if (Object.keys(updateData).length) await item.update(updateData, { render: false });
}

async function ensureExternalAnimationsMuted(effect, item) {
  if (!item?.update || !effect) return;
  const aa = autoAnimationStatus(item);
  const crp = crpStatus(item);
  const shouldMuteAa = game.modules.get("autoanimations")?.active && aa.active && !effect.ignoreAaGuard;
  const shouldMuteCrp = crp.hasAnimation && !effect.ignoreCrpGuard;
  if (!shouldMuteAa && !shouldMuteCrp) return;

  const key = `${item.uuid ?? item.id ?? item.name}|${effect.key}`;
  const now = Date.now();
  if (now - (externalSyncStamps.get(key) ?? 0) < 1200) return;
  externalSyncStamps.set(key, now);

  try {
    await syncExternalAnimationToggles(item, true, effect);
  } catch (error) {
    debugLog("自动关闭外部动画失败", { item: item?.name, effect: effect?.label, error });
  }
}

async function createOpenPanelMacro() {
  if (!game.user?.isGM) {
    notify("warn", "只有 GM 可以创建宏。");
    return null;
  }

  const command = `game.modules.get("${MODULE_ID}")?.api?.openPanel();`;
  const macro = await Macro.create({
    name: "打开玩家定制特效库",
    type: "script",
    img: "icons/magic/light/explosion-star-glow-silhouette.webp",
    command
  });
  macro?.sheet?.render(true);
  notify("info", "已创建宏：打开玩家定制特效库");
  return macro;
}

function panelActor() {
  const controlledActor = canvas?.tokens?.controlled?.[0]?.actor;
  if (controlledActor && canViewActor(controlledActor)) return controlledActor;

  const selectedId = setting("selectedActorId");
  const selectedActor = selectedId ? game.actors?.get(selectedId) : null;
  if (selectedActor && canViewActor(selectedActor)) return selectedActor;

  for (const actor of game.actors ?? []) {
    if (canViewActor(actor) && findProfileForActor(actor)) return actor;
  }
  return Array.from(game.actors ?? []).find((actor) => actor.type === "character" && canViewActor(actor)) ?? null;
}

function actorSelectOptions(currentId) {
  const actors = Array.from(game.actors ?? [])
    .filter((actor) => actor.type === "character")
    .filter(canViewActor)
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "zh-Hans-CN"));

  if (!actors.length) return `<option value="">没有角色</option>`;
  return actors.map((actor) => {
    const profile = findProfileForActor(actor);
    const suffix = profile ? ` · ${profile.theme}` : "";
    return `<option value="${escapeAttribute(actor.id)}" ${actor.id === currentId ? "selected" : ""}>${escapeHTML(actor.name + suffix)}</option>`;
  }).join("");
}

function profileSelectOptions(currentId, options = {}) {
  const entries = [];
  if (options.includeAuto) {
    entries.push(`<option value="" ${options.autoSelected ? "selected" : ""}>自动匹配</option>`);
  }

  for (const profile of preparedProfiles.values()) {
    const selected = !options.autoSelected && profile.id === currentId ? "selected" : "";
    entries.push(`<option value="${escapeAttribute(profile.id)}" ${selected}>${escapeHTML(profile.displayName)} · ${escapeHTML(profile.theme ?? profile.id)}</option>`);
  }
  return entries.join("");
}

function resolveSequencePlayer(profile, effect, item = null) {
  const ownerProfileId = sequenceOwnerProfileId(effect?.sequence);
  if (ownerProfileId && profile?.id && ownerProfileId !== profile.id && !isFoodOrPotionReusableEffect(effect, item)) {
    debugLog("已阻止跨角色序列污染", {
      actorProfile: profile.id,
      sequenceOwner: ownerProfileId,
      sequence: effect?.sequence,
      effect: effect?.label
    });
    return signaturePlayerForProfile(profile);
  }
  if (shouldUseProfileSignature(profile, effect, item)) {
    return signaturePlayerForProfile(profile);
  }
  return SEQUENCE_PLAYERS[effect.sequence];
}

function signaturePlayerForProfile(profile) {
  if (!PROFILE_SIGNATURES[profile?.id]) return null;
  if (profile?.id === LEQUIN_PROFILE.id) return playLequinSignatureEffect;
  if (profile?.id === GRIM_PROFILE.id) return playGrimSignatureEffect;
  if (profile?.id === AISLAN_PROFILE.id) return playAislanSignatureEffect;
  return playProfileSignatureEffect;
}

function sequenceOwnerProfileId(sequence) {
  const value = String(sequence ?? "");
  if (!value) return "";
  const owner = PROFILE_SEQUENCE_OWNERS.find(({ prefix }) => value.startsWith(prefix));
  return owner?.profileId ?? "";
}

function buildSignaturePlayers(prefix, player) {
  return {
    [`${prefix}Utility`]: player,
    [`${prefix}Aura`]: player,
    [`${prefix}Defense`]: player,
    [`${prefix}Condition`]: player,
    [`${prefix}Summon`]: player,
    [`${prefix}Weapon`]: player,
    [`${prefix}Projectile`]: player,
    [`${prefix}Healing`]: player,
    [`${prefix}Passive`]: player
  };
}

function shouldUseProfileSignature(profile, effect, item = null) {
  if (!PROFILE_SIGNATURES[profile?.id]) return false;
  if (isFoodOrPotionReusableEffect(effect, item)) return false;
  if (isProfileOwnedSequence(profile, effect?.sequence)) return false;
  return true;
}

function isProfileOwnedSequence(profile, sequence) {
  const value = String(sequence ?? "");
  if (!value) return false;
  if (profile?.id === FLORENCE_PROFILE.id) return FLORENCE_OWNED_SEQUENCES.has(value);
  const prefixes = PROFILE_SEQUENCE_PREFIXES[profile?.id] ?? [];
  return prefixes.some((prefix) => value.startsWith(prefix));
}

function isFoodOrPotionReusableEffect(effect, item = null) {
  const sequence = String(effect?.sequence ?? "");
  if (!SHARED_CONSUMABLE_SEQUENCES.has(sequence) && sequence !== "healerKit") return false;
  const names = effect?.itemNames ? [...effect.itemNames] : [];
  const haystack = normalizeText(`${item?.name ?? ""} ${item?.type ?? ""} ${names.join(" ")} ${effect?.label ?? ""}`);
  if (!FOOD_OR_POTION_PATTERN.test(haystack)) return false;
  if (sequence === "healerKit" && !/potion|药水|goodberry|神莓/u.test(haystack)) return false;
  return true;
}

const SEQUENCE_PLAYERS = {
  ...SIGNATURE_SEQUENCE_PLAYERS,
  universalCantrip: playUniversalCantrip,
  grimManyHandsUnarmed: playGrimManyHandsUnarmed,
  grimManyHandsDagger: playGrimManyHandsDagger,
  guidingBolt: playGuidingBolt,
  healingWord: playHealingWord,
  radianceOfTheDawn: playRadianceOfTheDawn,
  sacredFlame: playSacredFlame,
  light: playLight,
  shieldOfFaith: playShieldOfFaith,
  guidance: playGuidance,
  channelDivinity: playChannelDivinity,
  wardingFlare: playWardingFlare,
  holdPerson: playHoldPerson,
  burningHands: playBurningHands,
  faerieFire: playFaerieFire,
  scorchingRay: playScorchingRay,
  detectMagic: playDetectMagic,
  utilityPulse: playUtilityPulse,
  passiveSigil: playPassiveSigil,
  scrollIntel: playScrollIntel,
  healerKit: playHealerKit,
  holyWater: playHolyWater,
  dartThrow: playDartThrow,
  daylightScroll: playDaylightScroll,
  seeInvisibility: playSeeInvisibility,
  gentleRepose: playGentleRepose,
  poisonUse: playPoisonUse,
  rationUse: playRationUse,
  brewUse: playBrewUse,
  graceArcaneStudy: playGraceArcaneStudy,
  graceLucky: playGraceLucky,
  graceArcaneUtility: playGraceArcaneUtility,
  graceAlert: playGraceAlert,
  graceRayOfFrost: playGraceRayOfFrost,
  graceDancingLights: playGraceDancingLights,
  graceRitualAdept: playGraceRitualAdept,
  graceArcaneRecovery: playGraceArcaneRecovery,
  graceDagger: playGraceDagger,
  graceStaff: playGraceStaff,
  graceAlchemy: playGraceAlchemy,
  xinghaiAcidSplash: playXinghaiAcidSplash,
  xinghaiFireBolt: playXinghaiFireBolt,
  xinghaiWitchBolt: playXinghaiWitchBolt,
  xinghaiMindSliver: playXinghaiMindSliver,
  xinghaiMinorIllusion: playXinghaiMinorIllusion,
  xinghaiMagicMissile: playXinghaiLegacyMagicMissile,
  xinghaiLegacyDancingLights: playXinghaiLegacyDancingLights,
  xinghaiLegacyArcaneUtility: playXinghaiLegacyArcaneUtility,
  xinghaiLegacyRitualAdept: playXinghaiLegacyRitualAdept,
  xinghaiLegacyArcaneRecovery: playXinghaiLegacyArcaneRecovery,
  xinghaiLegacyPrestidigitation: playXinghaiLegacyPrestidigitation,
  xinghaiLegacyShield: playXinghaiLegacyShield,
  xinghaiLegacyFindFamiliar: playXinghaiLegacyFindFamiliar,
  xinghaiLegacyMageArmor: playXinghaiLegacyMageArmor,
  xinghaiLegacyGreatsword: playXinghaiLegacyGreatsword,
  xinghaiLegacyArcaneStudy: playXinghaiLegacyArcaneStudy,
  xinghaiLegacyDetectMagic: playXinghaiLegacyDetectMagic,
  xinghaiLegacyPoisonUse: playXinghaiLegacyPoisonUse,
  xinghaiLegacySleep: playXinghaiLegacySleep,
  xinghaiLegacyComprehendLanguages: playXinghaiLegacyComprehendLanguages,
  xinghaiTideUtility: playProfileSignatureEffect,
  xinghaiTideAura: playProfileSignatureEffect,
  xinghaiTideDefense: playProfileSignatureEffect,
  xinghaiTideSummon: playProfileSignatureEffect,
  xinghaiTideWeapon: playProfileSignatureEffect,
  xinghaiTideCondition: playProfileSignatureEffect,
  xinghaiTidePassive: playProfileSignatureEffect,
  gracePrestidigitation: playGracePrestidigitation,
  graceFindFamiliar: playGraceFindFamiliar,
  graceComprehendLanguages: playGraceComprehendLanguages,
  graceSleep: playGraceSleep,
  graceUnseenServant: playGraceUnseenServant,
  graceMageArmor: playGraceMageArmor,
  graceMagicMissile: playGraceMagicMissile,
  graceBrew: playGraceBrew,
  graceSilveredWeapon: playGraceSilveredWeapon,
  graceTashaLaughter: playGraceTashaLaughter,
  graceDisguiseSelf: playGraceDisguiseSelf,
  graceEvocationSavant: playGraceEvocationSavant,
  gracePotentCantrip: playGracePotentCantrip,
  graceMistyStep: playGraceMistyStep,
  graceIdentify: playGraceIdentify,
  graceMidnightTears: playGraceMidnightTears,
  graceMagicalBerries: playGraceMagicalBerries,
  graceShield: playGraceShield,
  lawrenceBulwark: playLawrenceBulwark,
  lawrenceGrace: playLawrenceGrace,
  lawrenceCharge: playLawrenceCharge,
  lawrenceSecondWind: playLawrenceSecondWind,
  lawrenceHunter: playLawrenceHunter,
  lawrenceGreatsword: playLawrenceGreatsword,
  lawrenceFlail: playLawrenceFlail,
  lawrenceJavelin: playLawrenceJavelin,
  lawrenceActionSurge: playLawrenceActionSurge,
  lawrenceUtility: playLawrenceUtility
};

async function playUniversalCantrip(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const theme = String(effect?.universal?.theme ?? "arcane");
  const motion = String(effect?.universal?.motion ?? (effect?.requiresTarget ? "projectile" : "pulse"));
  const sound = universalCantripSound(theme);
  const cast = universalCantripCast(theme);
  const impact = universalCantripImpact(theme);
  const loop = universalCantripLoop(theme);
  const floating = effect?.universal?.floatingText ?? effect?.label ?? item?.name ?? "通用戏法";

  await cleanupInstantLegacyLoops(effect, item);
  if (shouldPersistEffect(ctx)) {
    await resetPersistentEffects(ctx, uniqueTokens([source, ...targetList].filter(Boolean)), ["universal-loop", "universal-mark"]);
  }

  addSound(seq, sound, { volume: 0.28 });
  addCameraPan(seq, targetList[0] ?? source, quality, { duration: 300, scale: 1.05 });
  addUniversalCantripCast(seq, source, cast, quality, theme);

  if (motion === "melee") {
    seq.effect()
      .file(firstExisting(loop))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
      .fadeOut(240)
      .delay(80);
  }

  if (motion === "burst") {
    seq.effect()
      .file(firstExisting(impact))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 1.02, { considerTokenScale: true, uniform: true })
      .fadeOut(360)
      .delay(180);
  }

  if (effect.requiresTarget) {
    for (const [index, target] of targetList.entries()) {
      const delay = index * Math.min(quality.stagger, 120);
      if (motion === "melee") {
        addTokenAfterimage(seq, source, target, quality, {
          delay: delay + 30,
          fraction: 0.14,
          opacity: 0.24,
          duration: 360
        });
      } else if (motion !== "point-burst") {
        seq.effect()
          .file(firstExisting(universalCantripProjectile(theme)))
          .atLocation(source, { randomOffset: 0.18, gridUnits: true })
          .stretchTo(target, { randomOffset: 0.12, gridUnits: true })
          .aboveLighting()
          .fadeOut(120)
          .delay(delay + 40);
      }

      seq.effect()
        .file(firstExisting(impact))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.56, { considerTokenScale: true, uniform: true })
        .fadeOut(280)
        .delay(delay + 250);

      if (quality.extraLayers) {
        seq.effect()
          .file(firstExisting(loop))
          .atLocation(target)
          .belowTokens()
          .scaleToObject(quality.targetScale * 0.7, { considerTokenScale: true, uniform: true })
          .fadeOut(420)
          .delay(delay + 140);
      }
    }
  } else {
    seq.effect()
      .file(firstExisting(loop))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.94, { considerTokenScale: true, uniform: true })
      .fadeOut(460)
      .delay(140);
  }

  if (shouldPersistEffect(ctx) && loop.length) {
    const focus = targetList[0] ?? source;
    addPersistentAttachedLoop(seq, ctx, focus, loop, {
      suffix: "universal-loop",
      scale: effect.requiresTarget ? quality.targetScale * 0.56 : quality.casterScale * 0.52,
      opacity: 0.54,
      delay: 900,
      fadeIn: 220,
      previewDuration: 2600,
      pulseDuration: 2200
    });
  }

  addFloatingText(seq, targetList[0] ?? source, effectFloatingText(effect, floating), 300);
  return playAndRecord(seq, ctx, effect.label);
}

function universalCantripCast(theme) {
  const map = {
    acid: ASSETS.xinghaiAcidCast,
    air: ASSETS.lightFlare,
    arcane: ASSETS.arcaneWispLoop,
    cold: ASSETS.graceRayOfFrost,
    divination: ASSETS.runeDivination,
    earth: ASSETS.auraStoneLoop,
    elemental: ASSETS.runeTransmutation,
    enchantment: ASSETS.graceStars,
    fire: ASSETS.xinghaiFireCast,
    force: ASSETS.xinghaiStarCast,
    healing: ASSETS.healingBurst,
    illusion: ASSETS.xinghaiIllusion,
    light: ASSETS.lightOrb,
    lightning: ASSETS.xinghaiWitchCast,
    necrotic: ASSETS.runeNecromancy,
    nature: ASSETS.auraStoneLoop,
    psychic: ASSETS.xinghaiMindProjectile,
    radiant: ASSETS.lightFlare,
    thunder: ASSETS.thunderwave,
    transmutation: ASSETS.runeTransmutation,
    ward: ASSETS.shieldLoopArcane,
    water: ASSETS.xinghaiWaterCast,
    poison: ASSETS.poisonSplash
  };
  return map[theme] ?? ASSETS.arcaneWispLoop;
}

function universalCantripProjectile(theme) {
  const map = {
    acid: ASSETS.xinghaiAcidProjectile,
    air: ASSETS.lightOrb,
    arcane: ASSETS.graceMagicMissile,
    cold: ASSETS.graceRayOfFrost,
    divination: ASSETS.graceMagicMissile,
    earth: ASSETS.holyCone,
    elemental: ASSETS.graceMagicMissile,
    enchantment: ASSETS.graceStars,
    fire: ASSETS.xinghaiFireBolt,
    force: ASSETS.xinghaiStarProjectile,
    healing: ASSETS.healingBurst,
    illusion: ASSETS.xinghaiMindProjectile,
    light: ASSETS.lightOrb,
    lightning: ASSETS.xinghaiWitchBolt,
    necrotic: ASSETS.poisonProjectile,
    nature: ASSETS.poisonProjectile,
    psychic: ASSETS.xinghaiMindProjectile,
    radiant: ASSETS.holyLightImpact,
    thunder: ASSETS.thunderwave,
    transmutation: ASSETS.xinghaiWaterImpact,
    ward: ASSETS.holyLightImpact,
    water: ASSETS.xinghaiWaterProjectile ?? ASSETS.xinghaiWaterImpact,
    poison: ASSETS.poisonProjectile
  };
  return map[theme] ?? ASSETS.graceMagicMissile;
}

function universalCantripImpact(theme) {
  const map = {
    acid: ASSETS.xinghaiAcidImpact,
    air: ASSETS.lightOrb,
    arcane: ASSETS.graceStars,
    cold: ASSETS.graceFrostImpact,
    divination: ASSETS.runeDivination,
    earth: ASSETS.auraStoneLoop,
    elemental: ASSETS.runeTransmutation,
    enchantment: ASSETS.graceStars,
    fire: ASSETS.xinghaiFireImpact,
    force: ASSETS.xinghaiStarImpact,
    healing: ASSETS.healingBurst,
    illusion: ASSETS.xinghaiIllusion,
    light: ASSETS.lightOrb,
    lightning: ASSETS.xinghaiLightningImpact,
    necrotic: ASSETS.runeNecromancy,
    nature: ASSETS.poisonSplash,
    psychic: ASSETS.xinghaiPsychicImpact,
    radiant: ASSETS.holyLightImpact,
    thunder: ASSETS.thunderwave,
    transmutation: ASSETS.xinghaiWaterImpact,
    ward: ASSETS.shieldLoopArcane,
    water: ASSETS.xinghaiWaterImpact,
    poison: ASSETS.poisonSplash
  };
  return map[theme] ?? ASSETS.graceStars;
}

function universalCantripLoop(theme) {
  const map = {
    acid: ASSETS.xinghaiWaterLoop,
    air: ASSETS.lightOrbLoop,
    arcane: ASSETS.arcaneWispLoop,
    cold: ASSETS.graceSleepCloud,
    divination: ASSETS.detectMagicLoop,
    earth: ASSETS.auraStoneLoop,
    elemental: ASSETS.runeTransmutation,
    enchantment: ASSETS.graceStars,
    fire: ASSETS.xinghaiFireImpact,
    force: ASSETS.xinghaiStarLoop,
    healing: ASSETS.healingLoop,
    illusion: ASSETS.xinghaiIllusion,
    light: ASSETS.lightOrbLoop,
    lightning: ASSETS.shieldLoopArcane,
    necrotic: ASSETS.runeNecromancy,
    nature: ASSETS.auraStoneLoop,
    psychic: ASSETS.xinghaiPsychicImpact,
    radiant: ASSETS.auraRadiantLoop,
    thunder: ASSETS.thunderwave,
    transmutation: ASSETS.xinghaiWaterLoop,
    ward: ASSETS.shieldLoopRadiant,
    water: ASSETS.xinghaiWaterLoop,
    poison: ASSETS.poisonSplash
  };
  return map[theme] ?? ASSETS.arcaneWispLoop;
}

function universalCantripSound(theme) {
  const map = {
    acid: ASSETS.sounds.acid ?? ASSETS.sounds.cast,
    fire: ASSETS.sounds.fire ?? ASSETS.sounds.cast,
    cold: ASSETS.sounds.frost,
    light: ASSETS.sounds.divineCaster,
    lightning: ASSETS.sounds.lightning ?? ASSETS.sounds.witchBolt,
    necrotic: ASSETS.sounds.necrotic ?? ASSETS.sounds.mind,
    poison: ASSETS.sounds.poison ?? ASSETS.sounds.acid ?? ASSETS.sounds.cast,
    psychic: ASSETS.sounds.psychic ?? ASSETS.sounds.mind,
    radiant: ASSETS.sounds.radiantExplosion,
    thunder: ASSETS.sounds.thunder ?? ASSETS.sounds.chargeImpact ?? ASSETS.sounds.cast,
    ward: ASSETS.sounds.cast,
    water: ASSETS.sounds.cast,
    arcane: ASSETS.sounds.cast
  };
  return map[theme] ?? ASSETS.sounds.cast;
}

function addUniversalCantripCast(seq, source, files, quality, theme) {
  const castFiles = Array.isArray(files) ? files : [files];
  seq.effect()
    .file(firstExisting(castFiles))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(320);

  if (theme === "radiant" || theme === "ward" || theme === "healing") {
    seq.effect()
      .file(firstExisting(ASSETS.lightOrb))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.52, { considerTokenScale: true, uniform: true })
      .fadeOut(260)
      .delay(80);
  }
}

async function playProfileSignatureEffect(ctx) {
  const signature = PROFILE_SIGNATURES[ctx.profile?.id];
  if (!signature) return false;

  const seq = makeSequence();
  const { source, targets, templates, quality, effect, item } = ctx;
  const category = effect.category ?? "utility";
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = signatureFocus(category, source, targetList, templates);

  await cleanupInstantLegacyLoops(effect, item);
  if (shouldPersistEffect(ctx)) {
    await resetPersistentEffects(ctx, uniqueTokens([source, ...targetList, focus].filter(Boolean)), [
      "signature-loop",
      "signature-mark",
      "signature-aura"
    ]);
  }

  addSound(seq, signature.sound ?? ASSETS.sounds.cast, {
    volume: category === "weapon" ? 0.42 : category === "healing" ? 0.34 : 0.28
  });
  addCameraPan(seq, focus ?? source, quality, { duration: 360, scale: 1.08 });
  addSignatureCast(seq, source, signature, quality, { category });

  if (category === "weapon") {
    addSignatureWeapon(seq, ctx, signature, targetList[0] ?? source);
  } else if (category === "projectile") {
    addSignatureProjectiles(seq, ctx, signature, targetList);
  } else if (category === "healing") {
    addSignatureAura(seq, ctx, signature, targetList, "healing", "signature-aura", 0.72);
  } else if (category === "defense") {
    addSignatureAura(seq, ctx, signature, targetList, "defense", "signature-aura", 0.82);
  } else if (category === "condition") {
    addSignatureAura(seq, ctx, signature, targetList, "condition", "signature-mark", 0.78);
  } else if (category === "summon") {
    addSignatureAura(seq, ctx, signature, targetList.length ? targetList : [source], "summon", "signature-loop", 0.88);
  } else {
    addSignatureUtility(seq, ctx, signature, focus ?? source);
  }

  addFloatingText(seq, focus ?? source, effectFloatingText(effect, signatureFloatingText(signature, effect)), 560);
  return playAndRecord(seq, ctx, effect.label);
}

function aislanSpellKind(text) {
  if (/shortsword|短剑/.test(text)) return "shortsword";
  if (/lightcrossbow|crossbow|bolts|弩矢|轻弩/.test(text)) return "crossbow";
  if (/mindsliver|心灵之楔/.test(text)) return "mindSliver";
  if (/firebolt|火焰箭/.test(text)) return "fireBolt";
  if (/scatterspray|碎物散射/.test(text)) return "scatterspray";
  if (/healingword|治愈真言/.test(text)) return "healingWord";
  if (/curewounds|疗伤术/.test(text)) return "cureWounds";
  if (/shieldoffaith|虔诚护盾/.test(text)) return "shieldOfFaith";
  if (/magearmor|法师护甲/.test(text)) return "mageArmor";
  if (/bless|祝福术|祝福/.test(text)) return "bless";
  if (/feyancestry|feyresistance|精类血统|精类抗性/.test(text)) return "feyDefense";
  if (/shield|护盾术/.test(text)) return "shield";
  if (/findfamiliar|寻获魔宠/.test(text)) return "findFamiliar";
  if (/spiritofthewild|荒野精魄/.test(text)) return "spiritOfTheWild";
  if (/minorillusion|次级幻象/.test(text)) return "minorIllusion";
  if (/feycharm|精类魅惑/.test(text)) return "feyCharm";
  if (/tasha|hideouslaughter|塔莎|狂笑/.test(text)) return "tasha";
  if (/command|命令术|approach|drop|flee|grovel|halt|过来|放下|走开|趴下|立定/.test(text)) return "command";
  if (/faeriewings|妖精之翼/.test(text)) return "faerieWings";
  if (/guidance|神导术/.test(text)) return "guidance";
  if (/message|传讯术/.test(text)) return "message";
  if (/communalbinding|bondedcasting|communalchanneling|集群纽带|联结施法|集群导能/.test(text)) return "covenBond";
  if (/spellcasting|magicinitiate|女巫施法|魔法学徒/.test(text)) return "spellcraft";
  return "";
}

function aislanEffectiveCategory(text, fallback) {
  const kind = aislanSpellKind(text);
  if (kind === "shortsword") return "weapon";
  if (["crossbow", "mindSliver", "fireBolt", "scatterspray"].includes(kind)) return "projectile";
  if (["healingWord", "cureWounds"].includes(kind)) return "healing";
  if (["shieldOfFaith", "mageArmor", "shield", "bless", "feyDefense"].includes(kind)) return "defense";
  if (["findFamiliar", "spiritOfTheWild", "minorIllusion"].includes(kind)) return "summon";
  if (["feyCharm", "command", "tasha"].includes(kind)) return "condition";
  if (["faerieWings", "guidance"].includes(kind)) return "aura";
  if (["message", "covenBond", "spellcraft"].includes(kind)) return "utility";
  if (/torch|火把/.test(text)) return "aura";
  return fallback;
}

function aislanVariantSignature(signature, text) {
  const kind = aislanSpellKind(text);

  if (kind === "mindSliver") {
    return {
      ...signature,
      cast: [
        "jb2a.magic_signs.circle.02.illusion.intro.purple",
        ...signature.cast
      ],
      projectile: [
        "modules/jb2a_patreon/Library/Generic/RangedSpell/02/RangedProjectile02_01_Regular_Purple_60ft_2800x400.webm",
        "jb2a.magic_missile.purple.60ft",
        ...signature.projectile
      ],
      impact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Psychic_Impact_1_1200x1200.webm",
        "jb2a.particle_burst.01.star.bluepurple",
        ...signature.impact
      ],
      ring: [
        ...ASSETS.enchantmentCircle,
        ...signature.ring
      ],
      condition: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Psychic_Impact_1_1200x1200.webm",
        ...signature.ring
      ],
      sound: ASSETS.sounds.mind
    };
  }

  if (kind === "fireBolt") {
    return {
      ...signature,
      cast: [
        "modules/blfx-assets-pack01/artwork/05-spell/homebrew/cast/Spell_Cast_2_Fire_1_ORANGE_1200x1200.webm",
        ...signature.cast
      ],
      projectile: [
        "modules/jb2a_patreon/Library/Cantrip/Fire_Bolt/FireBolt_01_Regular_Orange_60ft_2800x400.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/range/throw/Throw_Flame_1_RANGE_COLOR_1_60ft_2800x400.webm",
        "modules/jaamod/AnimatedArt/SequencerFXMaster/fireBolt.webm"
      ],
      impact: [
        "modules/jaamod/AnimatedArt/SequencerFXMaster/fireImpact.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Fire_Impact_1_1200x1200.webm"
      ],
      ring: [
        ...ASSETS.lightFlare,
        ...signature.ring
      ],
      sound: ASSETS.sounds.fireBolt
    };
  }

  if (kind === "scatterspray") {
    return {
      ...signature,
      cast: [
        ...ASSETS.particlesOutward,
        ...signature.cast
      ],
      projectile: [
        ...ASSETS.dart,
        ...signature.projectile
      ],
      impact: [
        ...ASSETS.lawrenceStoneImpact,
        ...ASSETS.particlesOutward,
        ...signature.impact
      ],
      ring: [
        ...ASSETS.faerieFire,
        ...signature.ring
      ]
    };
  }

  if (kind === "crossbow") {
    return {
      ...signature,
      cast: [
        "modules/blfx-assets-pack01/artwork/01-weapon/crossbow/Crossbow_1_GLOW_COLOR_4_1200x1200.webm",
        "modules/blfx-assets-pack01/artwork/01-weapon/crossbow/Crossbow_1_COLOR_1_1200x1200.webm"
      ],
      projectile: [
        "modules/blfx-assets-pack01/artwork/01-weapon/bolt/Bolt_1_Simple_Trail_COLOR_1_60ft_2800x400.webm",
        "modules/blfx-assets-pack01/artwork/01-weapon/bolt/Bolt_1_Simple_COLOR_1_60ft_2800x400.webm"
      ],
      impact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Impact_Hit_1_Light_Blast_1_COLOR_1_1200x1200.webm",
        ...ASSETS.particlesOutward
      ],
      ring: [
        ...ASSETS.faerieFire,
        ...signature.ring
      ],
      sound: [
        "modules/blfx-assets-pack01/sounds/pack1/blfx_crossbow_releasing_arrow_1.ogg",
        "modules/blfx-assets-pack01/sounds/pack1/blfx_crossbow_releasing_arrow_2.ogg"
      ]
    };
  }

  if (kind === "healingWord") {
    return {
      ...signature,
      cast: [
        ...ASSETS.lightOrb,
        ...ASSETS.graceStars,
        ...signature.cast
      ],
      impact: [
        ...ASSETS.lightOrb,
        ...signature.healing,
        ...ASSETS.healingBurst
      ],
      healing: [
        ...ASSETS.lightOrb,
        ...signature.healing,
        ...ASSETS.healingBurst
      ],
      loop: [
        ...ASSETS.lightOrbLoop,
        ...signature.loop
      ],
      sound: ASSETS.sounds.cast
    };
  }

  if (kind === "cureWounds") {
    return {
      ...signature,
      cast: [
        ...ASSETS.healingLoop,
        ...signature.healing,
        ...signature.cast
      ],
      impact: [
        ...ASSETS.healingBurst,
        ...signature.healing,
        ...ASSETS.healingLoop
      ],
      healing: [
        ...signature.healing,
        ...ASSETS.healingLoop,
        ...ASSETS.healingBurst
      ],
      loop: [
        ...ASSETS.healingLoop,
        ...signature.loop
      ],
      sound: ASSETS.sounds.cast
    };
  }

  if (kind === "bless") {
    return {
      ...signature,
      cast: [
        ...ASSETS.blessLoopRadiant,
        ...signature.cast,
        ...ASSETS.lightOrb
      ],
      defense: [
        ...ASSETS.blessLoopRadiant,
        ...ASSETS.tokenMaskRadiant,
        ...ASSETS.lightOrb
      ],
      impact: [
        ...ASSETS.lightOrb,
        ...ASSETS.dawnStars,
        ...ASSETS.healingBurst
      ],
      loop: [
        ...ASSETS.blessLoopRadiant,
        ...ASSETS.lightOrbLoop,
        ...signature.loop
      ],
      sound: ASSETS.sounds.divineCaster
    };
  }

  if (kind === "shieldOfFaith") {
    return {
      ...signature,
      cast: [
        ...ASSETS.shieldLoopRadiant,
        ...signature.cast
      ],
      defense: [
        ...ASSETS.shieldLoopRadiant,
        ...ASSETS.auraRadiantLoop,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.lightFlare,
        ...ASSETS.shieldLoopRadiant,
        ...signature.impact
      ],
      loop: [
        ...ASSETS.shieldLoopRadiant,
        ...ASSETS.auraRadiantLoop
      ],
      sound: ASSETS.sounds.divineCaster
    };
  }

  if (kind === "mageArmor") {
    return {
      ...signature,
      cast: [
        ...ASSETS.graceAbjurationCircle,
        ...ASSETS.graceMageArmor
      ],
      defense: [
        ...ASSETS.graceMageArmor,
        ...ASSETS.shieldLoopArcane
      ],
      impact: [
        ...ASSETS.graceMageArmor,
        ...signature.impact
      ],
      loop: [
        ...ASSETS.graceMageArmor,
        ...ASSETS.shieldLoopArcane
      ],
      sound: ASSETS.sounds.mageArmor
    };
  }

  if (kind === "shield") {
    return {
      ...signature,
      cast: [
        ...ASSETS.graceShield,
        ...ASSETS.shieldLoopArcane
      ],
      defense: [
        ...ASSETS.graceShield,
        ...ASSETS.shieldLoopArcane,
        ...ASSETS.lightFlare
      ],
      impact: [
        ...ASSETS.graceShield,
        ...ASSETS.lightFlare
      ],
      loop: [
        ...ASSETS.shieldLoopArcane,
        ...ASSETS.graceShield
      ],
      sound: ASSETS.sounds.mageArmor
    };
  }

  if (kind === "feyDefense") {
    return {
      ...signature,
      cast: [
        ...signature.cast,
        ...ASSETS.enchantmentCircle
      ],
      defense: [
        ...signature.ring,
        ...ASSETS.faerieFire,
        ...ASSETS.tokenMaskArcane
      ],
      impact: [
        ...signature.impact,
        ...ASSETS.faerieFire
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ]
    };
  }

  if (kind === "findFamiliar") {
    return {
      ...signature,
      cast: [
        ...ASSETS.graceConjurationCircle,
        ...signature.cast
      ],
      summon: [
        ...ASSETS.graceServant,
        ...ASSETS.arcaneWispLoop
      ],
      ring: [
        ...ASSETS.graceConjurationCircle,
        ...signature.ring
      ],
      loop: [
        ...ASSETS.graceServant,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.teleport
    };
  }

  if (kind === "spiritOfTheWild") {
    return {
      ...signature,
      cast: [
        ...ASSETS.faerieFire,
        ...signature.cast
      ],
      summon: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop,
        ...ASSETS.faerieFire
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.auraArcaneLoop
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.teleport
    };
  }

  if (kind === "minorIllusion") {
    return {
      ...signature,
      cast: [
        ...ASSETS.graceIllusionCircle,
        ...signature.cast
      ],
      summon: [
        ...ASSETS.graceDancingLights,
        ...ASSETS.graceIllusionCircle
      ],
      impact: [
        ...ASSETS.graceStars,
        ...signature.impact
      ],
      ring: [
        ...ASSETS.graceIllusionCircle,
        ...signature.ring
      ],
      loop: [
        ...ASSETS.graceDancingLights,
        ...ASSETS.graceIllusionCircle
      ]
    };
  }

  if (kind === "feyCharm") {
    return {
      ...signature,
      cast: [
        ...ASSETS.enchantmentCircle,
        ...signature.cast
      ],
      condition: [
        ...ASSETS.enchantmentCircle,
        ...ASSETS.faerieFire,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.lightOrb,
        ...ASSETS.faerieFire,
        ...signature.impact
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.enchantmentCircle
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.mind
    };
  }

  if (kind === "command") {
    return {
      ...signature,
      cast: [
        ...ASSETS.scrollSigil,
        ...ASSETS.enchantmentCircle
      ],
      condition: [
        ...ASSETS.chainMarker,
        ...ASSETS.enchantmentCircle
      ],
      impact: [
        ...ASSETS.chainMarker,
        ...ASSETS.lightFlare,
        ...signature.impact
      ],
      ring: [
        ...ASSETS.enchantmentCircle,
        ...ASSETS.scrollSigil
      ],
      loop: [
        ...ASSETS.chainMarkerLoop,
        ...signature.loop
      ],
      sound: ASSETS.sounds.mind
    };
  }

  if (kind === "tasha") {
    return {
      ...signature,
      cast: [
        ...ASSETS.enchantmentCircle,
        ...signature.cast
      ],
      condition: [
        ...ASSETS.graceLaughter,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.graceLaughter,
        ...signature.impact
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.enchantmentCircle
      ],
      loop: [
        ...ASSETS.graceLaughter,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.laughter
    };
  }

  if (kind === "guidance") {
    return {
      ...signature,
      cast: [
        ...ASSETS.runeDivination,
        ...ASSETS.lightOrb
      ],
      defense: [
        ...ASSETS.blessLoopRadiant,
        ...ASSETS.runeDivination,
        ...ASSETS.lightOrb
      ],
      impact: [
        ...ASSETS.lightOrb,
        ...ASSETS.dawnStars
      ],
      loop: [
        ...ASSETS.lightOrbLoop,
        ...ASSETS.blessLoopRadiant
      ],
      sound: ASSETS.sounds.divineCaster
    };
  }

  if (kind === "message") {
    return {
      ...signature,
      cast: [
        ...ASSETS.scrollSigil,
        ...ASSETS.runeDivination
      ],
      ring: [
        ...ASSETS.scrollSigil,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.graceArcaneProjectile,
        ...ASSETS.arcaneWispLoop,
        ...signature.impact
      ],
      loop: [
        ...ASSETS.arcaneWispLoop,
        ...ASSETS.graceDancingLights
      ],
      sound: ASSETS.sounds.identify
    };
  }

  if (kind === "covenBond") {
    return {
      ...signature,
      cast: [
        ...signature.cast,
        ...ASSETS.scrollSigil
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.auraArcaneLoop
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop,
        ...ASSETS.auraArcaneLoop
      ],
      impact: [
        ...signature.impact,
        ...ASSETS.graceStars
      ]
    };
  }

  if (kind === "spellcraft") {
    return {
      ...signature,
      cast: [
        ...ASSETS.scrollSigil,
        ...ASSETS.runeDivination,
        ...signature.cast
      ],
      ring: [
        ...ASSETS.runeDivination,
        ...signature.ring
      ],
      loop: [
        ...ASSETS.arcaneWispLoop,
        ...signature.loop
      ],
      impact: [
        ...ASSETS.graceStars,
        ...signature.impact
      ],
      sound: ASSETS.sounds.identify
    };
  }

  if (["healingWord", "cureWounds"].includes(kind) || /heal|治愈|疗伤/.test(text)) {
    return {
      ...signature,
      cast: [
        ...signature.healing,
        ...signature.cast
      ],
      impact: [
        ...signature.healing,
        ...ASSETS.healingBurst
      ],
      healing: [
        ...signature.healing,
        ...ASSETS.healingBurst
      ],
      loop: [
        ...ASSETS.healingLoop,
        ...signature.loop,
      ],
      sound: ASSETS.sounds.cast
    };
  }

  if (["shieldOfFaith", "mageArmor", "shield", "bless", "feyDefense"].includes(kind) || /护盾|法师护甲|祝福|血统|抗性/.test(text)) {
    return {
      ...signature,
      cast: [
        ...signature.cast,
        ...ASSETS.shieldLoopArcane
      ],
      defense: [
        ...signature.ring,
        ...ASSETS.shieldLoopArcane,
        ...ASSETS.lightBloom
      ],
      impact: [
        ...signature.impact,
        ...ASSETS.lightBloom
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.shieldLoopArcane,
        ...ASSETS.auraRadiantLoop
      ]
    };
  }

  if (["findFamiliar", "spiritOfTheWild", "minorIllusion"].includes(kind) || /familiar|荒野精魄|寻获魔宠/.test(text)) {
    return {
      ...signature,
      cast: [
        ...signature.cast,
        ...ASSETS.faerieFire
      ],
      summon: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.auraArcaneLoop
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.teleport
    };
  }

  if (["feyCharm", "command", "tasha"].includes(kind) || /魅惑|命令|狂笑/.test(text)) {
    return {
      ...signature,
      cast: [
        ...ASSETS.enchantmentCircle,
        ...signature.cast
      ],
      condition: [
        ...ASSETS.graceLaughter,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.graceLaughter,
        ...signature.impact
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.enchantmentCircle
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.mind
    };
  }

  if (kind === "minorIllusion" || /illusion|次级幻象/.test(text)) {
    return {
      ...signature,
      cast: [
        ...ASSETS.graceIllusionCircle,
        ...signature.cast
      ],
      condition: [
        ...ASSETS.graceIllusionCircle,
        ...signature.ring
      ],
      impact: [
        ...ASSETS.graceStars,
        ...signature.impact
      ],
      ring: [
        ...ASSETS.graceIllusionCircle,
        ...signature.ring
      ],
      loop: [
        ...ASSETS.graceDancingLights,
        ...signature.loop
      ]
    };
  }

  if (kind === "shortsword") {
    return {
      ...signature,
      weapon: [
        ...signature.weapon,
        "modules/blfx-assets-pack01/artwork/01-weapon/shortsword/Shortsword_3_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
      ],
      projectile: [
        ...signature.projectile,
        "modules/jb2a_patreon/Library/Generic/RangedSpell/ProjectileMusicNote01_01_Regular_GreenYellow_60ft_2800x400.webm"
      ]
    };
  }

  if (["message", "covenBond", "spellcraft", "guidance"].includes(kind) || /女巫|集群|联结|导能|纽带|神导|传讯|施法|魔法学徒/.test(text)) {
    return {
      ...signature,
      cast: [
        ...signature.cast,
        ...ASSETS.scrollSigil
      ],
      ring: [
        ...signature.ring,
        ...ASSETS.auraArcaneLoop
      ],
      loop: [
        ...signature.loop,
        ...ASSETS.arcaneWispLoop
      ],
      impact: [
        ...signature.impact,
        ...ASSETS.graceStars
      ]
    };
  }

  return signature;
}

async function playAislanSignatureEffect(ctx) {
  const signature = PROFILE_SIGNATURES[AISLAN_PROFILE.id];
  if (!signature) return false;

  const seq = makeSequence();
  const { source, targets, templates, quality, effect, item } = ctx;
  const text = effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity);
  const category = aislanEffectiveCategory(text, effect.category ?? "utility");
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = signatureFocus(category, source, targetList, templates);
  const themedSignature = aislanVariantSignature(signature, text);

  await cleanupInstantLegacyLoops(effect, item);
  if (shouldPersistEffect(ctx)) {
    await resetPersistentEffects(ctx, uniqueTokens([source, ...targetList, focus].filter(Boolean)), [
      "signature-loop",
      "signature-mark",
      "signature-aura",
      "aislan-wing-guard",
      "aislan-charm-mark",
      "aislan-coven-loop"
    ]);
  }

  addSound(seq, themedSignature.sound ?? signature.sound, {
    volume: category === "weapon" ? 0.42 : category === "healing" ? 0.34 : 0.28
  });
  addCameraPan(seq, focus ?? source, quality, { duration: 360, scale: 1.08 });
  addSignatureCast(seq, source, themedSignature, quality, { category });

  if (category === "weapon") {
    addSignatureWeapon(seq, ctx, themedSignature, targetList[0] ?? source);
  } else if (category === "projectile") {
    addSignatureProjectiles(seq, ctx, themedSignature, targetList);
  } else if (category === "healing") {
    addSignatureAura(seq, ctx, themedSignature, targetList, "healing", "aislan-coven-loop", 0.72);
  } else if (category === "defense" || category === "aura") {
    addSignatureAura(seq, ctx, themedSignature, targetList.length ? targetList : [focus ?? source], "defense", "aislan-wing-guard", 0.78);
  } else if (category === "condition") {
    addSignatureAura(seq, ctx, themedSignature, targetList, "condition", "aislan-charm-mark", 0.74);
  } else if (category === "summon") {
    addSignatureAura(seq, ctx, themedSignature, targetList.length ? targetList : [source], "summon", "aislan-coven-loop", 0.86);
  } else {
    addSignatureUtility(seq, ctx, themedSignature, focus ?? source);
  }

  addFloatingText(seq, focus ?? source, effectFloatingText(effect, signatureFloatingText(themedSignature, effect)), 560);
  return playAndRecord(seq, ctx, effect.label);
}

function signatureFocus(category, source, targets = [], templates = []) {
  if (category === "template" && templates?.[0]) return templates[0];
  if (["projectile", "weapon", "condition"].includes(category)) return targets[0] ?? source;
  if (["healing", "defense", "summon"].includes(category)) return targets[0] ?? source;
  return source;
}

function addSignatureCast(seq, source, signature, quality, options = {}) {
  const castFile = firstExisting(signature.cast ?? signature.ring);
  if (castFile) {
    seq.effect()
      .file(castFile)
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
      .fadeIn(70)
      .fadeOut(420)
      .duration(options.category === "passive" ? 900 : 1180);
  }

  const ringFile = firstExisting(signature.ring ?? signature.cast);
  if (ringFile && quality.extraLayers) {
    seq.effect()
      .file(ringFile)
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
      .opacity(0.72)
      .fadeIn(90)
      .fadeOut(520)
      .duration(1250)
      .delay(150);
  }
}

function addSignatureProjectiles(seq, ctx, signature, targets = []) {
  const { source, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 120);
    if (target !== source) {
      seq.effect()
        .file(pickExisting(signature.projectile ?? signature.impact, index))
        .atLocation(source, { randomOffset: 0.16, gridUnits: true })
        .stretchTo(target, { randomOffset: 0.12, gridUnits: true })
        .aboveLighting()
        .fadeOut(150)
        .delay(delay + 90);
      addTokenAfterimage(seq, source, target, quality, { delay: delay + 70, fraction: 0.1, opacity: 0.18, duration: 360 });
    }

    addSignatureImpact(seq, target, signature, quality, { delay: delay + 310, scale: 0.72 });
    if (quality.extraLayers) addSignatureGround(seq, target, signature.ring ?? signature.impact, quality, {
      delay: delay + 420,
      scale: 0.64,
      opacity: 0.46,
      duration: 1100
    });
  });

  if (targetList.length > 1) addFloatingText(seq, targetList[0], effectFloatingText(effect, signatureFloatingText(signature, effect)), 740);
}

function addSignatureWeapon(seq, ctx, signature, target) {
  const { source, quality } = ctx;
  addTokenAfterimage(seq, source, target, quality, { delay: 30, fraction: 0.18, opacity: 0.32, duration: 470 });

  const weaponFile = firstExisting(signature.weapon ?? signature.projectile);
  if (weaponFile) {
    const swing = seq.effect()
      .file(weaponFile)
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.92, { considerTokenScale: true, uniform: true })
      .fadeOut(180);
    if (target && target !== source) swing.rotateTowards(target);
  }

  if (target && target !== source) {
    seq.effect()
      .file(firstExisting(signature.projectile ?? signature.weapon))
      .atLocation(source, { randomOffset: 0.08, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.08, gridUnits: true })
      .aboveLighting()
      .fadeOut(150)
      .delay(120);
  }

  addSignatureImpact(seq, target ?? source, signature, quality, { delay: 300, scale: 0.7 });
  addShake(seq, target ?? source, quality, { delay: 320, strength: Math.max(0, quality.shakeStrength - 5), duration: 220 });
}

function addSignatureAura(seq, ctx, signature, targets = [], kind = "ring", suffix = "signature-loop", scale = 0.76) {
  const { source, quality } = ctx;
  const targetList = uniqueTokens((targets.length ? targets : [source]).filter(Boolean));
  const files = signature[kind] ?? signature.ring ?? signature.impact;
  const loopFiles = signature.loop ?? files;

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 110);
    addSignatureGround(seq, target, files, quality, {
      delay: delay + 120,
      scale,
      opacity: kind === "healing" ? 0.74 : 0.58,
      duration: 1500
    });
    addSignatureImpact(seq, target, signature, quality, { delay: delay + 300, scale: kind === "healing" ? 0.62 : 0.5 });

    addPersistentAttachedLoop(seq, ctx, target, loopFiles, {
      suffix,
      below: kind !== "condition",
      scale: quality.targetScale * scale,
      opacity: kind === "defense" ? 0.64 : 0.5,
      delay: delay + 620,
      fadeIn: 260,
      previewDuration: 3100,
      pulseDuration: 2300 + index * 120
    });
  });
}

function addSignatureUtility(seq, ctx, signature, focus) {
  const { quality } = ctx;
  addSignatureGround(seq, focus, signature.ring ?? signature.cast, quality, {
    delay: 160,
    scale: 0.74,
    opacity: 0.54,
    duration: 1300
  });
  addSignatureImpact(seq, focus, signature, quality, { delay: 360, scale: 0.48 });
  addPersistentAttachedLoop(seq, ctx, focus, signature.loop ?? signature.ring, {
    suffix: "signature-loop",
    below: true,
    scale: quality.targetScale * 0.62,
    opacity: 0.44,
    delay: 650,
    fadeIn: 280,
    previewDuration: 3000,
    pulseDuration: 2600
  });
}

function addSignatureImpact(seq, target, signature, quality, options = {}) {
  if (!target) return;
  const file = firstExisting(signature.impact ?? signature.ring);
  if (!file) return;
  seq.effect()
    .file(file)
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * (options.scale ?? 0.66), { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(430)
    .duration(options.duration ?? 980)
    .delay(options.delay ?? 0);
}

function addSignatureGround(seq, target, files, quality, options = {}) {
  if (!target) return;
  const file = firstExisting(files);
  if (!file) return;
  const section = seq.effect()
    .file(file)
    .atLocation(target)
    .scaleToObject(quality.targetScale * (options.scale ?? 0.7), { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(520)
    .duration(options.duration ?? 1300)
    .delay(options.delay ?? 0);
  if (options.below === false) section.aboveLighting();
  else section.belowTokens();
  if (options.opacity) section.opacity(options.opacity);
}

function signatureFloatingText(signature, effect) {
  const shortLabel = String(effect?.label ?? "")
    .replace(/^[^·]{1,8}·/u, "")
    .trim();
  return `${signature.tag}·${shortLabel || "定制演出"}`;
}

function lequinVariantSignature(signature, text) {
  if (/bone shield|骨盾/.test(text)) {
    return {
      ...signature,
      cast: [
        "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
        ...signature.boneShield
      ],
      ring: [
        ...ASSETS.runeNecromancy,
        ...signature.shadowMark
      ],
      loop: [
        ...signature.boneShield,
        "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm"
      ],
      boneShield: [
        "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
        ...signature.boneShield
      ],
      shadowMark: [
        ...ASSETS.runeNecromancy,
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
      ]
    };
  }

  if (/light bearer|光辉掌者|天界抗性|celestial resistance|light|radiant|光辉|天界/.test(text)) {
    return {
      ...signature,
      cast: [
        ...ASSETS.lightFlare,
        ...ASSETS.divineCaster
      ],
      ring: [
        ...ASSETS.lightBloom,
        ...ASSETS.dawnStars
      ],
      loop: [
        ...ASSETS.shieldLoopRadiant,
        ...ASSETS.auraRadiantLoop
      ],
      boneShield: [
        ...ASSETS.shieldLoopRadiant,
        ...ASSETS.lightOrb
      ],
      shadowMark: [
        ...ASSETS.lightOrb,
        ...ASSETS.dawnStars
      ],
      ruinImpact: [
        ...ASSETS.impactRadiant,
        ...ASSETS.lightFlare
      ],
      healing: [
        ...ASSETS.healingBurst,
        ...ASSETS.lightBloom
      ],
      sound: [
        ...ASSETS.sounds.divineCaster,
        ...ASSETS.sounds.radiantExplosion
      ]
    };
  }

  if (/hunter of hunters|猎兽猎手/.test(text)) {
    return {
      ...signature,
      cast: [
        ...ASSETS.insightEye,
        ...ASSETS.detectMagicCircle
      ],
      ring: [
        ...ASSETS.detectMagicCircle,
        ...ASSETS.chainMarker
      ],
      loop: [
        ...ASSETS.detectMagicLoop,
        ...ASSETS.chainMarkerLoop
      ],
      shadowMark: [
        ...ASSETS.insightEye,
        ...ASSETS.detectMagicCircle
      ],
      ruinImpact: [
        ...ASSETS.impactRadiant,
        ...ASSETS.insightEye
      ],
      sound: ASSETS.sounds.detectMagic
    };
  }

  if (/agonizing mark|痛苦印记/.test(text)) {
    return {
      ...signature,
      cast: [
        ...signature.shadowMark,
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
      ],
      ring: [
        ...signature.shadowMark,
        "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_2_LOOP_CIRCLE_RADIUS_COLOR_1_1200x1200.webm"
      ],
      loop: [
        ...signature.shadowMark,
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
      ],
      shadowMark: [
        "modules/jb2a_patreon/Library/TMFX/Runes/Circle/NecromancyOutPulse_01_Circle_Normal_500.webm",
        "modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadSkullSmoke_01_Regular_Grey_400x400.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_1_CIRCLE_RADIUS_COLOR_1_1200x1200.webm"
      ],
      ruinImpact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Necrotic_Impact_1_1200x1200.webm",
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm",
        ...signature.ruinImpact
      ]
    };
  }

  if (/sundering shadow|崩裂深影/.test(text)) {
    return {
      ...signature,
      cast: [
        "modules/blfx-assets-pack01/artwork/05-spell/range/ray/Ray_of_Enfeeblement_1_COLOR_1_RANGE_60ft_2800x400.webm",
        ...signature.shadowMark
      ],
      projectile: [
        "modules/blfx-assets-pack01/artwork/05-spell/range/ray/Ray_of_Enfeeblement_1_COLOR_1_RANGE_60ft_2800x400.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/range/ray/Ray_of_Enfeeblement_1_COLOR_1_RANGE_30ft_1600x400.webm"
      ],
      ruinImpact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Necrotic_Impact_1_1200x1200.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Psychic_Impact_1_1200x1200.webm",
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
      ],
      shadowMark: [
        "modules/blfx-assets-pack01/artwork/05-spell/template/circle/Darkness_2_LOOP_CIRCLE_RADIUS_COLOR_1_1200x1200.webm",
        ...ASSETS.runeNecromancy
      ]
    };
  }

  if (/ruinous touch|毁灭之触/.test(text)) {
    return {
      ...signature,
      cast: [
        "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Touch_1_ATTACK_1_COLOR_1_2400x2400_05ft.webm",
        ...signature.shadowMark
      ],
      projectile: [
        "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Touch_1_ATTACK_1_COLOR_1_2400x2400_05ft.webm",
        "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Claw_1_ATTACK_1_COLOR_2_2400x2400_05ft.webm"
      ],
      ruinImpact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Necrotic_Impact_1_1200x1200.webm",
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm",
        ...signature.ruinImpact
      ],
      shadowMark: [
        ...ASSETS.runeNecromancy,
        "modules/jaamod/AnimatedArt/Smoke/smokeBlackTopDown.webm"
      ]
    };
  }

  return signature;
}

async function playLequinSignatureEffect(ctx) {
  const signature = PROFILE_SIGNATURES[LEQUIN_PROFILE.id];
  const seq = makeSequence();
  const { source, targets, templates, quality, effect, item } = ctx;
  const category = effect.category ?? "utility";
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = signatureFocus(category, source, targetList, templates);
  const themedSignature = lequinVariantSignature(signature, effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity));

  await cleanupInstantLegacyLoops(effect, item);
  if (shouldPersistEffect(ctx)) await resetPersistentEffects(ctx, uniqueTokens([source, ...targetList, focus].filter(Boolean)), [
    "lequin-shadow-mark",
    "lequin-bone-guard",
    "lequin-grave-aura"
  ]);

  addSound(seq, themedSignature.sound, { volume: category === "weapon" ? 0.44 : 0.28 });
  addCameraPan(seq, focus ?? source, quality, { duration: 380, scale: 1.08 });

  if (category === "weapon") addLequinWeapon(seq, ctx, themedSignature, targetList[0] ?? source);
  else if (category === "projectile") addLequinProjectile(seq, ctx, themedSignature, targetList);
  else if (category === "defense") addLequinDefense(seq, ctx, themedSignature, targetList[0] ?? source);
  else if (category === "healing") addLequinHealing(seq, ctx, themedSignature, targetList[0] ?? source);
  else if (category === "condition") addLequinCondition(seq, ctx, themedSignature, targetList[0] ?? source);
  else addLequinUtility(seq, ctx, themedSignature, focus ?? source);

  addFloatingText(seq, focus ?? source, effectFloatingText(effect, signatureFloatingText(themedSignature, effect)), 560);
  return playAndRecord(seq, ctx, effect.label);
}

function addLequinWeapon(seq, ctx, signature, target) {
  const { source, quality } = ctx;
  addTokenAfterimage(seq, source, target, quality, { delay: 25, fraction: 0.2, opacity: 0.3, duration: 500 });

  addSignatureGround(seq, source, signature.shadowMark, quality, { scale: 0.72, opacity: 0.5, duration: 1050 });
  const swing = seq.effect()
    .file(firstExisting(signature.shadowBlade))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.98, { considerTokenScale: true, uniform: true })
    .fadeOut(220)
    .delay(80);
  if (target && target !== source) swing.rotateTowards(target);

  addSignatureImpact(seq, target ?? source, { impact: signature.ruinImpact, ring: signature.shadowMark }, quality, {
    delay: 340,
    scale: 0.72,
    duration: 1150
  });
  addSignatureGround(seq, target ?? source, signature.shadowMark, quality, {
    delay: 460,
    scale: 0.62,
    opacity: 0.5,
    duration: 1500
  });
  addShake(seq, target ?? source, quality, { delay: 360, strength: Math.max(0, quality.shakeStrength - 4), duration: 240 });
}

function addLequinProjectile(seq, ctx, signature, targets = []) {
  const { source, quality } = ctx;
  const targetList = targets.length ? targets : [source];
  addSignatureCast(seq, source, { ...signature, cast: signature.shadowMark, ring: signature.ring }, quality, { category: "projectile" });

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 120);
    if (target !== source) {
      seq.effect()
        .file(pickExisting(signature.projectile, index))
        .atLocation(source, { randomOffset: 0.12, gridUnits: true })
        .stretchTo(target, { randomOffset: 0.08, gridUnits: true })
        .aboveLighting()
        .fadeOut(170)
        .delay(delay + 120);
    }
    addSignatureImpact(seq, target, { impact: signature.ruinImpact, ring: signature.shadowMark }, quality, {
      delay: delay + 360,
      scale: 0.66,
      duration: 1050
    });
    addSignatureGround(seq, target, signature.shadowMark, quality, {
      delay: delay + 470,
      scale: 0.58,
      opacity: 0.42,
      duration: 1350
    });
  });
}

function addLequinDefense(seq, ctx, signature, target) {
  const { source, quality } = ctx;
  addSignatureCast(seq, source, { ...signature, cast: signature.boneShield, ring: signature.shadowMark }, quality, { category: "defense" });
  addSignatureGround(seq, target, signature.shadowMark, quality, { delay: 160, scale: 0.82, opacity: 0.48, duration: 1400 });
  addPersistentAttachedLoop(seq, ctx, target, signature.boneShield, {
    suffix: "lequin-bone-guard",
    scale: quality.targetScale * 0.82,
    opacity: 0.68,
    delay: 580,
    fadeIn: 260,
    previewDuration: 3100,
    pulseDuration: 2400
  });
}

function addLequinHealing(seq, ctx, signature, target) {
  const { quality } = ctx;
  addSignatureGround(seq, target, signature.healing, quality, { delay: 120, scale: 0.72, opacity: 0.72, duration: 1450 });
  addSignatureImpact(seq, target, { impact: signature.healing, ring: signature.shadowMark }, quality, {
    delay: 320,
    scale: 0.6,
    duration: 1050
  });
  addPersistentAttachedLoop(seq, ctx, target, signature.boneShield, {
    suffix: "lequin-grave-aura",
    below: true,
    scale: quality.targetScale * 0.66,
    opacity: 0.42,
    delay: 650,
    fadeIn: 260,
    previewDuration: 2900,
    pulseDuration: 2600
  });
}

function addLequinCondition(seq, ctx, signature, target) {
  const { source, quality } = ctx;
  addSignatureCast(seq, source, { ...signature, cast: signature.shadowMark, ring: signature.ring }, quality, { category: "condition" });
  addSignatureImpact(seq, target, { impact: signature.ruinImpact, ring: signature.shadowMark }, quality, {
    delay: 260,
    scale: 0.62,
    duration: 1100
  });
  addPersistentAttachedLoop(seq, ctx, target, signature.shadowMark, {
    suffix: "lequin-shadow-mark",
    scale: quality.targetScale * 0.58,
    opacity: 0.52,
    delay: 570,
    fadeIn: 240,
    previewDuration: 3000,
    pulseDuration: 2300
  });
}

function addLequinUtility(seq, ctx, signature, focus) {
  const { source, quality, effect } = ctx;
  const text = effectKeywordText(effect, ctx.item, ctx.activity ?? ctx.workflow?.activity);
  const cast = /light|光亮|天界|celestial|radiant|光辉/.test(text)
    ? [...ASSETS.lightFlare, ...ASSETS.lightOrb, ...ASSETS.insightEye]
    : signature.shadowMark;
  addSignatureCast(seq, source, { ...signature, cast, ring: signature.ring }, quality, { category: "utility" });
  addSignatureGround(seq, focus, cast, quality, { delay: 220, scale: 0.62, opacity: 0.46, duration: 1300 });
  if (shouldPersistEffect(ctx)) {
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "lequin-grave-aura",
      below: true,
      scale: quality.targetScale * 0.6,
      opacity: 0.4,
      delay: 620,
      fadeIn: 280,
      previewDuration: 3000,
      pulseDuration: 2600
    });
  } else {
    addSignatureImpact(seq, focus, { impact: signature.ruinImpact, ring: cast }, quality, { delay: 420, scale: 0.42 });
  }
}

function grimVariantSignature(signature, text) {
  if (/quarterstaff|长棍|staff|棍/.test(text)) {
    return {
      ...signature,
      staff: [
        "modules/blfx-assets-pack01/artwork/01-weapon/quarterstaff/Quarterstaff_2_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm",
        "modules/blfx-assets-pack01/artwork/01-weapon/quarterstaff/Quarterstaff_1_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
      ],
      fist: [
        "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Punch_3_ATTACK_2_COLOR_1_2400x2400_05ft.webm",
        "modules/blfx-assets-pack01/artwork/06-ability/strike/unarmed/Unarmed_Strike_Claw_1_ATTACK_1_COLOR_2_2400x2400_05ft.webm"
      ],
      weapon: [
        "modules/blfx-assets-pack01/artwork/01-weapon/quarterstaff/Quarterstaff_2_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm",
        "modules/blfx-assets-pack01/artwork/01-weapon/quarterstaff/Quarterstaff_1_Trail_ATTACK_1_COLOR_1_05ft_2400x2400.webm"
      ],
      impact: [
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Impact_Hit_1_Light_Blast_1_COLOR_1_1200x1200.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Radiant_Impact_1_1200x1200.webm"
      ],
      ring: [
        ...ASSETS.auraArcaneLoop,
        ...ASSETS.chainMarker
      ],
      loop: [
        ...ASSETS.auraArcaneLoop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: [
        "modules/blfx-assets-pack01/sounds/pack6/blfx_melee_quarterstaff_attack_1.ogg",
        "modules/blfx-assets-pack01/sounds/pack6/blfx_melee_quarterstaff_attack_2.ogg"
      ]
    };
  }

  if (/net|trap|捕网|陷阱/.test(text)) {
    return {
      ...signature,
      chainNet: [
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/jaamod/AnimatedArt/Traps/trapNet.webm",
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm"
      ],
      weapon: [
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/jaamod/AnimatedArt/Traps/trapNet.webm"
      ],
      projectile: [
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/jaamod/AnimatedArt/Traps/trapNet.webm"
      ],
      impact: [
        "modules/jaamod/AnimatedArt/Traps/trapNet.webm",
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/blfx-assets-pack01/artwork/05-spell/impact/Damage_Necrotic_Impact_1_1200x1200.webm"
      ],
      ring: [
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/jaamod/AnimatedArt/Misc/chainFigure8.webm"
      ],
      loop: [
        "modules/jaamod/AnimatedArt/Traps/trapNetDark.webm",
        "modules/jaamod/AnimatedArt/Misc/chainFigure8.webm"
      ],
      sound: [
        "modules/blfx-assets-pack01/sounds/pack4/blfx_electric_chain_lightning_1.ogg",
        "modules/blfx-assets-pack01/sounds/pack4/blfx_electric_chain_lightning_2.ogg"
      ]
    };
  }

  if (/第三目|third eye/.test(text)) {
    return {
      ...signature,
      abyssMark: [
        ...ASSETS.insightEye,
        ...ASSETS.detectMagicCircle
      ],
      ring: [
        ...ASSETS.detectMagicCircle,
        ...ASSETS.insightEye
      ],
      loop: [
        ...ASSETS.detectMagicLoop,
        ...ASSETS.insightEye
      ],
      sound: ASSETS.sounds.detectMagic
    };
  }

  if (/多手|polychiral|many hands/.test(text)) {
    return {
      ...signature,
      ring: [
        ...ASSETS.arcaneWispLoop,
        ...ASSETS.chainMarker
      ],
      loop: [
        ...ASSETS.arcaneWispLoop,
        ...ASSETS.chainMarkerLoop
      ],
      impact: [
        ...ASSETS.particlesOutward,
        ...ASSETS.arcaneWispLoop
      ]
    };
  }

  if (/无甲移动|unarmored movement/.test(text)) {
    return {
      ...signature,
      ring: [
        ...ASSETS.auraArcaneLoop,
        ...ASSETS.arcaneWispLoop
      ],
      loop: [
        ...ASSETS.auraArcaneLoop,
        ...ASSETS.arcaneWispLoop
      ],
      sound: ASSETS.sounds.cast
    };
  }

  if (/运转周天|uncanny metabolism/.test(text)) {
    return {
      ...signature,
      healing: [
        ...ASSETS.healingBurst,
        ...ASSETS.healingLoop
      ],
      loop: [
        ...ASSETS.healingLoop,
        ...ASSETS.auraArcaneLoop
      ],
      sound: ASSETS.sounds.cast
    };
  }

  if (/abyssal resilience|深渊抗性|无甲防御/.test(text)) {
    return {
      ...signature,
      abyssMark: [
        ...ASSETS.runeNecromancy,
        ...ASSETS.insightEye
      ],
      ring: [
        ...ASSETS.shieldLoopStone,
        ...ASSETS.chainMarker
      ],
      loop: [
        ...ASSETS.shieldLoopStone,
        ...ASSETS.shieldLoopArcane
      ]
    };
  }

  return signature;
}

async function playGrimSignatureEffect(ctx) {
  const signature = PROFILE_SIGNATURES[GRIM_PROFILE.id];
  const seq = makeSequence();
  const { source, targets, templates, quality, effect, item } = ctx;
  const category = effect.category ?? "utility";
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = signatureFocus(category, source, targetList, templates);
  const text = effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity);
  const focusMode = grimMonkFocusKind(text);
  const themedSignature = focusMode ? grimMonkFocusSignature(grimVariantSignature(signature, text), focusMode) : grimVariantSignature(signature, text);

  await cleanupInstantLegacyLoops(effect, item);
  if (shouldPersistEffect(ctx)) await resetPersistentEffects(ctx, uniqueTokens([source, ...targetList, focus].filter(Boolean)), [
    "grim-chain-bind",
    "grim-many-hands",
    "grim-abyss-eye",
    "grim-quick-step",
    "grim-metabolism",
    "grim-abyss-guard",
    "grim-patient-defense",
    "grim-focus-pulse"
  ]);

  addSound(seq, themedSignature.sound, { volume: category === "weapon" ? 0.48 : 0.3 });
  addCameraPan(seq, focus ?? source, quality, { duration: 340, scale: 1.08 });

  let floatingText = signatureFloatingText(themedSignature, effect);
  if (focusMode) {
    addGrimMonkFocus(seq, ctx, themedSignature, focusMode, targetList, focus ?? source);
    floatingText = grimMonkFocusLabel(focusMode);
  } else if (category === "weapon") addGrimWeapon(seq, ctx, themedSignature, targetList[0] ?? source);
  else if (category === "projectile") addGrimProjectile(seq, ctx, themedSignature, targetList);
  else if (category === "condition" || category === "summon") addGrimBind(seq, ctx, themedSignature, targetList[0] ?? source);
  else if (category === "defense" || category === "aura") addGrimGuard(seq, ctx, themedSignature, focus ?? source);
  else addGrimUtility(seq, ctx, themedSignature, focus ?? source);

  addFloatingText(seq, focus ?? source, effectFloatingText(effect, floatingText), 560);
  return playAndRecord(seq, ctx, effect.label);
}

function grimMonkFocusKind(text) {
  if (/疾风连击|flurryofblows|flurry/.test(text)) return "flurry";
  if (/疾步如风|stepofthewind|windstep|dash/.test(text)) return "step";
  if (/闪转腾挪功力|patientdefensefocus|focuspatientdefense/.test(text)) return "patientFocus";
  if (/闪转腾挪|patientdefense|dodge|disengage/.test(text)) return "patient";
  if (/消耗功力|expendfocus|spendfocus|consumefocus|focuspoint/.test(text)) return "focus";
  return "";
}

function grimMonkFocusLabel(kind) {
  if (kind === "flurry") return "疾风连击";
  if (kind === "step") return "疾步如风";
  if (kind === "patientFocus") return "闪转腾挪·功力";
  if (kind === "patient") return "闪转腾挪";
  if (kind === "focus") return "功力流转";
  return "武僧武功";
}

function grimMonkFocusSignature(signature, kind) {
  if (kind === "flurry") {
    return {
      ...signature,
      cast: [
        ...(signature.manyHandPunch ?? signature.fist ?? []),
        ...(signature.ring ?? [])
      ],
      impact: [
        ...(signature.manyHandClaw ?? []),
        ...(signature.impact ?? [])
      ],
      ring: [
        ...(signature.ring ?? []),
        ...ASSETS.chainMarker
      ],
      sound: signature.manyHandSound ?? signature.sound
    };
  }

  if (kind === "step") {
    return {
      ...signature,
      cast: [
        ...ASSETS.outpulse,
        ...(signature.chainNet ?? [])
      ],
      impact: [
        ...(signature.chainNet ?? []),
        ...ASSETS.particlesOutward
      ],
      ring: [
        ...ASSETS.outpulse,
        ...(signature.ring ?? [])
      ],
      loop: [
        ...ASSETS.auraArcaneLoop,
        ...(signature.loop ?? [])
      ],
      sound: ASSETS.sounds.teleport
    };
  }

  if (kind === "patient" || kind === "patientFocus") {
    return {
      ...signature,
      cast: [
        ...ASSETS.shieldLoopStone,
        ...(signature.abyssMark ?? [])
      ],
      impact: [
        ...(signature.abyssMark ?? []),
        ...ASSETS.shieldLoopStone
      ],
      ring: [
        ...(signature.abyssMark ?? []),
        ...ASSETS.shieldLoopStone
      ],
      loop: [
        ...ASSETS.shieldLoopStone,
        ...(signature.loop ?? [])
      ],
      sound: [
        ...ASSETS.sounds.cast,
        ...(signature.sound ?? [])
      ]
    };
  }

  return {
    ...signature,
    cast: [
      ...(signature.abyssMark ?? []),
      ...(signature.ring ?? [])
    ],
    impact: [
      ...(signature.impact ?? []),
      ...(signature.abyssMark ?? [])
    ],
    loop: [
      ...(signature.loop ?? []),
      ...ASSETS.chainMarkerLoop
    ],
    sound: signature.sound
  };
}

function addGrimMonkFocus(seq, ctx, signature, kind, targets = [], focus) {
  const { source, quality } = ctx;
  const target = targets.find((entry) => entry && entry !== source) ?? focus ?? source;

  if (kind === "flurry") {
    addSignatureGround(seq, source, signature.ring, quality, { scale: 0.68, opacity: 0.52, duration: 1050 });
    if (target && target !== source) {
      addTokenAfterimage(seq, source, target, quality, { delay: 24, fraction: 0.16, opacity: 0.34, duration: 380 });
      addTokenAfterimage(seq, source, target, quality, { delay: 96, fraction: 0.3, opacity: 0.18, duration: 310 });
    }
    [0, 72, 140].forEach((delay, index) => {
      const swing = seq.effect()
        .file(pickExisting(signature.manyHandPunch ?? signature.fist ?? signature.impact, index))
        .atLocation(source, { randomOffset: 0.16, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.casterScale * (0.82 - index * 0.04), { considerTokenScale: true, uniform: true })
        .fadeOut(160)
        .delay(60 + delay);
      if (target && target !== source) swing.rotateTowards(target);
    });
    addSignatureImpact(seq, target ?? source, { impact: signature.impact, ring: signature.abyssMark ?? signature.ring }, quality, {
      delay: 260,
      scale: 0.7,
      duration: 920
    });
    addShake(seq, target ?? source, quality, { delay: 300, strength: Math.max(0, quality.shakeStrength - 5), duration: 210 });
    return;
  }

  if (kind === "step") {
    addSignatureGround(seq, source, signature.ring, quality, { scale: 0.72, opacity: 0.48, duration: 980 });
    seq.effect()
      .file(firstExisting(signature.impact ?? signature.ring))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.86, { considerTokenScale: true, uniform: true })
      .opacity(0.56)
      .fadeOut(260)
      .delay(140);
    addPersistentAttachedLoop(seq, ctx, source, signature.loop, {
      suffix: "grim-quick-step",
      below: true,
      scale: quality.targetScale * 0.52,
      opacity: 0.38,
      delay: 560,
      fadeIn: 220,
      previewDuration: 2800,
      pulseDuration: 1900
    });
    return;
  }

  if (kind === "patient" || kind === "patientFocus") {
    const empowered = kind === "patientFocus";
    addSignatureGround(seq, source, signature.ring, quality, {
      scale: empowered ? 0.78 : 0.68,
      opacity: empowered ? 0.58 : 0.48,
      duration: empowered ? 1380 : 1080
    });
    addSignatureImpact(seq, source, { impact: signature.impact, ring: signature.ring }, quality, {
      delay: empowered ? 300 : 240,
      scale: empowered ? 0.58 : 0.44,
      duration: empowered ? 1100 : 860
    });
    addPersistentAttachedLoop(seq, ctx, source, signature.loop, {
      suffix: "grim-patient-defense",
      below: true,
      scale: quality.targetScale * (empowered ? 0.66 : 0.52),
      opacity: empowered ? 0.52 : 0.42,
      delay: 610,
      fadeIn: 250,
      previewDuration: empowered ? 3300 : 2600,
      pulseDuration: 2200
    });
    return;
  }

  addSignatureGround(seq, source, signature.ring, quality, { scale: 0.66, opacity: 0.48, duration: 1120 });
  addSignatureImpact(seq, source, { impact: signature.impact, ring: signature.abyssMark ?? signature.ring }, quality, {
    delay: 280,
    scale: 0.46,
    duration: 900
  });
  addPersistentAttachedLoop(seq, ctx, source, signature.loop, {
    suffix: "grim-focus-pulse",
    below: true,
    scale: quality.targetScale * 0.5,
    opacity: 0.4,
    delay: 580,
    fadeIn: 240,
    previewDuration: 2600,
    pulseDuration: 2100
  });
}

function addGrimWeapon(seq, ctx, signature, target) {
  const { source, quality, effect, item } = ctx;
  const text = effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity);
  const isWhip = /whip|鞭/.test(text);
  const isNet = /net|trap|chain|捕网|陷阱|链条|滑轮/.test(text);
  const isStaff = /quarterstaff|长棍|staff|棍/.test(text);
  const weaponFiles = isWhip ? signature.whip : isNet ? signature.chainNet : isStaff ? (signature.staff ?? signature.fist) : signature.fist;

  addSignatureGround(seq, source, signature.ring, quality, { scale: 0.68, opacity: 0.46, duration: 1000 });
  addTokenAfterimage(seq, source, target, quality, { delay: 15, fraction: isWhip ? 0.12 : 0.22, opacity: 0.34, duration: 430 });
  if (!isWhip && !isNet && quality.extraLayers) addTokenAfterimage(seq, source, target, quality, { delay: 95, fraction: 0.1, opacity: 0.22, duration: 360 });

  const swing = seq.effect()
    .file(firstExisting(weaponFiles))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * (isWhip ? 0.98 : 0.86), { considerTokenScale: true, uniform: true })
    .fadeOut(200)
    .delay(80);
  if (target && target !== source) swing.rotateTowards(target);

  if (isWhip && target !== source) {
    seq.effect()
      .file(pickExisting(signature.chainNet, isWhip ? 2 : 1))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(180)
      .delay(170);
  } else if (isNet && target !== source) {
    seq.effect()
      .file(pickExisting(signature.chainNet, 0))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(180)
      .delay(170);
  }

  addSignatureImpact(seq, target ?? source, { impact: signature.impact, ring: signature.abyssMark }, quality, {
    delay: isWhip || isNet ? 420 : isStaff ? 300 : 270,
    scale: isWhip ? 0.68 : 0.78,
    duration: 980
  });
  addShake(seq, target ?? source, quality, { delay: 310, strength: Math.max(0, quality.shakeStrength - 5), duration: 210 });
}

async function playGrimManyHandsUnarmed(ctx) {
  const signature = PROFILE_SIGNATURES[GRIM_PROFILE.id];
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = targetList[0] ?? source;
  const themedSignature = grimVariantSignature(signature, effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity));

  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, themedSignature.manyHandSound ?? themedSignature.sound, { volume: 0.48 });
  addCameraPan(seq, focus, quality, { duration: 340, scale: 1.1 });
  addSignatureGround(seq, source, themedSignature.ring, quality, { scale: 0.68, opacity: 0.5, duration: 1080 });
  if (quality.extraLayers) {
    addSignatureGround(seq, source, themedSignature.chainNet ?? themedSignature.ring, quality, {
      delay: 80,
      scale: 0.56,
      opacity: 0.32,
      duration: 960
    });
  }

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 110);
    const strikeDelays = [0, 72, 138, 204];
    const strikeScales = [0.84, 0.8, 0.76, 0.72];

    if (target !== source) {
      addTokenAfterimage(seq, source, target, quality, { delay: delay + 18, fraction: 0.16, opacity: 0.32, duration: 410 });
      if (quality.extraLayers) {
        addTokenAfterimage(seq, source, target, quality, { delay: delay + 82, fraction: 0.28, opacity: 0.18, duration: 320 });
      }
    }

    strikeDelays.forEach((swingDelay, swingIndex) => {
      const swing = seq.effect()
        .file(pickExisting(themedSignature.manyHandPunch ?? themedSignature.fist, index + swingIndex))
        .atLocation(source, { randomOffset: 0.2, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.casterScale * strikeScales[swingIndex], { considerTokenScale: true, uniform: true })
        .fadeOut(170)
        .delay(delay + swingDelay + 50);
      if (target !== source) swing.rotateTowards(target);
      if (target !== source) {
        const claw = seq.effect()
          .file(pickExisting(themedSignature.manyHandClaw ?? themedSignature.impact, index + swingIndex))
          .atLocation(source, { randomOffset: 0.12, gridUnits: true })
          .aboveLighting()
          .opacity(0.6)
          .scaleToObject(quality.casterScale * strikeScales[swingIndex] * 0.88, { considerTokenScale: true, uniform: true })
          .fadeOut(150)
          .delay(delay + swingDelay + 78);
        claw.rotateTowards(target);
      }
    });

    addSignatureGround(seq, target ?? source, themedSignature.abyssMark ?? themedSignature.ring, quality, {
      delay: delay + 150,
      scale: 0.64,
      opacity: 0.5,
      duration: 1080
    });
    seq.effect()
      .file(pickExisting(themedSignature.manyHandClaw ?? themedSignature.impact, index))
      .atLocation(target ?? source, { randomOffset: 0.14, gridUnits: true })
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.66, { considerTokenScale: true, uniform: true })
      .fadeOut(380)
      .delay(delay + 220);

    if (quality.extraLayers) {
      seq.effect()
        .file(pickExisting(themedSignature.manyHandPunch ?? themedSignature.impact, index + 1))
        .atLocation(target ?? source, { randomOffset: 0.18, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.5, { considerTokenScale: true, uniform: true })
        .fadeOut(320)
        .delay(delay + 300);
    }

    addSignatureImpact(seq, target ?? source, {
      impact: themedSignature.manyHandClaw ?? themedSignature.impact,
      ring: themedSignature.abyssMark ?? themedSignature.ring
    }, quality, {
      delay: delay + 250,
      scale: 0.72,
      duration: 940
    });
    addShake(seq, target ?? source, quality, {
      delay: delay + 300,
      strength: Math.max(0, quality.shakeStrength - 5),
      duration: 220
    });
  });

  addFloatingText(seq, focus, effectFloatingText(effect, "多手连击"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGrimManyHandsDagger(ctx) {
  const signature = PROFILE_SIGNATURES[GRIM_PROFILE.id];
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = uniqueTokens((targets?.length ? targets : [source]).filter(Boolean));
  const focus = targetList[0] ?? source;
  const themedSignature = grimVariantSignature(signature, effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity));

  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, themedSignature.daggerSound ?? themedSignature.sound, { volume: 0.46 });
  addCameraPan(seq, focus, quality, { duration: 320, scale: 1.1 });
  addSignatureGround(seq, source, themedSignature.ring, quality, { scale: 0.64, opacity: 0.48, duration: 1020 });
  if (quality.extraLayers) {
    addSignatureGround(seq, source, themedSignature.chainNet ?? themedSignature.ring, quality, {
      delay: 70,
      scale: 0.54,
      opacity: 0.28,
      duration: 900
    });
  }

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 110);
    const swingDelays = [0, 78, 150];
    const swingScales = [0.88, 0.84, 0.8];

    if (target !== source) {
      addTokenAfterimage(seq, source, target, quality, { delay: delay + 16, fraction: 0.14, opacity: 0.3, duration: 400 });
      if (quality.extraLayers) {
        addTokenAfterimage(seq, source, target, quality, { delay: delay + 74, fraction: 0.24, opacity: 0.18, duration: 320 });
      }
    }

    swingDelays.forEach((swingDelay, swingIndex) => {
      const swing = seq.effect()
        .file(pickExisting(themedSignature.manyHandDagger ?? themedSignature.weapon ?? themedSignature.fist, index + swingIndex))
        .atLocation(source, { randomOffset: 0.16, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.casterScale * swingScales[swingIndex], { considerTokenScale: true, uniform: true })
        .fadeOut(160)
        .delay(delay + swingDelay + 48);
      if (target !== source) swing.rotateTowards(target);
      if (target !== source) {
        const offhand = seq.effect()
          .file(pickExisting(themedSignature.manyHandDagger ?? themedSignature.weapon ?? themedSignature.fist, index + swingIndex + 1))
          .atLocation(source, { randomOffset: 0.1, gridUnits: true })
          .aboveLighting()
          .opacity(0.66)
          .scaleToObject(quality.casterScale * swingScales[swingIndex] * 0.88, { considerTokenScale: true, uniform: true })
          .fadeOut(140)
          .delay(delay + swingDelay + 88);
        offhand.rotateTowards(target);
      }
    });

    addSignatureGround(seq, target ?? source, themedSignature.abyssMark ?? themedSignature.ring, quality, {
      delay: delay + 130,
      scale: 0.6,
      opacity: 0.48,
      duration: 980
    });
    seq.effect()
      .file(pickExisting(themedSignature.manyHandKnifeBurst ?? themedSignature.projectile ?? themedSignature.impact, index))
      .atLocation(target ?? source, { randomOffset: 0.12, gridUnits: true })
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.6, { considerTokenScale: true, uniform: true })
      .fadeOut(360)
      .delay(delay + 210);

    if (quality.extraLayers) {
      seq.effect()
        .file(pickExisting(themedSignature.manyHandKnifeBurst ?? themedSignature.projectile ?? themedSignature.impact, index + 1))
        .atLocation(target ?? source, { randomOffset: 0.18, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.46, { considerTokenScale: true, uniform: true })
        .fadeOut(300)
        .delay(delay + 290);
    }

    addSignatureImpact(seq, target ?? source, {
      impact: themedSignature.manyHandKnifeBurst ?? themedSignature.projectile ?? themedSignature.impact,
      ring: themedSignature.abyssMark ?? themedSignature.ring
    }, quality, {
      delay: delay + 240,
      scale: 0.66,
      duration: 900
    });
    addShake(seq, target ?? source, quality, {
      delay: delay + 290,
      strength: Math.max(0, quality.shakeStrength - 5),
      duration: 210
    });
  });

  addFloatingText(seq, focus, effectFloatingText(effect, "多刃齐刺"), 500);
  return playAndRecord(seq, ctx, effect.label);
}

function addGrimProjectile(seq, ctx, signature, targets = []) {
  const { source, quality } = ctx;
  const targetList = targets.length ? targets : [source];
  addSignatureGround(seq, source, signature.ring, quality, { scale: 0.62, opacity: 0.42, duration: 980 });

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 110);
    if (target !== source) {
      seq.effect()
        .file(pickExisting(signature.chainNet, index + 1))
        .atLocation(source, { randomOffset: 0.12, gridUnits: true })
        .stretchTo(target, { randomOffset: 0.08, gridUnits: true })
        .aboveLighting()
        .fadeOut(170)
        .delay(delay + 110);
    }
    addSignatureImpact(seq, target, { impact: signature.impact, ring: signature.abyssMark }, quality, {
      delay: delay + 340,
      scale: 0.68,
      duration: 980
    });
  });
}

function addGrimBind(seq, ctx, signature, target) {
  const { source, quality } = ctx;
  addSignatureGround(seq, source, signature.ring, quality, { scale: 0.64, opacity: 0.45, duration: 1050 });
  addSignatureGround(seq, target, signature.abyssMark, quality, { delay: 210, scale: 0.72, opacity: 0.5, duration: 1250 });
  addPersistentAttachedLoop(seq, ctx, target, signature.loop, {
    suffix: "grim-chain-bind",
    scale: quality.targetScale * 0.72,
    opacity: 0.58,
    delay: 550,
    fadeIn: 250,
    previewDuration: 3000,
    pulseDuration: 2100
  });
}

function addGrimGuard(seq, ctx, signature, focus) {
  const { quality } = ctx;
  addSignatureGround(seq, focus, signature.abyssMark, quality, { delay: 120, scale: 0.72, opacity: 0.5, duration: 1300 });
  addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
    suffix: "grim-abyss-eye",
    below: true,
    scale: quality.targetScale * 0.66,
    opacity: 0.46,
    delay: 580,
    fadeIn: 260,
    previewDuration: 3000,
    pulseDuration: 2300
  });
}

function addGrimUtility(seq, ctx, signature, focus) {
  const { quality, effect, item, source } = ctx;
  const text = effectKeywordText(effect, item, ctx.activity ?? ctx.workflow?.activity);
  if (/third eye|第三目/.test(text)) {
    addSignatureGround(seq, focus, signature.abyssMark, quality, { delay: 120, scale: 0.72, opacity: 0.52, duration: 1300 });
    addSignatureImpact(seq, focus, { impact: signature.abyssMark, ring: signature.ring }, quality, { delay: 320, scale: 0.44, duration: 920 });
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "grim-abyss-eye",
      below: true,
      scale: quality.targetScale * 0.58,
      opacity: 0.46,
      delay: 620,
      fadeIn: 260,
      previewDuration: 3000,
      pulseDuration: 2400
    });
    return;
  }

  if (/多手|polychiral|many hands/.test(text)) {
    addSignatureGround(seq, focus, signature.ring, quality, { delay: 120, scale: 0.68, opacity: 0.5, duration: 1180 });
    addTokenAfterimage(seq, source, focus, quality, { delay: 170, fraction: 0.28, opacity: 0.2, duration: 320 });
    addSignatureImpact(seq, focus, { impact: signature.impact, ring: signature.ring }, quality, { delay: 330, scale: 0.42, duration: 900 });
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "grim-many-hands",
      below: true,
      scale: quality.targetScale * 0.56,
      opacity: 0.42,
      delay: 600,
      fadeIn: 240,
      previewDuration: 2900,
      pulseDuration: 2400
    });
    return;
  }

  if (/无甲移动|unarmored movement/.test(text)) {
    addSignatureGround(seq, focus, signature.ring, quality, { delay: 110, scale: 0.66, opacity: 0.46, duration: 1120 });
    addTokenAfterimage(seq, source, focus, quality, { delay: 160, fraction: 0.34, opacity: 0.16, duration: 260 });
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "grim-quick-step",
      below: true,
      scale: quality.targetScale * 0.5,
      opacity: 0.4,
      delay: 560,
      fadeIn: 220,
      previewDuration: 2800,
      pulseDuration: 2100
    });
    return;
  }

  if (/运转周天|uncanny metabolism/.test(text)) {
    addSignatureGround(seq, focus, signature.healing ?? signature.loop, quality, { delay: 120, scale: 0.7, opacity: 0.54, duration: 1250 });
    addSignatureImpact(seq, focus, { impact: signature.healing ?? signature.loop, ring: signature.ring }, quality, { delay: 320, scale: 0.46, duration: 920 });
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "grim-metabolism",
      below: true,
      scale: quality.targetScale * 0.54,
      opacity: 0.44,
      delay: 590,
      fadeIn: 240,
      previewDuration: 2900,
      pulseDuration: 2300
    });
    return;
  }

  if (/abyssal resilience|深渊抗性|无甲防御/.test(text)) {
    addSignatureGround(seq, focus, signature.abyssMark, quality, { delay: 120, scale: 0.7, opacity: 0.52, duration: 1280 });
    addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
      suffix: "grim-abyss-guard",
      below: true,
      scale: quality.targetScale * 0.62,
      opacity: 0.48,
      delay: 600,
      fadeIn: 250,
      previewDuration: 3000,
      pulseDuration: 2300
    });
    return;
  }

  const files = /chain|rope|trap|滑轮|链条|绳|陷阱/.test(text) ? signature.chainNet : signature.ring;
  addSignatureGround(seq, focus, files, quality, { delay: 120, scale: 0.66, opacity: 0.5, duration: 1200 });
  addSignatureImpact(seq, focus, { impact: files, ring: signature.ring }, quality, { delay: 340, scale: 0.45, duration: 900 });
  if (shouldPersistEffect(ctx)) addPersistentAttachedLoop(seq, ctx, focus, signature.loop, {
    suffix: "grim-many-hands",
    below: true,
    scale: quality.targetScale * 0.58,
    opacity: 0.42,
    delay: 620,
    fadeIn: 260,
    previewDuration: 2900,
    pulseDuration: 2400
  });
}

function activityKeywordText(activity = null) {
  if (!activity) return "";
  const stripMarkup = (value) => String(value ?? "").replace(/<[^>]+>/g, " ");
  return [
    activity.identifier,
    activity.id,
    activity._id,
    activity.name,
    activity.type,
    activity.activation?.type,
    stripMarkup(activity.description?.value),
    stripMarkup(activity.description?.chatFlavor)
  ].filter(Boolean).join(" ");
}

function effectKeywordText(effect, item = null, activity = null) {
  const itemNames = effect?.itemNames ? [...effect.itemNames] : [];
  return normalizeText(`${activityKeywordText(activity)} ${effect?.sequence ?? ""} ${effect?.label ?? ""} ${item?.name ?? ""} ${itemNames.join(" ")}`);
}

async function playGuidingBolt(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.48 });
  addCameraPan(seq, targets[0] ?? source, quality, { duration: 460, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(420)
    .duration(1180);

  seq.effect()
    .file(firstExisting(ASSETS.divineCaster))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(160);

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    addTokenAfterimage(seq, source, target, quality, { delay: delay + 210, fraction: 0.12, opacity: 0.22 });

    seq.effect()
      .file(firstExisting(ASSETS.solarSeal))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 0.74, { considerTokenScale: true, uniform: true })
      .fadeIn(80)
      .fadeOut(640)
      .duration(1650)
      .delay(delay + 120);

    seq.effect()
      .file(firstExisting(ASSETS.solarSpear))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeIn(40)
      .fadeOut(180)
      .delay(delay + 320);

    seq.effect()
      .file(firstExisting(ASSETS.dawnStars))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.92, { considerTokenScale: true, uniform: true })
      .fadeIn(90)
      .fadeOut(700)
      .duration(1820)
      .delay(delay + 480);

    seq.effect()
      .file(firstExisting(ASSETS.lightOrb))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.48, { considerTokenScale: true, uniform: true })
      .fadeIn(80)
      .fadeOut(580)
      .duration(1320)
      .delay(delay + 600);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.outpulse))
        .atLocation(target)
        .belowTokens()
        .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
        .fadeOut(560)
        .delay(delay + 610);

      seq.effect()
        .file(firstExisting(ASSETS.dawnStars))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.52, { considerTokenScale: true, uniform: true })
        .fadeOut(560)
        .delay(delay + 760);

      seq.effect()
        .file(firstExisting(ASSETS.tokenMaskRadiant))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
        .fadeIn(120)
        .fadeOut(900)
        .duration(2600)
        .delay(delay + 820);
    }

    addFloatingText(seq, target, effectFloatingText(effect, "晨星指引"), delay + 740);
  });

  addSound(seq, ASSETS.sounds.divineTarget, { delay: 430, volume: 0.24 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playHealingWord(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.42 });
  addCameraPan(seq, targets[0] ?? source, quality, { duration: 360, scale: 1.06 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.65, { considerTokenScale: true, uniform: true })
    .fadeOut(260);

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.healingLoop))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 1.1, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(420)
      .duration(quality.extraLayers ? 1550 : 980)
      .delay(delay + 120);

    seq.effect()
      .file(firstExisting(ASSETS.healingBurst))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.25, { considerTokenScale: true, uniform: true })
      .delay(delay + 620);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.dawnStars))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.64, { considerTokenScale: true, uniform: true })
        .fadeOut(520)
        .delay(delay + 520);

      seq.effect()
        .file(firstExisting(ASSETS.lightOrb))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.42, { considerTokenScale: true, uniform: true })
        .fadeOut(520)
        .delay(delay + 720);
    }

    addFloatingText(seq, target, effectFloatingText(effect, "新生日冕"), delay + 690);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playRadianceOfTheDawn(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.58 });
  addCameraPan(seq, source, quality, { duration: 560, scale: 1.18 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.radiusScale * 0.95, { considerTokenScale: true, uniform: true })
    .fadeIn(180)
    .fadeOut(480)
    .duration(1680);

  seq.effect()
    .file(firstExisting(ASSETS.solarRadiance))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeIn(80)
    .fadeOut(620)
    .duration(1500)
    .delay(140);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.radiusScale * 1.75, { considerTokenScale: true, uniform: true })
    .fadeOut(560)
    .delay(390);

  if (quality.extraLayers) {
    seq.effect()
      .file(firstExisting(ASSETS.dawnStars))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 1.45, { considerTokenScale: true, uniform: true })
      .fadeIn(80)
      .fadeOut(560)
      .duration(1650)
      .delay(360);

    seq.effect()
      .file(firstExisting(ASSETS.particlesOutward))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.radiusScale * 1.08, { considerTokenScale: true, uniform: true })
      .fadeOut(520)
      .delay(610);

    seq.effect()
      .file(firstExisting(ASSETS.auraRadiantLoop))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.radiusScale * 1.18, { considerTokenScale: true, uniform: true })
      .opacity(0.52)
      .fadeIn(120)
      .fadeOut(720)
      .duration(2100)
      .delay(520);
  }

  for (const [index, target] of targets.entries()) {
    if (target === source) continue;
    const delay = 580 + index * 65;
    seq.effect()
      .file(firstExisting(ASSETS.impactRadiant))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.85, { considerTokenScale: true, uniform: true })
      .delay(delay);
  }

  addFloatingText(seq, source, effectFloatingText(effect, "黎明环冕"), 720);
  addShake(seq, source, quality, { delay: 540, strength: Math.max(0, quality.shakeStrength - 3), duration: 320 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playSacredFlame(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.sacredCaster, { volume: 0.45 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.68, { considerTokenScale: true, uniform: true })
    .fadeOut(300);

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.sacredTarget))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.05, { considerTokenScale: true, uniform: true })
      .delay(delay + 180);

    seq.effect()
      .file(firstExisting(ASSETS.holyLightImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
      .fadeOut(420)
      .delay(delay + 460);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.dawnStars))
        .atLocation(target)
        .belowTokens()
        .scaleToObject(quality.targetScale * 0.76, { considerTokenScale: true, uniform: true })
        .fadeOut(520)
        .delay(delay + 560);
    }

    addFloatingText(seq, target, effectFloatingText(effect, "圣阳坠火"), delay + 590);
  });

  addSound(seq, ASSETS.sounds.sacredTarget, { delay: 360, volume: 0.55 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playLight(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  await resetPersistentEffects(ctx, [target], ["light", "light-mask"]);
  addSound(seq, ASSETS.sounds.cast, { volume: 0.34 });

  seq.effect()
    .file(firstExisting(ASSETS.abjurationCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale, { considerTokenScale: true, uniform: true })
    .fadeOut(300);

  seq.effect()
    .file(firstExisting(ASSETS.lightBloom))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 1.25, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1500)
    .delay(180);

  addPersistentAttachedLoop(seq, ctx, target, ASSETS.lightOrbLoop, {
    suffix: "light",
    scale: quality.targetScale * 0.46,
    fadeIn: 260,
    previewDuration: 2800,
    pulseDuration: 2100
  });

  addPersistentAttachedLoop(seq, ctx, target, ASSETS.tokenMaskRadiant, {
    suffix: "light-mask",
    below: true,
    scale: quality.targetScale * 0.84,
    opacity: 0.72,
    fadeIn: 260,
    previewDuration: 2800,
    pulseDuration: 2400
  });

  addFloatingText(seq, target, effectFloatingText(effect, "曙光烛芯"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playShieldOfFaith(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  await resetPersistentEffects(ctx, targetList, ["aegis", "aegis-mask"]);
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.42 });

  targetList.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.abjurationCircle))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 1.08, { considerTokenScale: true, uniform: true })
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.solarShield))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.05, { considerTokenScale: true, uniform: true })
      .fadeIn(80)
      .fadeOut(580)
      .duration(1480)
      .delay(delay + 220);

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.shieldLoopRadiant, {
      suffix: "aegis",
      scale: quality.targetScale * 0.98,
      delay: delay + 520,
      fadeIn: 240,
      previewDuration: 3000,
      pulseDuration: 2200
    });

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.dawnStars))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
        .fadeOut(480)
        .delay(delay + 420);

      addPersistentAttachedLoop(seq, ctx, target, ASSETS.tokenMaskRadiant, {
        suffix: "aegis-mask",
        below: true,
        scale: quality.targetScale * 0.82,
        opacity: 0.68,
        delay: delay + 620,
        fadeIn: 280,
        previewDuration: 3000,
        pulseDuration: 2600
      });
    }

    addFloatingText(seq, target, effectFloatingText(effect, "洛山达金盾"), delay + 530);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playGuidance(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  await resetPersistentEffects(ctx, targetList, "guidance");
  addSound(seq, ASSETS.sounds.cast, { volume: 0.28 });

  targetList.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.healingLoop))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
      .fadeIn(100)
      .fadeOut(320)
      .duration(980)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.outpulse))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.9, { considerTokenScale: true, uniform: true })
      .delay(delay + 280);

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.blessLoopRadiant, {
      suffix: "guidance",
      below: true,
      scale: quality.targetScale * 0.58,
      opacity: 0.68,
      delay: delay + 460,
      fadeIn: 180,
      previewDuration: 2400,
      pulseDuration: 2000
    });
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playChannelDivinity(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.58 });
  addCameraPan(seq, source, quality, { duration: 520, scale: 1.12 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.22, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(420)
    .duration(1500);

  seq.effect()
    .file(firstExisting(ASSETS.solarRadiance))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1600)
    .delay(180);

  seq.effect()
    .file(firstExisting(ASSETS.lightOrb))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.76, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(500)
    .duration(1700)
    .delay(260);

  if (quality.extraLayers) {
    seq.effect()
      .file(firstExisting(ASSETS.dawnStars))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 1.55, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(500)
      .delay(520);

    seq.effect()
      .file(firstExisting(ASSETS.outpulse))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 1.75, { considerTokenScale: true, uniform: true })
      .delay(640);

    seq.effect()
      .file(firstExisting(ASSETS.auraRadiantLoop))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 1.16, { considerTokenScale: true, uniform: true })
      .opacity(0.58)
      .fadeIn(120)
      .fadeOut(620)
      .duration(1900)
      .delay(720);
  }

  addFloatingText(seq, source, effectFloatingText(effect, "晨曦圣储"), 720);
  addShake(seq, source, quality, { delay: 620, strength: Math.max(quality.shakeStrength, 6), duration: 360 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playWardingFlare(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const focus = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.divineTarget, { volume: 0.5 });

  seq.effect()
    .file(firstExisting(ASSETS.solarRadiance))
    .atLocation(focus)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(280);

  seq.effect()
    .file(firstExisting(ASSETS.solarShield))
    .atLocation(focus)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeOut(340)
    .delay(120);

  addFloatingText(seq, focus, effectFloatingText(effect, "日冕耀斑"), 220);
  return playAndRecord(seq, ctx, effect.label);
}

async function playHoldPerson(ctx) {
  const seq = makeSequence();
  const { targets, quality, effect } = ctx;
  await resetPersistentEffects(ctx, targets, ["bind", "bind-mask"]);
  addSound(seq, ASSETS.sounds.cast, { volume: 0.38 });

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.enchantmentCircle))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 1.15, { considerTokenScale: true, uniform: true })
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.chainMarker))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(480)
      .duration(1350)
      .delay(delay + 240);

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.chainMarkerLoop, {
      suffix: "bind",
      scale: quality.targetScale * 0.98,
      delay: delay + 560,
      fadeIn: 260,
      previewDuration: 3200,
      pulseDuration: 1800
    });

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.solarSeal))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
        .fadeOut(520)
        .delay(delay + 380);

      addPersistentAttachedLoop(seq, ctx, target, ASSETS.tokenMaskRadiant, {
        suffix: "bind-mask",
        below: true,
        scale: quality.targetScale * 0.72,
        opacity: 0.56,
        delay: delay + 720,
        fadeIn: 240,
        previewDuration: 3200,
        pulseDuration: 2400
      });
    }

    addFloatingText(seq, target, effectFloatingText(effect, "晨光锁印"), delay + 520);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playBurningHands(ctx) {
  const seq = makeSequence();
  const { source, targets, templates, quality, effect } = ctx;
  const template = templates?.[0] ?? null;
  const geometry = templateGeometry(template, source);
  const focus = geometry?.center ?? placeableCenter(targets[0]) ?? placeableCenter(source) ?? source;
  const origin = geometry?.origin ?? placeableCenter(source) ?? source;
  const scale = (geometry?.scale ?? 1) * (quality.extraLayers ? 1.05 : 0.92);
  addSound(seq, ASSETS.sounds.burningHands, { volume: 0.56 });
  addTokenAfterimage(seq, source, focus, quality, { delay: 80, fraction: 0.1, opacity: 0.24, duration: 440 });

  const flame = seq.effect()
    .file(firstExisting(ASSETS.burningHands))
    .atLocation(origin)
    .aboveLighting()
    .scale(scale);

  if (geometry) flame.rotate(geometry.direction);
  else flame.rotateTowards(focus);

  const groundCone = seq.effect()
    .file(firstExisting(ASSETS.burningHandsTemplate))
    .atLocation(origin)
    .belowTokens()
    .scale(scale * 1.02)
    .fadeIn(60)
    .fadeOut(520)
    .duration(1500)
    .delay(90);

  if (geometry) groundCone.rotate(geometry.direction);
  else groundCone.rotateTowards(focus);

  if (quality.extraLayers) {
    const holyCone = seq.effect()
      .file(firstExisting(ASSETS.holyCone))
      .atLocation(origin)
      .aboveLighting()
      .scale(scale * 0.92)
      .fadeOut(420)
      .delay(140);
    if (geometry) holyCone.rotate(geometry.direction);
    else holyCone.rotateTowards(focus);

    const flare = seq.effect()
      .file(firstExisting(ASSETS.lightFlare))
      .atLocation(origin)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
      .fadeOut(420)
      .delay(60);
    if (!geometry) flare.rotateTowards(focus);

    seq.effect()
      .file(firstExisting(ASSETS.particlesOutward))
      .atLocation(focus)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.85, { considerTokenScale: true, uniform: true })
      .fadeOut(420)
      .delay(360);

    targets.slice(0, 4).forEach((target, index) => {
      seq.effect()
        .file(firstExisting(ASSETS.holyLightImpact))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.58, { considerTokenScale: true, uniform: true })
        .fadeOut(360)
        .delay(390 + index * 75);
    });
  }

  addFloatingText(seq, source, effectFloatingText(effect, "黎明火舌"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playFaerieFire(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  await resetPersistentEffects(ctx, targetList, ["faerie", "faerie-mask"]);
  addSound(seq, ASSETS.sounds.cast, { volume: 0.36 });

  targetList.forEach((target, index) => {
    seq.effect()
      .file(firstExisting(ASSETS.faerieFire))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(420)
      .duration(1300)
      .delay(index * quality.stagger);

    if (quality.extraLayers) {
      seq.effect()
        .file(pickExisting(ASSETS.faerieFire, index))
        .atLocation(target, { randomOffset: 0.35, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.36, { considerTokenScale: true, uniform: true })
        .fadeOut(520)
        .delay(index * quality.stagger + 260);

      addPersistentAttachedLoop(seq, ctx, target, ASSETS.tokenMaskArcane, {
        suffix: "faerie-mask",
        below: true,
        scale: quality.targetScale * 0.72,
        opacity: 0.66,
        delay: index * quality.stagger + 520,
        fadeIn: 240,
        previewDuration: 3000,
        pulseDuration: 1700
      });
    }

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.faerieFire, {
      suffix: "faerie",
      scale: quality.targetScale * 0.82,
      opacity: 0.72,
      delay: index * quality.stagger + 480,
      fadeIn: 240,
      previewDuration: 3000,
      pulseDuration: 2200
    });
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playScorchingRay(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.burningHands, { volume: 0.45 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.74, { considerTokenScale: true, uniform: true })
    .fadeOut(320);

  targets.forEach((target, index) => {
    const delay = index * 130;
    seq.effect()
      .file(firstExisting(ASSETS.scorchingRay))
      .atLocation(source, { randomOffset: 0.15, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.12, gridUnits: true })
      .aboveLighting()
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.holyLightImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
      .delay(delay + 280);
  });

  addFloatingText(seq, targets[0], effectFloatingText(effect, "三重日枪"), 580);
  return playAndRecord(seq, ctx, effect.label);
}

async function playDetectMagic(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const focus = targets[0] ?? source;
  await resetPersistentEffects(ctx, [source], ["detect-circle", "detect-eye"]);
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.38 });

  seq.effect()
    .file(firstExisting(ASSETS.solarSeal))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(160)
    .fadeOut(420)
    .duration(1500);

  if (focus !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.detectMagicCone))
      .atLocation(source)
      .stretchTo(focus)
      .aboveLighting()
      .delay(280);
  }

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.44, { considerTokenScale: true, uniform: true })
    .fadeOut(480)
    .delay(360);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.detectMagicLoop, {
    suffix: "detect-circle",
    below: true,
    scale: quality.casterScale * 0.92,
    opacity: 0.7,
    delay: 580,
    fadeIn: 240,
    previewDuration: 3200,
    pulseDuration: 2600
  });

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.insightEye, {
    suffix: "detect-eye",
    scale: quality.casterScale * 0.32,
    opacity: 0.7,
    delay: 700,
    fadeIn: 240,
    previewDuration: 3200,
    pulseDuration: 1800
  });

  addFloatingText(seq, source, effectFloatingText(effect, "晨曦魔视"), 540);
  return playAndRecord(seq, ctx, effect.label);
}

async function playUtilityPulse(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  addSound(seq, ASSETS.sounds.cast, { volume: 0.26 });

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 110);
    seq.effect()
      .file(firstExisting(ASSETS.runeDivination))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
      .fadeIn(80)
      .fadeOut(320)
      .duration(920)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.lightOrb))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.48, { considerTokenScale: true, uniform: true })
      .fadeOut(360)
      .delay(delay + 160);
  });

  addFloatingText(seq, targetList[0], effectFloatingText(effect, effect.label), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playPassiveSigil(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.dawnCircleIntro))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(320);

  seq.effect()
    .file(firstExisting(ASSETS.runeTransmutation))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 420);
  return playAndRecord(seq, ctx, effect.label);
}

async function playScrollIntel(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.2 });

  seq.effect()
    .file(firstExisting(ASSETS.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.75, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(520)
    .duration(1250);

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.42, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(260);

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playHealerKit(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  addSound(seq, ASSETS.sounds.cast, { volume: 0.22 });

  targetList.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.healingLoop))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
      .fadeIn(100)
      .fadeOut(360)
      .duration(980)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.healingBurst))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.74, { considerTokenScale: true, uniform: true })
      .delay(delay + 360);
  });

  addFloatingText(seq, targetList[0], effectFloatingText(effect, "急救晨光"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playHolyWater(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.divineTarget, { volume: 0.34 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.guidingBolt))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(180);
  }

  seq.effect()
    .file(firstExisting(ASSETS.holyWaterSplash))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(220);

  seq.effect()
    .file(firstExisting(ASSETS.holyLightImpact))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.75, { considerTokenScale: true, uniform: true })
    .fadeOut(460)
    .delay(360);

  addFloatingText(seq, target, effectFloatingText(effect, "圣水破邪"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playDartThrow(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.dartThrow, { volume: 0.36 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.dart))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting();
  } else {
    seq.effect()
      .file(firstExisting(ASSETS.dart))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true });
  }

  addSound(seq, ASSETS.sounds.dartHit, { delay: 420, volume: 0.32 });
  addFloatingText(seq, target, effectFloatingText(effect, "飞镖破空"), 460);
  return playAndRecord(seq, ctx, effect.label);
}

async function playDaylightScroll(ctx) {
  const seq = makeSequence();
  const { source, targets, templates, quality, effect } = ctx;
  const template = templates?.[0] ?? null;
  const geometry = templateGeometry(template, source);
  const location = geometry?.center ?? placeableCenter(targets[0]) ?? source;
  if (template && shouldPersistEffect(ctx)) await endPersistentEffect(ctx, template, "daylight-zone");
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.42 });

  seq.effect()
    .file(firstExisting(ASSETS.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  seq.effect()
    .file(firstExisting(ASSETS.lightBloom))
    .atLocation(location)
    .aboveLighting()
    .scale((geometry?.scale ?? 1.4) * quality.radiusScale * 0.72)
    .fadeIn(120)
    .fadeOut(720)
    .duration(1800)
    .delay(240);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(location)
    .belowTokens()
    .scale((geometry?.scale ?? 1.4) * quality.radiusScale * 0.78)
    .fadeOut(560)
    .delay(420);

  if (template) {
    addPersistentAttachedLoop(seq, ctx, template, ASSETS.auraRadiantLoop, {
      suffix: "daylight-zone",
      below: true,
      scaleToObject: false,
      scale: (geometry?.scale ?? 1.4) * quality.radiusScale * 0.62,
      opacity: 0.48,
      delay: 760,
      fadeIn: 320,
      previewDuration: 3600,
      pulseDuration: 3000
    });
  }

  addFloatingText(seq, source, effectFloatingText(effect, "昼光卷轴"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playSeeInvisibility(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["see-circle", "see-eye"]);
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.3 });

  seq.effect()
    .file(firstExisting(ASSETS.detectMagicCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.95, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(460)
    .duration(1350);

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(560)
    .delay(280);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.detectMagicLoop, {
    suffix: "see-circle",
    below: true,
    scale: quality.casterScale * 0.78,
    opacity: 0.55,
    delay: 580,
    fadeIn: 260,
    previewDuration: 3000,
    pulseDuration: 2600
  });

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.insightEye, {
    suffix: "see-eye",
    scale: quality.casterScale * 0.28,
    opacity: 0.58,
    delay: 660,
    fadeIn: 260,
    previewDuration: 3000,
    pulseDuration: 2100
  });

  addFloatingText(seq, source, effectFloatingText(effect, "破隐晨视"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGentleRepose(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.28 });

  seq.effect()
    .file(firstExisting(ASSETS.runeNecromancy))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(560)
    .duration(1600);

  seq.effect()
    .file(firstExisting(ASSETS.healingLoop))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(220);

  addFloatingText(seq, target, effectFloatingText(effect, "静息圣封"), 600);
  return playAndRecord(seq, ctx, effect.label);
}

async function playPoisonUse(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.2 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.poisonProjectile))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(180);
  }

  seq.effect()
    .file(firstExisting(ASSETS.poisonSplash))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(260);

  addFloatingText(seq, target, effectFloatingText(effect, "午夜毒露"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playRationUse(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  seq.effect()
    .file(firstExisting(ASSETS.lightOrb))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.38, { considerTokenScale: true, uniform: true })
    .fadeOut(360);
  addFloatingText(seq, source, effectFloatingText(effect, "旅粮补给"), 240);
  return playAndRecord(seq, ctx, effect.label);
}

async function playBrewUse(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.16 });
  seq.effect()
    .file(firstExisting(ASSETS.healingBurst))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.46, { considerTokenScale: true, uniform: true })
    .fadeOut(360);
  addFloatingText(seq, source, effectFloatingText(effect, "新人啤酒"), 280);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceArcaneStudy(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "arcane-study-aura");
  addSound(seq, ASSETS.sounds.identify, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(ASSETS.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.7, { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(480)
    .duration(1280);

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.9, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1450)
    .delay(100);

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.42, { considerTokenScale: true, uniform: true })
    .fadeOut(440)
    .delay(300);

  if (SUSTAINED_DURATION_TYPES.has(effect.durationType)) {
    addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraArcaneLoop, {
      suffix: "arcane-study-aura",
      below: true,
      scale: quality.casterScale * 0.72,
      opacity: 0.46,
      delay: 640,
      fadeIn: 260,
      previewDuration: 3000,
      pulseDuration: 2600
    });
  }

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceLucky(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.2 });

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.9, { considerTokenScale: true, uniform: true })
    .fadeIn(80)
    .fadeOut(460)
    .duration(1200);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(180);

  addFloatingText(seq, source, effectFloatingText(effect, "星轨转运"), 430);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceArcaneUtility(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.16 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeIn(70)
    .fadeOut(320)
    .duration(900);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.48, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceAlert(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.2 });

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.54, { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(360);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.2, { considerTokenScale: true, uniform: true })
    .fadeOut(340)
    .delay(90);

  addFloatingText(seq, source, effectFloatingText(effect, "银铃警兆"), 260);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceRayOfFrost(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.frost, { volume: 0.42 });
  addCameraPan(seq, targets[0] ?? source, quality, { duration: 360, scale: 1.06 });

  seq.effect()
    .file(firstExisting(ASSETS.graceSnowSigil))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.74, { considerTokenScale: true, uniform: true })
    .fadeOut(340);

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.graceRayOfFrost))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeIn(40)
      .fadeOut(160)
      .delay(delay + 80);

    seq.effect()
      .file(firstExisting(ASSETS.graceFrostImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.86, { considerTokenScale: true, uniform: true })
      .fadeOut(460)
      .delay(delay + 330);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.graceSnowSigil))
        .atLocation(target)
        .belowTokens()
        .scaleToObject(quality.targetScale * 1.08, { considerTokenScale: true, uniform: true })
        .fadeIn(80)
        .fadeOut(620)
        .duration(1380)
        .delay(delay + 380);
    }

    addFloatingText(seq, target, effectFloatingText(effect, "霜晶直线"), delay + 520);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceDancingLights(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["dancing-0", "dancing-1", "dancing-2", "dancing-3", "dancing-orbit"]);
  addSound(seq, ["blfx.sound.spell.dancing_lights1.1", ...ASSETS.sounds.cast], { volume: 0.26 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.74, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  for (let i = 0; i < 4; i += 1) {
    const angle = Math.PI * 0.5 * i;
    const radius = 0.7 + i * 0.08;
    seq.effect()
      .file(pickExisting(ASSETS.graceDancingLights, i))
      .atLocation(source, { randomOffset: 1 + i * 0.15, gridUnits: true })
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.34, { considerTokenScale: true, uniform: true })
      .fadeIn(140)
      .fadeOut(620)
      .duration(1800)
      .delay(i * 115);

    addPersistentAttachedLoop(seq, ctx, source, ASSETS.arcaneWispLoop, {
      suffix: `dancing-${i}`,
      scale: quality.casterScale * 0.25,
      offset: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      gridUnits: true,
      local: false,
      delay: 520 + i * 90,
      fadeIn: 260,
      previewDuration: 3400,
      pulseDuration: 1600 + i * 120
    });
  }

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.95, { considerTokenScale: true, uniform: true })
    .fadeOut(500)
    .delay(260);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraArcaneLoop, {
    suffix: "dancing-orbit",
    below: true,
    scale: quality.casterScale * 0.74,
    opacity: 0.48,
    delay: 760,
    fadeIn: 320,
    previewDuration: 3400,
    pulseDuration: 3000
  });

  addFloatingText(seq, source, effectFloatingText(effect, "星灯环舞"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceRitualAdept(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.identify, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.graceConjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(140)
    .fadeOut(640)
    .duration(1700);

  seq.effect()
    .file(firstExisting(ASSETS.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(280);

  addFloatingText(seq, source, effectFloatingText(effect, "仪式钟环"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceArcaneRecovery(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.3 });
  addCameraPan(seq, source, quality, { duration: 420, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(560)
    .duration(1500);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.18, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(560)
    .duration(1600)
    .delay(180);

  seq.effect()
    .file(firstExisting(ASSETS.lightOrb))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(360);

  addFloatingText(seq, source, effectFloatingText(effect, "星辉回想"), 640);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceDagger(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.dartThrow, { volume: 0.32 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.graceArcaneProjectile))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(150);
  }

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.46, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(260);

  addSound(seq, ASSETS.sounds.dartHit, { delay: 320, volume: 0.24 });
  addFloatingText(seq, target, effectFloatingText(effect, "银刃弧线"), 420);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceStaff(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(280);

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.graceArcaneProjectile))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .delay(120);
  }

  seq.effect()
    .file(firstExisting(ASSETS.impactRadiant))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.52, { considerTokenScale: true, uniform: true })
    .fadeOut(340)
    .delay(360);

  addFloatingText(seq, target, effectFloatingText(effect, "法杖点星"), 460);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceAlchemy(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.16 });

  seq.effect()
    .file(firstExisting(ASSETS.runeTransmutation))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  seq.effect()
    .file(firstExisting(ASSETS.holyWaterSplash))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.42, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, "炼油微光"), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiAcidSplash(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  // Acid Splash is instant; clear loops left by older versions before the new one-shot burst.
  await endPersistentEffectsForItem(effect, item);
  addSound(seq, ASSETS.sounds.acid, { volume: 0.32 });
  addCameraPan(seq, targetList[0] ?? source, quality, { duration: 260, scale: 1.04 });

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiAcidCast))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.56, { considerTokenScale: true, uniform: true })
    .fadeIn(35)
    .fadeOut(180)
    .duration(520);

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 90);
    if (target !== source) {
      seq.effect()
        .file(pickExisting(ASSETS.xinghaiAcidProjectile, index))
        .atLocation(source, { randomOffset: 0.12, gridUnits: true })
        .stretchTo(target, { randomOffset: 0.1, gridUnits: true })
        .aboveLighting()
        .fadeOut(100)
        .delay(delay + 70);
    }

    seq.effect()
      .file(firstExisting(ASSETS.xinghaiAcidImpact))
      .atLocation(target, { randomOffset: 0.08, gridUnits: true })
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.54, { considerTokenScale: true, uniform: true })
      .fadeIn(20)
      .fadeOut(210)
      .duration(390)
      .delay(delay + (target === source ? 120 : 250));

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.particlesOutward))
        .atLocation(target, { randomOffset: 0.06, gridUnits: true })
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.24, { considerTokenScale: true, uniform: true })
        .opacity(0.58)
        .fadeOut(160)
        .duration(300)
        .delay(delay + (target === source ? 180 : 300));
    }

    addFloatingText(seq, target, effectFloatingText(effect, "酸液迸裂"), delay + (target === source ? 260 : 380));
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiFireBolt(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.fireBolt, { volume: 0.36 });
  addCameraPan(seq, targetList[0] ?? source, quality, { duration: 330, scale: 1.07 });

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiFireCast))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.68, { considerTokenScale: true, uniform: true })
    .fadeIn(50)
    .fadeOut(320)
    .duration(900);

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 120);
    seq.effect()
      .file(pickExisting(ASSETS.xinghaiFireBolt, index))
      .atLocation(source, { randomOffset: 0.16, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.1, gridUnits: true })
      .aboveLighting()
      .fadeOut(130)
      .delay(delay + 100);

    seq.effect()
      .file(firstExisting(ASSETS.xinghaiFireImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.68, { considerTokenScale: true, uniform: true })
      .fadeOut(420)
      .delay(delay + 320);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.particlesOutward))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.5, { considerTokenScale: true, uniform: true })
        .fadeOut(420)
        .delay(delay + 410);
    }

    addShake(seq, target, quality, { delay: delay + 340, strength: Math.max(0, quality.shakeStrength - 6), duration: 180 });
    addFloatingText(seq, target, effectFloatingText(effect, "火星贯射"), delay + 500);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiWitchBolt(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.witchBolt, { volume: 0.34 });
  addCameraPan(seq, targetList[0] ?? source, quality, { duration: 360, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiWitchCast))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeIn(50)
    .fadeOut(300)
    .duration(860);

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 115);
    seq.effect()
      .file(pickExisting(ASSETS.xinghaiWitchBolt, index))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeIn(40)
      .fadeOut(180)
      .delay(delay + 70);

    seq.effect()
      .file(firstExisting(ASSETS.xinghaiLightningImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.76, { considerTokenScale: true, uniform: true })
      .fadeOut(480)
      .delay(delay + 290);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.xinghaiDetectMagicPulse))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.56, { considerTokenScale: true, uniform: true })
        .opacity(0.72)
        .fadeOut(320)
        .duration(780)
        .delay(delay + 420);
    }

    addShake(seq, target, quality, { delay: delay + 330, strength: Math.max(0, quality.shakeStrength - 5), duration: 220 });
    addFloatingText(seq, target, effectFloatingText(effect, "巫雷牵引"), delay + 520);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiMindSliver(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.mind, { volume: 0.32 });

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiIllusion))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeIn(70)
    .fadeOut(360)
    .duration(850);

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 105);
    seq.effect()
      .file(pickExisting(ASSETS.xinghaiMindProjectile, index))
      .atLocation(source, { randomOffset: 0.14, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.08, gridUnits: true })
      .aboveLighting()
      .fadeOut(130)
      .delay(delay + 80);

    seq.effect()
      .file(firstExisting(ASSETS.xinghaiPsychicImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.64, { considerTokenScale: true, uniform: true })
      .fadeOut(430)
      .delay(delay + 300);

    addFloatingText(seq, target, effectFloatingText(effect, "心棘裂隙"), delay + 460);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiMinorIllusion(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const focus = targets.find((target) => target !== source) ?? source;
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.cast, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiIllusion))
    .atLocation(focus)
    .belowTokens()
    .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(560)
    .duration(1280);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceStars))
    .atLocation(focus, { randomOffset: 0.45, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.46, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(220);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.lightOrb))
    .atLocation(focus, { randomOffset: 0.28, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.34, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(380);

  addFloatingText(seq, focus, effectFloatingText(effect, "星影拟声"), 500);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiMagicMissile(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  const shots = magicMissileShotCount(ctx, targetList);
  const synthetic = isCprMagicMissileSyntheticContext(effect, ctx);

  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.magicMissile, { volume: 0.38 });

  if (!synthetic) {
    seq.effect()
      .file(firstExisting(ASSETS.xinghaiStarCast))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.82, { considerTokenScale: true, uniform: true })
      .fadeOut(340);
  }

  for (let i = 0; i < shots; i += 1) {
    const target = targetList[i % targetList.length];
    const delay = synthetic ? 0 : 80 + i * 105;
    seq.effect()
      .file(pickExisting(ASSETS.xinghaiMagicMissile, i))
      .atLocation(source, { randomOffset: 0.2, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.12, gridUnits: true })
      .aboveLighting()
      .fadeOut(120)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.xinghaiStarImpact))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.4, { considerTokenScale: true, uniform: true })
      .fadeOut(300)
      .delay(delay + 240);

    if (quality.extraLayers) {
      seq.effect()
        .file(firstExisting(ASSETS.xinghaiStarLoop))
        .atLocation(target)
        .aboveLighting()
        .scaleToObject(quality.targetScale * 0.34, { considerTokenScale: true, uniform: true })
        .fadeOut(280)
        .delay(delay + 260);
    }
  }

  addFloatingText(seq, targetList[0], effectFloatingText(effect, shots > 1 ? "星海流光" : "星海飞弹"), shots > 1 ? 720 : 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyArcaneStudy(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "xinghai-arcane-study-aura");
  addSound(seq, ASSETS.sounds.identify, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.7, { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(480)
    .duration(1280);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.9, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1450)
    .delay(100);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.42, { considerTokenScale: true, uniform: true })
    .fadeOut(440)
    .delay(300);

  if (SUSTAINED_DURATION_TYPES.has(effect.durationType)) {
    addPersistentAttachedLoop(seq, ctx, source, XINGHAI_1_0_10.auraArcaneLoop, {
      suffix: "xinghai-arcane-study-aura",
      below: true,
      scale: quality.casterScale * 0.72,
      opacity: 0.46,
      delay: 640,
      fadeIn: 260,
      previewDuration: 3000,
      pulseDuration: 2600
    });
  }

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyDetectMagic(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["xinghai-detect-magic-aura", "xinghai-detect-magic-radar"]);
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.24 });
  addCameraPan(seq, source, quality, { duration: 360, scale: 1.05 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .opacity(0.72)
    .fadeIn(90)
    .fadeOut(420)
    .duration(1180);

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiDetectMagicPulse))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.35, { considerTokenScale: true, uniform: true })
    .opacity(0.58)
    .fadeIn(80)
    .fadeOut(460)
    .duration(1300)
    .delay(160);

  seq.effect()
    .file(firstExisting(ASSETS.xinghaiDetectMagicAura))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.55, { considerTokenScale: true, uniform: true })
    .opacity(0.52)
    .fadeIn(160)
    .fadeOut(560)
    .duration(1600)
    .delay(360);

  if (quality.extraLayers) {
    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.insightEye))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.36, { considerTokenScale: true, uniform: true })
      .opacity(0.68)
      .fadeOut(380)
      .delay(520);
  }

  if (SUSTAINED_DURATION_TYPES.has(effect.durationType)) {
    addPersistentAttachedLoop(seq, ctx, source, ASSETS.xinghaiDetectMagicLoop, {
      suffix: "xinghai-detect-magic-radar",
      below: true,
      scale: quality.casterScale * 1.28,
      opacity: 0.28,
      delay: 720,
      fadeIn: 360,
      previewDuration: 3600,
      pulseDuration: 3200
    });

    addPersistentAttachedLoop(seq, ctx, source, ASSETS.xinghaiDetectMagicAura, {
      suffix: "xinghai-detect-magic-aura",
      below: true,
      scale: quality.casterScale * 1.05,
      opacity: 0.22,
      delay: 940,
      fadeIn: 420,
      previewDuration: 3600,
      pulseDuration: 3600
    });
  }

  addFloatingText(seq, source, effectFloatingText(effect, "星海侦测"), 680);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyArcaneUtility(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.16 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeIn(70)
    .fadeOut(320)
    .duration(900);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.48, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, effect.label), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyDancingLights(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], [
    "xinghai-dancing-0",
    "xinghai-dancing-1",
    "xinghai-dancing-2",
    "xinghai-dancing-3",
    "xinghai-dancing-orbit"
  ]);
  addSound(seq, ["blfx.sound.spell.dancing_lights1.1", ...ASSETS.sounds.cast], { volume: 0.26 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.74, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  for (let i = 0; i < 4; i += 1) {
    const angle = Math.PI * 0.5 * i;
    const radius = 0.7 + i * 0.08;
    seq.effect()
      .file(pickExisting(XINGHAI_1_0_10.graceDancingLights, i))
      .atLocation(source, { randomOffset: 1 + i * 0.15, gridUnits: true })
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.34, { considerTokenScale: true, uniform: true })
      .fadeIn(140)
      .fadeOut(620)
      .duration(1800)
      .delay(i * 115);

    addPersistentAttachedLoop(seq, ctx, source, XINGHAI_1_0_10.arcaneWispLoop, {
      suffix: `xinghai-dancing-${i}`,
      scale: quality.casterScale * 0.25,
      offset: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      gridUnits: true,
      local: false,
      delay: 520 + i * 90,
      fadeIn: 260,
      previewDuration: 3400,
      pulseDuration: 1600 + i * 120
    });
  }

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.95, { considerTokenScale: true, uniform: true })
    .fadeOut(500)
    .delay(260);

  addPersistentAttachedLoop(seq, ctx, source, XINGHAI_1_0_10.auraArcaneLoop, {
    suffix: "xinghai-dancing-orbit",
    below: true,
    scale: quality.casterScale * 0.74,
    opacity: 0.48,
    delay: 760,
    fadeIn: 320,
    previewDuration: 3400,
    pulseDuration: 3000
  });

  addFloatingText(seq, source, effectFloatingText(effect, "星灯环舞"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyRitualAdept(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.identify, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceConjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(140)
    .fadeOut(640)
    .duration(1700);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.scrollSigil))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(280);

  addFloatingText(seq, source, effectFloatingText(effect, "仪式钟环"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyArcaneRecovery(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.3 });
  addCameraPan(seq, source, quality, { duration: 420, scale: 1.08 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(560)
    .duration(1500);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.18, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(560)
    .duration(1600)
    .delay(180);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.lightOrb))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(360);

  addFloatingText(seq, source, effectFloatingText(effect, "星辉回想"), 640);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyPrestidigitation(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceIllusionCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeIn(80)
    .fadeOut(420)
    .duration(1100);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceDancingLights))
    .atLocation(source, { randomOffset: 0.65, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.34, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(170);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(280);

  addFloatingText(seq, source, effectFloatingText(effect, "棱镜小戏法"), 460);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyFindFamiliar(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "xinghai-familiar-glimmer");
  addSound(seq, ASSETS.sounds.teleport, { volume: 0.34 });
  addCameraPan(seq, source, quality, { duration: 420, scale: 1.08 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceConjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeIn(140)
    .fadeOut(680)
    .duration(1800);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceTeleport))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(300);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceServant))
    .atLocation(source, { randomOffset: 0.7, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.7, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(680)
    .duration(1500)
    .delay(520);

  addPersistentAttachedLoop(seq, ctx, source, XINGHAI_1_0_10.arcaneWispLoop, {
    suffix: "xinghai-familiar-glimmer",
    scale: quality.casterScale * 0.32,
    opacity: 0.58,
    randomOffset: 0.85,
    gridUnits: true,
    delay: 940,
    fadeIn: 320,
    previewDuration: 3400,
    pulseDuration: 2200
  });

  addFloatingText(seq, source, effectFloatingText(effect, "星使召来"), 760);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyComprehendLanguages(ctx) {
  return playXinghaiLegacyArcaneStudy(ctx);
}

async function playXinghaiLegacySleep(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  await resetPersistentEffects(ctx, targetList, ["xinghai-sleep-cloud", "xinghai-sleep-mark"]);
  addSound(seq, ASSETS.sounds.sleep, { volume: 0.34 });

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 120);
    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.graceSleepCloud))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(660)
      .duration(1650)
      .delay(delay);

    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.graceSleepSymbol))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
      .fadeOut(520)
      .delay(delay + 260);

    addPersistentAttachedLoop(seq, ctx, target, XINGHAI_1_0_10.graceSleepCloud, {
      suffix: "xinghai-sleep-cloud",
      scale: quality.targetScale * 0.78,
      opacity: 0.48,
      delay: delay + 680,
      fadeIn: 280,
      previewDuration: 3200,
      pulseDuration: 2600
    });

    addPersistentAttachedLoop(seq, ctx, target, XINGHAI_1_0_10.graceSleepSymbol, {
      suffix: "xinghai-sleep-mark",
      scale: quality.targetScale * 0.52,
      opacity: 0.58,
      delay: delay + 760,
      fadeIn: 260,
      previewDuration: 3200,
      pulseDuration: 2200
    });
  });

  addFloatingText(seq, targetList[0], effectFloatingText(effect, "月眠星尘"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyMageArmor(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  await resetPersistentEffects(ctx, [target], ["xinghai-mage-armor", "xinghai-mage-armor-aura"]);
  addSound(seq, ASSETS.sounds.mageArmor, { volume: 0.36 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceAbjurationCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 1.12, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1550);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceMageArmor))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(130)
    .fadeOut(650)
    .duration(1700)
    .delay(180);

  addPersistentAttachedLoop(seq, ctx, target, XINGHAI_1_0_10.shieldLoopArcane, {
    suffix: "xinghai-mage-armor",
    scale: quality.targetScale * 0.96,
    delay: 620,
    fadeIn: 280,
    previewDuration: 3200,
    pulseDuration: 2400
  });

  addPersistentAttachedLoop(seq, ctx, target, XINGHAI_1_0_10.auraArcaneLoop, {
    suffix: "xinghai-mage-armor-aura",
    below: true,
    scale: quality.targetScale * 0.72,
    opacity: 0.46,
    delay: 720,
    fadeIn: 320,
    previewDuration: 3200,
    pulseDuration: 2800
  });

  addFloatingText(seq, target, effectFloatingText(effect, "银蓝法甲"), 600);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyMagicMissile(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  const shots = magicMissileShotCount(ctx, targetList);
  const synthetic = isCprMagicMissileSyntheticContext(effect, ctx);
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.magicMissile, { volume: 0.4 });

  if (!synthetic) {
    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.graceArcaneCircle))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.84, { considerTokenScale: true, uniform: true })
      .fadeOut(360);
  }

  for (let i = 0; i < shots; i += 1) {
    const target = targetList[i % targetList.length];
    const delay = synthetic ? 0 : 90 + i * 115;
    seq.effect()
      .file(pickExisting(XINGHAI_1_0_10.graceMagicMissile, i))
      .atLocation(source, { randomOffset: 0.28, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.16, gridUnits: true })
      .aboveLighting()
      .fadeOut(120)
      .delay(delay);

    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.graceStars))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.42, { considerTokenScale: true, uniform: true })
      .fadeOut(300)
      .delay(delay + 260);
  }

  addFloatingText(seq, targetList[0], effectFloatingText(effect, shots > 1 ? "星矢齐发" : "星矢命中"), shots > 1 ? 720 : 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyShield(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.mageArmor, { volume: 0.42 });

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceShield))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(460)
    .duration(1000);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.graceAbjurationCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(90);

  addShake(seq, target, quality, { delay: 130, strength: Math.max(0, quality.shakeStrength - 7), duration: 180 });
  addFloatingText(seq, target, effectFloatingText(effect, "瞬发银盾"), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyGreatsword(ctx) {
  return playXinghaiLegacyMelee(ctx, XINGHAI_1_0_10.lawrenceGreatsword, ASSETS.sounds.greatsword, "墓卫巨剑", {
    scale: 1.1,
    shake: 1
  });
}

async function playXinghaiLegacyMelee(ctx, files, soundFiles, fallbackText, options = {}) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, soundFiles, { volume: 0.46 });
  addTokenAfterimage(seq, source, target, quality, { delay: 35, fraction: 0.14, opacity: 0.28, duration: 430 });

  const swing = seq.effect()
    .file(firstExisting(files))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * (options.scale ?? 1), { considerTokenScale: true, uniform: true });

  if (target !== source) swing.rotateTowards(target);

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.lawrenceStoneImpact))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.74, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(options.delayImpact ?? 240);

  addFloatingText(seq, target, effectFloatingText(effect, fallbackText), 460);
  addShake(seq, target, quality, { delay: 280, strength: Math.max(0, quality.shakeStrength - (options.shake ?? 4)), duration: 260 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playXinghaiLegacyPoisonUse(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.2 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(XINGHAI_1_0_10.poisonProjectile))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(180);
  }

  seq.effect()
    .file(firstExisting(XINGHAI_1_0_10.poisonSplash))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(260);

  addFloatingText(seq, target, effectFloatingText(effect, "午夜毒露"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGracePrestidigitation(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(ASSETS.graceIllusionCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeIn(80)
    .fadeOut(420)
    .duration(1100);

  seq.effect()
    .file(firstExisting(ASSETS.graceDancingLights))
    .atLocation(source, { randomOffset: 0.65, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.34, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(170);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(280);

  addFloatingText(seq, source, effectFloatingText(effect, "棱镜小戏法"), 460);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceFindFamiliar(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "familiar-glimmer");
  addSound(seq, ASSETS.sounds.teleport, { volume: 0.34 });
  addCameraPan(seq, source, quality, { duration: 420, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.graceConjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeIn(140)
    .fadeOut(680)
    .duration(1800);

  seq.effect()
    .file(firstExisting(ASSETS.graceTeleport))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(300);

  seq.effect()
    .file(firstExisting(ASSETS.graceServant))
    .atLocation(source, { randomOffset: 0.7, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.7, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(680)
    .duration(1500)
    .delay(520);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.arcaneWispLoop, {
    suffix: "familiar-glimmer",
    scale: quality.casterScale * 0.32,
    opacity: 0.58,
    randomOffset: 0.85,
    gridUnits: true,
    delay: 940,
    fadeIn: 320,
    previewDuration: 3400,
    pulseDuration: 2200
  });

  addFloatingText(seq, source, effectFloatingText(effect, "星使召来"), 760);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceComprehendLanguages(ctx) {
  return playGraceArcaneStudy(ctx);
}

async function playGraceSleep(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const targetList = targets.length ? targets : [source];
  await resetPersistentEffects(ctx, targetList, ["sleep-cloud", "sleep-mark"]);
  addSound(seq, ASSETS.sounds.sleep, { volume: 0.34 });

  targetList.forEach((target, index) => {
    const delay = index * Math.min(quality.stagger, 120);
    seq.effect()
      .file(firstExisting(ASSETS.graceSleepCloud))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
      .fadeIn(120)
      .fadeOut(660)
      .duration(1650)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.graceSleepSymbol))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.72, { considerTokenScale: true, uniform: true })
      .fadeOut(520)
      .delay(delay + 260);

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.graceSleepCloud, {
      suffix: "sleep-cloud",
      scale: quality.targetScale * 0.78,
      opacity: 0.48,
      delay: delay + 680,
      fadeIn: 280,
      previewDuration: 3200,
      pulseDuration: 2600
    });

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.graceSleepSymbol, {
      suffix: "sleep-mark",
      scale: quality.targetScale * 0.52,
      opacity: 0.58,
      delay: delay + 760,
      fadeIn: 260,
      previewDuration: 3200,
      pulseDuration: 2200
    });
  });

  addFloatingText(seq, targetList[0], effectFloatingText(effect, "月眠星尘"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceUnseenServant(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "unseen-servant");
  addSound(seq, ASSETS.sounds.teleport, { volume: 0.24 });

  seq.effect()
    .file(firstExisting(ASSETS.graceConjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.86, { considerTokenScale: true, uniform: true })
    .fadeOut(500);

  seq.effect()
    .file(firstExisting(ASSETS.graceServant))
    .atLocation(source, { randomOffset: 0.75, gridUnits: true })
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(620)
    .duration(1300)
    .delay(260);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.graceServant, {
    suffix: "unseen-servant",
    scale: quality.casterScale * 0.42,
    opacity: 0.42,
    randomOffset: 0.7,
    gridUnits: true,
    delay: 700,
    fadeIn: 320,
    previewDuration: 3200,
    pulseDuration: 2400
  });

  addFloatingText(seq, source, effectFloatingText(effect, "无形侍手"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceMageArmor(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  await resetPersistentEffects(ctx, [target], ["mage-armor", "mage-armor-aura"]);
  addSound(seq, ASSETS.sounds.mageArmor, { volume: 0.36 });

  seq.effect()
    .file(firstExisting(ASSETS.graceAbjurationCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 1.12, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1550);

  seq.effect()
    .file(firstExisting(ASSETS.graceMageArmor))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 1.02, { considerTokenScale: true, uniform: true })
    .fadeIn(130)
    .fadeOut(650)
    .duration(1700)
    .delay(180);

  addPersistentAttachedLoop(seq, ctx, target, ASSETS.shieldLoopArcane, {
    suffix: "mage-armor",
    scale: quality.targetScale * 0.96,
    delay: 620,
    fadeIn: 280,
    previewDuration: 3200,
    pulseDuration: 2400
  });

  addPersistentAttachedLoop(seq, ctx, target, ASSETS.auraArcaneLoop, {
    suffix: "mage-armor-aura",
    below: true,
    scale: quality.targetScale * 0.72,
    opacity: 0.46,
    delay: 720,
    fadeIn: 320,
    previewDuration: 3200,
    pulseDuration: 2800
  });

  addFloatingText(seq, target, effectFloatingText(effect, "银蓝法甲"), 600);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceMagicMissile(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, item } = ctx;
  const targetList = targets.length ? targets : [source];
  const shots = magicMissileShotCount(ctx, targetList);
  await cleanupInstantLegacyLoops(effect, item);
  addSound(seq, ASSETS.sounds.magicMissile, { volume: 0.4 });

  if (!isCprMagicMissileSyntheticContext(effect, ctx)) {
    seq.effect()
      .file(firstExisting(ASSETS.graceArcaneCircle))
      .atLocation(source)
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.84, { considerTokenScale: true, uniform: true })
      .fadeOut(360);
  }

  for (let i = 0; i < shots; i += 1) {
    const target = targetList[i % targetList.length];
    const delay = isCprMagicMissileSyntheticContext(effect, ctx) ? 0 : 90 + i * 115;
    seq.effect()
      .file(pickExisting(ASSETS.graceMagicMissile, i))
      .atLocation(source, { randomOffset: 0.28, gridUnits: true })
      .stretchTo(target, { randomOffset: 0.16, gridUnits: true })
      .aboveLighting()
      .fadeOut(120)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.graceStars))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.42, { considerTokenScale: true, uniform: true })
      .fadeOut(300)
      .delay(delay + 260);
  }

  addFloatingText(seq, targetList[0], effectFloatingText(effect, shots > 1 ? "星矢齐发" : "星矢命中"), shots > 1 ? 720 : 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceBrew(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.14 });

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.46, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  addFloatingText(seq, source, effectFloatingText(effect, "星杯小酌"), 260);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceSilveredWeapon(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.graceShield))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(460);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(380)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, "月银镀刃"), 420);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceTashaLaughter(ctx) {
  const seq = makeSequence();
  const { targets, quality, effect } = ctx;
  await resetPersistentEffects(ctx, targets, ["laughter-mask", "laughter-ring"]);
  addSound(seq, ASSETS.sounds.laughter, { volume: 0.32 });

  targets.forEach((target, index) => {
    const delay = index * quality.stagger;
    seq.effect()
      .file(firstExisting(ASSETS.graceIllusionCircle))
      .atLocation(target)
      .belowTokens()
      .scaleToObject(quality.targetScale * 1.04, { considerTokenScale: true, uniform: true })
      .fadeIn(100)
      .fadeOut(560)
      .duration(1500)
      .delay(delay);

    seq.effect()
      .file(firstExisting(ASSETS.graceLaughter))
      .atLocation(target)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
      .fadeOut(620)
      .delay(delay + 240);

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.graceLaughter, {
      suffix: "laughter-mask",
      scale: quality.targetScale * 0.52,
      opacity: 0.52,
      delay: delay + 650,
      fadeIn: 260,
      previewDuration: 3200,
      pulseDuration: 2200
    });

    addPersistentAttachedLoop(seq, ctx, target, ASSETS.auraArcaneLoop, {
      suffix: "laughter-ring",
      below: true,
      scale: quality.targetScale * 0.68,
      opacity: 0.44,
      delay: delay + 720,
      fadeIn: 280,
      previewDuration: 3200,
      pulseDuration: 2600
    });

    addFloatingText(seq, target, effectFloatingText(effect, "塔莎镜笑"), delay + 560);
  });

  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceDisguiseSelf(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["disguise-veil", "disguise-mask"]);
  addSound(seq, ASSETS.sounds.cast, { volume: 0.28 });

  seq.effect()
    .file(firstExisting(ASSETS.graceIllusionCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.96, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(620)
    .duration(1600);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeOut(580)
    .delay(220);

  seq.effect()
    .file(firstExisting(ASSETS.lightOrb))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.52, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(380);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraArcaneLoop, {
    suffix: "disguise-veil",
    below: true,
    scale: quality.casterScale * 0.74,
    opacity: 0.42,
    delay: 680,
    fadeIn: 300,
    previewDuration: 3200,
    pulseDuration: 2600
  });

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.tokenMaskArcane, {
    suffix: "disguise-mask",
    scale: quality.casterScale * 0.54,
    opacity: 0.58,
    delay: 760,
    fadeIn: 260,
    previewDuration: 3200,
    pulseDuration: 2200
  });

  addFloatingText(seq, source, effectFloatingText(effect, "镜幕易容"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceEvocationSavant(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.16 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  seq.effect()
    .file(firstExisting(ASSETS.graceFrostImpact))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.42, { considerTokenScale: true, uniform: true })
    .fadeOut(380)
    .delay(160);

  addFloatingText(seq, source, effectFloatingText(effect, "塑能蓝式"), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGracePotentCantrip(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.frost, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.graceSnowSigil))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.68, { considerTokenScale: true, uniform: true })
    .fadeOut(360);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.54, { considerTokenScale: true, uniform: true })
    .fadeOut(380)
    .delay(150);

  addFloatingText(seq, source, effectFloatingText(effect, "戏法增幅晶"), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceMistyStep(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const destination = targets.find((target) => target !== source) ?? source;
  addSound(seq, ASSETS.sounds.teleport, { volume: 0.38 });
  addCameraPan(seq, destination, quality, { duration: 360, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.graceTeleport))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeOut(520);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.86, { considerTokenScale: true, uniform: true })
    .fadeOut(480)
    .delay(120);

  if (destination !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.graceTeleport))
      .atLocation(destination)
      .aboveLighting()
      .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
      .fadeOut(520)
      .delay(260);
  }

  addFloatingText(seq, source, effectFloatingText(effect, "星雾折步"), 480);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceIdentify(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["identify-prism", "identify-eye"]);
  addSound(seq, ASSETS.sounds.identify, { volume: 0.3 });

  seq.effect()
    .file(firstExisting(ASSETS.graceArcaneCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.94, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(560)
    .duration(1500);

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.48, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(240);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.72, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(390);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraArcaneLoop, {
    suffix: "identify-prism",
    below: true,
    scale: quality.casterScale * 0.72,
    opacity: 0.46,
    delay: 650,
    fadeIn: 260,
    previewDuration: 3000,
    pulseDuration: 2600
  });

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.insightEye, {
    suffix: "identify-eye",
    scale: quality.casterScale * 0.3,
    opacity: 0.58,
    delay: 760,
    fadeIn: 260,
    previewDuration: 3000,
    pulseDuration: 2200
  });

  addFloatingText(seq, source, effectFloatingText(effect, "鉴定棱镜"), 620);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceMidnightTears(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.18 });

  if (target !== source) {
    seq.effect()
      .file(firstExisting(ASSETS.poisonProjectile))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(160);
  }

  seq.effect()
    .file(firstExisting(ASSETS.poisonSplash))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.76, { considerTokenScale: true, uniform: true })
    .fadeOut(500)
    .delay(260);

  seq.effect()
    .file(firstExisting(ASSETS.graceIllusionCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(440)
    .delay(360);

  addFloatingText(seq, target, effectFloatingText(effect, "午夜紫露"), 560);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceMagicalBerries(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.18 });

  seq.effect()
    .file(firstExisting(ASSETS.healingBurst))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.66, { considerTokenScale: true, uniform: true })
    .fadeOut(420);

  seq.effect()
    .file(firstExisting(ASSETS.graceStars))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(150);

  addFloatingText(seq, target, effectFloatingText(effect, "星莓绽光"), 380);
  return playAndRecord(seq, ctx, effect.label);
}

async function playGraceShield(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.mageArmor, { volume: 0.42 });

  seq.effect()
    .file(firstExisting(ASSETS.graceShield))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(460)
    .duration(1000);

  seq.effect()
    .file(firstExisting(ASSETS.graceAbjurationCircle))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(90);

  addShake(seq, target, quality, { delay: 130, strength: Math.max(0, quality.shakeStrength - 7), duration: 180 });
  addFloatingText(seq, target, effectFloatingText(effect, "瞬发银盾"), 360);
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceBulwark(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], ["stone-bulwark", "stone-aura"]);
  addSound(seq, ASSETS.sounds.divineCaster, { volume: 0.34 });

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceShield))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.22, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(560)
    .duration(1500);

  seq.effect()
    .file(firstExisting(ASSETS.abjurationCircle))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.08, { considerTokenScale: true, uniform: true })
    .fadeOut(460)
    .delay(120);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(260);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.shieldLoopStone, {
    suffix: "stone-bulwark",
    scale: quality.casterScale * 0.94,
    opacity: 0.76,
    delay: 620,
    fadeIn: 300,
    previewDuration: 3200,
    pulseDuration: 2600
  });

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraStoneLoop, {
    suffix: "stone-aura",
    below: true,
    scale: quality.casterScale * 0.82,
    opacity: 0.5,
    delay: 700,
    fadeIn: 320,
    previewDuration: 3200,
    pulseDuration: 3000
  });

  addFloatingText(seq, source, effectFloatingText(effect, "银辉壁垒"), 540);
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceGrace(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  await resetPersistentEffects(ctx, [source], "stone-grace");
  addSound(seq, ASSETS.sounds.cast, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceAura))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(520)
    .duration(1400);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.18, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(260);

  addPersistentAttachedLoop(seq, ctx, source, ASSETS.auraStoneLoop, {
    suffix: "stone-grace",
    below: true,
    scale: quality.casterScale * 0.72,
    opacity: 0.48,
    delay: 560,
    fadeIn: 260,
    previewDuration: 2800,
    pulseDuration: 2600
  });

  addFloatingText(seq, source, effectFloatingText(effect, "路途恩泽"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceCharge(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect, charge } = ctx;
  const target = targets[0] ?? source;
  const destination = charge?.destinationCenter ?? charge?.destination ?? null;
  const pathEnd = destination ?? target;
  const from = placeableCenter(source);
  const to = placeableCenter(pathEnd) ?? placeableCenter(target);
  const moveDelay = Number(charge?.moveDelay ?? 340);
  const moveDuration = Number(charge?.moveDuration ?? 760);
  const impactDelay = moveDelay + Math.max(420, Math.round(moveDuration * 0.84));
  const pathPoint = (fraction) => {
    if (!from || !to) return source;
    return {
      x: from.x + (to.x - from.x) * fraction,
      y: from.y + (to.y - from.y) * fraction
    };
  };

  addSound(seq, ASSETS.sounds.chargeStart, { volume: 0.44 });
  addSound(seq, ASSETS.sounds.greatsword, { delay: moveDelay + 80, volume: 0.28 });
  addSound(seq, ASSETS.sounds.chargeImpact, { delay: impactDelay, volume: 0.42 });
  addCameraPan(seq, pathEnd, quality, { duration: 720, scale: 1.13 });

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceChargeRunes))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.06, { considerTokenScale: true, uniform: true })
    .fadeIn(70)
    .fadeOut(360)
    .duration(moveDelay + 220);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.9, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(80);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceAura))
    .attachTo(source, { bindVisibility: true, bindAlpha: true })
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .opacity(0.64)
    .fadeIn(80)
    .fadeOut(360)
    .duration(moveDelay + moveDuration + 420);

  if (source !== target && to) {
    seq.effect()
      .copySprite(source)
      .atLocation(source)
      .aboveLighting()
      .opacity(0.42)
      .duration(moveDuration + 120)
      .fadeOut(360)
      .moveTowards(to, { ease: "easeInOutCubic" })
      .delay(moveDelay - 40);

    seq.effect()
      .file(firstExisting(ASSETS.lawrenceCharge))
      .atLocation(source)
      .stretchTo(to)
      .aboveLighting()
      .opacity(0.72)
      .fadeIn(40)
      .fadeOut(320)
      .delay(moveDelay);

    seq.effect()
      .file(firstExisting(ASSETS.lawrenceChargeWake))
      .atLocation(pathPoint(0.35))
      .belowTokens()
      .scaleToObject(quality.casterScale * 0.62, { considerTokenScale: true, uniform: true })
      .opacity(0.72)
      .fadeOut(420)
      .delay(moveDelay + Math.round(moveDuration * 0.26));

    seq.effect()
      .file(firstExisting(ASSETS.lawrenceDust))
      .atLocation(pathPoint(0.68))
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.52, { considerTokenScale: true, uniform: true })
      .opacity(0.62)
      .fadeOut(360)
      .delay(moveDelay + Math.round(moveDuration * 0.55));
  }

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceChargeWake))
    .atLocation(pathEnd)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.04, { considerTokenScale: true, uniform: true })
    .fadeOut(520)
    .delay(impactDelay - 90);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceChargeWeaponFlash))
    .atLocation(pathEnd)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.86, { considerTokenScale: true, uniform: true })
    .rotateTowards(target)
    .fadeOut(300)
    .delay(impactDelay - 20);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceShield))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.94, { considerTokenScale: true, uniform: true })
    .fadeIn(50)
    .fadeOut(520)
    .duration(980)
    .delay(impactDelay + 40);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceChargeImpact))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeOut(460)
    .delay(impactDelay + 90);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceAura))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 1.08, { considerTokenScale: true, uniform: true })
    .opacity(0.54)
    .fadeOut(560)
    .duration(1180)
    .delay(impactDelay + 120);

  addFloatingText(seq, target, effectFloatingText(effect, "破碑冲锋"), impactDelay + 280);
  addShake(seq, target, quality, { delay: impactDelay + 80, strength: Math.max(0, quality.shakeStrength - 1), duration: 340 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceSecondWind(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.26 });

  seq.effect()
    .file(firstExisting(ASSETS.healingLoop))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.92, { considerTokenScale: true, uniform: true })
    .fadeIn(120)
    .fadeOut(440)
    .duration(1250);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceShield))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.78, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(260);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.7, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(360);

  addFloatingText(seq, source, effectFloatingText(effect, "石躯回气"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceHunter(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  await resetPersistentEffects(ctx, [target], "hunter-mark");
  addSound(seq, ASSETS.sounds.detectMagic, { volume: 0.22 });

  seq.effect()
    .file(firstExisting(ASSETS.insightEye))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.48, { considerTokenScale: true, uniform: true })
    .fadeOut(420);

  seq.effect()
    .file(firstExisting(ASSETS.chainMarker))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.82, { considerTokenScale: true, uniform: true })
    .fadeIn(100)
    .fadeOut(520)
    .duration(1250)
    .delay(220);

  addPersistentAttachedLoop(seq, ctx, target, ASSETS.chainMarkerLoop, {
    suffix: "hunter-mark",
    scale: quality.targetScale * 0.72,
    opacity: 0.62,
    delay: 520,
    fadeIn: 240,
    previewDuration: 2800,
    pulseDuration: 2200
  });

  addFloatingText(seq, target, effectFloatingText(effect, "猎手凝视"), 520);
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceGreatsword(ctx) {
  return playLawrenceMelee(ctx, ASSETS.lawrenceGreatsword, ASSETS.sounds.greatsword, "墓卫巨剑", {
    scale: 1.1,
    shake: 1,
    stanceFiles: ASSETS.lawrenceAura,
    accentFiles: ASSETS.lawrenceShield,
    impactScale: 0.7,
    afterimageFraction: 0.18,
    extraDust: true
  });
}

async function playLawrenceFlail(ctx) {
  return playLawrenceMelee(ctx, ASSETS.lawrenceFlail, ASSETS.sounds.flail, "墓链回响", {
    scale: 0.95,
    delayImpact: 330,
    stanceFiles: ASSETS.chainMarker,
    accentFiles: ASSETS.chainMarker,
    linkFiles: [
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_1_Line_1_METAL_1200x100.webm",
      "modules/blfx-assets-pack01/artwork/02-equipment/chain/Chain_1_Line_1_METAL_1200x100.webm"
    ],
    impactScale: 0.62,
    afterimageFraction: 0.1
  });
}

async function playLawrenceMelee(ctx, files, soundFiles, fallbackText, options = {}) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, soundFiles, { volume: 0.46 });
  addTokenAfterimage(seq, source, target, quality, {
    delay: 35,
    fraction: options.afterimageFraction ?? 0.14,
    opacity: 0.3,
    duration: 460
  });

  seq.effect()
    .file(firstExisting(options.stanceFiles ?? ASSETS.lawrenceAura))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.76, { considerTokenScale: true, uniform: true })
    .opacity(0.56)
    .fadeIn(60)
    .fadeOut(380)
    .duration(960);

  if (options.extraDust) {
    seq.effect()
      .file(firstExisting(ASSETS.lawrenceDust))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.6, { considerTokenScale: true, uniform: true })
      .fadeOut(340)
      .delay(80);
  }

  const swing = seq.effect()
    .file(firstExisting(files))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * (options.scale ?? 1), { considerTokenScale: true, uniform: true })
    .fadeOut(180)
    .delay(80);

  if (target !== source) swing.rotateTowards(target);

  if (options.linkFiles && target !== source) {
    seq.effect()
      .file(firstExisting(options.linkFiles))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .opacity(0.62)
      .fadeOut(220)
      .delay(160);
  }

  seq.effect()
    .file(firstExisting(options.accentFiles ?? ASSETS.lawrenceShield))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.64, { considerTokenScale: true, uniform: true })
    .fadeIn(40)
    .fadeOut(360)
    .duration(820)
    .delay(options.delayImpact ?? 240);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceStoneImpact))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * (options.impactScale ?? 0.68), { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay((options.delayImpact ?? 240) + 110);

  addFloatingText(seq, target, effectFloatingText(effect, fallbackText), 500);
  addShake(seq, target, quality, { delay: 320, strength: Math.max(0, quality.shakeStrength - (options.shake ?? 4)), duration: 260 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceJavelin(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.dartThrow, { volume: 0.38 });

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceAura))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 0.66, { considerTokenScale: true, uniform: true })
    .opacity(0.48)
    .fadeOut(360)
    .duration(900);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 0.52, { considerTokenScale: true, uniform: true })
    .fadeOut(320)
    .delay(80);

  if (target !== source) {
    addTokenAfterimage(seq, source, target, quality, { delay: 30, fraction: 0.16, opacity: 0.24, duration: 420 });
    seq.effect()
      .file(firstExisting(ASSETS.lawrenceJavelin))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .fadeOut(150)
      .delay(110);

    seq.effect()
      .file(firstExisting(ASSETS.lawrenceCharge))
      .atLocation(source)
      .stretchTo(target)
      .aboveLighting()
      .opacity(0.48)
      .fadeOut(180)
      .delay(135);
  } else {
    seq.effect()
      .file(firstExisting(ASSETS.lawrenceJavelin))
      .atLocation(source)
      .aboveLighting()
      .scaleToObject(quality.casterScale * 0.8, { considerTokenScale: true, uniform: true });
  }

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceShield))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.66, { considerTokenScale: true, uniform: true })
    .fadeOut(380)
    .duration(850)
    .delay(320);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceStoneImpact))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.58, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(410);

  addSound(seq, ASSETS.sounds.dartHit, { delay: 390, volume: 0.32 });
  addFloatingText(seq, target, effectFloatingText(effect, "墓钉标枪"), 500);
  addShake(seq, target, quality, { delay: 430, strength: Math.max(0, quality.shakeStrength - 7), duration: 180 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceActionSurge(ctx) {
  const seq = makeSequence();
  const { source, quality, effect } = ctx;
  addSound(seq, ASSETS.sounds.greatsword, { volume: 0.28 });
  addCameraPan(seq, source, quality, { duration: 320, scale: 1.08 });

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceAura))
    .atLocation(source)
    .belowTokens()
    .scaleToObject(quality.casterScale * 1.12, { considerTokenScale: true, uniform: true })
    .fadeIn(80)
    .fadeOut(360)
    .duration(980);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.05, { considerTokenScale: true, uniform: true })
    .fadeOut(420)
    .delay(120);

  seq.effect()
    .file(firstExisting(ASSETS.outpulse))
    .atLocation(source)
    .aboveLighting()
    .scaleToObject(quality.casterScale * 1.35, { considerTokenScale: true, uniform: true })
    .fadeOut(360)
    .delay(240);

  addFloatingText(seq, source, effectFloatingText(effect, "动作如潮"), 420);
  addShake(seq, source, quality, { delay: 180, strength: Math.max(0, quality.shakeStrength - 3), duration: 260 });
  return playAndRecord(seq, ctx, effect.label);
}

async function playLawrenceUtility(ctx) {
  const seq = makeSequence();
  const { source, targets, quality, effect } = ctx;
  const target = targets[0] ?? source;
  addSound(seq, ASSETS.sounds.cast, { volume: 0.14 });

  seq.effect()
    .file(firstExisting(ASSETS.runeTransmutation))
    .atLocation(target)
    .belowTokens()
    .scaleToObject(quality.targetScale * 0.65, { considerTokenScale: true, uniform: true })
    .fadeOut(320);

  seq.effect()
    .file(firstExisting(ASSETS.lawrenceDust))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * 0.48, { considerTokenScale: true, uniform: true })
    .fadeOut(320)
    .delay(120);

  addFloatingText(seq, target, effectFloatingText(effect, effect.label), 320);
  return playAndRecord(seq, ctx, effect.label);
}

async function playAndRecord(sequence, ctx, effectLabel) {
  const started = performance.now();
  await sequence.play();
  recentEvents.unshift({
    at: Date.now(),
    actorName: ctx.actor?.name ?? "未知角色",
    itemName: ctx.item?.name ?? "未知条目",
    effectLabel,
    triggerLabel: triggerLabel(ctx.trigger),
    elapsed: Math.round(performance.now() - started)
  });
  recentEvents = recentEvents.slice(0, RECENT_LIMIT);
  refreshPanel({ rerender: true, preserveScroll: true });
  debugLog("特效播放完成", recentEvents[0]);
  return true;
}

function makeSequence() {
  return new Sequence({
    moduleName: MODULE_ID,
    softFail: true
  });
}

function addSound(seq, files, options = {}) {
  if (!setting("playSounds")) return;
  const file = firstExisting(files);
  if (!file) return;
  const volume = clamp(Number(setting("soundVolume") ?? 0.55) * Number(options.volume ?? 1), 0, 1);
  seq.sound()
    .file(file)
    .volume(volume)
    .delay(options.delay ?? 0);
}

function addCameraPan(seq, target, quality, options = {}) {
  if (!setting("enableCameraPan") || !target) return;
  seq.canvasPan(target)
    .duration(options.duration ?? 420)
    .scale(options.scale ?? (quality === QUALITY.cinematic ? 1.14 : 1.07));
}

function addShake(seq, target, quality, options = {}) {
  if (!setting("enableScreenShake") || !target || quality.shakeStrength <= 0) return;
  seq.canvasPan(target)
    .duration(options.duration ?? 320)
    .delay(options.delay ?? 0)
    .shake({
      duration: options.duration ?? 320,
      strength: options.strength ?? quality.shakeStrength,
      frequency: 18,
      fadeInDuration: 40,
      fadeOutDuration: 180,
      rotation: quality === QUALITY.cinematic
    });
}

function addFloatingText(seq, target, text, delay = 0) {
  if (!setting("showFloatingText") || !target) return;
  seq.scrollingText(target, text, {
    fill: "#fff6c7",
    stroke: "#2c1b06",
    strokeThickness: 5,
    fontSize: 26,
    fontWeight: 700,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4
  })
    .duration(1200)
    .direction("TOP")
    .delay(delay);
}

function addCinematicDawnBloom(seq, target, quality, delay = 0, options = {}) {
  if (!quality.extraLayers || !target) return;
  const scale = options.scale ?? 1;

  seq.effect()
    .file(firstExisting(ASSETS.dawnStars))
    .atLocation(target)
    [options.below ? "belowTokens" : "aboveLighting"]()
    .scaleToObject(quality.targetScale * scale, { considerTokenScale: true, uniform: true })
    .fadeIn(90)
    .fadeOut(420)
    .duration(1250)
    .delay(delay);

  seq.effect()
    .file(firstExisting(ASSETS.particlesOutward))
    .atLocation(target)
    .aboveLighting()
    .scaleToObject(quality.targetScale * scale * 1.15, { considerTokenScale: true, uniform: true })
    .fadeOut(430)
    .delay(delay + 120);
}

async function resetPersistentEffects(ctx, targets, suffix = "main") {
  if (!shouldPersistEffect(ctx) || !isSequencerReady()) return false;
  const suffixes = Array.isArray(suffix) ? suffix : [suffix];
  for (const target of uniqueTokens(targets.filter(Boolean))) {
    for (const entry of suffixes) await endPersistentEffect(ctx, target, entry);
  }
  return true;
}

async function cleanupInstantLegacyLoops(effect, item) {
  if (!effect || SUSTAINED_DURATION_TYPES.has(effect.durationType)) return;
  await endPersistentEffectsForItem(effect, item);
}

async function endPersistentEffect(ctx, target, suffix = "main") {
  try {
    await Sequencer.EffectManager.endEffects({
      name: persistentEffectName(ctx, target, suffix),
      object: target
    });
  } catch (error) {
    debugLog("清理持续特效失败", { effect: ctx.effect?.label, target: target?.name, error });
  }
}

function shouldPersistEffect(ctx) {
  return ctx?.trigger !== "preview" && SUSTAINED_DURATION_TYPES.has(ctx?.effect?.durationType);
}

function persistentEffectName(ctx, target, suffix = "main") {
  const targetId = target?.document?.uuid ?? target?.id ?? "canvas";
  return `${MODULE_ID}.${ctx?.effect?.key ?? "effect"}.${suffix}.${targetId}`;
}

function effectOrigin(ctx) {
  const activeEffect = activeEffectForContext(ctx);
  return String(activeEffect?.uuid ?? effectOriginForItem(ctx?.effect, ctx?.item));
}

function effectOriginForItem(effect, item) {
  return String(item?.uuid ?? effect?.key ?? MODULE_ID);
}

async function endPersistentEffectsForItem(effect, item) {
  if (!isSequencerReady()) return;
  const origins = new Set([effectOriginForItem(effect, item)]);
  for (const activeEffect of item?.actor?.effects ?? []) {
    if (String(activeEffect.origin ?? "") === item?.uuid) origins.add(activeEffect.uuid);
  }
  try {
    for (const origin of origins) await Sequencer.EffectManager.endEffects({ origin });
  } catch (error) {
    debugLog("按条目清理持续特效失败", { effect: effect?.label, item: item?.name, error });
  }
}

async function cleanupPersistentEffectsForActiveEffect(activeEffect) {
  if (!isSequencerReady()) return;
  const origins = [activeEffect?.uuid, activeEffect?.origin].map((origin) => String(origin ?? "")).filter(Boolean);
  if (!origins.length) return;
  try {
    for (const origin of origins) await Sequencer.EffectManager.endEffects({ origin });
  } catch (error) {
    debugLog("按 ActiveEffect 来源清理持续特效失败", { origins, error });
  }
}

function activeEffectForContext(ctx) {
  const itemUuid = ctx?.item?.uuid;
  if (!itemUuid) return null;
  return ctx?.actor?.effects?.find?.((activeEffect) => String(activeEffect.origin ?? "") === itemUuid) ?? null;
}

function addPersistentAttachedLoop(seq, ctx, target, files, options = {}) {
  if (!target) return null;
  const file = firstExisting(files);
  if (!file) return null;

  const attachOptions = {
    bindVisibility: true,
    bindAlpha: true,
    bindScale: Boolean(options.bindScale)
  };
  if (options.offset !== undefined) attachOptions.offset = options.offset;
  if (options.randomOffset !== undefined) attachOptions.randomOffset = options.randomOffset;
  if (options.gridUnits !== undefined) attachOptions.gridUnits = options.gridUnits;
  if (options.local !== undefined) attachOptions.local = options.local;

  const section = seq.effect()
    .file(file)
    .attachTo(target, attachOptions);

  if (options.below) section.belowTokens();
  else section.aboveLighting();

  if (options.scaleToObject !== false) {
    section.scaleToObject(options.scale ?? 1, { considerTokenScale: true, uniform: true });
  } else if (options.scale) {
    section.scale(options.scale);
  }

  if (options.opacity) section.opacity(options.opacity);
  if (options.delay) section.delay(options.delay);
  if (options.rotate !== undefined) section.rotate(options.rotate);
  if (options.zIndex !== undefined) section.zIndex(options.zIndex);

  if (shouldPersistEffect(ctx)) {
    section
      .name(persistentEffectName(ctx, target, options.suffix ?? "main"))
      .origin(effectOrigin(ctx))
      .persist(true, { persistTokenPrototype: true })
      .fadeIn(options.fadeIn ?? 240)
      .fadeOut(options.fadeOut ?? 650);
    if (ctx.item) section.tieToDocuments(ctx.item);
    const activeEffect = activeEffectForContext(ctx);
    if (activeEffect) section.tieToDocuments(activeEffect);
  } else {
    section
      .fadeIn(options.fadeIn ?? 120)
      .fadeOut(options.fadeOut ?? 520)
      .duration(options.previewDuration ?? 2200);
  }

  if (options.pulse !== false) {
    section.loopProperty("sprite", "scale.x", {
      values: [0.96, 1.04, 0.98],
      duration: options.pulseDuration ?? 1800,
      pingPong: true
    });
    section.loopProperty("sprite", "scale.y", {
      values: [0.96, 1.04, 0.98],
      duration: options.pulseDuration ?? 1800,
      pingPong: true
    });
  }

  return section;
}

function addTokenAfterimage(seq, source, target, quality, options = {}) {
  if (!setting("enableTokenMotion") || !quality.extraLayers || !source || !target || source === target) return;
  const from = placeableCenter(source);
  const to = placeableCenter(target);
  if (!from || !to) return;

  const fraction = clamp(Number(options.fraction ?? 0.18), 0.05, 0.38);
  const destination = {
    x: from.x + (to.x - from.x) * fraction,
    y: from.y + (to.y - from.y) * fraction
  };

  seq.effect()
    .copySprite(source)
    .atLocation(source)
    .aboveLighting()
    .opacity(options.opacity ?? 0.34)
    .duration(options.duration ?? 520)
    .fadeOut(options.fadeOut ?? 420)
    .moveTowards(destination, { ease: options.ease ?? "easeOutCubic" })
    .delay(options.delay ?? 0);
}

function ensureReady(mode = "auto") {
  if (!canvas?.ready) {
    if (mode === "manual") notify("warn", "请先进入一个已加载的场景。");
    return false;
  }
  if (!isSequencerReady()) {
    if (mode === "manual") notify("error", "Sequencer 未就绪，无法播放定制特效。");
    return false;
  }
  if (!hasVisualPacks()) {
    if (mode === "manual") notify("warn", "没有检测到 JB2A/动画资源包，部分特效可能缺失。");
  }
  return true;
}

function isSequencerReady() {
  return Boolean(game.modules.get("sequencer")?.active && globalThis.Sequence && globalThis.Sequencer?.Database);
}

function hasVisualPacks() {
  return Boolean(
    game.modules.get("jb2a_patreon")?.active ||
    game.modules.get("JB2A_DnD5e")?.active ||
    game.modules.get("jaamod")?.active ||
    game.modules.get("blfx-assets-pack01")?.active ||
    dbEntryExists("jb2a.guiding_bolt.01.blueyellow.60ft")
  );
}

function dbEntryExists(path) {
  try {
    return Boolean(globalThis.Sequencer?.Database?.entryExists(path));
  } catch (error) {
    return false;
  }
}

function firstExisting(paths) {
  const list = Array.isArray(paths) ? paths : [paths];
  if (!list.length) return "";
  if (!isSequencerReady()) return list[0];
  return list.find((path) => dbEntryExists(path)) ?? list[0];
}

function pickExisting(paths, index = 0) {
  const list = Array.isArray(paths) ? paths : [paths];
  if (!list.length) return "";
  const start = Math.abs(index) % list.length;
  return firstExisting([...list.slice(start), ...list.slice(0, start)]);
}

async function maybePreloadAssets() {
  if (!isSequencerReady()) return;
  try {
    const assetGroups = Object.values(ASSETS).flatMap((entry) => {
      if (Array.isArray(entry)) return [entry];
      if (entry && typeof entry === "object") return Object.values(entry);
      return [];
    });
    const files = [...new Set(assetGroups.map(firstExisting).filter(Boolean))];
    await Sequencer.Preloader?.preload?.(files, false);
  } catch (error) {
    debugLog("预载资源失败", error);
  }
}

function reportMissingDependencies() {
  if (!game.user?.isGM) return;
  if (!game.modules.get("sequencer")?.active) {
    notify("warn", "玩家定制特效库需要启用 Sequencer。");
  }
  if (!hasVisualPacks()) {
    notify("warn", "没有检测到 JB2A、JAA、BLFX 等动画资源包，定制特效可能无法完整播放。");
  }
}

function findProfileForActor(actor) {
  if (!actor) return null;
  const assignedProfileId = getAssignedProfileId(actor);
  if (assignedProfileId && preparedProfiles.has(assignedProfileId)) {
    return preparedProfiles.get(assignedProfileId);
  }

  const actorName = normalizeText(actor.name);
  for (const profile of preparedProfiles.values()) {
    if (profile.actorIds?.includes?.(actor.id)) return profile;
    if (profile.normalizedActorNames.has(actorName)) return profile;
  }
  return null;
}

function getAssignedProfileId(actor) {
  if (!actor) return "";
  const assignments = setting("actorProfileAssignments") ?? {};
  return String(assignments[actorAssignmentKey(actor)] ?? assignments[actor.uuid] ?? assignments[actor.id] ?? "");
}

function actorAssignmentKey(actor) {
  return actor?.uuid || actor?.id || "";
}

function findEffectForItem(profile, item) {
  if (!profile || !item) return null;
  const id = item.id ?? item._id;
  const normalizedNames = normalizedItemNames(item);
  return profile.effects.find((effect) => {
    if (id && effect.itemIds.has(id)) return true;
    return effectMatchesNormalizedNames(effect, normalizedNames);
  }) ?? null;
}

function effectMatchesNormalizedNames(effect, normalizedNames = []) {
  if (!effect || !normalizedNames.length) return false;
  for (const normalizedName of normalizedNames) {
    if (effect.normalizedNames.has(normalizedName)) return true;
    if (Array.from(effect.normalizedNames ?? []).some((alias) =>
      alias.length > 3 && normalizedName.length > 3 && (normalizedName.includes(alias) || alias.includes(normalizedName))
    )) {
      return true;
    }
  }
  return false;
}

function normalizedItemNames(item) {
  return [...new Set(itemCandidateNames(item).map(normalizeText).filter(Boolean))];
}

function itemCandidateNames(item) {
  if (!item) return [];
  const source = item._source ?? {};
  const values = [
    item.name,
    item.system?.identifier,
    item.system?.slug,
    item.getFlag?.("babele", "originalName"),
    item.getFlag?.("babele", "originalPayload")?.name,
    foundry.utils.getProperty(item, "flags.babele.originalName"),
    foundry.utils.getProperty(item, "flags.babele.originalPayload.name"),
    foundry.utils.getProperty(source, "flags.babele.originalName"),
    foundry.utils.getProperty(source, "flags.babele.originalPayload.name")
  ];

  for (const activity of collectionValues(item.system?.activities)) {
    values.push(
      activity?.name,
      activity?.identifier,
      foundry.utils.getProperty(activity, "flags.babele.originalName"),
      foundry.utils.getProperty(activity, "flags.babele.originalPayload.name")
    );
  }

  return values.filter((value) => typeof value === "string" && value.trim());
}

function collectionValues(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value.values === "function") return Array.from(value.values());
  if (typeof value === "object") return Object.values(value);
  return [];
}

function effectUsesMeasuredTemplate(effect) {
  return Boolean(effect?.usesMeasuredTemplate || effect?.category === "template" || ["burningHands", "daylightScroll"].includes(effect?.sequence));
}

function isEffectConfiguredEnabled(effect, item = null) {
  const override = getEffectOverride(effect.key);
  if (typeof override?.enabled === "boolean") return override.enabled;
  if (item && autoAnimationStatus(item).level === "disabled" && effect.defaultEnabled === false) return true;
  return effect.defaultEnabled !== false;
}

function isEffectPlayable(profile, effect, item) {
  if (!isEffectConfiguredEnabled(effect, item)) return false;
  return !externalAnimationGuard(effect, item).guarded;
}

function externalAnimationGuard(effect, item) {
  const aa = autoAnimationStatus(item);
  if (setting("respectAaAnimations") && aa.active && !effect.ignoreAaGuard) {
    return {
      guarded: true,
      type: "aa",
      label: "AA保护",
      className: "aa-guarded",
      hint: aa.hint
    };
  }

  const crp = crpStatus(item);
  if (setting("respectCrpAnimations") && crp.hasAnimation && !effect.ignoreCrpGuard) {
    return {
      guarded: true,
      type: "crp",
      label: "CRP保护",
      className: "crp-guarded",
      hint: "Chris Premades 已经提供动画，本模块自动避让。"
    };
  }

  return {
    guarded: false,
    type: "",
    label: "",
    className: "",
    hint: ""
  };
}

function getEffectOverride(key) {
  const world = (setting("effectOverrides") ?? {})[key] ?? null;
  const personal = (setting("personalEffectOverrides") ?? {})[key] ?? null;
  if (!game.user?.isGM && personal) return { ...(world ?? {}), ...personal };
  return world ?? personal ?? null;
}

function effectStatusLabel(effect, configuredEnabled, playable, guard) {
  if (!effect) return "未配置";
  if (!configuredEnabled) return "已停用";
  if (guard?.guarded) return guard.label;
  return playable ? "可自动" : "待检查";
}

function effectStatusClass(effect, configuredEnabled, playable, guard) {
  if (!effect) return "not-configured";
  if (!configuredEnabled) return "disabled";
  if (guard?.guarded) return guard.className;
  return playable ? "enabled" : "disabled";
}

function effectFloatingText(effect, fallback) {
  const override = getEffectOverride(effect.key);
  return String(override?.floatingText || fallback || effect.label || "").trim();
}

function editableOverrideSettingKey() {
  return game.user?.isGM ? "effectOverrides" : "personalEffectOverrides";
}

function editableModeSettingKey() {
  return game.user?.isGM ? "effectModeOverrides" : "personalEffectModeOverrides";
}

function itemEffectModeKey(actor, item) {
  return actor?.uuid || actor?.id ? `${actorAssignmentKey(actor)}.${item?.id ?? item?.name ?? ""}` : String(item?.id ?? item?.name ?? "");
}

function getItemEffectMode(actor, item) {
  if (!actor || !item) return "auto";
  const assignments = setting("effectModeOverrides") ?? {};
  const personal = setting("personalEffectModeOverrides") ?? {};
  const key = itemEffectModeKey(actor, item);
  const value = !game.user?.isGM && personal[key] ? personal[key] : assignments[key] ?? personal[key] ?? "auto";
  return normalizeEffectMode(value);
}

async function writeItemEffectMode(actor, item, mode) {
  if (!actor || !item) return false;
  const key = itemEffectModeKey(actor, item);
  const settingKey = editableModeSettingKey();
  const overrides = cloneObject(setting(settingKey) ?? {});
  const nextMode = normalizeEffectMode(mode);
  if (nextMode === "auto") delete overrides[key];
  else overrides[key] = nextMode;
  await game.settings.set(MODULE_ID, settingKey, overrides);
  return true;
}

function effectBlockedMessage(effect, item) {
  if (!isEffectConfiguredEnabled(effect, item)) return `${effect.label} 已停用。`;
  const guard = externalAnimationGuard(effect, item);
  if (guard.guarded) return `${effect.label} 当前被${guard.label}；请在控制面板点击该条目的 ${guard.type.toUpperCase()} 按钮关闭外部动画。`;
  return `${effect.label} 当前不可播放。`;
}

function crpStatus(item) {
  const flags = item?.flags ?? {};
  const crp = flags["chris-premades"];
  const animationFlag = Boolean(
    foundry.utils.getProperty(item, "flags.chris-premades.info.hasAnimation") ||
    foundry.utils.getProperty(item, "flags.chris-premades.config.animation")
  );
  const playAnimation = foundry.utils.getProperty(item, "flags.chris-premades.config.playAnimation");
  const hasAnimation = Boolean(animationFlag && playAnimation !== false);

  if (!crp) {
    return {
      present: false,
      hasAnimation: false,
      level: "none",
      label: "无CRP"
    };
  }

  return {
    present: true,
    hasAnimation,
    level: hasAnimation ? "animation" : playAnimation === false ? "disabled" : "automation",
    label: hasAnimation ? "CRP动画" : playAnimation === false ? "CRP动画关" : "CRP自动化"
  };
}

function autoAnimationStatus(item) {
  if (!game.modules.get("autoanimations")?.active) {
    return {
      active: false,
      level: "none",
      label: "无AA",
      hint: "Auto Animations 未启用。"
    };
  }

  const flags = item?.flags ?? {};
  const itemFlags = flags.autoanimations || flags["autoanimations"] || flags["auto-animations"];
  if (itemFlags) {
    if (itemFlags.killAnim || itemFlags.isEnabled === false) {
      return {
        active: false,
        level: "disabled",
        label: "AA已关",
        hint: "该条目的 Auto Animations 已在物品/活动配置中关闭。"
      };
    }
    if (itemFlags.isCustomized || itemFlags.override || itemFlags.macro?.enable || itemFlags.primary || itemFlags.animation) {
      return {
        active: true,
        level: "item",
        label: "AA物品",
        hint: "该条目有物品级 Auto Animations 配置，本模块默认避让。"
      };
    }
  }

  if (safeGameSetting("autoanimations", "disableAutoRec")) {
    return {
      active: false,
      level: "disabled",
      label: "AA菜单关",
      hint: "Auto Animations 自动识别菜单已全局关闭。"
    };
  }

  const match = findAutoAnimationAutorecMatch(item);
  if (match) {
    return {
      active: true,
      level: "autorec",
      label: `AA自动:${match.menu}`,
      hint: `命中 Auto Animations 自动识别条目：${match.label}。`
    };
  }

  return {
    active: false,
    level: "none",
    label: "无AA",
    hint: "没有检测到物品级或自动识别 AA 动画。"
  };
}

function findAutoAnimationAutorecMatch(item) {
  if (!item?.name) return null;

  const itemName = String(item.name);
  const rinsedItemName = rinseAutoAnimationName(itemName);
  const menus = {};
  for (const menu of AA_AUTOREC_MENUS) {
    const value = safeGameSetting("autoanimations", `aaAutorec-${menu}`);
    menus[menu] = Array.isArray(value) ? value : [];
  }

  const exact = [];
  const best = [];
  for (const [menu, entries] of Object.entries(menus)) {
    for (const entry of entries) {
      if (!entry?.label || entry.isEnabled === false) continue;
      const bucket = entry.advanced?.exactMatch ? exact : best;
      bucket.push({ ...entry, menu });
    }
  }

  exact.sort(sortAaMatchPriority);
  best.sort(sortAaMatchPriority);

  return exact.find((entry) => entry.label === itemName) ??
    best.find((entry) => aaEntryMatches(entry, rinsedItemName)) ??
    null;
}

function aaEntryMatches(entry, rinsedItemName) {
  const label = rinseAutoAnimationName(entry.label);
  if (!label || !rinsedItemName.includes(label)) return false;

  const excluded = entry.advanced?.excludedTerms ?? [];
  return !excluded.some((term) => rinsedItemName.includes(rinseAutoAnimationName(term)));
}

function sortAaMatchPriority(a, b) {
  return rinseAutoAnimationName(b.label).length - rinseAutoAnimationName(a.label).length;
}

function rinseAutoAnimationName(value) {
  return String(value ?? "").replace(/\s+/g, "").toLowerCase();
}

function itemLevel(item) {
  if (item.type !== "spell") return "";
  const level = Number(item.system?.level ?? 0);
  return level === 0 ? "戏法" : `${level}环`;
}

function itemTypeLabel(row) {
  if (row.type === "spell") return row.level || "法术";
  if (row.type === "feat") return "特性";
  if (row.type === "weapon") return "武器";
  if (row.type === "consumable") return "消耗品";
  return row.type;
}

function workflowTargets(workflow) {
  const sets = [
    workflow?.hitTargets,
    workflow?.targets,
    workflow?.failedSaves,
    workflow?.saves
  ];

  const tokens = [];
  for (const set of sets) {
    for (const token of tokensFromCollection(set)) tokens.push(token);
    if (tokens.length) break;
  }
  return uniqueTokens(tokens);
}

function activityTargets(activity, usageConfig, results) {
  const buckets = [
    results?.targets,
    results?.hitTargets,
    usageConfig?.targets,
    usageConfig?.target?.tokens,
    activity?.targets,
    game.user?.targets
  ];

  const tokens = [];
  for (const bucket of buckets) {
    for (const token of tokensFromCollection(bucket)) tokens.push(token);
    if (tokens.length) break;
  }
  return uniqueTokens(tokens);
}

function measuredTemplatesFromContext(context = {}) {
  const buckets = [
    context.templates,
    context.results?.templates,
    context.workflow?.templates,
    context.workflow?.template,
    context.workflow?.templateId,
    context.workflow?.templateUuid,
    context.message?.system?.templates
  ];

  const templates = [];
  for (const bucket of buckets) {
    for (const template of templatesFromCollection(bucket)) templates.push(template);
    if (templates.length) break;
  }
  return uniqueTemplates(templates);
}

function templatesFromCollection(value) {
  if (!value) return [];
  const single = normalizeMeasuredTemplate(value);
  if (single) return [single];

  const entries = value instanceof Set
    ? Array.from(value)
    : value instanceof Map
      ? Array.from(value.values())
      : Array.isArray(value)
        ? value
        : Array.isArray(value.contents)
          ? value.contents
          : typeof value.values === "function"
            ? Array.from(value.values())
            : typeof value === "object"
              ? Object.values(value)
              : [];

  return entries.map(normalizeMeasuredTemplate).filter(Boolean);
}

function normalizeMeasuredTemplate(value) {
  if (!value) return null;
  if (typeof value === "string") {
    if (value.startsWith("Scene.") || value.startsWith("MeasuredTemplate.")) return globalThis.fromUuidSync?.(value)?.object ?? null;
    return canvas?.templates?.get?.(value) ?? canvas?.templates?.placeables?.find((template) => template.id === value) ?? null;
  }
  if (value.documentName === "MeasuredTemplate" && value.object) return value.object;
  if (value.document?.documentName === "MeasuredTemplate") return value;
  if (value.object?.document?.documentName === "MeasuredTemplate") return value.object;
  if (value.id && canvas?.templates?.get?.(value.id)) return canvas.templates.get(value.id);
  return null;
}

function uniqueTemplates(templates) {
  const seen = new Set();
  const unique = [];
  for (const template of templates) {
    const id = template?.id ?? template?.document?.uuid ?? template?.document?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    unique.push(template);
  }
  return unique;
}

function tokensFromCollection(value) {
  if (!value) return [];
  const single = normalizeToken(value);
  if (single) return [single];

  const entries = value instanceof Set
    ? Array.from(value)
    : value instanceof Map
      ? Array.from(value.values())
      : Array.isArray(value)
        ? value
        : Array.isArray(value.contents)
          ? value.contents
          : typeof value.values === "function"
            ? Array.from(value.values())
            : Object.values(value);

  const tokens = [];
  for (const entry of entries) {
    const token = normalizeToken(entry) ?? normalizeToken(entry?.token) ?? normalizeToken(entry?.document);
    if (token) tokens.push(token);
  }
  return tokens;
}

function selectedSource(fallback = null) {
  return normalizeToken(canvas?.tokens?.controlled?.[0]) ?? fallback ?? null;
}

function selectedTargets(fallback = null) {
  const targets = Array.from(game.user?.targets ?? []).map(normalizeToken).filter(Boolean);
  if (!targets.length && fallback) targets.push(fallback);
  return uniqueTokens(targets);
}

function normalizeToken(value) {
  if (!value) return null;
  if (value.document && value.actor) return value;
  if (value.object?.document && value.object?.actor) return value.object;
  if (value.token?.document && value.token?.actor) return value.token;
  if (value.id && canvas?.tokens?.get?.(value.id)) return canvas.tokens.get(value.id);
  if (value.documentName === "Token" && value.object) return value.object;
  return null;
}

function placeableCenter(placeable) {
  if (!placeable) return null;
  if (placeable.center) return { x: placeable.center.x, y: placeable.center.y };
  const doc = placeable.document ?? placeable;
  const x = Number(doc.x ?? placeable.x);
  const y = Number(doc.y ?? placeable.y);
  if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  return null;
}

function templateGeometry(template, fallbackSource = null) {
  if (!template) return null;
  const doc = template.document ?? template;
  const docX = Number(doc.x);
  const docY = Number(doc.y);
  const origin = Number.isFinite(docX) && Number.isFinite(docY)
    ? { x: docX, y: docY }
    : placeableCenter(template) ?? placeableCenter(fallbackSource);
  if (!origin) return null;

  const direction = Number(doc.direction ?? template.direction ?? 0);
  const distance = Number(doc.distance ?? template.distance ?? 15);
  const gridSize = Number(canvas?.grid?.size ?? 100);
  const gridDistance = Number(canvas?.scene?.grid?.distance ?? 5) || 5;
  const pixelDistance = distance / gridDistance * gridSize;
  const radians = direction * Math.PI / 180;
  const center = {
    x: origin.x + Math.cos(radians) * pixelDistance * 0.5,
    y: origin.y + Math.sin(radians) * pixelDistance * 0.5
  };

  return {
    origin,
    center,
    direction,
    distance,
    scale: clamp(distance / 15, 0.72, 3)
  };
}

function tokenForActor(actor) {
  if (!actor || !canvas?.ready) return null;
  const active = actor.getActiveTokens?.(true, true) ?? [];
  return active[0] ?? canvas.tokens?.placeables?.find((token) => token.actor?.id === actor.id) ?? null;
}

function actorFromSpeaker(speaker) {
  if (!speaker) return null;
  const token = tokenFromSpeaker(speaker);
  if (token?.actor) return token.actor;
  return speaker.actor ? game.actors?.get(speaker.actor) : null;
}

function tokenFromSpeaker(speaker) {
  if (!speaker?.token) return null;
  return canvas?.tokens?.get?.(speaker.token) ?? null;
}

function itemFromChatMessage(message, actor) {
  const flags = message?.flags ?? {};
  const dnd5eItem = flags.dnd5e?.item;
  const midiItem = flags["midi-qol"]?.item;
  const itemId = dnd5eItem?.id ?? dnd5eItem?._id ?? midiItem?.id ?? midiItem?._id ?? flags.dnd5e?.itemId;
  const itemName = dnd5eItem?.name ?? midiItem?.name ?? flags.dnd5e?.itemName;
  return (itemId ? actor.items?.get(itemId) : null) ??
    (itemName ? actor.items?.find((item) => item.name === itemName) : null) ??
    null;
}

function uniqueTokens(tokens) {
  const seen = new Set();
  const unique = [];
  for (const token of tokens) {
    const id = token?.id ?? token?.document?.uuid ?? token?.name;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    unique.push(token);
  }
  return unique;
}

function isDuplicateEvent(key, windowMs = 1400) {
  const now = Date.now();
  const previous = duplicateEvents.get(key) ?? 0;
  duplicateEvents.set(key, now);

  for (const [entryKey, timestamp] of duplicateEvents.entries()) {
    if (now - timestamp > 5000) duplicateEvents.delete(entryKey);
  }
  return now - previous < windowMs;
}

function duplicateWindowForContext(effect, context = {}, fallback = 1400) {
  if (isCprMagicMissileSyntheticContext(effect, context)) return 0;
  return fallback;
}

function shouldSkipCprMagicMissileController(effect, context = {}) {
  if (context.trigger === "preview" || context.manual) return false;
  if (!isMagicMissileEffect(effect, context.item)) return false;
  if (!hasCprMagicMissileController(context.item)) return false;
  if (isCprMagicMissileSyntheticContext(effect, context)) return false;
  return true;
}

function isCprMagicMissileSyntheticContext(effect, context = {}) {
  if (!isMagicMissileEffect(effect, context.item)) return false;
  const id = activityIdentifier(context.workflow?.activity ?? context.activity);
  return id.includes("magicmissilebolt") || id.includes("magicmissileflat");
}

function hasCprMagicMissileController(item) {
  if (!item) return false;
  if (!game.modules.get("chris-premades")?.active && !item.flags?.["chris-premades"]) return false;
  const activities = item.system?.activities;
  const activityList = Array.isArray(activities?.contents)
    ? activities.contents
    : typeof activities?.values === "function"
      ? Array.from(activities.values())
      : Array.isArray(activities)
        ? activities
        : activities && typeof activities === "object"
          ? Object.values(activities)
          : [];
  const activityIds = activityList
    .map((entry) => activityIdentifier(entry))
    .filter(Boolean);
  const flagText = normalizeText(JSON.stringify(item.flags?.["chris-premades"] ?? {}));
  return (
    flagText.includes("magicmissile") ||
    activityIds.some((id) => id.includes("magicmissile")) ||
    isMagicMissileEffect(null, item)
  );
}

function isMagicMissileEffect(effect, item = null) {
  const haystack = normalizeText(`${effect?.sequence ?? ""} ${effect?.label ?? ""} ${item?.name ?? ""} ${(effect?.itemNames ? [...effect.itemNames] : []).join(" ")}`);
  return haystack.includes("magicmissile") || haystack.includes("魔法飞弹");
}

function activityIdentifier(activity) {
  return normalizeText(activity?.identifier ?? activity?.id ?? activity?.name ?? "");
}

function magicMissileShotCount(ctx, targetList = []) {
  if (isCprMagicMissileSyntheticContext(ctx.effect, ctx)) return 1;
  const castLevel = Number(
    ctx.workflow?.castData?.castLevel ??
    ctx.workflow?.workflowOptions?.spellLevel ??
    ctx.workflow?.options?.spellLevel ??
    ctx.activity?.item?.system?.level ??
    ctx.item?.system?.level ??
    1
  );
  if (Number.isFinite(castLevel) && castLevel > 0) return clamp(Math.floor(castLevel) + 2, 3, 9);
  return clamp(Math.max(3, targetList.length + 2), 3, 9);
}

function eventKey(actor, item, activity = null) {
  const activityId = activityIdentifier(activity);
  return `${actor?.uuid ?? actor?.id ?? "actor"}|${item?.id ?? item?._id ?? item?.name ?? "item"}|${activityId}`;
}

function getQualityProfile() {
  return QUALITY.cinematic;
}

function triggerLabel(trigger) {
  if (trigger === "midi") return "Midi结算后";
  if (trigger === "activity") return "活动使用后";
  if (trigger === "chat") return "聊天卡回退";
  if (trigger === "preview") return "手动预览";
  return "手动";
}

function isAutoPlayEnabled() {
  if (!setting("autoPlayEnabled")) return false;
  if (game.user?.isGM) return true;
  return Boolean(setting("clientAutoPlayEnabled"));
}

function shouldHandleAutoplay(actor) {
  if (!isAutoPlayEnabled()) return false;
  if (setting("gmOnlyAutoplay")) return Boolean(game.user?.isGM);
  if (game.user?.isGM) return !hasActiveNonGmOwner(actor);
  return canControlActor(actor) && isPrimaryActiveOwner(actor);
}

function shouldHandleLocalActivity(actor) {
  if (!isAutoPlayEnabled()) return false;
  if (setting("gmOnlyAutoplay")) return Boolean(game.user?.isGM);
  return canControlActor(actor);
}

function hasActiveNonGmOwner(actor) {
  return activeNonGmOwners(actor).length > 0;
}

function isPrimaryActiveOwner(actor) {
  const owners = activeNonGmOwners(actor);
  if (!owners.length) return false;
  return owners[0]?.id === game.user?.id;
}

function activeNonGmOwners(actor) {
  return Array.from(game.users ?? [])
    .filter((user) => user.active && !user.isGM && actorUserCanControl(actor, user))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function canOpenPanel() {
  return Boolean(game.user?.isGM || setting("allowPlayerPanel"));
}

function canViewActor(actor) {
  return Boolean(game.user?.isGM || actorUserCanControl(actor, game.user));
}

function canControlActor(actor) {
  return Boolean(game.user?.isGM || actorUserCanControl(actor, game.user));
}

function actorUserCanControl(actor, user) {
  if (!actor || !user) return false;
  try {
    if (typeof actor.testUserPermission === "function") return actor.testUserPermission(user, "OWNER");
  } catch (error) {
    return false;
  }
  return Boolean(actor.isOwner);
}

async function runMigrations() {
  if (!game.user?.isGM) return;
  let version = Number(setting("migrationVersion") ?? 0);
  if (version < 2) {
    await game.settings.set(MODULE_ID, "gmOnlyAutoplay", false);
    await game.settings.set(MODULE_ID, "migrationVersion", 2);
    version = 2;
  }
  if (version < 3) {
    await migrateXinghaiPollutedOverrides();
    await game.settings.set(MODULE_ID, "migrationVersion", 3);
    version = 3;
  }
  if (version < 4) {
    await migrateCrossProfilePollutedOverrides();
    await game.settings.set(MODULE_ID, "migrationVersion", 4);
  }
}

async function migrateXinghaiPollutedOverrides() {
  const changedWorld = await cleanXinghaiPollutedOverrideSetting("effectOverrides");
  const changedPersonal = await cleanXinghaiPollutedOverrideSetting("personalEffectOverrides");
  if (changedWorld || changedPersonal) notify("info", "已清理星海法术的旧污染浮字覆盖。");
}

async function cleanXinghaiPollutedOverrideSetting(settingKey) {
  const overrides = cloneObject(setting(settingKey) ?? {});
  let changed = false;
  for (const [key, entry] of Object.entries(overrides)) {
    if (!key.startsWith(`${XINGHAI_PROFILE.id}.`) || !entry || typeof entry !== "object") continue;
    const floatingText = String(entry.floatingText ?? "").trim();
    if (!floatingText || !XINGHAI_POLLUTED_FLOATING_TEXT.test(floatingText)) continue;
    const nextEntry = { ...entry };
    delete nextEntry.floatingText;
    if (Object.keys(nextEntry).length) overrides[key] = nextEntry;
    else delete overrides[key];
    changed = true;
  }
  if (changed) await game.settings.set(MODULE_ID, settingKey, overrides);
  return changed;
}

async function migrateCrossProfilePollutedOverrides() {
  const changedWorld = await cleanCrossProfileOverrideSetting("effectOverrides");
  const changedPersonal = await cleanCrossProfileOverrideSetting("personalEffectOverrides");
  if (changedWorld || changedPersonal) notify("info", "已清理跨角色污染浮字覆盖。");
}

async function cleanCrossProfileOverrideSetting(settingKey) {
  const overrides = cloneObject(setting(settingKey) ?? {});
  let changed = false;
  for (const [key, entry] of Object.entries(overrides)) {
    if (!entry || typeof entry !== "object") continue;
    const profileId = String(key).split(".")[0] ?? "";
    const floatingText = String(entry.floatingText ?? "").trim();
    if (!floatingText || !isCrossProfilePollutedFloatingText(profileId, floatingText)) continue;
    const nextEntry = { ...entry };
    delete nextEntry.floatingText;
    if (Object.keys(nextEntry).length) overrides[key] = nextEntry;
    else delete overrides[key];
    changed = true;
  }
  if (changed) await game.settings.set(MODULE_ID, settingKey, overrides);
  return changed;
}

function isCrossProfilePollutedFloatingText(profileId, floatingText) {
  if (profileId === XINGHAI_PROFILE.id && XINGHAI_LEGACY_FLOATING_TEXT.test(floatingText)) return false;
  if (profileId === XINGHAI_PROFILE.id && XINGHAI_POLLUTED_FLOATING_TEXT.test(floatingText)) return true;
  for (const [otherProfileId, signature] of Object.entries(PROFILE_SIGNATURES)) {
    if (otherProfileId === profileId) continue;
    if (signature?.tag && (floatingText.startsWith(`${signature.tag}·`) || floatingText === signature.tag)) return true;
  }
  return CROSS_PROFILE_FLOATING_TEXT_MARKERS.some(({ owner, pattern }) => owner !== profileId && pattern.test(floatingText));
}

function addSceneControlButton(controls) {
  const tool = {
    name: MODULE_ID,
    title: "玩家定制特效库",
    icon: "fas fa-sun",
    button: true,
    visible: canOpenPanel(),
    onClick: () => togglePanel()
  };

  try {
    if (Array.isArray(controls)) {
      const tokenControls = controls.find((control) => control.name === "token") ?? controls[0];
      if (Array.isArray(tokenControls?.tools)) tokenControls.tools.push(tool);
      return;
    }

    const tokenControls = controls.tokens ?? controls.token ?? Object.values(controls).find((control) => control.name === "token");
    if (!tokenControls) return;
    if (Array.isArray(tokenControls.tools)) {
      tokenControls.tools.push(tool);
    } else if (tokenControls.tools instanceof Map) {
      tokenControls.tools.set(MODULE_ID, tool);
    } else if (tokenControls.tools && typeof tokenControls.tools === "object") {
      tokenControls.tools[MODULE_ID] = tool;
    }
  } catch (error) {
    console.warn(`${MODULE_TITLE} | 添加场景控制按钮失败`, error);
  }
}

function setting(key) {
  return game.settings.get(MODULE_ID, key);
}

function safeGameSetting(namespace, key) {
  try {
    return game.settings.get(namespace, key);
  } catch (error) {
    return null;
  }
}

function notify(type, message) {
  ui.notifications?.[type]?.(message);
}

function debugLog(...args) {
  if (setting("debug")) console.debug(`${MODULE_TITLE} |`, ...args);
}

function cloneObject(value) {
  return foundry.utils.deepClone(value ?? {});
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s'"’‘“”\-_:：，,。.!！?？]/g, "");
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

function escapeCssIdentifier(value) {
  if (globalThis.CSS?.escape) return CSS.escape(String(value ?? ""));
  return String(value ?? "").replace(/["\\]/g, "\\$&");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
