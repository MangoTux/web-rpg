class Sentient {
  name;
  level;
	experience;
	// Stats are determined by race and archetype
	base_combat_stats = {};
	// And combat stats include all modifiers such as equipment and status
	combat_stats = {};
	position = [0, 0];
	inventory = [];
	gold = 250;

  constructor() {
    this.level = 0;
    this.combat_stats = {};
    this.inventory = [];
    this.gold = 0;
  }

  get name() {
    return this.name;
  }
}
