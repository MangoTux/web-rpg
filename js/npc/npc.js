class NPC extends Sentient {
  id;
  modifier = null;
  quest = null;
  fallback_stats = {
    power: 30,
    vitality: 30,
    resilience: 30,
    dexterity: 30,
    spirit: 30,
    luck: 0,
  };

  constructor(id) {
    super();
    this.id = id;
    this.name = id;
    this.generate();
  }

  generate(position) {
    // Based on player details and location
    this.level = player.level;
    this.actions = npc_list[this.id].actions || ["npc_debug_action"];
    this.base_combat_stats = npc_list[this.id].stats || this.fallback_stats;
    this.hp.max = this.get_stat("vitality");
    this.hp.now = this.hp.max;
    // Modify level based on random tweaking, area, etc
    this.position = position;
    // From the source config, apply combat stats, gold, etc
    // Variable (default 5?)-percent chance mutation
    if (getRandomInt(0, 100) < 5) {
      this.mutate();
    }
  }

  generateFromSummon(source) {
    this.level = source.level;
    this.actions = npc_list[this.id].actions;
    this.base_combat_stats = npc_list[this.id].stats;
    this.hp.max = this.get_stat("vitality");
    this.hp.now = this.hp.max;
  }

  mutate() {
    // Find a random npc modifier
    // Update name and all stats to reflect the big lug
    this.modifier = randomChoice(
      [
        giant_mod, tiny_mod, puny_mod,
        trash_mod, colossal_mod, quick_mod,
        slow_mod, king_mod, queen_mod
      ]
    );
    // Update stats to factor in modifier's changes?
    this.name = this.modifier.name.replace('%', this.name);
  }
}

// Config files for all of the encounter-able NPCs. Setting-dependent configs are detailed below
const npc_list = {
	"Alligator": {
    description:"Or is it a crocodile?",
    actions:[],
    stats: {
      power: 80,
      vitality: 90,
      resilience: 40,
      dexterity: 70,
      spirit: 15,
      luck: 2,
    }
	},
	"Bat": {
    description:"Not the baseball kind.",
    actions:[],
    stats: {
      power: 20,
      vitality: 15,
      resilience: 30,
      dexterity: 125,
      spirit: 30,
      luck: 10,
    }
	},
	"Basilisk": {
    description:"Don't look at it!",
    actions:[],
    stats: {
      power: 120,
      vitality: 80,
      resilience: 120,
      dexterity: 30,
      spirit: 30,
      luck: 1,
    }
	},
	"Bumblebee": {
    description:"Just a humble bumblebee.",
    actions:['sting'],
    stats: {
      power: 25,
      vitality: 25,
      resilience: 65,
      dexterity: 70,
      spirit: 30,
      luck: 13,
    }
	},
	"Camel": {
    description:"Humps Don't Lie",
    actions:['spit','stomp'],
    stats: {
      power: 30,
      vitality: 40,
      resilience: 175,
      dexterity: 30,
      spirit: 30,
      luck: 0,
    }
	},
	"Chicken": {
    description:"Why *did* it cross the road?",
    actions:[],
    stats: {
      power: 20,
      vitality: 20,
      resilience: 20,
      dexterity: 105,
      spirit: 5,
      luck: 1,
    }
	},
	"Cow": {
    description:"Moo.",
    actions:[],
    stats: {
      power: 45,
      vitality: 60,
      resilience: 70,
      dexterity: 15,
      spirit: 5,
      luck: 2,
    }
	},
	"Coyote": {
    description:"Looks a little beaten-up and hungry.",
    actions:[],
    stats: {
      power: 95,
      vitality: 45,
      resilience: 45,
      dexterity: 70,
      spirit: 15,
      luck: -1,
    }
	},
	"Crab": {
    description:"I bet it has a firm handshake.",
    actions:[],
    stats: {
      power: 35,
      vitality: 25,
      resilience: 190,
      dexterity: 45,
      spirit: 5,
      luck: 0,
    }
	},
	"Crocodile": {
    description:"Or is it an alligator?",
    actions:[],
    stats: {
      power: 70,
      vitality: 40,
      resilience: 90,
      dexterity: 80,
      spirit: 15,
      luck: 2,
    }
	},
	"Demon": {
    description:"The often-malevolent beings of lore.",
    actions:[],
    stats: {
      power: 125,
      vitality: 125,
      resilience: 125,
      dexterity: 75,
      spirit: 125,
      luck: 2,
    }
	},
	"Dragon": {
    description:"Here be dragons.",
    actions:[],
    stats: {
      power: 200,
      vitality: 160,
      resilience: 170,
      dexterity: 100,
      spirit: 160,
      luck: 0,
    }
	},
	"Duck":	{
    description:"Quack quack.",
    actions:[],
    stats: {
      power: 15,
      vitality: 15,
      resilience: 15,
      dexterity: 80,
      spirit: 5,
      luck: 3,
    }
	},
	"Electric Eel": {
    description:"Shockingly, these aren't actually eels.",
    actions:[],
    stats: {
      power: 25,
      vitality: 40,
      resilience: 40,
      dexterity: 115,
      spirit: 115,
      luck: 2,
    }
	},
  "Fish": {
    description:"Blub.",
    actions:[],
    stats: {
      power: 19,
      vitality: 19,
      resilience: 19,
      dexterity: 100,
      spirit: 19,
      luck: 0,
    }
  },
	"Frog": {
    description:"Ribbit.",
    actions:[],
    stats: {
      power: 20,
      vitality: 20,
      resilience: 45,
      dexterity: 80,
      spirit: 25,
      luck: 2,
    }
	},
	"Goldfish":	{
    description:"Shiny!",
    actions:[],
    stats: {
      power: 10,
      vitality: 20,
      resilience: 55,
      dexterity: 80,
      spirit: 15,
      luck: 10,
    }
	},
	"Golem": {
    description:"An animated pile o' stuff.",
    actions:[],
    stats: {
      power: 165,
      vitality: 130,
      resilience: 75,
      dexterity: 35,
      spirit: 5,
      luck: 2,
    }
	},
	"Grizzly Bear":	{
    description:"Proof that fuzzy =/= friendly. Don't try to hug it.",
    actions:[],
    stats: {
      power: 115,
      vitality: 140,
      resilience: 140,
      dexterity: 55,
      spirit: 15,
      luck: 0,
    }
	},
	"Imp": {
    description:"Practical jokers just looking for a friend.",
    actions:[],
    stats: {
      power: 25,
      vitality: 25,
      resilience: 95,
      dexterity: 115,
      spirit: 115,
      luck: 20,
    }
	},
	"Kraken":	{
    description:"A gigantic octopus and the bane of sailors.",
    actions:[],
    stats: {
      power: 135,
      vitality: 155,
      resilience: 15,
      dexterity: 100,
      spirit: 35,
      luck: 0,
    }
	},
	"Lizard": {
    description:"Mostly harmless, preferring to spend its time basking in the sun",
    actions:[],
    stats: {
      power: 17,
      vitality: 17,
      resilience: 17,
      dexterity: 85,
      spirit: 10,
      luck: 1,
    }
	},
	"Mammoth": {
    description:"",
    actions:[],
    stats: {
      power: 170,
      vitality: 80,
      resilience: 90,
      dexterity: 65,
      spirit: 25,
      luck: 0,
    }
	},
	"Mermaid": {
    description:"Half human, half fish. Thankfully, the human half is on top.",
    actions:[],
    stats: {
      power: 10,
      vitality: 35,
      resilience: 40,
      dexterity: 55,
      spirit: 165,
      luck: 2,
    }
	},
	"Nomad": {
    description:"I wonder where they'll wander next.",
    actions:[],
    stats: {
      power: 60,
      vitality: 60,
      resilience: 60,
      dexterity: 60,
      spirit: 80,
      luck: 1,
    }
	},
	"Penguin": {
    description:"Formal, Flightless and Flippered.",
    actions:[],
    stats: {
      power: 45,
      vitality: 25,
      resilience: 130,
      dexterity: 115,
      spirit: 15,
      luck: 2,
    }
	},
	"Pig": {
    description:"Oink!",
    actions:[],
    stats: {
      power: 30,
      vitality: 60,
      resilience: 60,
      dexterity: 25,
      spirit: 10,
      luck: 2,
    }
	},
	"Pirate":	{
    description:"Pegleg, eyepatch, hook and parrot. Not the other kind.",
    actions:[],
    stats: {
      power: 80,
      vitality: 40,
      resilience: 80,
      dexterity: 30,
      spirit: 20,
      luck: 1,
    }
	},
	"Polar Bear":	{
    description:"The apex predator of the arctic. Don't try to hug it.",
    actions:[],
    stats: {
      power: 100,
      vitality: 150,
      resilience: 150,
      dexterity: 65,
      spirit: 15,
      luck: 0,
    }
	},
	"Roadrunner":	{
    description:"Gotta go fast!",
    actions:[],
    stats: {
      power: 20,
      vitality: 40,
      resilience: 50,
      dexterity: 135,
      spirit: 20,
      luck: 15,
    }
	},
	"Scorpion":	{
    description:"Mother nature's favorite child.",
    actions:['sting'],
    stats: {
      power: 160,
      vitality: 20,
      resilience: 20,
      dexterity: 55,
      spirit: 15,
      luck: 0,
    }
	},
	"Seagull": {
    description:"They lived by the bay until people started making fun of them.",
    actions:[],
    stats: {
      power: 25,
      vitality: 20,
      resilience: 20,
      dexterity: 25,
      spirit: 15,
      luck: 3,
    }
	},
	"Seal":	{
    description:"Cute and cuddly. Don't even think about fighting it.",
    actions:[],
    stats: {
      power: 500, // i warned you
      vitality: 500,
      resilience: 500,
      dexterity: 500,
      spirit: 500,
      luck: 500,
    }
	},
	"Shark": {
    description:"~~~~~^~~~~",
    actions:[],
    stats: {
      power: 160,
      vitality: 140,
      resilience: 140,
      dexterity: 55,
      spirit: 15,
      luck: 0,
    }
	},
	"Sheep": {
    description:"If there were any more, you'd probably be asleep by now.",
    actions:[],
    stats: {
      power: 25,
      vitality: 20,
      resilience: 50,
      dexterity: 30,
      spirit: 15,
      luck: 1,
    }
	},
	"Skeleton":	{
    description:"How is it moving if it doesn't have muscles?",
    actions:[],
    stats: {
      power: 70,
      vitality: 115,
      resilience: 115,
      dexterity: 50,
      spirit: 30,
      luck: 0,
    }
	},
	"Snake": {
    description:"Named after the dot-collection game featured on the original Nokia phones.",
    actions:[],
    stats: {
      power: 70,
      vitality: 55,
      resilience: 105,
      dexterity: 75,
      spirit: 15,
      luck: 3,
    }
	},
	"Snowman": {
    description:"Do you want to kill a snowman?",
    actions:[],
    stats: {
      power: 20,
      vitality: 35,
      resilience: 35,
      dexterity: 30,
      spirit: 80,
      luck: 0,
    }
	},
  "Spider": {
    description:"Cute widdle friends!",
    actions:[],
    stats: {
      power: 30,
      vitality: 30,
      resilience: 75,
      dexterity: 140,
      spirit: 55,
      luck: 2,
    }
	},
	"Squid": {
    description:"Super intelligent and a lot of legs.",
    actions:[],
    stats: {
      power: 60,
      vitality: 35,
      resilience: 75,
      dexterity: 60,
      spirit: 15,
      luck: 1,
    }
	},
	"Squirrel":	{
    description:"Little rodents that can be big pests.",
    actions:[],
    stats: {
      power: 30,
      vitality: 20,
      resilience: 20,
      dexterity: 95,
      spirit: 15,
      luck: 0,
    }
	},
	"Troll": {
    description:"Ugly, dimwitted, and afraid of sunlight. Who let them use the internet?",
    actions:[],
    stats: {
      power: 175,
      vitality: 85,
      resilience: 190,
      dexterity: 30,
      spirit: 5,
      luck: 1,
    }
	},
	"Turtle":	{
    description:"",
    actions:[],
    stats: {
      power: 45,
      vitality: 95,
      resilience: 180,
      dexterity: 40,
      spirit: 15,
      luck: 0,
    }
	},
	"Venus Flytrap": {
    description:"The opposite of vegetarian",
    actions:[],
    stats: {
      power: 85,
      vitality: 80,
      resilience: 30,
      dexterity: 65,
      spirit: 15,
      luck: 4,
    }
	},
	"Villager":	{
    description:"Just a peaceful citizen",
    actions:[],
    stats: {
      power: 55,
      vitality: 65,
      resilience: 55,
      dexterity: 65,
      spirit: 55,
      luck: 1,
    }
	},
	"Whale": {
    description:"AWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOGGGGGGAAAAAAAA",
    actions:[],
    stats: {
      power: 30,
      vitality: 250,
      resilience: 135,
      dexterity: 60,
      spirit: 15,
      luck: 0,
    }
	},
	"Witch": {
    description:"Double, double, toil and trouble;<br>    Fire burn, and cauldron bubble.",
    actions:[],
    stats: {
      power: 35,
      vitality: 55,
      resilience: 60,
      dexterity: 40,
      spirit: 175,
      luck: 3,
    }
	},
	"Wolf":	{
    description:"Hey look, a dog! Hi Doggy!",
    actions:[],
    stats: {
      power: 75,
      vitality: 65,
      resilience: 65,
      dexterity: 85,
      spirit: 15,
      luck: 0,
    }
	},
	"Wizard":	{
    description:"A wise, old man with a penchant for sorcery",
    actions:[],
    stats: {
      power: 25,
      vitality: 40,
      resilience: 70,
      dexterity: 30,
      spirit: 190,
      luck: 0,
    }
	},
	"Yeti":	{
    description:"I think \"abominable\" is a bit harsh...",
    actions:[],
    stats: {
      power: 110,
      vitality: 105,
      resilience: 170,
      dexterity: 75,
      spirit: 20,
      luck: 0,
    }
	},
	"Zombie":	{
    description:"If it only had a brain...",
    stats: {
      power: 60,
      vitality: 15,
      resilience: 130,
      dexterity: 30,
      spirit: 0,
      luck: 0,
    }
	},
	"Simpleton": {
    description:"A test NPC",
    actions: ["npc_debug_action"],
    stats: {
      power: 30,
      vitality: 30,
      resilience: 30,
      dexterity: 30,
      spirit: 30,
      luck: 0,
    }
	},
  "Familiar": {
    description:"A natural spirit in beast form",
    actions: ["bite"],
    stats: {
      power: 60,
      vitality: 20,
      resilience: 30,
      dexterity: 50,
      spirit: 5,
      luck: 0
    },
  }
};
