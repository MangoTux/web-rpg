'use strict';

class Item {
	static region = {
		head: 1,
		neck: 2,
		chest: 3,
		arms: 4,
		legs: 5,
		feet: 6,
	};
	name;
	cost;
	constructor(id) {
		if (id == undefined) {
			randomChoice(player.archetype.armor);
		}
	}

	toString() { return ""; }
}

class Tool extends Item {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(Object.keys(tool_list));
		}
		this.id = id;
		this.base_item = tool_list[id];
		this.category = "Tool";
		this.cost = 100;
		this.name = randomChoice(tool_list[id].variants);
		this.cost = Math.floor(this.cost);
	}

	toString() { super.toString(); }
}

class Equipment extends Item {
	stat_changes = {
		power: 0,
		vitality: 0,
		resilience: 0,
		dexterity: 0,
		spirit: 0,
		luck: 0
	}
	constructor() {
		super();
	}

	apply_stat_changes() {
		this.base_item.stats.boost.forEach(doc => {
			if (typeof doc.chance !== "undefined" && getRandomInt(0, 100) >= doc.chance) { return; }
			this.stat_changes[doc.stat] += doc.value();
		});
		this.base_item.stats.lower.forEach(doc => {
			if (typeof doc.chance !== "undefined" && getRandomInt(0, 100) >= doc.chance) { return; }
			this.stat_changes[doc.stat] -= doc.value();
		});
	}

	modify(category) {
		if (getRandomInt(0, 100) > 20) { return; }
		const modifier_options = [];
		for (const i in modifier_list) {
			if (modifier_list[i].valid.includes(category)) {
				modifier_options.push(i);
			}
		}
		const name_mod = randomChoice(modifier_options);
		let mod;
		if (typeof modifier_list[name_mod].multiplier === "function") {
			mod = modifier_list[name_mod].multiplier();
		} else {
			mod = modifier_list[name_mod].multiplier;
		}
		Object.keys(this.stat_changes).forEach(key => {
			this.stat_changes[key] *= mod;
		})
		this.cost *= mod; // TODO cost should be based on price, as well.

		this.name = name_mod + " " + this.name;
		if (getRandomInt(0, 100 > 20)) { return; }
		this.name += " of " + (new MName().New());
		// TODO Named items are a little more special
		this.cost *= 1.1;
	}

	// Each stat change
	toString() { super.toString(); }
}

class Armor extends Equipment {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(player.archetype.armor);
		}
		this.id = id;
		this.category = "armor";
		this.base_item = armor_list[id];
		this.apply_stat_changes();
		this.cost = 450;
		this.name = id;
		this.modify('armor');
		this.cost = Math.floor(this.cost);
	}

	toString() { return this.id; }
}

class Weapon extends Equipment {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(player.archetype.weapons);
		}
		this.id = id;
		this.category = "weapon";
		this.base_item = weapon_list[id];
		this.apply_stat_changes();
		this.cost = 100;
		this.name = randomChoice(weapon_list[id].variants);
		this.modify('weapon');
		this.cost = Math.floor(this.cost);
	}

	toString() { return this.id; }
}

class Consumable extends Item {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(Object.keys(consumable_list));
		}
		this.id = id;
		this.category = "consumable";
		this.base_item = consumable_list[id];
		this.cost = 75;
		this.name = id;
		this.cost = Math.floor(this.cost);
	}

	get name() { return this.id; }

	toString() { return this.description; }

	get description() {
		if (typeof this.base_item.hp_restore !== "undefined") {
			return `Restores ${this.base_item.hp_restore} HP`;
		}
		if (typeof this.base_item.hp_fraction !== "undefined") {
			let percent_label = parseInt(this.base_item.hp_fraction * 100);
			return `Restores ${percent_label}% of your HP`;
		}
		if (typeof this.base_item.hp_buffer !== "undefined") {
			return `Grants a ${this.base_item.hp_buffer} HP buffer over your health`;
		}
	}
}

class ItemFactory {
	static getRandomConsumable() {
		return new Consumable();
	}

	static getRandomEquipment() {
		switch (getRandomInt(0, 4)) {
			case 0:
			case 1: return new Weapon();
			case 2:
			case 3: return new Armor();
			case 4: return new Tool();
		}
	}

	static getRandomArmor() {
		const new_id = randomChoice(player.archetype.armor);
		// TODO Invoke mutations
		return new Armor(new_id);
	}

	static getRandomWeapon() {
		const new_id = randomChoice(player.archetype.weapons);
		// TODO Invoke mutations
		return new Weapon(new_id);
	}

	static getRandomItem() {
		const prob = Math.random();
		if (prob < 0.4) {
			return this.getRandomWeapon();
		}
		if (prob < 0.7) {
			return this.getRandomArmor();
		}
		if (prob < 0.85) {
			return this.getRandomConsumable();
		}
		return this.getRandomEquipment();
	}
}

/*
This includes weapon type, base stat changes/damage (todo). No special properties are stored here,
but certain actions will be enabled by having a specific item.
*/
const weapon_list = {
	'Sword': {
		tags: ['melee', '1h', 'pierce'],
		variants: ['Sword', 'Longsword', 'Shortsword', 'Flamberge', 'Claymore', 'Broadsword'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 30, value: () => getRandomInt(5, 10)}
			],
			lower: [
				{stat: 'spirit', chance: 3, value: () => getRandomInt(0, 10)}
			],
		},
	},
	'Axe': {
		tags: ['melee', '1h', 'slash'],
		variants: ['Axe', 'Hatchet', 'Mattock'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(15, 25)},
			],
			lower: [],
		},
	},
	'Hammer': {
		tags: ['melee', '1h', 'bludgeon'],
		variants: ['Hammer', 'Pick'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(15, 25)},
			],
			lower: [],
		},
	},
	'Rapier': {
		tags: ['melee', '1h', 'pierce'],
		variants: ['Rapier', 'Epee'],
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(10, 20)},
			],
			lower: [
				{stat: 'power', chance: 5, value: () => getRandomInt(5, 10)},
			],
		},
	},
	'Scimitar': {
		tags: ['melee', '1h', 'slash'],
		variants: ['Scimitar', 'Cutlass'],
		stats: {
			boost: [
				{stat: 'power', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 40, value: () => getRandomInt(7, 12)},
			],
			lower: [],
		},
	},
	'Spear': {
		tags: ['melee', '1h', 'ranged', 'pierce'],
		variants: ['Spear', 'Javelin', 'Trident'],
		stats: {
			boost: [
				{stat: 'dexterity', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'spirit', chance: 15, value: () => getRandomInt(10, getRandomInt(10, 20))},
			],
			lower: [],
		},
	},
	'Flail': {
		tags: ['melee', '1h', 'bludgeon'],
		variants: ['Flail'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(10, 20)},
				{stat: 'luck', chance: 1, value: () => getRandomInt(2, 4)},
			],
			lower: [
				{stat: 'dexterity', chance: 3, value: () => getRandomInt(20, 30)}
			],
		},
	},
	'Halberd': {
		tags: ['melee', '1h', '2h', 'slash'],
		variants: ['Halberd', 'Glaive', 'Naginata'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(20, 35)},
			],
			lower: [
				{stat: 'dexterity', chance: 45, value: () => getRandomInt(0, 10)}
			],
		},
	},
	'Bow': {
		tags: ['ranged', '2h'],
		variants: ['Shortbow', 'Longbow'],
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(20, 30)},
				{stat: 'power', chance: 25, value: () => getRandomInt(5, 15)},
			],
			lower: [],
		},
	},
	'Crossbow': {
		tags: ['ranged', '1h'],
		stats: {
			boost: [
				{stat: 'dexterity', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'power', chance: 60, value: () => getRandomInt(10, 20)},
			],
			lower: [
				{stat: 'dexterity', chance: 15, value: () => getRandomInt(0, 10)},
			],
		},
	},
	'Boomerang': {
		tags: ['ranged', '1h'],
		variants: ['Boomerang', 'Shuriken', 'Darts', 'Throwing Glaive', 'Chakram'],
		stats: {
			boost: [
				{stat: 'power', value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 75, value: () => getRandomInt(20, 30)},
			],
			lower: [
				{stat: 'luck', chance: 25, value: () => getRandomInt(0, 10)},
			],
		},
	},
	'Dagger': {
		tags: ['melee', '1h'],
		variants: ['Dagger', 'Rondeau', 'Knife'],
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(30, 40)},
				{stat: 'luck', value: () => 1},
			],
			lower: [
				{stat: 'power', chance: 55, value: () => getRandomInt(5, 15)}
			],
		},
	},
	'Staff': {
		tags: ['melee', '1h', 'focus', 'bludgeon'],
		variants: ['Staff'],
		stats: {
			boost: [
				{stat: 'power', chance: 55, value: () => getRandomInt(10, 20)},
				{stat: 'spirit', chance: 55, value: () => getRandomInt(15, 20)},
			],
			lower: [],
		},
	},
	'Wand': {
		tags: ['1h', 'focus'],
		variants: ['Wand'],
		stats: {
			boost: [
				{stat: 'spirit', value: () => getRandomInt(15, 35)},
				{stat: 'dexterity', value: () => getRandomInt(5, 10)},
			],
			lower: [
				{stat: 'power', chance: 65, value: () => getRandomInt(10, 35)},
			],
		},
	},
	'Rod': {
		tags: ['1h', 'focus'],
		variants: ['Rod', 'Scepter'],
		stats: {
			boost: [
				{stat: 'spirit', value: () => 5 + getRandomInt(10, 20)},
				{stat: 'power', chance: 65, value: () => 2},
			],
			lower: [],
		},
	},
	'Tome': {
		tags: ['1h', 'focus'],
		variants: ['Tome', 'Book', 'Scroll'],
		stats: {
			boost: [
				{stat: 'spirit', value: () => 15},
			],
			lower: [],
		},
	},
	'Runes': {
		tags: ['1h', 'focus'],
		variants: ['Runes', 'Bones', 'Dice', 'Cards'],
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'luck', chance: 50, value: () => getRandomInt(0, getRandomInt(1, 3))},
			],
			lower: [
				{stat: 'power', value: () => getRandomInt(0, 10)},
				{stat: 'dexterity', value: () => getRandomInt(0, 10)},
			],
		},
	},
	'Claw': {
		tags: ['1h', 'melee', 'focus', 'slash'],
		variants: ['Claw', 'Fist', 'Gloves'],
		stats: {
			boost: [
				{stat: 'power', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 85, value: () => getRandomInt(10, 20)},
			],
			lower: [],
		},
	},
	'Talisman': {
		tags: ['1h', 'melee', 'focus'],
		variants: ['Talisman', 'Sigil'],
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 45, value: () => getRandomInt(5, 15)},
			],
			lower: [],
		},
	}
}
const armor_list = {
	'Helm': {
		region: Item.region.head,
		stats: {
			boost: [
				{stat: 'resilience', value: () => getRandomInt(10, 20)},
			],
			lower: [],
		},
	},
	'Cowl': {
		region: Item.region.head,
		stats: {
			boost: [
				{stat: 'resilience', value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 55, value: () => getRandomInt(5, 15)},
			],
			lower: [],
		},
	},
	'Wizard Hat': {
		region: Item.region.head,
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(5, 15)},
				{stat: 'dexterity', chance: 55, value: () => getRandomInt(1, 5)},
			],
			lower: [
				{stat: 'resilience', chance: 25, value: () => getRandomInt(0, 5)},
			],
		},
	},
	'Tiara': {
		region: Item.region.head,
		stats: {
			boost: [
				{stat: 'spirit', value: () => getRandomInt(20, 30)},
			],
			lower: [
				{stat: 'resilience', chance: 85, value: () => getRandomInt(5, 10)},
			],
		},
	},
	'Eye': {
		region: Item.region.head,
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(10, 20)},
			],
			lower: [
				{stat: 'dexterity', chance: 55, value: () => getRandomInt(1, 5)},
			],
		},
	},
	'Amulet': {
		region: Item.region.neck,
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(10, 20)},,
			],
			lower: [],
		},
	},
	'Brooch': {
		region: Item.region.neck,
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(10, 20)},,
			],
			lower: [],
		},
	},
	'Cloak': {
		region: Item.region.neck,
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(15, 20)},
			],
			lower: [
				{stat: 'luck', chance: 60, value: () => 1},
			],
		},
	},
	'Shroud': {
		region: Item.region.neck,
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(10, 20)},
				{stat: 'spirit', chance: 30, value: () => getRandomInt(0, 5)},
			],
			lower: [],
		},
	},
	'Pendant': {
		region: Item.region.neck,
		stats: {
			boost: [
				{stat: 'spirit', value: () => getRandomInt(10, 20)},
			],
			lower: [],
		},
	},
	'Breastplate': {
		region: Item.region.chest,
		stats: {
			boost: [
				{stat: 'resilience', value: () => getRandomInt(25, 40)},
			],
			lower: [
				{stat: 'dexterity', value: () => getRandomInt(15, 30)},
			],
		},
	},
	'Jerkin': {
		region: Item.region.chest,
		stats: {
			boost: [
				{stat: 'resilience', value: () => getRandomInt(15, 20)},
				{stat: 'dexterity', chance: 75, value: () => getRandomInt(15, 20)},
			],
			lower: [],
		},
	},
	'Robe': {
		region: Item.region.chest,
		stats: {
			boost: [
				{stat: 'resilience', chance: 90, value: () => getRandomInt(0, 10)},
				{stat: 'dexterity', chance: 45, value: () => getRandomInt(10, 20)},
			],
			lower: [],
		},
	},
	'Tunic': {
		region: Item.region.chest,
		stats: {
			boost: [
				{stat: 'dexterity', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'resilience', chance: 60, value: () => getRandomInt(15, 20)},
			],
			lower: [],
		},
	},
	'Wizard Robes': {
		region: Item.region.chest,
		stats: {
			boost: [
				{stat: 'spirit', chance: 90, value: () => getRandomInt(0, 15)},
			],
			lower: [
				{stat: 'resilience', chance: 50, value: () => getRandomInt(5, 20)},
			],
		},
	},
	'Ring': {
		region: Item.region.arms,
		stats: {
			boost: [
				{stat: 'luck', value: () => getRandomInt(40, 50)},
			],
			lower: [ // Cursed Rings as a trope
				{stat: 'resilience', chance: 15, value: () => getRandomInt(15, 30)},
				{stat: 'power', chance: 15, value: () => getRandomint(15, 30)},
				{stat: 'dexterity', chance: 15, value: () => getRandomInt(15, 30)},
				{stat: 'vitality', chance: 10, value: () => getRandomInt(15, 30)},
				{stat: 'spirit', chance: 15, value: () => getRandomInt(15, 30)},
			],
		},
	},
	'Vambraces': {
		region: Item.region.arms,
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(10, 20)},
				{stat: 'resilience', chance: 55, value: () => getRandomInt(10, 25)},
			],
			lower: [],
		},
	},
	'Shield': {
		region: Item.region.arms,
		stats: {
			boost: [
				{stat: 'power', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'resilience', value: () => 30 + getRandomInt(10, 20)},
			],
			lower: [
				{stat: 'dexterity', chance: 35, value: () => getRandomInt(10, 20)},
			],
		},
	},
	'Greaves': {
		region: Item.region.legs,
		stats: {
			boost: [
				{stat: 'resilience', chance: 90, value: () => getRandomInt(10, 20)},
			],
			lower: [
				{stat: 'dexterity', chance: 30, value: () => getRandomInt(0, 10)},
			],
		},
	},
	'Breeches': {
		region: Item.region.legs,
		stats: {
			boost: [
				{stat: 'resilience', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'dexterity', chance: 50, value: () => getRandomInt(5, 15)},
			],
			lower: [],
		},
	},
	'Shackle': {
		region: Item.region.legs,
		stats: {
			boost: [
				{stat: 'power', chance: 90, value: () => getRandomInt(10, 20)},
				{stat: 'spirit', value: () => getRandomInt(20, 30)},
			],
			lower: [
				{stat: 'dexterity', value: () => 5 + getRandomInt(0, 10)},
			],
		},
	},
	'Sandals': {
		region: Item.region.feet,
		stats: {
			boost: [
				{stat: 'dexterity', value: () => getRandomInt(15, 25)},
				{stat: 'power', value: () => 2},
			],
			lower: [
				{stat: 'resilience', chance: 3, value: () => getRandomInt(0, 10)}
			],
		},
	},
	'Boots': {
		region: Item.region.feet,
		stats: {
			boost: [
				{stat: 'resilience', value: () => getRandomInt(15, 25)},
			],
			lower: [],
		},
	},
};
const modifier_list = {
	'Holy': {
		valid:['weapon', 'armor'],
		multiplier:()=>{return player.archetype.name=="Monk"?4.5:3}
		// Increases Spirit, Resilience
	},
	'Magical':
	{
		valid:['weapon', 'armor'],
		multiplier:()=>{return player.archetype.name=="Mage"?2.2:2}
		// Increases Spirit
	},
	'Golden':
	{
		valid:['weapon', 'armor'],
		multiplier:3
	},
	'Great':
	{
		valid:['weapon', 'armor'],
		multiplier:4
	},
	'Leather':
	{
		valid:['armor'],
		multiplier:()=>{return player.archetype.name=="Ranger"?2.5:0.8}
		// Chance to increase Dexterity
	},
	'Steel':
	{
		valid:['weapon', 'armor'],
		multiplier:1.15
		// Chance to increase power, resilience
	},
	'Iron':
	{
		valid:['weapon', 'armor'],
		multiplier:1.1
		// Chance to increase power
	},
	'Bronze':
	{
		valid:['weapon', 'armor'],
		multiplier:1.05
		// Chance to increase resilience
	},
	'Silk':
	{
		valid:['armor'],
		multiplier:()=>{return player.archetype.name=="Mage"?2.5:0.8}
		// Chance to increase spirit
	},
	'Flaming':
	{
		valid:['weapon'],
		multiplier:2.5
	},
	'Fire':
	{
		valid:['weapon'],
		multiplier:2
	},
	'Freezing':
	{
		valid:['weapon'],
		multiplier:2.5
	},
	'Ice':
	{
		valid:['weapon'],
		multiplier:2
	},
	'Stone':
	{
		valid:['weapon'],
		multiplier:1.5
		// Chance to increase Resilience
	},
	'Dragonscale':
	{
		valid:['armor'],
		multiplier:3
		// Chance to increase power, resilience
	},
	'Lifeblood':
	{
		valid:['armor'],
		multiplier: 2
		// Chance to increase vitality, resilience
	}
};
const consumable_list = {
	'Bread': {
		hp_restore: 30,
	},
	'Potato': {
		hp_restore: 15,
	},
	'Cabbage': {
		hp_restore:10
	},
	'Soup': {
		hp_restore:40
	},
	'Potion of Lesser Fortitude': {
		hp_buffer: 10
	},
	'Potion of Greater Fortitude': {
		hp_buffer: 25
	},
	'Lesser Healing Potion':	{
		hp_fraction: 0.25 // hp_fraction will restore that percent of user's HP.
	},
	'Greater Healing Potion': {
		hp_fraction: 0.5
	}
}
const tool_list = {
	'Boat': {
		tags: ['waterTravel'],
		variants: ['Boat', 'Raft', 'Canoe', 'Sailboat'],
	},
};
