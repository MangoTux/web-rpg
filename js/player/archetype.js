/*
Items should go into archetypes (into their own file)

Still toying with the exact implementation, but this seems like a solid way forward.
*/
class Archetype {
	// Each of these should be an ID that maps to something in the Action Catalog
	actions = [,
		{ id: 'basic_punch', level: 1 }, // Accessible with ActionCatalog.catalog[id]
	];
	features = [];
	// These are modifiers based on archetype, such as increasing number of attacks, damage reduction, passives, etc.
	stat_base = {};

	constructor() {

	}

	get name() {
		return this.name;
	}
}

class Warrior extends Archetype {
	name = "Warrior";
	paragon_options = ["Champion", "Thief"];
	weapons = [
		'Sword',
		'Axe',
		'Hammer',
		'Rapier',
		'Scimitar',
		'Spear',
		'Flail',
		'Halberd'
	];
	armor = [
		'Helm',
		'Brooch',
		'Breastplate',
		'Vambraces',
		'Shield',
		'Greaves',
		'Boots'
	];
	actions = [
		{ id: 'basic_punch', level_min: 1 },
		{ id: 'basic_stab', level_min: 1 },
		{ id: 'basic_slash', level_min: 1 },
		{ id: 'basic_crush', level_min: 1 },
	];
	features = [
		{ id: 'minor_improved_weaponry', level_min: 6 },
		{ id: 'major_improved_weaponry', level_min: 10 },
	]
	constructor() {
		super();
		this.stat_base = {
			base: {
				power: 75,
				vitality: 65,
				dexterity: 30,
				resilience: 30,
				spirit: 15,
				luck: 1,
			},
			mid: {
				power: 100,
				vitality: 80,
				dexterity: 40,
				resilience: 55,
				spirit: 20,
				luck: 2,
			}
		};
	}
}

class Ranger extends Archetype {
	name = "Ranger";
	paragon_options = ["Hunter", "Druid"];
	weapons = [
		'Bow',
		'Crossbow',
		'Spear',
		'Boomerang',
	];
	armor = [
		'Cowl',
		'Cloak',
		'Jerkin',
		'Tunic',
		'Vambraces',
		'Breeches',
		'Boots'
	];
	actions = [
		{ id: 'basic_punch', level_min: 1 },
		{ id: 'basic_stab', level_min: 1 },
		{ id: 'basic_slash', level_min: 1 },
		{ id: 'basic_crush', level_min: 1 },
	];
	features = [
		{ id: 'minor_improved_weaponry', level_min: 10 },
	]
	constructor() {
		super();
		this.stat_base = {
			base: {
				power: 75,
				vitality: 30,
				dexterity: 65,
				resilience: 15,
				spirit: 30,
				luck: 1,
			},
			mid: {
				power: 80,
				vitality: 40,
				dexterity: 100,
				resilience: 20,
				spirit: 55,
				luck: 3,
			}
		};
	}
}

class Mage extends Archetype {
	name = "Mage";
	paragon_options = ["Elementalist", "Necromancer"];
	weapons = [
		'Staff',
		'Wand',
		'Rod',
		'Tome',
		'Runes'
	];
	armor = [
		'Wizard Hat',
		'Tiara',
		'Eye',
		'Amulet',
		'Wizard Robes',
		'Ring',
		'Boots'
	];
	actions = [
		{ id: 'basic_punch', level_min: 1 },
		{ id: 'basic_bolt', level_min: 1 },
		{ id: 'fireball', level: 5 },
	];
	constructor() {
		super();
		this.stat_base = {
			base: {
				power: 15,
				vitality: 15,
				dexterity: 45,
				resilience: 40,
				spirit: 100,
				luck: 0,
			},
			mid: {
				power: 20,
				vitality: 20,
				dexterity: 65,
				resilience: 50,
				spirit: 140,
				luck: 1,
			}
		};
	}
}

class Monk extends Archetype {
	name = "Monk";
	paragon_options = ["Priest", "Sage"];
	weapons = [
		'Boomerang',
		'Claw',
		'Talisman'
	];
	armor = [
		'Cowl',
		'Pendant',
		'Robe',
		'Shroud',
		'Ring',
		'Shackle',
		'Sandals',
		'Boots'
	];
	actions = [
		{ id: 'basic_punch', level_min: 1 },
		{ id: 'basic_kick', level_min: 1 },
		{ id: 'flurry_of_blows', level: 5 },
	];
	constructor() {
		super();
		this.stat_base = {
			base: {
				power: 70,
				vitality: 40,
				dexterity: 70,
				resilience: 15,
				spirit: 20,
				luck: 4,
			},
			mid: {
				power: 85,
				vitality: 55,
				dexterity: 95,
				resilience: 25,
				spirit: 35,
				luck: 8,
			}
		};
	}
}

/*
Eventually, Sub-archetypes:
Warrior:
- Champion (All-around decent tank, Passive skills)
- Thief (Can steal items, avoid being hit)
Ranger:
- Hunter (Bonus to enemies, Rapid Fire?)
- Druid (Magic breaks armor, HP restoration (true))
Mage:
- Elementalist (Bigger blasts, some abjuration?)
- Necromancer (Bonus to enemies, HP restoration (buffer))
Monk:
- Priest (Paladin, Enemy bonus)
- Sage (Guru/Martial Artist, Ignores armor/piercing, higher luck?)
*/
