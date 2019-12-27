//Player object
class Player extends Sentient {
	name;
	level = 1;
	experience = 0;
	previous_direction = [0, -1];
	inventory = [];
	wielding = [];
	gold = 250;

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
	}

	load(json) {
		throw new Exception("Loading hasn't been fully built.");
	}

	move(h, v) {
		let moveable = environment.map.canMove([this.position[0] + h, this.position[1] + v]);
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

	hasWaterTravel() {
		const is_water_travel = (item) => {
			return typeof item.purpose_c !== "undefined" && item.purpose_c == "waterTravel"
		};
		return this.inventory.some(is_water_travel);
	}

	acceptQuest() {
		this.quest_handler.accept(environment.getNpcOnTile(player.position).quest);
	}

	updateQuestProgress(event, target) {
		this.quest_handler.updateProgress(event, target);
	}

	receiveQuestReward(reward_object) {
		// Increase gold
		// Gain items (if any)
	}
}
