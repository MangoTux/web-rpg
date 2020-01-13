class NPC_Factory {
  static easy_list = [
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
  ];
  static medium_list = [
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
  ];
  static difficult_list = [
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
  ]
  static humanoid_list = [
		"Nomad",
		"Pirate",
		"Skeleton",
		"Villager",
		"Witch",
		"Wizard",
		"Zombie"
  ];
  static cold_list = [
		"Mammoth",
		"Penguin",
		"Polar Bear",
		"Seal",
		"Snowman",
		"Wolf",
		"Yeti"
  ];
  static arid_list = [
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
  ];
  static aquatic_list = [
		"Electric Eel",
		"Fish",
		"Goldfish",
		"Kraken",
		"Mermaid",
		"Shark",
		"Squid",
		"Whale",
    "Pirate"
  ];
  static debug_list = [
		"Simpleton"
  ];

  constructor() {}

  // NPCs that can talk and give quests.
  // Generate from list of (most) humanoids, and give them a quest (usually)
  static getRandomQuestable() {
    const npc = new NPC(randomChoice(this.humanoid_list));
    npc.name = new MName().New() + ` the ${npc.id}`;
    // TODO Establish quest
    return npc;
  }

  // Based on map data.
  // Moisture => aquatic_list
  // Dryness + Temperature => arid_list
  // Temperature => cold_list
  // Others from easy, medium, hard list
  static getRandomEnvironmental(position) {
    // As a development behavior.
    return new NPC(randomChoice(this.debug_list));
    let biome_data = environment.map.getTileData(position);
    let id = null;
    let full_npc_list = this.humanoid_list;
    full_npc_list = full_npc_list.concat(this.easy_list, this.medium_list, this.difficult_list);
    if (biome_data.elevation < 1) {
      full_npc_list = full_npc_list.concat(this.aquatic_list);
    }
    if (biome_data.moisture < 3 && biome_data.elevation < 5) {
      full_npc_list = full_npc_list.concat(this.arid_list);
    }
    if (biome_data.moisture > 4 && biome_data.elevation > 5) {
      full_npc_list = full_npc_list.concat(this.cold_list);
    }
    if (biome_data.moisture < 5 && biome_data.elevation < 6) {
      full_npc_list = full_npc_list.concat(this.humanoid_list);
    }
    if (biome_data.elevation < 3) {
      full_npc_list = full_npc_list.concat(this.aquatic_list);
    }
    return new NPC(randomChoice(full_npc_list));
  }
}
