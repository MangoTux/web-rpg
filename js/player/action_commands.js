ActionCatalog.catalog['basic_punch'] = new Attack("Basic Punch", "A basic punch");
ActionCatalog.catalog['basic_punch'].setAccuracy(0.9);
ActionCatalog.catalog['basic_punch'].setDamageBounds(20, 22);

ActionCatalog.catalog['basic_slash'] = new Attack("Basic Slash", "A basic slash");
ActionCatalog.catalog['basic_slash'].requireItemProperty("slash");
ActionCatalog.catalog['basic_slash'].setAccuracy(0.95);
ActionCatalog.catalog['basic_slash'].setDamageBounds(19, 20);

ActionCatalog.catalog['basic_kick'] = new Attack("Basic Kick", "A basic kick");
ActionCatalog.catalog['basic_kick'].setAccuracy(0.8);
ActionCatalog.catalog['basic_kick'].setDamageBounds(15, 20);
ActionCatalog.catalog['basic_kick'].setCriticalModifier(+2);
ActionCatalog.catalog['basic_kick'].registerHook("onMiss", (scope) => { console.log("Ha! You missed."); })

ActionCatalog.catalog['basic_stab'] = new Attack("Basic Stab", "A basic stab", 1);
ActionCatalog.catalog['basic_stab'].requireItemProperty("pierce");
ActionCatalog.catalog['basic_stab'].setAccuracy(0.7);
ActionCatalog.catalog['basic_stab'].setCriticalModifier(+4);
ActionCatalog.catalog['basic_stab'].setDamageBounds(
  (scope) => scope.source.level,
  (scope) => scope.source.level+2
);

ActionCatalog.catalog['basic_crush'] = new Attack("Basic Crush", "A basic blow of a bludgeon");
ActionCatalog.catalog['basic_crush'].requireItemProperty("bludgeon");
ActionCatalog.catalog['basic_crush'].setAccuracy(0.7);
ActionCatalog.catalog['basic_crush'].setDamageBounds(35, 40);

ActionCatalog.catalog['basic_bolt'] = new Attack("Basic Bolt", "A basic magical bolt", 1);
ActionCatalog.catalog['basic_bolt'].setAccuracy(999);
ActionCatalog.catalog['basic_bolt'].setDamageBounds(
  (scope) => scope.source.level,
  (scope) => scope.source.level
);

ActionCatalog.catalog['flurry_of_blows'] = new Attack("Flurry of Blows", "Three quick attacks", 1);
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

ActionCatalog.catalog['fireball'] = new Attack("Fireball", "A large ball of fire", 1);
ActionCatalog.catalog['fireball'].setAccuracy(0.7);
ActionCatalog.catalog['fireball'].allowPartialDamage(0.5);
ActionCatalog.catalog['fireball'].setTargetCount(5);
ActionCatalog.catalog['fireball'].setDamageRoll(
  (scope) => { let total = 0; for (let i=0; i<8; i++) { total += getRandomInt(1, 6); } return total; }
);
