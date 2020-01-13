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
    const name_map = (list) => { return list.reduce(function(prev, cur) { prev[cur.name] = (prev[cur.name] || 0) + 1; return prev; }, {}) }
    const encounter_size = randomChoice([1, 1, 1, 2, 2, 3, 4]);
    this.enemy_list = [];
    for (let i = 0; i<encounter_size; i++) {
      this.enemy_list.push(NPC_Factory.getRandomEnvironmental(player.position));
    }
    this.enemy_list.forEach((npc, index) => {
      this.rewards.gold += npc.gold;
      this.rewards.experience += 100; // TODO
      this.rewards.items.concat(npc.inventory);
    });

    // Rename duplicates to [name] A, [name] B
    const unique_name_list = name_map(this.enemy_list);
    Object.keys(unique_name_list).forEach(name => {
      if (unique_name_list[name] == 1) { return; }
      const char_code_base = 65;
      for (let i = 0; i<unique_name_list[name]; i++) {
        let entity_index = this.enemy_list.findIndex((entity) => entity.name == name);
        this.enemy_list[entity_index].name += " " + String.fromCharCode(char_code_base + i);
      }
    });
  }

  startCombat() {
    Terminal.setWorking(true);
    player.state = state.player.combat;
    this.combat = new Combat();
    this.combat.versus(this.enemy_list);
    this.combat.updateDisplay();
    this.combat.turn_timer();
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

  fleeCombat() {
    Terminal.print("You manage to escape!");
    Terminal.setWorking(false);
    clearTimeout(this.combat.turn_cycle);
    this.combat = null;
    player.state = state.player.standard;
    $(Terminal.selector.hud_main).animate({opacity: "0%"}, 500, "linear", () => {
      Terminal.resetGameInfo();
      environment.cleanEncounter();
    });
  }

  endCombat() {
    clearTimeout(this.combat.turn_cycle);
    Terminal.resetGameInfo();
    Terminal.setWorking(false);
    if (this.combat.ally_list.length == 0) {
      ui.drawTomstone();
      Terminal.print("You died...");
      player.state = state.player.dead;
      environment.cleanEncounter();
      return;
    }
    this.combat = null;
    player.state = state.player.standard;
    // On player victory, administer rewards
    if (this.rewards.gold) {
      player.gold += this.rewards.gold;
      Terminal.print(`You gained ${reward.gold} gold.`);
    }
    if (this.rewards.items.length) {
      this.rewards.items.forEach(item => {
        Terminal.print(`You found an item: ${item.name}`);
        player.inventory.push(item);
      });
    }
    player.increase_experience(this.rewards.experience).forEach((response) => {
      Terminal.print(response);
    });
    environment.cleanEncounter();
  }
}
