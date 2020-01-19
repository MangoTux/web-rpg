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

	get power() {
		return this.abilities.power;
	}

	get vitality() {
		return this.abilities.vitality;
	}

	get dexterity() {
		return this.abilities.dexterity;
	}

	get resilience() {
		return this.abilities.resilience;
	}

	get spirit() {
		return this.abilities.spirit;
	}

	get luck() {
		return this.abilities.luck;
	}
}

class Warrior extends Archetype {
	name = "Warrior";
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
		'basic_punch',
	];
	constructor() {
		super();

	}

	getPowerFunction() {
		return function(level){ return 0 };
	}

	getVitalityFunction() {
		return function(level){ return 0 };
	}

	getDexterityFunction() {
		return function(level){ return 0 };
	}

	getResilienceFunction() {
		return function(level){ return 0 };
	}

	getSpiritFunction() {
		return function(level){ return 0 };
	}

	getLuckFunction() {
		return function(level){ return 0 };
	}
}

class Ranger extends Archetype {
	name = "Ranger";
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
		'basic_stab',
	];
	constructor() {
		super();

	}

	getPowerFunction() {
		return function(level){ return 0 };
	}

	getVitalityFunction() {
		return function(level){ return 0 };
	}

	getDexterityFunction() {
		return function(level){ return 0 };
	}

	getResilienceFunction() {
		return function(level){ return 0 };
	}

	getSpiritFunction() {
		return function(level){ return 0 };
	}

	getLuckFunction() {
		return function(level){ return 0 };
	}
}

class Mage extends Archetype {
	name = "Mage";
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
		'basic_bolt',
		'fireball',
	];
	constructor() {
		super();

	}

	getPowerFunction() {
		return function(level){ return 0 };
	}

	getVitalityFunction() {
		return function(level){ return 0 };
	}

	getDexterityFunction() {
		return function(level){ return 0 };
	}

	getResilienceFunction() {
		return function(level){ return 0 };
	}

	getSpiritFunction() {
		return function(level){ return 0 };
	}

	getLuckFunction() {
		return function(level){ return 0 };
	}
}

class Monk extends Archetype {
	name = "Monk";
	// These should just be lists for the key values.
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
		'basic_punch',
		'basic_kick',
		'flurry_of_blows',
	];
	constructor() {
		super();

	}

	getPowerFunction() {
		return function(level){ return 0 };
	}

	getVitalityFunction() {
		return function(level){ return 0 };
	}

	getDexterityFunction() {
		return function(level){ return 0 };
	}

	getResilienceFunction() {
		return function(level){ return 0 };
	}

	getSpiritFunction() {
		return function(level){ return 0 };
	}

	getLuckFunction() {
		return function(level){ return 0 };
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
