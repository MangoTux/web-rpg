//Player object
class Player {
	level = 1;
	experience = 0;
	// Stats are determined by race and archetype
	base_combat_stats = {};
	// And combat stats include all modifiers such as equipment and status
	combat_stats = {};
	position = [0, 0];
	previous_direction = [0, -1];
	inventory = [];
	wielding = [];
	gold = 250;

	quests = {};

	constructor(name) {
		this.name = name;
		this.race = null;
		this.archetype = null;
		this.state = state.player.start;
	}

	// When a player is created, move them to a non-lava/water tile
	onCreate(map) {
		if (map.canMove(...this.position).canMove) {
			return;
		};
	  this.position = map.findNearestTraversible(...this.position);
	}

	load(json) {
		throw new Exception("Loading hasn't been fully built.");
	}

	move(h, v) {
		let moveable = map.canMove(this.position[0] + h, this.position[1] + v);
		if (!moveable.canMove) {
			if (moveable.reason == "W") {
				return [false, "You can't swim!"];
			} else if (moveable.reason == "L") {
				return [false, "Lava is kind of hot, and you'll probably die if you go there."];
			}
		}
		this.position[0] += h;
		this.position[1] += v;
		this.previous_direction = [h, v];
		return [true];
	}

	rest() {
		this.base_combat_stats.currentHP = this.base_combat_stats.maxHP;
	}

	get experience_needed() {
		let exp = 0;
		for (let i = 1; i < this.level + 1; i++) {
			// BG Inspire: Classes have different experience progression?
			// e.g. this.archetype.experience_factor ?
			exp += Math.floor((this.level + 1) + 300 * Math.pow(2, (this.level + 1)/7.));
		}
		return exp - this.experience;
	}

	increase_experience(exp) {
		this.experience += exp;
		let response = [`You gain ${experience} experience.`];
		while (this.experience_needed <= 0) {
			this.increase_level();
			response.push([`Congratulations! You're now level ${this.level}`]);
		}
		return response;
	}

	increase_level() {
		this.level++;
		// Use class's features and apply to base combat stats
		// Update player's stats to include equipped items
		// Gain gold equal to 50 * level
		// Increase luck by one
	}

	apply_equipment() {
		// Set combat stats equal to base combat stats
		// For each item in equipped (ignoring health-change):
		//  - Increase combat stats by the modifier from the item
	}

	get luck() {
		// This needs to factor in class features and inventory items eventually
		return this.level + this.race.luck;
	}
}

class Race {
	base_health;
	luck;
	name;
	constructor() {}

	get name() {
		return this.name;
	}
}

class Human extends Race {
	name = "Human";
	constructor() {
		super();
		this.base_health = 30,
		this.luck = 2;
	}
}

class Elf extends Race {
	name = "Elf";
	constructor() {
		super();
		this.base_health = 50;
		this.luck = 0;
	}
}

class Dwarf extends Race {
	name = "Dwarf";
	constructor() {
		super();
		this.base_health = 40;
		this.luck = 1;
	}
}

class Goblin extends Race {
	name = "Goblin";
	constructor() {
		super();
		this.base_health = 20;
		this.luck = 4;
	}
}

/*
Items should go into archetypes (into their own file)
*/
class Archetype {
	constructor() {

	}

	get name() {
		return this.name;
	}
}

class Warrior extends Archetype {
	name = "Warrior";
	constructor() {
		super();

	}
}

class Ranger extends Archetype {
	name = "Ranger";
	constructor() {
		super();

	}
}

class Mage extends Archetype {
	name = "Mage";
	constructor() {
		super();

	}
}

class Monk extends Archetype {
	name = "Monk";
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
