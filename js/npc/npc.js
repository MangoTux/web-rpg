class NPC extends Sentient {
  id;
  modifier = null;
  quest = null;

  constructor(id) {
    super();
    this.id = id;
    this.generate();
  }

  generate(position) {
    // Based on player details and location
    this.level = player.level;
    // Modify level based on random tweaking, area, etc
    this.position = position;
    // From the source config, apply combat stats, gold, etc
    // Variable (default 5?)-percent chance mutation
    if (getRandomInt(0, 100) < 5) {
      this.mutate();
    }
  }

  mutate() {
    // Find a random npc modifier
    // Update name and all stats to reflect the big lug
  }
}

// Config files for all of the encounter-able NPCs. Setting-dependent configs are detailed below
const npc_list = {
	"Alligator": {
    description:"Or is it a crocodile?",
	},
	"Bat": {
    description:"Not the baseball kind.",
	},
	"Basilisk": {
    description:"Don't look at it!",
	},
	"Bumblebee": {
    description:"Just a humble bumblebee.",
	},
	"Camel": {
    description:"Humps Don't Lie",
	},
	"Chicken": {
    description:"Why *did* it cross the road?",
	},
	"Cow": {
    description:"Moo.",
	},
	"Coyote": {
    description:"Looks a little beaten-up and hungry.",
	},
	"Crab": {
    description:"I bet it has a firm handshake.",
	},
	"Crocodile": {
    description:"Or is it an alligator?",
	},
	"Demon": {
    description:"The often-malevolent beings of lore.",
	},
	"Dragon": {
    description:"Here be dragons.",
	},
	"Duck":	{
    description:"Quack quack.",
	},
	"Electric Eel": {
    description:"Shockingly, these aren't actually eels.",
	},
  "Fish": {
    description:"Blub.",
  },
	"Frog": {
    description:"Ribbit.",
	},
	"Goldfish":	{
    description:"Shiny!",
	},
	"Golem": {
    description:"An animated pile o' stuff.",
	},
	"Grizzly Bear":	{
    description:"Proof that fuzzy =/= friendly. Don't try to hug it.",
	},
	"Imp": {
    description:"Practical jokers just looking for a friend.",
	},
	"Kraken":	{
    description:"A gigantic octopus and the bane of sailors.",
	},
	"Lizard": {
    description:"Mostly harmless, preferring to spend its time basking in the sun",
	},
	"Mammoth": {
    description:"",
	},
	"Mermaid": {
    description:"Half human, half fish. Thankfully, the human half is on top.",
	},
	"Nomad": {
    description:"I wonder where they'll wander next.",
	},
	"Penguin": {
    description:"Formal, Flightless and Flippered.",
	},
	"Pig": {
    description:"Oink!",
	},
	"Pirate":	{
    description:"Pegleg, eyepatch, hook and parrot. Not the other kind.",
	},
	"Polar Bear":	{
    description:"The apex predator of the arctic. Don't try to hug it.",
	},
	"Roadrunner":	{
    description:"Gotta go fast!",
	},
	"Scorpion":	{
    description:"Mother nature's favorite child.",
	},
	"Seagull": {
    description:"They lived by the bay until people started making fun of them.",
	},
	"Seal":	{
    description:"Cute and cuddly. Don't even think about fighting it.",
	},
	"Shark": {
    description:"~~~~~^~~~~",
	},
	"Sheep": {
    description:"If there were any more, you'd probably be asleep by now.",
	},
	"Skeleton":	{
    description:"How is it moving if it doesn't have muscles?",
	},
	"Snake": {
    description:"Named after the dot-collection game featured on the original Nokia phones.",
	},
	"Snowman": {
    description:"Do you want to kill a snowman?",
	},
  "Spider": {
    description:"Cute widdle friends!",
	},
	"Squid": {
    description:"Super intelligent and a lot of legs.",
	},
	"Squirrel":	{
    description:"Little rodents that can be big pests.",
	},
	"Troll": {
    description:"Ugly, dimwitted, and afraid of sunlight. Who let them use the internet?",
	},
	"Turtle":	{
    description:"",
	},
	"Venus Flytrap": {
    description:"The opposite of vegetarian",
	},
	"Villager":	{
    description:"Just a peaceful citizen",
	},
	"Whale": {
    description:"AWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOGGGGGGAAAAAAAA",
	},
	"Witch": {
    description:"Double, double, toil and trouble;<br>    Fire burn, and cauldron bubble.",
	},
	"Wolf":	{
    description:"Hey look, a dog! Hi Doggy!",
	},
	"Wizard":	{
    description:"A wise, old man with a penchant for sorcery",
	},
	"Yeti":	{
    description:"I think \"abominable\" is a bit harsh...",
	},
	"Zombie":	{
    description:"If it only had a brain...",
	},
	"Simpleton": {
    description:"A test NPC",
	}
};
