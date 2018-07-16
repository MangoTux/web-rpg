
var npc;
// List of npcs and their descriptions.
allNpcs = {
		"Alligator":
		{description:"Or is it a crocodile?",
		 damage:12,
		 gold:0,
		 baseXP:300,
		 defense:2},
		"Bat":
		{description:"Not the baseball kind.",
		 damage:1,
		 gold:0,
		 baseXP:25,
		 defense:1},
		"Basilisk":
		{description:"Don't look at it!",
		 damage:18,
		 gold:0,
		 baseXP:1000,
		 defense:2},
		"Bumblebee":
		{description:"Just a humble bumblebee.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:2,
		 defense:-4},
		"Camel":
		{description:"Humps Don't Lie",
		 damage:5,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Chicken":
		{description:"Why *did* it cross the road?",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Cow":
		{description:"Moo.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Coyote":
		{description:"Looks a little beaten-up and hungry.",
		 damage:7,
		 gold:0,
		 baseXP:100,
		 defense:-1},
		"Crab":
		{description:"I bet it has a firm handshake.",
		 damage:6,
		 gold:0,
		 baseXP:150,
		 defense:6},
		"Crocodile":
		{description:"Or is it an alligator?",
		 damage:12,
		 gold:0,
		 baseXP:300,
		 defense:2},
		"Demon":
		{description:"The often-malevolent beings of lore.",
		 damage:30,
		 gold:100,
		 baseXP:100,
		 defense:-5},
		"Dragon": // Here be dragons.
		{description:"Here be dragons.",
		 damage:75,
		 gold:0,
		 baseXP:10000,
		 defense:50},
		"Duck":
		{description:"Quack quack.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:0},
		"Electric Eel":
		{description:"Shockingly, these aren't actually eels.",
		 damage:8,
		 gold:0,
		 baseXP:70,
		 defense:0},
    "Fish":
    {description:"Blub.",
     damage:5,
     gold:1,
     baseXP:50,
     defense:1},
		"Frog":
		{description:"Ribbit.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Goldfish":
		{description:"Shiny!",
		 damage:1,
		 gold:1,
		 baseXP:1,
		 defense:1},
		"Golem":
		{description:"An animated pile o' stuff.",
		 damage:10,
		 gold:0,
		 baseXP:15000,
		 defense:100},
		"Grizzly Bear":
		{description:"Proof that fuzzy =/= friendly. Don't try to hug it.",
		 damage:40,
		 gold:0,
		 baseXP:200,
		 defense:2},
		"Imp":
		{description:"Practical jokers just looking for a friend.",
		 damage:7,
		 gold:5,
		 baseXP:100,
		 defense:-1},
		"Kraken":
		{description:"A gigantic octopus and the bane of sailors.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Lizard":
		{description:"Mostly harmless, preferring to spend its time basking in the sun",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Mammoth":
		{description:"",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Mermaid":
		{description:"Half human, half fish. Thankfully, the human half is on top.",
		 damage:4,
		 gold:70,
		 baseXP:50,
		 defense:1},
		"Nomad":
		{description:"I wonder where they'll wander next.",
		 damage:4,
		 gold:5,
		 baseXP:50,
		 defense:1},
		"Penguin":
		{description:"Formal, Flightless and Flippered.",
		 damage:5,
		 gold:10,
		 baseXP:50,
		 defense:1},
		"Pig":
		{description:"Oink!",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Pirate":
		{description:"Pegleg, eyepatch, hook and parrot. Not the other kind.",
		 damage:8,
		 gold:120,
		 baseXP:100,
		 defense:-1},
		"Polar Bear":
		{description:"The apex predator of the arctic. Don't try to hug it.",
		 damage:7,
		 gold:0,
		 baseXP:150,
		 defense:3},
		"Roadrunner":
		{description:"Gotta go fast!",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Scorpion":
		{description:"Mother nature's favorite child.",
		 damage:6,
		 gold:0,
		 baseXP:50,
		 defense:-1},
		"Seagull":
		{description:"They lived by the bay until people started making fun of them.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Seal":
		{description:"Cute and cuddly. Don't even think about fighting it.",
		 damage:1,
		 gold:0,
		 baseXP:0,
		 defense:-4},
		"Shark":
		{description:"~~~~~^~~~~",
		 damage:6,
		 gold:0,
		 baseXP:100,
		 defense:0},
		"Sheep":
		{description:"If there were any more, you'd probably be asleep by now.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Skeleton":
		{description:"How is it moving if it doesn't have muscles?",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Snake":
		{description:"Named after the dot-collection game featured on the original Nokia phones.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Snowman":
		{description:"Do you want to kill a snowman?",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Spider":
		{description:"Cute widdle friends!",
		 damage:4,
		 gold:8,
		 baseXP:88,
		 defense:1},
		"Squid":
		{description:"Super intelligent and a lot of legs.",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Squirrel":
		{description:"Little rodents that can be big pests.",
		 damage:3,
		 gold:5,
		 baseXP:50,
		 defense:1},
		"Troll":
		{description:"Ugly, dimwitted, and afraid of sunlight. Who let them use the internet?",
		 damage:7,
		 gold:15,
		 baseXP:87,
		 defense:-1},
		"Turtle":
		{description:"",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Venus Flytrap":
		{description:"The opposite of vegetarian",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:1},
		"Villager":
		{description:"Just a peaceful citizen",
		 damage:4,
		 gold:25,
		 baseXP:65,
		 defense:1},
		"Whale":
		{description:"AWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOGGGGGGAAAAAAAA",
		 damage:4,
		 gold:0,
		 baseXP:50,
		 defense:12},
		"Witch":
		{description:"Double, double, toil and trouble;<br>    Fire burn, and cauldron bubble.",
		 damage:6,
		 gold:60,
		 baseXP:90,
		 defense:1},
		"Wolf":
		{description:"Hey look, a dog! Hi Doggy!",
		 damage:4,
		 gold:0,
		 baseXP:60,
		 defense:1},
		"Wizard":
		{description:"A wise, old man with a penchant for sorcery",
		 damage:7,
		 gold:45,
		 baseXP:1000,
		 defense:2},
		"Yeti":
		{description:"I think \"abominable\" is a bit harsh...",
		 damage:7,
		 gold:0,
		 baseXP:120,
		 defense:3},
		"Zombie":
		{description:"If it only had a brain...",
		 damage:4,
		 gold:15,
		 baseXP:50,
		 defense:-2},
		"Simpleton":
		{description:"A test NPC",
		damageRoll:4, // A number from 1-N will be rolled
	  damageModifier:0, // This value is added to the damage Roll
	  baseXP:0,
	  defense:0, // Reduces incoming damage by this amount (Minimum damage applied should be 1)
		accuracy:0, // Increases the chance to hit by [some amount correlating to the stat]
		evasion:0, // Increases chance to miss by [some amount correlating to the stat]
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
		attackSpeed:3,
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
		attackSpeed:2,
    luckModifier: 0,
    defenseModifier: 2,
    hpModifier:5,
    rewardModifier:100
  },
  {
    nameModifier: "Queen of the %s",
    damageModifier: 3,
		attackSpeed:2,
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
			baseName = npcs.debug["Simpleton"];
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
	this.maxHP = 0;
	this.luck = 0;
  this.aggression = 0;
	this.baseDamageRoll = 1;
	this.baseDamageModifier = 0;
	this.defense = 0;
	this.currentHP = 0;
	this.gold = 0;

	// Creates the npc based on player info
	this.createNpc = function(isRandomEncounter)
	{
    this.name = getName();

		var distance = Math.abs(player.X + player.Y);

    this.level = player.level;
    if (distance > 60)
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

		this.experience = Math.floor(allNpcs[this.name].baseXP*Math.sqrt(this.level)); // TODO scale
		this.maxHP = 30 + Math.floor(this.level*Math.sqrt(this.level+1)-getRandomInt(0, this.level+1));
		this.currentHP = this.maxHP;

		this.luck = getRandomInt(1, this.level+1);
		//TODO improve calculations
		this.baseDamage = Math.floor(allNpcs[this.name].damage+this.level*Math.sqrt(getRandomInt(0, this.level)));

		this.defense = Math.floor(allNpcs[this.name].defense+Math.sqrt(getRandomInt(0, this.level))); // TODO scale

    if (getRandomInt(0, 100)<5)
    {
      var mod = randomChoice(specialModifiers);
      this.luck = Math.floor(this.luck*mod.luckMod);

      this.baseDamage = Math.floor(this.baseDamage*mod.damageModifier);
      this.defense = Math.floor(this.defense*mod.defenseMod);
      this.maxHP = Math.floor(this.maxHP*mod.hpMod);
      this.experience = Math.floor(this.experience*mod.rewardMod);
      this.gold = Math.floor(this.gold*mod.rewardMod);
      this.currentHP = this.maxHP;
      this.name_mod = mod.nameMod.replace("%", this.name);
    }
    else
    {
      this.name_mod = this.name;
    }

    if (!isRandomEncounter) {
      this.name_mod = new MName().New() + " the " + this.name_mod; // Humanize questable NPCs
      this.quest = getQuest();
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
