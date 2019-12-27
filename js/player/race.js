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
