class Combat {
  // Encounter
  scope;
  config = {
    turn_delay: 1500,
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

  constructor(scope) {
    this.scope = scope;
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

  updateDisplay() {
    Combat_UI.drawMainHUD(this.ally_list, this.enemy_list);
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
    this.updateDisplay();
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

  async npc_turn() {
    this._turn_start();
    // This enemy and ally list is from the perspective of
    this.active_entity.ai
      .withParticipants(this.enemy_list, this.ally_list);
    let plan = this.active_entity.ai.getPlan();
    if (plan.plan == 'item') {
      this.resolveItem(plan.item_id);
    } else if (plan.plan == 'attack') {
      this.setAction(ActionCatalog.catalog[plan.action_id]);
      this.addTarget(plan.target_id);
      this.resolveAction();
    } else if (plan.plan == 'flee') {
      Terminal.print(`${this.active_entity.name} runs away!`);
      Combat_UI.drawFlee(this.active_entity.uid);
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
    this.action.setSource(this.active_entity);
  }

  addTarget(uid) {
    this.action.addTarget(uid);
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
    this.action.hook("onStart");
    if (this.active_entity == player) {
      Terminal.print(`You use ${this.action.name} on the ${this.getTargetEntity().name}.`);
    } else {
      Terminal.print(`${this.active_entity.name} targets ${this.getTargetEntity().name} with a ${this.action.name}.`);
    }
    // Most attacks will target a single creature
    let bundle = {
      damage: [],
      recovery: [],
    };
    for (let hit_attempt = 0; hit_attempt < this.action.hit_count; hit_attempt++) {
      this.action.hook("onBeforeHit");
      if (this.action.doesHit()) {
        this.action.hook("onHit");
        bundle.damage.push(getRandomInt(...this.action.getDamageBounds()));
        this.getTargetEntity().applyDamage(bundle.damage.reduce((t, c) => t + c, 0));
        this.action.hook("onDamage");
      } else {
        this.action.hook("onMiss");
      }
    }
    if (bundle.damage.length == 0) {
      Combat_UI.drawMiss();
    } else {
      Combat_UI.drawDamage(this.getTargetEntity(), bundle);
    }
    if (!this.getTargetEntity().hp.now) {
      this.resolveDeath();
    }
    this.action.hook("onEnd");
    this.action.cleanup();
  }

  resolveDeath() {
    Combat_UI.drawRemove(this.getTarget());
    this.action.hook("onKill");
    if (this.active_entity == player) {
      Terminal.print(`You defeated the ${this.getTargetEntity().name}!`);
      player.updateQuestProgress("kill", this.getTargetEntity().name);
    }
    this.scope.addRewards(this.getTargetEntity());
    this.removeParticipant(this.getTarget());
  }

  // Async should be used instead of strict timeouts.
  // Await the current npc_turn, then turn_timer()
  turn_timer() {
    this._turn_setup();
    if (this.enemy_list.length == 0 || this.ally_list.length == 0) {
      // Weird display jump happens.
      setTimeout(() => {
        this.scope.endCombat();
      }, this.config.turn_delay);
      return;
    }
    if (this.active_entity == player) {
      this._turn_start();
      Terminal.setWorking(false);
      Terminal.print("What would you like to do? [Attack/Item/Flee]");
      this.state = state.combat.plan;
      return;
    }
    this.npc_turn();
    setTimeout(() => {
      this.turn_timer();
    }, this.config.turn_delay);
  }

  updateInitiative() {
    // TODO Stat reliance
    this.initiative = [];
    Object.keys(this.participants).forEach(uid => this.initiative.push(uid));
    this.turn_count = 0;
  }

  setPlayerIdle() {
    let self = this;
    setTimeout(() => {
      self._turn_end();
      Combat_UI.setView("none");
      Combat_UI.updateView();
      this.state = state.combat.idle;
      Terminal.setWorking(true);
      this.turn_timer()
    }, this.config.turn_delay);
  }
}
