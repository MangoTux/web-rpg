class Combat {
  config = {
    ai_turn_length: 1000,
  };
  ally_list = [];
  enemy_list = [];
  participants = {};
  // Generate the full turn order at the start of each round
  initiative = [];
  turn_count = 0;
  // The timeout callback handler for AI turns, so it doesn't happen ASAP
  turn_cycle;
  state;
  state_history = [];

  active_entity;

  constructor() {
    this.ally_list = [ player ];
    this.participants[player.uuid] = {
      side: "ally",
      entity: player,
      active_effects: [],
    };
    // The combat-specific player state. Idle until it reaches their turn.
    this.state = state.combat.idle;
  }

  versus(list) {
    // Building like this will allow for development on targeting, so your list of targets matches
    this.enemy_list = list;
    list.forEach((npc, element) => {
      this.participants[npc.uuid] = {
        side: "enemy",
        entity: npc,
        active_effects: [],
        ai: null, // Aggressive always attacks, Defeatist tries to run after 50%, Lucky rolls the dice
      };
    });
  }

  updateMainHUD() {
    // Main HUD will show player and enemy(s) name/HP
    document.querySelector(Terminal.selector.hud_main).classList.add(Terminal.selector.combat.wrapper);

    document.querySelector(Terminal.selector.hud_main).innerHTML =
`<div id="${Terminal.selector.combat.ally}">
</div>
<div id="${Terminal.selector.combat.center}">
</div>
<div id="${Terminal.selector.combat.enemy}">
</div>`;

    this.ally_list.forEach((ally) => {
    document.querySelector(`#${Terminal.selector.combat.ally}`).innerHTML +=
`
<span class='container_ally' id='${ally.uuid}'>
  <h2 class='${Terminal.selector.combat.name}'>${ally.name}</h2>
  <h4 class='${Terminal.selector.combat.hp.wrapper}'>
    <span class='${Terminal.selector.combat.hp.now}'>${ally.hp.now}</span> /
    <span class='${Terminal.selector.combat.hp.max}'>${ally.hp.max}</span>
  </h4>
</span>
`;
    });

    this.enemy_list.forEach((enemy) => {
      document.querySelector(`#${Terminal.selector.combat.enemy}`).innerHTML +=
`
<span class='container_enemy' id='${enemy.uuid}'>
  <h2 class='${Terminal.selector.combat.name}'>${enemy.name}</h2>
  <h4 class='${Terminal.selector.combat.hp.wrapper}'>
    <span class='${Terminal.selector.combat.hp.now}'>${enemy.hp.now}</span> /
    <span class='${Terminal.selector.combat.hp.max}'>${enemy.hp.max}</span>
  </h4>
</span>
`;
    });

    /*
    hud_main will show player status, enemy status, (initiative?)
    hud_combat will show move and targeting selection options (when available)
    */
  }

  updateCombatHUD() {
    // If the combat state is idle, show nothing yet
    // If the combat state is plan, show options for [Attack | Item | Flee]
    // If the combat state is attack, show the active page for attack options
    // If the combat state is item, show the active page for item options
    // If the combat state is target, show the valid targets for the attack
  }

  updateDisplay() {
    this.updateMainHUD();
    this.updateCombatHUD();
  }

  /*
  The setup process for a given turn
  Remove any participant that has an excuse for leaving
  If no more creatures are available in the initiative list, reroll
  */
  _turn_setup() {
    this.initiative = this.initiative.filter(uid => typeof this.participants[uid] !== "undefined");
    this.initiative.length || this.updateInitiative();
    // TODO Check here for win condition
    let current_turn = this.initiative[this.turn_count];
    this.initiative.shift();
    this.active_entity = this.participants[current_turn].entity;
    this.updateDisplay();
  }

  /*
  Process any active effects such as buffs or pre-turn data
  */
  _turn_start() {
    console.log(`--start ${this.active_entity.name}`);
    return;
  }

  /*
  Process any effects that trigger at the end of a creature's turn
  */
  _turn_end() {
    console.log(`--end ${this.active_entity.name}`);
    // If the NPC has any active effects (burns) that apply damage, calculate here.
    // If the NPC has any buffs/debuffs that expire, end them here.
    return;
  }

  npc_turn() {
    this._turn_start();
    console.log(`--mid ${this.active_entity.name}`);
    // Core logic TBD - AI behavior, given entity and combat situation:
    // Plan
    // Target
    let action_text = randomChoice([
      'does something',
      'bites down',
      'punches',
      'kicks'
    ]);
    Terminal.print(`The ${this.active_entity.name} ${action_text}`);
    this._turn_end();
  }

  // Figure out best way to divide this up.
  turn_timer() {
    this.turn_cycle = setTimeout(() => {
      this._turn_setup();
      if (this.enemy_list.length == 0 || this.ally_list.length == 0) {
        environment.encounter.endCombat();
        return;
      }
      if (this.active_entity == player) {
        this._turn_start();
        Terminal.setWorking(false);
        Terminal.print("What would you like to do? [Attack/Item/Flee]");
        this.state = state.combat.plan;
        clearTimeout(this.turn_cycle);
        return;
      }
      this.npc_turn();
      this.turn_timer();
    }, this.config.ai_turn_length);
  }

  updateInitiative() {
    // TODO Stat reliance
    this.initiative = [];
    Object.keys(this.participants).forEach(uid => this.initiative.push(uid) );
    this.turn_count = 0;
  }

  setPlayerIdle() {
    this._turn_end();
    this.state = state.combat.idle;
    Terminal.setWorking(true);
    this.turn_timer();
  }
}
