//Player object
class Player extends Sentient {
	name;
	level = 1;
	experience = 0;
	previous_direction = [0, -1];
	step_count = 0;

	quest_handler = null;

	level_map = {
		stat_change: 7,
		paragon: 12,
		cap: 20,
	};

	constructor(name) {
		super();
		this.level = 1;
		this.name = name;
		this.race = null;
		this.archetype = null;
		this.state = state.player.start;
		this.gold = 250;
		this.quest_handler = new Quest_Handler();
	}

	assign_race(race_instance) {
		this.race = new race_instance();
	}

	assign_archetype(arch_instance) {
		this.archetype = new arch_instance();
		this.base_combat_stats = this.archetype.stat_base.base;
	}

	assign_paragon(paragon_instance) {
		this.paragon = new paragon_instance();
		this.base_combat_stats = this.paragon.stat_base;
	}

	finish_setup() {
		this.hp.max = this.get_stat("vitality");
		this.hp.now = this.hp.max;
	}

	load(json) {
		throw new Exception("Loading hasn't been fully built.");
	}

	get available_actions() {
		let action_list = this.archetype.actions
			.filter(action =>
				this.level >= action.level_min && (typeof action.level_max === "undefined" || this.level <= action.level_max)
			)
			.filter(action => ActionCatalog.catalog[action.id].required_properties.every(prop =>
				this.wielding.some(item => item.base_item.tags.includes(prop))
			))
			.filter(action => {
				let name = ActionCatalog.catalog[action.id].name;
				if (!(environment.encounter && environment.encounter.combat && environment.encounter.combat.participants[this.uid].move_quota)) { return true; }
				if (typeof environment.encounter.combat.participants[this.uid].move_quota[name] === "undefined") { return true; }
				if (ActionCatalog.catalog[action.id].use_count == null) { return true; }
				return environment.encounter.combat.participants[this.uid].move_quota[name] < ActionCatalog.catalog[action.id].use_count;
			});
		return action_list;
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
		this.hp.max = this.get_stat("vitality");
		this.hp.now = this.hp.max;
	}

	get_racial_mod(stat) {
		if (this.race === null) {
			return 0;
		}
		return this.race.stat_modifier[stat];
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
			if (this.level == this.level_map.paragon) {
				this.state = state.player.paragon;
				response.push([`You have mastered the basic skills of your archetype`]);
				response.push([`Choose one of the following paragons: [${player.archetype.paragon_options.join('/')}]`]);
			}
		}
		return response;
	}

	increase_level() {
		this.level++;
		if (this.level == this.level_map.stat_change) {
			this.base_combat_stats = this.archetype.stat_base.mid;
		}
		this.hp.max = this.get_stat("vitality");
		this.hp.now = this.hp.max;
		this.gold += this.level * 25;

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
