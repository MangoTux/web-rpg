const basic_attack_multiplier = (scope) => {
  if (scope.source.hasFeatureActive('master_improved_weaponry')) { return 4; }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) { return 3; }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) { return 2; }
  return 1;
}

ActionCatalog.catalog['basic_punch'] = new Attack("Basic Punch", "A basic punch");
ActionCatalog.catalog['basic_punch'].setAccuracy(0.9);
ActionCatalog.catalog['basic_punch'].setPowerFunction((scope) => {
  let power = getRandomInt(20, 22);
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});

ActionCatalog.catalog['basic_slash'] = new Attack("Basic Slash", "A basic slash");
ActionCatalog.catalog['basic_slash'].requireItemProperty("slash");
ActionCatalog.catalog['basic_slash'].setAccuracy(0.95);
ActionCatalog.catalog['basic_slash'].setPowerFunction((scope) => {
  let power = getRandomInt(18, 20);
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});

ActionCatalog.catalog['basic_kick'] = new Attack("Basic Kick", "A basic kick");
ActionCatalog.catalog['basic_kick'].setAccuracy(0.8);
ActionCatalog.catalog['basic_kick'].setPowerFunction((scope) => {
  let power = getRandomInt(15, 20);
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});
ActionCatalog.catalog['basic_kick'].setCriticalModifier(+2);
ActionCatalog.catalog['basic_kick'].registerHook("onMiss", (scope) => { console.log("Ha! You missed."); })

ActionCatalog.catalog['basic_stab'] = new Attack("Basic Stab", "A basic stab", 1);
ActionCatalog.catalog['basic_stab'].requireItemProperty("pierce");
ActionCatalog.catalog['basic_stab'].setAccuracy(0.7);
ActionCatalog.catalog['basic_stab'].setCriticalModifier(+4);
ActionCatalog.catalog['basic_stab'].setPowerFunction((scope) => {
  let power = getRandomInt(10, 15);
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});

ActionCatalog.catalog['basic_crush'] = new Attack("Basic Crush", "A basic blow of a bludgeoning weapon");
ActionCatalog.catalog['basic_crush'].requireItemProperty("bludgeon");
ActionCatalog.catalog['basic_crush'].setAccuracy(0.7);
ActionCatalog.catalog['basic_crush'].setPowerFunction((scope) => {
  let power = getRandomInt(35, 40);
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});

ActionCatalog.catalog['basic_bolt'] = new Attack("Basic Bolt", "A basic magical bolt");
ActionCatalog.catalog['basic_bolt'].setAccuracy(999);
ActionCatalog.catalog['basic_bolt'].setAttackType("spirit");
ActionCatalog.catalog['basic_bolt'].setPowerFunction((scope) => {
  let power = 10;
  let multiplier = basic_attack_multiplier(scope);

  return power * multiplier;
});

ActionCatalog.catalog['flurry_of_blows'] = new Attack("Flurry of Blows", "Three quick attacks");
ActionCatalog.catalog['flurry_of_blows'].setAccuracy(0.75);
ActionCatalog.catalog['flurry_of_blows'].setHitCount(3);
ActionCatalog.catalog['flurry_of_blows'].setDamageBounds(
  (scope) => Math.ceil(scope.source.level / 2),
  (scope) => Math.ceil(scope.source.level / 2),
);
ActionCatalog.catalog['flurry_of_blows'].registerHook(
  "onStart",
  (scope) => { scope.hit_counter = 0; }
);
ActionCatalog.catalog['flurry_of_blows'].registerHook(
  "onHit",
  (scope) => { scope.hit_counter++; }
);
ActionCatalog.catalog['flurry_of_blows'].registerHook(
  "onEnd",
  (scope) => { if (scope.hit_counter == scope.hit_count) { console.log("Knock the target prone"); }}
);

ActionCatalog.catalog['cinder_sweep'] = new Attack("Fireball", "A large ball of fire");
ActionCatalog.catalog['cinder_sweep'].setAccuracy(0.7);
ActionCatalog.catalog['cinder_sweep'].allowPartialDamage(0.5);
ActionCatalog.catalog['cinder_sweep'].setTargetCount(5);
ActionCatalog.catalog['cinder_sweep'].setDamageRoll(
  (scope) => { let total = 0; for (let i=0; i<8; i++) { total += getRandomInt(1, 6); } return total; }
);

ActionCatalog.catalog['frenzy'] = new Ability("Frenzy", "Take two actions");
ActionCatalog.catalog['frenzy'].setUseCount((scope) => { return Math.ceil(scope.source.level / 10) });
ActionCatalog.catalog['frenzy'].setBehavior((scope) => {
  // Push self uid twice at the front of initiative.
  scope.text = "You summon up a reserve of energy to take additional actions!";
  environment.encounter.combat.initiative.unshift(scope.source.uid);
  environment.encounter.combat.initiative.unshift(scope.source.uid);
});

ActionCatalog.catalog['summon_companion'] = new Ability("Summon Companion", "Summon a familiar to aid you");
ActionCatalog.catalog['summon_companion'].setUseCount((scope) => Math.ceil(scope.source.level / 10));
ActionCatalog.catalog['summon_companion'].setBehavior((scope) => {
  let side = environment.encounter.combat.participants[scope.source.uid].side;
  let companion = new NPC("Familiar");
  companion.name = `${scope.source.name}\'s Familiar`;
  companion.uid = `${scope.source.uid}_companion`;
  companion.ai = new LoyalAI(companion);

  companion.base_combat_stats.power = Math.floor(2 * scope.source.get_stat("power") / 3);
  companion.base_combat_stats.dexterity = Math.floor(2 * scope.source.get_stat("dexterity") / 3);
  if (scope.source.hasFeatureActive('improved_companion')) {
    companion.hp.buffer = 20;
    companion.base_combat_stats.power = scope.source.get_stat("power");
    companion.base_combat_stats.dexterity = scope.source.get_stat("dexterity");
  }
  // Restore the familiar if it already exists
  if (typeof environment.encounter.combat.participants[companion.uid] !== "undefined") {
    environment.encounter.combat.participants[companion.uid].entity = companion;
    scope.text = "You revitalize your familiar!";
    return;
  }
  scope.text = "You call a familiar to your aid!";
  environment.encounter.combat.participants[companion.uid] = {
    side: side,
    entity: companion,
    active_effects: [],
    move_quota: {},
  };
  if (side == "ally") {
    environment.encounter.combat.ally_list.push(companion);
  } else {
    environment.encounter.combat.enemy_list.push(companion);
  }
});

ActionCatalog.catalog['arcane_ward'] = new Ability("Arcane Ward", "Create a shield that absorbs damage");
ActionCatalog.catalog['arcane_ward'].setUseCount((scope) => Math.ceil(scope.source.level/10));
ActionCatalog.catalog['arcane_ward'].setBehavior((scope) => {
  let buffer = 20; // Grants a 20-hp buffer
  // Future notes: Elementalist may have a damage return - something about an active effect later on?
  if (scope.source.hp.buffer > 0) {
    scope.text = "You revitalize your buffer!";
    scope.source.buffer += 10;
  } else {
    scope.text = "You summon a defensive aura!";
    scope.source.buffer = buffer;
  }
});
