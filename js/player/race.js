class Race {
	base_health;
	constructor() {
		this.base_health = 20;
		this.power_mod = 0;
		this.vitality_mod = 0;
		this.dexterity_mod = 0;
		this.resilience_mod = 0;
		this.spirit_mod = 0;
		this.luck_mod = 0;
	}

	get name() {
		return this.name;
	}
}

class Human extends Race {
	name = "Human";
	constructor() {
		super();
		this.power_mod = 2;
		this.vitality_mod = 1;
		this.resilience_mod = 1;
		this.luck_mod = 2;
	}
}

class Elf extends Race {
	name = "Elf";
	constructor() {
		super();
		this.power_mod = 1;
		this.vitality_mod = 1;
		this.resilience_mod = 1;
		this.dexterity_mod = 2;
		this.spirit_mod = 1;
	}
}

class Dwarf extends Race {
	name = "Dwarf";
	constructor() {
		super();
		this.power_mod = 1;
		this.vitality_mod = 3;
		this.resilience_mod = 1;
		this.luck_mod = 1;
	}
}

class Goblin extends Race {
	name = "Goblin";
	constructor() {
		super();
		this.dexterity_mod = 2;
		this.luck_mod = 4;
	}
}
