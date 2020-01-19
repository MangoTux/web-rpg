//Player object
class Player extends Sentient {
	name;
	level = 1;
	experience = 0;
	previous_direction = [0, -1];
	inventory = [];
	wielding = [];
	gold = 250;
	step_count = 0;

	quest_handler = null;

	constructor(name) {
		super();
		this.level = 1;
		this.name = name;
		this.race = null;
		this.archetype = null;
		this.state = state.player.start;
		this.gold = 250;
		this.quest_handler = new Quest_Handler();
		this.base_combat_stats = {
	    power: 5,
	    vitality: 5,
	    dexterity: 5,
	    resilience: 5,
	    spirit: 5,
	    luck: 0,
	  };
		// TODO Archetype, Race basis
    this.hp.max = getRandomInt(20, 30)+this.level;
    this.hp.now = this.hp.max;
	}

	load(json) {
		throw new Exception("Loading hasn't been fully built.");
	}

	move(h, v) {
		let moveable = environment.map.canMove([this.position[0] + h, this.position[1] + v]);
		if (!moveable.canMove) {
			if (moveable.reason == "W" && !this.hasWaterTravel()) {
				return [false, "You can't swim!"];
			} else if (moveable.reason == "L") {
				return [false, "Lava is kind of hot, and you'll probably die if you go there."];
			}
		}
		this.position[0] += h;
		this.position[1] += v;
		this.previous_direction = [h, v];
		this.step_count++;
		return [true];
	}

	rest() {
		// Effects that grant a buffer for the first combat?
		this.hp.buffer = 0;
		this.hp.now = this.hp.max;
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
		let response = [`You gain ${exp} experience.`];
		while (this.experience_needed <= 0) {
			this.increase_level();
			response.push([`Congratulations! You're now level ${this.level}`]);
		}
		return response;
	}

	increase_level() {
		this.level++;
		// TODO
		// Use class's features and apply to base combat stats
		// Update player's stats to include equipped items
		// Gain gold equal to 50 * level
		// Increase luck by one
	}

	apply_equipment() {
		// TODO
		// Set combat stats equal to base combat stats
		// For each item in equipped (ignoring health-change):
		//  - Increase combat stats by the modifier from the item
	}

	hasWaterTravel() {
    return this.inventory.some((item) => {
      return item.base_item.tags && item.base_item.tags.includes("waterTravel");
    })
  }

	acceptQuest() {
		this.quest_handler.accept(environment.getNpcOnTile(player.position).quest);
	}

	updateQuestProgress(event, target) {
		this.quest_handler.updateProgress(event, target);
	}

	receiveQuestReward(reward_object) {
		// TODO
		// Increase gold
		// Gain items (if any)
	}
}
