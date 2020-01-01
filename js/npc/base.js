class Sentient {
  name;
  level;
	experience;
	// Stats are determined by race and archetype
	base_combat_stats = {
    power: 0,
    vitality: 0,
    dexterity: 0,
    resilience: 0,
    spirit: 0,
    luck: 0,
  };
  hp = {
    now: 0,
    max: 0,
    buffer: 0,
  };
	// And combat stats include all modifiers such as equipment and status
	position = [0, 0];
	inventory = [];
	gold = 250;

  constructor() {
    this.uuid = uuid();
    this.level = 0;
    this.inventory = [];
    this.gold = 0;
    // Modify HP to be
  }

  calculateHPMax() {
    // Vitality, Level, Equipped Items
  }

  get combat_stats() {
    // From constructor
    return this.base_combat_stats;
    // Work through racial formula (if any)
    // Work through archetype formula (if any)
    // Work through subarchetype formula (if any)
    // Work through equipped items (if any)
    // Work through passive skills (if any)
    // Work through active skills (if any)
  }
}
