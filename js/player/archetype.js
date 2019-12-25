/*
Items should go into archetypes (into their own file)

Still toying with the exact implementation, but this seems like a solid way forward.
*/
class Archetype {
	// Each of these should be an ID that maps to something in the Action Catalog
	actions = [
		'basic_punch', // Accessible with ActionCatalog.catalog[id]
	];
	// These are modifiers based on archetype, such as increasing number of attacks, damage reduction, passives, etc.
	abilities = [
		{}
	];

	constructor() {

	}

	get name() {
		return this.name;
	}
}

class Warrior extends Archetype {
	name = "Warrior";
	weapons = [
		'Sword',
		'Shield',
		'Axe',
		'Hammer',
		'Cutlass',
		'Rapier',
		'Scimitar',
		'Spear',
		'Flail',
		'Halberd'
	];
	equipment = [
		'Helm',
		'Brooch',
		'Breastplate',
		'Vambraces',
		'Greaves',
		'Boots'
	];
	constructor() {
		super();

	}
}

class Ranger extends Archetype {
	name = "Ranger";
	weapons = [
		'Shortbow',
		'Longbow',
		'Crossbow',
		'Spear',
		'Boomerang',
		'Shuriken'
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
	constructor() {
		super();

	}
}

class Mage extends Archetype {
	name = "Mage";
	weapons = [
		'Staff',
		'Wand',
		'Rod',
		'Scepter',
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
	constructor() {
		super();

	}
}

class Monk extends Archetype {
	name = "Monk";
	// These should just be lists for the key values.
	weapons = [
		'Chakram',
		'Claw',
		'Fist',
		'Gloves',
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
	constructor() {
		super();

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
