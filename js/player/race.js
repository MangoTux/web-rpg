class Race {
	base_health;
	stat_modifier = {};
	constructor() {
		this.base_health = 20;
	}

	get name() {
		return this.name;
	}
}

class Human extends Race {
	name = "Human";
	constructor() {
		super();
		this.stat_modifier = {
			power: 16,
			vitality: 16,
			dexterity: 16,
			resilience: 16,
			spirit: 16,
			luck: 16,
		};
	}
}

class Elf extends Race {
	name = "Elf";
	constructor() {
		super();
		this.stat_modifier = {
			power: 20,
			vitality: 13,
			dexterity: 25,
			resilience: 8,
			spirit: 20,
			luck: 10,
		};
	}
}

class Dwarf extends Race {
	name = "Dwarf";
	constructor() {
		super();
		this.stat_modifier = {
			power: 25,
			vitality: 25,
			dexterity: 8,
			resilience: 20,
			spirit: 18,
			luck: 0,
		};
	}
}

class Goblin extends Race {
	name = "Goblin";
	constructor() {
		super();
		this.stat_modifier = {
			power: 17,
			vitality: 9,
			dexterity: 21,
			resilience: 20,
			spirit: 5,
			luck: 24,
		};
	}
}
