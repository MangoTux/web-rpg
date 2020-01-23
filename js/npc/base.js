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
    this.uid = uid();
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

  get consumable_list() {
    return this.inventory.filter(item => item.category == "consumable");
  }

	consume(item) {
    if (typeof item.base_item.hp_buffer !== "undefined") {
      this.hp.buffer = Math.max(this.hp.buffer, item.base_item.hp_buffer);
      return {buffer: item.base_item.hp_buffer};
    }
    let max_restore = this.hp.max - this.hp.now;
    let hp_capacity = 0;
		if (typeof item.base_item.hp_restore !== "undefined") {
      hp_capacity = item.base_item.hp_restore.clamp(0, max_restore);
		}
		if (typeof item.base_item.hp_fraction !== "undefined") {
			hp_capacity = parseInt(item.base_item.hp_fraction * this.hp.max).clamp(0, max_restore);
		}
    this.hp.now += hp_capacity;
    return {restore: hp_capacity};
	}

  // Applies damage to the entity and returns the total amount taken
  applyDamage(amount) {
    // Buffer (if any) shields as much as possible, with excess rolling to damage taken
    let start_hp = this.hp.buffer + this.hp.now;
    amount -= this.hp.buffer;
    if (amount < 0) {
      this.hp.buffer = -1*amount;
    } else {
      this.hp.buffer = 0;
      this.hp.now -= amount;
    }
    this.hp.now = this.hp.now.clamp(0, this.hp.max);
    return start_hp - (this.hp.buffer + this.hp.now);
  }
}
