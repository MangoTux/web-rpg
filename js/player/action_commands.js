ActionCatalog.catalog['basic_punch'] = new Attack("Basic Punch", "A basic punch");
ActionCatalog.catalog['basic_punch'].setAccuracy(0.9);
ActionCatalog.catalog['basic_punch'].setPowerFunction((scope) => {
  let power = getRandomInt(20, 22);
  if (scope.source.hasFeatureActive('master_improved_weaponry')) {
    return power * 6;
  }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) {
    return power * 4;
  }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) {
    return power * 2;
  }
  return power;
});

ActionCatalog.catalog['basic_slash'] = new Attack("Basic Slash", "A basic slash");
ActionCatalog.catalog['basic_slash'].requireItemProperty("slash");
ActionCatalog.catalog['basic_slash'].setAccuracy(0.95);
ActionCatalog.catalog['basic_slash'].setPowerFunction((scope) => {
  let power = getRandomInt(18, 20);
  // Placeholder structure until features are improved?
  if (scope.source.hasFeatureActive('master_improved_weaponry')) {
    return power * 6;
  }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) {
    return power * 4;
  }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) {
    return power * 2;
  }
  return power;
});

ActionCatalog.catalog['basic_kick'] = new Attack("Basic Kick", "A basic kick");
ActionCatalog.catalog['basic_kick'].setAccuracy(0.8);
ActionCatalog.catalog['basic_kick'].setPowerFunction((scope) => {
  let power = getRandomInt(15, 20);
  if (scope.source.hasFeatureActive('master_improved_weaponry')) {
    return power * 6;
  }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) {
    return power * 4;
  }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) {
    return power * 2;
  }
  return power;
});
ActionCatalog.catalog['basic_kick'].setCriticalModifier(+2);
ActionCatalog.catalog['basic_kick'].registerHook("onMiss", (scope) => { console.log("Ha! You missed."); })

ActionCatalog.catalog['basic_stab'] = new Attack("Basic Stab", "A basic stab", 1);
ActionCatalog.catalog['basic_stab'].requireItemProperty("pierce");
ActionCatalog.catalog['basic_stab'].setAccuracy(0.7);
ActionCatalog.catalog['basic_stab'].setCriticalModifier(+4);
ActionCatalog.catalog['basic_stab'].setPowerFunction((scope) => {
  let power = getRandomInt(10, 15);
  if (scope.source.hasFeatureActive('master_improved_weaponry')) {
    return power * 6;
  }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) {
    return power * 4;
  }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) {
    return power * 2;
  }
  return power;
});

ActionCatalog.catalog['basic_crush'] = new Attack("Basic Crush", "A basic blow of a bludgeoning weapon");
ActionCatalog.catalog['basic_crush'].requireItemProperty("bludgeon");
ActionCatalog.catalog['basic_crush'].setAccuracy(0.7);
ActionCatalog.catalog['basic_crush'].setPowerFunction((scope) => {
  let power = getRandomInt(35, 40);
  if (scope.source.hasFeatureActive('master_improved_weaponry')) {
    return power * 6;
  }
  if (scope.source.hasFeatureActive('major_improved_weaponry')) {
    return power * 4;
  }
  if (scope.source.hasFeatureActive('minor_improved_weaponry')) {
    return power * 2;
  }
  return power;
});

ActionCatalog.catalog['basic_bolt'] = new Attack("Basic Bolt", "A basic magical bolt");
ActionCatalog.catalog['basic_bolt'].setAccuracy(999);
ActionCatalog.catalog['basic_bolt'].setAttackType("spirit");
ActionCatalog.catalog['basic_bolt'].setPowerFunction((scope) => {
  return 10;
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

ActionCatalog.catalog['fireball'] = new Attack("Fireball", "A large ball of fire");
ActionCatalog.catalog['fireball'].setAccuracy(0.7);
ActionCatalog.catalog['fireball'].allowPartialDamage(0.5);
ActionCatalog.catalog['fireball'].setTargetCount(5);
ActionCatalog.catalog['fireball'].setDamageRoll(
  (scope) => { let total = 0; for (let i=0; i<8; i++) { total += getRandomInt(1, 6); } return total; }
);
