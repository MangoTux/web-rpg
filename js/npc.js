
var npc;
// List of npcs and their descriptions.
allNpcs = {
		"Alligator":
		{description:"Or is it a crocodile?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:300,
		 defense:2},
		"Bat":
		{description:"Not the baseball kind.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:25,
		 defense:1},
		"Basilisk":
		{description:"Don't look at it!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:1000,
		 defense:2},
		"Bumblebee":
		{description:"Just a humble bumblebee.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:2,
		 defense:-4},
		"Camel":
		{description:"Humps Don't Lie",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Chicken":
		{description:"Why *did* it cross the road?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Cow":
		{description:"Moo.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Coyote":
		{description:"Looks a little beaten-up and hungry.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:100,
		 defense:-1},
		"Crab":
		{description:"I bet it has a firm handshake.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:150,
		 defense:6},
		"Crocodile":
		{description:"Or is it an alligator?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:300,
		 defense:2},
		"Demon":
		{description:"The often-malevolent beings of lore.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:100,
		 baseXP:100,
		 defense:-5},
		"Dragon": // Here be dragons.
		{description:"Here be dragons.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:10000,
		 defense:50},
		"Duck":
		{description:"Quack quack.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Electric Eel":
		{description:"Shockingly, these aren't actually eels.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:70,
		 defense:0},
    "Fish":
    {description:"Blub.",
     damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
     gold:1,
     baseXP:50,
     defense:1},
		"Frog":
		{description:"Ribbit.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Goldfish":
		{description:"Shiny!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:1,
		 baseXP:1,
		 defense:1},
		"Golem":
		{description:"An animated pile o' stuff.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:15000,
		 defense:100},
		"Grizzly Bear":
		{description:"Proof that fuzzy =/= friendly. Don't try to hug it.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:200,
		 defense:2},
		"Imp":
		{description:"Practical jokers just looking for a friend.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:5,
		 baseXP:100,
		 defense:-1},
		"Kraken":
		{description:"A gigantic octopus and the bane of sailors.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Lizard":
		{description:"Mostly harmless, preferring to spend its time basking in the sun",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Mammoth":
		{description:"",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Mermaid":
		{description:"Half human, half fish. Thankfully, the human half is on top.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:70,
		 baseXP:50,
		 defense:1},
		"Nomad":
		{description:"I wonder where they'll wander next.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:5,
		 baseXP:50,
		 defense:1},
		"Penguin":
		{description:"Formal, Flightless and Flippered.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:10,
		 baseXP:50,
		 defense:1},
		"Pig":
		{description:"Oink!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Pirate":
		{description:"Pegleg, eyepatch, hook and parrot. Not the other kind.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:120,
		 baseXP:100,
		 defense:-1},
		"Polar Bear":
		{description:"The apex predator of the arctic. Don't try to hug it.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:150,
		 defense:3},
		"Roadrunner":
		{description:"Gotta go fast!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Scorpion":
		{description:"Mother nature's favorite child.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:-1},
		"Seagull":
		{description:"They lived by the bay until people started making fun of them.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Seal":
		{description:"Cute and cuddly. Don't even think about fighting it.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:0,
		 defense:-4},
		"Shark":
		{description:"~~~~~^~~~~",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:100,
		 defense:0},
		"Sheep":
		{description:"If there were any more, you'd probably be asleep by now.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Skeleton":
		{description:"How is it moving if it doesn't have muscles?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Snake":
		{description:"Named after the dot-collection game featured on the original Nokia phones.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Snowman":
		{description:"Do you want to kill a snowman?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Spider":
		{description:"Cute widdle friends!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:8,
		 baseXP:88,
		 defense:1},
		"Squid":
		{description:"Super intelligent and a lot of legs.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Squirrel":
		{description:"Little rodents that can be big pests.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:5,
		 baseXP:50,
		 defense:1},
		"Troll":
		{description:"Ugly, dimwitted, and afraid of sunlight. Who let them use the internet?",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:15,
		 baseXP:87,
		 defense:-1},
		"Turtle":
		{description:"",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Venus Flytrap":
		{description:"The opposite of vegetarian",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Villager":
		{description:"Just a peaceful citizen",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:25,
		 baseXP:65,
		 defense:1},
		"Whale":
		{description:"AWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOGGGGGGAAAAAAAA",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:50,
		 defense:12},
		"Witch":
		{description:"Double, double, toil and trouble;<br>    Fire burn, and cauldron bubble.",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:60,
		 baseXP:90,
		 defense:1},
		"Wolf":
		{description:"Hey look, a dog! Hi Doggy!",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:0,
		 baseXP:60,
		 defense:1},
		"Wizard":
		{description:"A wise, old man with a penchant for sorcery",
		 damageRollMax:2, // A number from 1-M will be rolled
     damageRollQty:2, // The above number will be rolled Q times.
     damageModifier:1, // This value is added to the damage Roll
     attackSpeed:1,
		 gold:45,
		 baseXP:1000,
		 defense:2},
		"Yeti":
		{description:"I think \"abominable\" is a bit harsh...",
		 damageRollMax:2, // A number from 1-M will be rolled
		 damageRollQty:2, // The above number will be rolled Q times.
		 damageModifier:1, // This value is added to the damage Roll
		 attackSpeed:1,
		 gold:0,
		 baseXP:120,
		 defense:3},
		"Zombie":
		{description:"If it only had a brain...",
		 damageRollMax:2, // A number from 1-M will be rolled
		 damageRollQty:2, // The above number will be rolled Q times.
	 	 damageModifier:1, // This value is added to the damage Roll
	 	 attackSpeed:1,
		 gold:15,
		 baseXP:50,
		 defense:-2},
		"Simpleton":
		{description:"A test NPC",
		damageRollMax:2, // A number from 1-M will be rolled
		damageRollQty:2, // The above number will be rolled Q times.
	  damageModifier:1, // This value is added to the damage Roll
		attackSpeed:1,
		gold:0,
	  baseXP:0,
	  defense:0, // Reduces incoming damage by this amount (Minimum damage applied should be 1)
	  luck:0} // Increases the chance of a critical hit
	};
//Overlap of npcs is intended.
npcs =
{
	//For low levels
	easyNpcs:
	[
		"Bat",
		"Bumblebee",
		"Chicken",
		"Cow",
		"Crab",
		"Duck",
		"Frog",
		"Imp",
		"Lizard",
		"Pig",
		"Seagull",
		"Sheep",
		"Spider",
		"Squirrel",
		"Turtle",
		"Villager"
	],
	//For use in shops/town?
	peopleNpcs:
	[
		"Nomad",
		"Pirate",
		"Skeleton",
		"Villager",
		"Witch",
		"Wizard",
		"Zombie"
        /* ,
        "Monk",
        "Warrior",
        "Mage",
        "Ranger",
        "Human",
        "Dwarf",
        "Elf",
        "Goblin" */
	],
	//For North/South > 70
	coldNpcs:
	[
		"Mammoth",
		"Penguin",
		"Polar Bear",
		"Seal",
		"Snowman",
		"Wolf",
		"Yeti"
	],
	//For desert/sand locations
	aridNpcs:
	[
		"Camel",
		"Coyote",
		"Crab",
		"Lizard",
		"Nomad",
		"Roadrunner",
		"Scorpion",
		"Seagull",
		"Skeleton",
		"Snake",
		"Spider",
		"Turtle",
		"Venus Flytrap"
	],
	//These npcs only appear in water
	waterNpcs:
	[
		"Electric Eel",
		"Fish",
		"Goldfish",
		"Kraken",
		"Mermaid",
		"Shark",
		"Squid",
		"Whale",
        "Pirate"
	],
	//For high levels
	hardNpcs:
	[
		"Alligator",
		"Basilisk",
		"Crocodile",
		"Demon",
		"Dragon",
		"Golem",
		"Grizzly Bear",
		"Imp",
		"Pirate",
		"Scorpion",
		"Skeleton",
		"Troll",
		"Witch",
		"Wizard",
		"Zombie"
	],
	//For everything else
	normalNpcs:
	[
		"Bat",
		"Bumblebee",
		"Chicken",
		"Cow",
		"Crab",
		"Crocodile",
		"Duck",
		"Frog",
		"Grizzly Bear",
		"Imp",
		"Lizard",
		"Nomad",
		"Pig",
		"Pirate",
		"Scorpion",
		"Seagull",
		"Sheep",
		"Skeleton",
		"Snake",
		"Spider",
		"Squirrel",
		"Troll",
		"Turtle",
		"Venus Flytrap",
		"Villager",
		"Wolf",
		"Witch",
		"Wizard",
		"Zombie"
	],
	debug: [
		"Simpleton"
	]
};

specialModifiers = [
  {
    nameModifier: "Giant %",
    damageModifier:4,
		attackSpeed:1,
    defenseModifier:2,
    luckModifier:0,
    hpModifier:0.5,
    rewardModifier:6
  },
  {
    nameModifier: "Tiny %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:0.5,
    luckModifier:0,
    hpModifier:2,
    rewardModifier:0.25
  },
  {
    nameModifier: "Puny %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:2,
    luckModifier:4,
    hpModifier:1,
    rewardModifier:1
  },
  {
    nameModifier: "Trash %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:0.6,
    luckModifier:0,
    hpModifier:0.5,
    rewardModifier:0
  },
  {
    nameModifier: "Collosal %",
    damageModifier:10,
		attackSpeed:1,
    luckModifier:0,
    defenseModifier:10,
    hpModifier:2,
    rewardModifier:100
  },
  {
    nameModifier: "Quick %",
    damageModifier:.3,
		attackSpeed:2,
    luckModifier:5,
    defenseModifier:2,
    hpModifier:.9,
    rewardModifier:2
  },
  {
    nameModifier: "Slow %",
    damageModifier:1,
		attackSpeed:0.5,
    luckModifier:0,
    defenseModifier:0.5,
    hpModifier:2,
    rewardModifier:0.25
  },
  {
    nameModifier: "King of the %s",
    damageModifier: 4,
		attackSpeed:1,
    luckModifier: 0,
    defenseModifier: 2,
    hpModifier:5,
    rewardModifier:100
  },
  {
    nameModifier: "Queen of the %s",
    damageModifier: 3,
		attackSpeed:1,
    luckModifier:4,
    defenseModifier:0,
    hpModifier:1,
    rewardModifier:100
  }
];

var debug = true;
function getName()
{
    var baseName;

		if (debug) {
			baseName = randomChoice(npcs.debug);
		}
    else if (map.getTile(player.X, player.Y).type=="W")
    {
        baseName = randomChoice(npcs.waterNpcs);
    }

    // Extreme north or south; create arctic npcs
    else if (player.Y > 70 || player.Y < -70)
    {
        baseName = randomChoice(npcs.coldNpcs);
    }
    // Center of world, create people
    else if ((player.Y < 30 && player.Y > -30) && (player.X < 30 && player.X > -30))
    {
        baseName = randomChoice(npcs.peopleNpcs);
    }
    else if (player.level < 25)
    {
        baseName = randomChoice(npcs.easyNpcs.concat(npcs.normalNpcs));
    }
    else if (player.level > 60)
    {
        baseName = randomChoice(npcs.hardNpcs.concat(npcs.normalNpcs));
    }
    else
    {
        baseName = randomChoice(npcs.normalNpcs);
    }
    return baseName;
}

function Npc()
{
	this.name = "";
  this.name_mod = "%";
	this.level = 0;
	this.combat_stats = {
		maxHP: 0,
		luck: 0,
		aggression: 0,
		damageRollMax: 1,
		damageRollQty: 1,
		damageModifier: 0,
		defense: 0,
		currentHP: 0,
		attackSpeed: 1,
	}
	this.inventory = [];
	this.gold = 0;

	// Creates the npc based on player info
	this.createNpc = function(isRandomEncounter)
	{
    this.name = getName();

		var distance = Math.abs(player.X + player.Y);

    this.level = player.level;
    if (distance > 60) // Make encounters more difficult the further the Player strays
    {
      this.level += getRandomInt(-Math.sqrt(distance)/2, Math.sqrt(distance));
    }
    this.level += getRandomInt(-1-(player.level/5), (player.level/5));
    this.level = Math.floor(this.level);
		if (this.level > 100)
			this.level = 100;
		if (this.level < 1)
			this.level = 1;
		this.gold = Math.floor(allNpcs[this.name].gold*Math.sqrt(this.level)/2);

		this.experience = allNpcs[this.name].baseXP
		this.combat_stats.maxHP = 30 + Math.floor(this.level*Math.sqrt(this.level+1)-getRandomInt(0, this.level+1));
		this.combat_stats.damageRollMax = allNpcs[this.name].damageRollMax;
		this.combat_stats.damageRollQty = allNpcs[this.name].damageRollQty;
		this.combat_stats.damageModifier = allNpcs[this.name].damageModifier;
		this.combat_stats.attackSpeed = allNpcs[this.name].attackSpeed;
		this.combat_stats.luck = getRandomInt(1, this.level+1);
		this.combat_stats.defense = allNpcs[this.name].defense

    if (getRandomInt(0, 100)<5)
    {
      var mod = randomChoice(specialModifiers);
      this.combat_stats.luck = Math.floor(this.combat_stats.luck*mod.luckMod);

      this.combat_stats.baseDamage = Math.floor(this.combat_stats.baseDamage*mod.damageModifier);
      this.combat_stats.defense = Math.floor(this.combat_stats.defense*mod.defenseModifier);
      this.combat_stats.maxHP = Math.floor(this.combat_stats.maxHP*mod.hpModifier);
      this.experience = Math.floor(this.experience*mod.rewardModifier);
      this.gold = Math.floor(this.gold*mod.rewardModifier);
      this.name_mod = mod.nameModifier.replace("%", this.name);
			this.combat_stats.attackSpeed = this.combat_stats.attackSpeed*mod.attackSpeed;
    }
    else
    {
      this.name_mod = this.name;
    }
		this.combat_stats.currentHP = this.combat_stats.maxHP;

    if (!isRandomEncounter) {
      this.name_mod = new MName().New() + " the " + this.name_mod; // Humanize questable NPCs
      // this.quest = getQuest();
    }
	};
}

function isNpcOnTile(x, y) {
  for (var i in npcList) {
    if (npcList[i].x == x && npcList[i].y == y) {
      currentNpcIndex = i;
      return true;
    }
  }
  currentNpcIndex = null;
  return false;
}

var npcList = [];
npcList.push({x:0,y:1,npc:null});
for (var i=1; i<=1000; i++)
{
    npcList.push({x:getRandomInt(-500, 500), y:getRandomInt(-500, 500), npc:null});
}
var currentNpcIndex;
