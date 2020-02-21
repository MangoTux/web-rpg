ActionCatalog.catalog['npc_debug_action'] = new Attack("Test Action", "It's something");
ActionCatalog.catalog['npc_debug_action'].setAccuracy(0.5);
ActionCatalog.catalog['npc_debug_action'].setDamageBounds(20, 20);

ActionCatalog.catalog['bite'] = new Attack("Bite", "Presumably, with teeth");
ActionCatalog.catalog['bite'].setAccuracy(0.7);
ActionCatalog.catalog['bite'].setPowerFunction((scope) => getRandomInt(50, 65));
