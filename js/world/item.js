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
	var isWeapon = (Math.random() > .5);
	var itemModList = []; // List of possible names for the item modifier
	var itemnamingTemplate = []; // List of possible items
	var referenceList; // List to use for item pool

	if (typeof player === "undefined")
	{
		this.name = "Regular Fist";
		this.statChanges.damageModifier = 0;
		this.statChanges.luck = 0;
		this.statChanges.defense = 0;
		this.type = types.wield;
		return;
	}
	switch (player.playerClass)
	{
		case "warrior": referenceList = warriorItems; break;
		case "ranger": referenceList = rangerItems; break;
		case "mage": referenceList = mageItems; break;
		case "monk": referenceList = monkItems; break;
		default: referenceList = allItems; break;
	}

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
	}

	toString() { super.toString(); }
}

class Equipment extends Item {
	constructor() {
		super();
	}

	toString() { super.toString(); }
}

class Armor extends Equipment {
	constructor(id) {
		super();
		this.id = id;
		this.base_item = armor_list[id];
		// TODO Modifier, name
	}

	toString() { super.toString(); }
}

class Weapon extends Equipment {
	constructor(id) {
		super();
		this.id = id;
		this.base_item = weapon_list[id];
		// TODO Modifier, name
	}

	toString() { super.toString(); }
}

class Consumable extends Item {
	constructor(id) {
		super();
		this.id = id;
		this.base_item = consumable_list[id];
	}

	toString() { super.toString(); }
}

class ItemFactory {
	static getRandomConsumable() {
		return new Consumable();
	}

	static getRandomEquipment() {
		switch (getRandomInt(0, 5)) {
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

	},
	'Shield': {

	},
	'Axe': {

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

	},
	'Flail': {

	},
	'Halberd': {

	},
	'Shortbow': {

	},
	'Longbow': {

	},
	'Crossbow': {

	},
	'Boomerang': {

	},
	'Shuriken': {

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
		valid:equipment_types.both,
		multiplier:()=>{player.archetype.name=="Monk"?4.5:3}
	},
	'Magical':
	{
		valid:equipment_types.both,
		multiplier:()=>{player.archetype.name=="Mage"?2.2:2}
	},
	'Golden':
	{
		valid:equipment_types.both,
		multiplier:3
	},
	'Great':
	{
		valid:equipment_types.both,
		multiplier:4
	},
	'Leather':
	{
		valid:equipment_types.armor,
		multiplier:()=>{player.archetype.name=="Ranger"?2.5:0.8}
	},
	'Steel':
	{
		valid:equipment_types.both,
		multiplier:1.15
	},
	'Iron':
	{
		valid:equipment_types.both,
		multiplier:1.1
	},
	'Bronze':
	{
		valid:equipment_types.both,
		multiplier:1.05
	},
	'Silk':
	{
		valid:equipment_types.armor,
		multiplier:()=>{player.archetype.name=="Mage"?2.5:0.8}
	},
	'Flaming':
	{
		valid:equipment_types.weapon,
		multiplier:2.5
	},
	'Fire':
	{
		valid:equipment_types.weapon,
		multiplier:2
	},
	'Freezing':
	{
		valid:equipment_types.weapon,
		multiplier:2.5
	},
	'Ice':
	{
		valid:equipment_types.weapon,
		multiplier:2
	},
	'Stone':
	{
		valid:equipment_types.weapon,
		multiplier:1.5
	},
	'Dragonscale':
	{
		valid:equipment_types.armor,
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
