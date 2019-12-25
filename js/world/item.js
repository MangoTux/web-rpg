'use strict';
/* Unused for now? */
const equipment_types =
{
	//Descriptors
	armor:'Armor',
	weapon:'Weapon',
	both:'Both',
	healing:'Healing',
  tool:'Tool',
	//Equip location
	head:'Head',
	hat:'Head',
	neck:'Neck',
	chest:'Chest',
	arms:'Arms',
	legs:'Legs',
	feet:'Feet',
	wield:'Wield',
}

var dep_Item = function()
{

	for (var p in modifier)
	{
		if ((modifier[p].type == types.both) || (isWeapon && modifier[p].type == types.weapon) || (!isWeapon && modifier[p].type == types.armor))
		{
			itemModList.push(p);
		}
	}
	for (var p in referenceList)
	{
		if ((referenceList[p].type == types.wield && isWeapon) || (referenceList[p].type != types.wield && !isWeapon))
		{
			itemnamingTemplate.push(p);
		}
	}
	var nameMod = randomChoice(itemModList);
	var itemType = randomChoice(itemnamingTemplate);
	var mname = new MName();

	this.name = nameMod + ' ' + itemType;
	this.statChanges = {};
	if (referenceList[itemType].damageModifier < 0)
		this.statChanges.damageModifier = Math.floor(referenceList[itemType].damageModifier*modifier[nameMod].multiplier);
	else
		this.statChanges.damageModifier = Math.floor(modifier[nameMod].multiplier*Math.sqrt(referenceList[itemType].damageModifier*player.level));
	if (referenceList[itemType].defense < 0)
		this.statChanges.defense = Math.floor(referenceList[itemType].defense*modifier[nameMod].multiplier);
	else
		this.statChanges.defense = Math.floor(modifier[nameMod].multiplier*Math.sqrt(referenceList[itemType].defense*player.level));
	if (referenceList[itemType].luck < 0)
		this.statChanges.luck = Math.floor(referenceList[itemType].luck*modifier[nameMod].multiplier);
	else
		this.statChanges.luck = Math.floor(modifier[nameMod].multiplier*Math.sqrt(referenceList[itemType].luck*player.level));
	this.type = referenceList[itemType].type;
	this.cost = Math.floor((getRandomInt(30, 200)+this.statChanges.luck+this.statChanges.defense+this.statChanges.damageModifier)*modifier[nameMod].multiplier);
  if (getRandomInt(0, 100)<10)
  {
    this.name += ' of ' + mname.New();
    this.statChanges.damageModifier *= 1.1;
    this.statChanges.defense *= 1.1;
    this.statChanges.luck *= 1.1;
  }
}

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
	constructor() {}

	toString() { return ""; }
}

class Tool extends Item {
	constructor() {
		super();
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
		if (id == undefined) {
			randomChoice(player.archetype.armor);
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
		if (id == undefined) {
			randomChoice(player.archetype.weapons);
		}
		this.id = id;
		this.base_item = weapon_list[id];
		this.cost = 100;
		this.name = id;
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
			case 1: return new Weapon(randomChoice(player.archetype.weapons));
			case 2:
			case 3: return new Armor(randomChoice(player.archetype.armor));
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
	},
	'Axe': {
		tags: ['melee', '1h'],
	},
	'Hammer': {

	},
	'Cutlass': {

	},
	'Rapier': {

	},
	'Scimitar': {

	},
	'Spear': {
		tags: ['melee', '1h', 'ranged'],
	},
	'Flail': {

	},
	'Halberd': {

	},
	'Shortbow': {
		tags: ['ranged', '2h'],
	},
	'Longbow': {
		tags: ['ranged', '2h'],
	},
	'Crossbow': {
		tags: ['ranged', '1h'],
	},
	'Boomerang': {
		tags: ['ranged', '1h'],
	},
	'Shuriken': {
		tags: ['ranged', '1h'],
	},
	'Dagger': {

	},
	'Staff': {

	},
	'Wand': {

	},
	'Rod': {

	},
	'Scepter': {

	},
	'Tome': {

	},
	'Runes': {

	},
	'Chakram': {

	},
	'Claw': {

	},
	'Fist': {

	},
	'Gloves': {

	},
	'Talisman': {

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
		type: "waterTravel",
	},
	'Raft': {
		type: "waterTravel",
	}
};
