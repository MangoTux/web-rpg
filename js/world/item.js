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
			id = randomChoice(tool_id_list);
		}
		this.base_item = tool_list[id];
		this.cost = 100;
		this.name = randomChoice(tool_list[id].variants);
		this.cost = Math.floor(this.cost);
	}

	toString() { super.toString(); }
}

class Equipment extends Item {
	constructor() {
		super();
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
		if (typeof modifier_list[name_mod].multiplier === "function") {
			this.cost *= modifier_list[name_mod].multiplier();
		} else {
			this.cost *= modifier_list[name_mod].multiplier;
		}
		// TODO Stat changes apply here
		this.name = name_mod + " " + this.name;
		if (getRandomInt(0, 100 > 20)) { return; }
		this.name += " of " + (new MName().New());
		// TODO Named items are a little more special
		this.cost *= 1.1;
	}

	toString() { super.toString(); }
}

class Armor extends Equipment {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(player.archetype.armor);
		}
		this.id = id;
		this.base_item = armor_list[id];
		this.cost = 450;
		this.name = id;
		this.modify('armor');
		this.cost = Math.floor(this.cost);
	}

	get name() { return id; }

	toString() { return id; }
}

class Weapon extends Equipment {
	constructor(id) {
		super();
		if (typeof id === "undefined") {
			id = randomChoice(player.archetype.weapons);
		}
		this.id = id;
		this.base_item = weapon_list[id];
		this.cost = 100;
		this.name = randomChoice(weapon_list[id].variants);
		this.modify('weapon');
		this.cost = Math.floor(this.cost);
	}

	get name() { return this.id; }

	toString() { return this.id; }
}

class Consumable extends Item {
	constructor(id) {
		super();
		this.id = id;
		this.base_item = consumable_list[id];
		this.cost = 75;
		this.name = id;
		this.cost = Math.floor(this.cost);
	}

	get name() { return this.id; }

	toString() { return this.id; }
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
		tags: ['melee', '1h'],
		variants: ['Sword', 'Longsword', 'Shortsword', 'Flamberge', 'Claymore', 'Broadsword'],
	},
	'Axe': {
		tags: ['melee', '1h'],
		variants: ['Axe', 'Hatchet', 'Mattock'],
	},
	'Hammer': {
		tags: ['melee', '1h'],
		variants: ['Hammer', 'Pick'],
	},
	'Rapier': {
		tags: ['melee', '1h'],
		variants: ['Rapier', 'Epee'],
	},
	'Scimitar': {
		variants: ['Scimitar', 'Cutlass'],
	},
	'Spear': {
		tags: ['melee', '1h', 'ranged'],
		variants: ['Spear', 'Javelin', 'Trident'],
	},
	'Flail': {
		tags: ['melee', '1h'],
		variants: ['Flail'],
	},
	'Halberd': {
		tags: ['melee', '1h', '2h'],
		variants: ['Halberd', 'Glaive', 'Naginata'],
	},
	'Bow': {
		tags: ['ranged', '2h'],
		variants: ['Shortbow', 'Longbow'],
	},
	'Crossbow': {
		tags: ['ranged', '1h'],
	},
	'Boomerang': {
		tags: ['ranged', '1h'],
		variants: ['Boomerang', 'Shuriken', 'Darts', 'Throwing Glaive', 'Chakram'],
	},
	'Dagger': {
		tags: ['melee', '1h'],
		variants: ['Dagger', 'Rondeau', 'Knife'],
	},
	'Staff': {
		tags: ['melee', '1h', 'focus'],
		variants: ['Staff'],
	},
	'Wand': {
		tags: ['1h', 'focus'],
		variants: ['Wand'],
	},
	'Rod': {
		tags: ['1h', 'focus'],
		variants: ['Rod', 'Scepter'],
	},
	'Tome': {
		tags: ['1h', 'focus'],
		variants: ['Tome', 'Book', 'Scroll'],
	},
	'Runes': {
		tags: ['1h', 'focus'],
		variants: ['Runes', 'Bones', 'Dice', 'Cards'],
	},
	'Claw': {
		tags: ['1h', 'melee', 'focus'],
		variants: ['Claw', 'Fist', 'Gloves'],
	},
	'Talisman': {
		tags: ['1h', 'melee', 'focus'],
		variants: ['Talisman', 'Sigil'],
	}
}
const armor_list = {
	'Helm': {
		region: Item.region.head,
	},
	'Cowl': {
		region: Item.region.head,
	},
	'Wizard Hat': {
		region: Item.region.head,
	},
	'Tiara': {
		region: Item.region.head,
	},
	'Eye': {
		region: Item.region.head,
	},
	'Amulet': {
		region: Item.region.neck,
	},
	'Brooch': {
		region: Item.region.neck,
	},
	'Cloak': {
		region: Item.region.neck,
	},
	'Shroud': {
		region: Item.region.neck,
	},
	'Pendant': {
		region: Item.region.neck,
	},
	'Breastplate': {
		region: Item.region.chest,
	},
	'Jerkin': {
		region: Item.region.chest,
	},
	'Robe': {
		region: Item.region.chest,
	},
	'Tunic': {
		region: Item.region.chest,
	},
	'Wizard Robes': {
		region: Item.region.chest,
	},
	'Ring': {
		region: Item.region.arms,
	},
	'Vambraces': {
		region: Item.region.arms,
	},
	'Shield': {
		region: Item.region.arms,
	},
	'Greaves': {
		region: Item.region.legs,
	},
	'Breeches': {
		region: Item.region.legs,
	},
	'Shackle': {
		region: Item.region.legs,
	},
	'Sandals': {
		region: Item.region.feet,
	},
	'Boots': {
		region: Item.region.feet,
	},
};
const modifier_list = {
	'Holy': {
		valid:['weapon', 'armor'],
		multiplier:()=>{return player.archetype.name=="Monk"?4.5:3}
	},
	'Magical':
	{
		valid:['weapon', 'armor'],
		multiplier:()=>{return player.archetype.name=="Mage"?2.2:2}
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
	},
	'Steel':
	{
		valid:['weapon', 'armor'],
		multiplier:1.15
	},
	'Iron':
	{
		valid:['weapon', 'armor'],
		multiplier:1.1
	},
	'Bronze':
	{
		valid:['weapon', 'armor'],
		multiplier:1.05
	},
	'Silk':
	{
		valid:['armor'],
		multiplier:()=>{return player.archetype.name=="Mage"?2.5:0.8}
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
	},
	'Dragonscale':
	{
		valid:['armor'],
		multiplier:3
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
const tool_id_list = ["Boat"];
