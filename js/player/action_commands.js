ActionCatalog.catalog['npc_debug_action'] = new Attack("Test Action", "It's something", 0);
ActionCatalog.catalog['npc_debug_action'].setAccuracy(0.5);
ActionCatalog.catalog['npc_debug_action'].setDamageBounds(1, 1);

ActionCatalog.catalog['basic_punch'] = new Attack("Basic Punch", "A basic punch", 1);
ActionCatalog.catalog['basic_punch'].setAccuracy(0.9);
ActionCatalog.catalog['basic_punch'].setDamageBounds(
  (scope) => scope.source.level+10,
  (scope) => scope.source.level+12
);

ActionCatalog.catalog['basic_kick'] = new Attack("Basic Kick", "A basic kick", 1);
ActionCatalog.catalog['basic_kick'].setAccuracy(0.8);
ActionCatalog.catalog['basic_kick'].setDamageBounds(
  2,
  (scope) => scope.source.level
);
ActionCatalog.catalog['basic_kick'].setCriticalModifier(+2);
ActionCatalog.catalog['basic_kick'].registerHook("onMiss", (scope) => { console.log("Ha! You missed."); })

ActionCatalog.catalog['basic_stab'] = new Attack("Basic Stab", "A basic stab", 1);
ActionCatalog.catalog['basic_stab'].setAccuracy(0.7);
ActionCatalog.catalog['basic_stab'].setCriticalModifier(+4);
ActionCatalog.catalog['basic_stab'].setDamageBounds(
  (scope) => scope.source.level,
  (scope) => scope.source.level+2
);

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
  (scope) => { let total = 0; for (let i=0; i<8; i++) { total += getRandomInt(1, 6); }}
);
