class Encounter {
  /*
  An encounter matches the player (allies out of scope)
  against a number of enemies.
  Turn order dependant on initiative, moves are selected on turn.
  Once the move is selected, (optional) targets are chosen and the move is performed
  When one side has no available participants (flee or 0 HP), the fight is over.
  If the player wins, yield onVictory
  */
  enemy_list;
  combat;
  // List of callbacks
  on_victory = [];
  on_defeat = [];

  constructor() {
    this.rewards = {
      gold: 0,
      experience: 0,
      items: []
    };
  }

  generate() {
    this.enemy_list = [
      NPC_Factory.getRandomEnvironmental(player.position)
    ];
    this.enemy_list.push(NPC_Factory.getRandomEnvironmental(player.position));
    this.enemy_list.push(NPC_Factory.getRandomEnvironmental(player.position));
    this.enemy_list.push(NPC_Factory.getRandomEnvironmental(player.position));
    this.enemy_list.forEach((npc) => {
      this.rewards.gold += npc.gold;
      this.rewards.experience += 10; // TODO
      this.rewards.items.concat(npc.inventory);
    });
  }

  startCombat() {
    player.state = state.player.combat;
    this.combat = new Combat();
    this.combat.versus(this.enemy_list);
    this.combat.updateDisplay();
  }

  toString() {
    if (this.enemy_list.length > 1) {
      return "a group of enemies";
    }
    let enemy = this.enemy_list[0];
    return `a level ${enemy.level} ${enemy.name}`;
  }

  toFleeString() {
    if (this.enemy_list.length > 1) {
      return "group of enemies";
    }
    let enemy = this.enemy_list[0];
    return enemy.name;
  }

  endCombat() {

  }
}
