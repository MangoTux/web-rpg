class Combat {
  config = {
    ai_turn_length: 1300,
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
    this.participants[player.uid] = {
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
      npc.ai = AI_Factory.generate(npc);
      this.participants[npc.uid] = {
        side: "enemy",
        entity: npc,
        active_effects: [],
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
      let text = `
      <span class='container_ally' id='${ally.uid}'>
      <h2 class='${Terminal.selector.combat.name}'>${ally.name}</h2>
      <h4 class='${Terminal.selector.combat.hp.wrapper}'>
      <span class='${Terminal.selector.combat.hp.now}'>${ally.hp.now}</span> /
      <span class='${Terminal.selector.combat.hp.max}'>${ally.hp.max}</span>`;
      if (ally.hp.buffer > 0) {
        text += `<span class='${Terminal.selector.combat.hp.buffer}'> (+${ally.hp.buffer})</span>`;
      }
      text += `
      </h4>
      </span>`;
      document.querySelector(`#${Terminal.selector.combat.ally}`).innerHTML += text;
    });

    this.enemy_list.forEach((enemy) => {
      let text = `
      <span class='container_enemy' id='${enemy.uid}'>
      <h2 class='${Terminal.selector.combat.name}'>${enemy.name}</h2>
      <h4 class='${Terminal.selector.combat.hp.wrapper}'>
      <span class='${Terminal.selector.combat.hp.now}'>${enemy.hp.now}</span> /
      <span class='${Terminal.selector.combat.hp.max}'>${enemy.hp.max}</span>`;
      if (enemy.hp.buffer > 0) {
        text += `<span class='${Terminal.selector.combat.hp.buffer}'> (+${enemy.hp.buffer})</span>`;
      }
      text += `
      </h4>
      </span>`;
      document.querySelector(`#${Terminal.selector.combat.enemy}`).innerHTML += text;
    });

    /*
    hud_main will show player status, enemy status, (initiative?)
    hud_combat will show move and targeting selection options (when available)
    */
  }

  updateDisplay() {
    this.updateMainHUD();
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
    this.active_entity.hp.buffer = Math.max(0, --this.active_entity.hp.buffer);
    this.updateMainHUD();
    return;
  }

  /*
  Process any effects that trigger at the end of a creature's turn
  */
  _turn_end() {
    // If the NPC has any active effects (burns) that apply damage, calculate here.
    // If the NPC has any buffs/debuffs that expire, end them here.
    return;
  }

  npc_turn() {
    this._turn_start();
    // get AI
    // ai.self()
    // ai.allies()
    // ai.enemies()
    // Core logic TBD - AI behavior, given entity and combat situation:
    // Plan
    // Target
    let action_text = randomChoice([
      'does something',
      'bites down',
      'punches',
      'kicks'
    ]);
    // This enemy and ally list is from the perspective of
    this.active_entity.ai
      .withParticipants(this.enemy_list, this.ally_list);
    let plan = this.active_entity.ai.getPlan();
    if (plan.plan == 'item') {
      this.resolveItem(plan.item_id);
    } else if (plan.plan == 'attack') {
      this.setAction(ActionCatalog.catalog[plan.action_id]);
      this.setTarget(plan.target_id);
      this.resolveAction();
    } else if (plan.plan == 'flee') {
      Terminal.print(`${this.active_entity.name} runs away!`);
      this.removeParticipant(this.active_entity.uid);
      return;
    } else if (plan.plan == 'defect') {
      Terminal.print(`${this.active_entity.name} betrays their teammates!`);
      if (this.participants[this.active_entity.uid].side == "enemy") {
        this.participants[this.active_entity.uid].side = "ally";
        let npc_index = this.enemy_list.findIndex(npc => npc.uid == this.active_entity.uid);
        let npc = this.enemy_list.splice(npc_index, 1)[0];
        this.ally_list.push(npc);
      } else {
        this.participants[this.active_entity.uid].side = "enemy";
        let npc_index = this.ally_list.findIndex(npc => npc.uid == this.active_entity.uid);
        let npc = this.ally_list.splice(npc_index, 1)[0];
        this.enemy_list.push(npc);
      }
    }
    this._turn_end();
  }

  setAction(action) {
    this.action = action;
    this.source = this.active_entity;
  }

  setTarget(uid) {
    this.action.setTarget(uid);
  }

  getTarget() {
    return this.action.target;
  }

  getTargetEntity() {
    return this.participants[this.action.target].entity;
  }

  removeParticipant(uid) {
    let list = null;
    if (this.participants[uid].side == "enemy") {
      list = this.enemy_list;
    } else {
      list = this.ally_list;
    }
    let entity_id = list.findIndex(entity => entity.uid == uid);
    list.splice(entity_id, 1);
    delete this.participants[uid];
  }

  resolveItem(item_id) {
    let index = this.active_entity.inventory.findIndex(item => item.id == item_id);
    let item = this.active_entity.inventory.splice(index, 1)[0];
    let response = this.active_entity.consume(item);
    if (this.active_entity == player) {
      Terminal.print(`You use the ${item.name}`);
    } else {
      Terminal.print(`${this.active_entity.name} uses a ${item.name}`);
    }
    Combat_UI.drawRestore(this.active_entity, response);
  }

  resolveAction() {
    this.action.onStart();
    this.action.onBeforeHit();
    // TODO Stats impact hit rate
    this.action.successful_hit = (Math.random() <= this.action.accuracy);

    if (this.active_entity == player) {
      Terminal.print(`You use ${this.action.name} on the ${this.getTargetEntity().name}.`);
    } else {
      Terminal.print(`${this.active_entity.name} targets ${this.getTargetEntity().name} with a ${this.action.name}.`);
    }
    if (this.action.successful_hit) {
      this.action.onHit();
      let bundle = {damage: 0};
      bundle.damage = getRandomInt(...this.action.getDamageBounds());
      this.getTargetEntity().applyDamage(bundle.damage);
      this.action.onDamage();
      let hp_done = !this.getTargetEntity().hp.now;
      Combat_UI.drawDamage(this.getTargetEntity(), bundle);

      if (hp_done) {
        this.action.onKill();
        if (this.active_entity == player) {
          Terminal.print(`You defeated the ${this.getTargetEntity().name}!`);
          player.updateQuestProgress("kill", this.getTargetEntity().name);
        }
        this.removeParticipant(this.getTarget());
      }
    } else {
      Terminal.print("But it misses!");
      this.action.onMiss();
      Combat_UI.drawMiss();
    }
    this.action.onEnd();
    this.action.cleanup();
  }

  // Async should be used instead of strict timeouts.
  // Await the current npc_turn, then turn_timer()
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
    Object.keys(this.participants).forEach(uid => this.initiative.push(uid));
    this.turn_count = 0;
  }

  setPlayerIdle() {
    this._turn_end();
    Combat_UI.setView("none");
    Combat_UI.updateView();
    this.state = state.combat.idle;
    Terminal.setWorking(true);
    // Add in a slight delay before NPCs resume behavior
    setTimeout(() => {
      this.turn_timer()
    }, 2*this.config.ai_turn_length);
  }
}
