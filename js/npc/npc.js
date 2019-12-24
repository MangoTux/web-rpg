class NPC extends Sentient {
  id;
  modifier = null;

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
