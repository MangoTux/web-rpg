class Combat {
  // Encounter
  scope;
  config = {
    turn_delay: 1700,
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
    this.has_death = false;
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

  get _target_string() {

    let action = `${this.action.name}`;
    if (['a', 'e', 'i', 'o', 'u'].includes(action.charAt(0).toLowerCase())) {
      action = `an ${action}`;
    } else {
      action = `a ${action}`;
    }

    let target_list = this.action.target.list;
    let target = "";
    if (target_list.length == 1) {
      target = `${this.participants[target_list[0]].entity.name}`;
    } else {
      target = `multiple creatures`;
    }

    if (this.active_entity == player) {
      Terminal.print(`You use ${action} on ${target}.`);
    } else {
      Terminal.print(`${this.active_entity.name} targets ${target} with ${action}.`);
    }
  }

  async npc_turn() {
    if (!this.active_entity.hp.now) {
      return;
    }
    this._turn_start();
    let side_lists = [this.enemy_list, this.ally_list];
    if (this.participants[this.active_entity.uid].side == "ally") {
      side_lists.reverse();
    }

    this.active_entity.ai
      .withParticipants(...side_lists);
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
    this.updateDisplay();
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
    let bundle = {};
    bundle[this.active_entity] = [ response ];
    Combat_UI.drawEffects(bundle);
  }

  async resolveAttack() {
    Terminal.print(this._target_string);
    // Most attacks will target a single creature
    let bundle = {};
    for (let hit_attempt = 0; hit_attempt < this.action.hit_count; hit_attempt++) {
      this.action.hook("onBeforeHit");
      this.action.establishBasePower();
      let received_damage = 0;
      this.action.target.list.forEach(uid => {
        if (typeof bundle[uid] === "undefined") {
          bundle[uid] = [];
        }
        let resilience = this.participants[uid].entity.get_stat("resilience");
        let applied_damage = this.action.getDamage(resilience);
        if (this.action.doesHit()) {
          this.action.hook("onHit");
        } else if (this.action.damage.partial) {
          this.action.hook("onPartial");
          applied_damage = applied_damage * this.action.damage.partial;
        } else {
          this.action.hook("onMiss");
          return;
        }
        let critical = this.action.getCritical();
        let target_payload = { damage: 0 };
        if (critical) {
          this.action.hook("onCrit");
          applied_damage *= critical.multiplier;
          target_payload.critical = critical.text;
        }
        applied_damage = Math.floor(applied_damage);
        target_payload.damage = this.participants[uid].entity.applyDamage(applied_damage);
        this.action.hook("onDamage");
        bundle[uid].push(target_payload);
      });
    }
    await Combat_UI.drawEffects(bundle);
    this.updateDisplay();
    let death_list = this.action.target.list.filter(uid => !this.participants[uid].entity.hp.now);
    death_list.length && this.resolveDeath(death_list);
  }

  async resolveAbility() {
    this.action.resolve();
    Terminal.print(this.action.text);
    this.updateDisplay();
  }

  async resolveAction() {
    this.action.hook("onStart");
    switch (this.action.constructor.name) {
      case "Attack": await this.resolveAttack(); break;
      case "Ability": await this.resolveAbility(); break;
      default: throw new Exception(`Unknown action ${this.action.constructor.name}!`);
    }
    this.action.hook("onEnd");
    this.action.cleanup();
  }

  async resolveDeath(uid_list) {
    this.has_death = true;
    await Combat_UI.drawRemove(uid_list);
    uid_list.forEach(uid => {
      this.action.hook("onKill", uid);
      Terminal.print(`${this.participants[uid].entity.name} has been defeated.`);
      if (this.active_entity == player) {
        player.updateQuestProgress("kill", this.participants[uid].entity.id);
      }
      this.scope.addRewards(this.participants[uid].entity);
      this.removeParticipant(uid);
    });
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
    this.initiative = [];
    let init_template = [];
    Object.keys(this.participants).forEach(uid => {
      let dexterity = this.participants[uid].entity.get_stat("dexterity");
      // Creatures with thresholds of AC get more actions each round.
      do {
        init_template.push({ uid: uid, value: getRandomInt(0, 100) / Math.min(dexterity, 100) });
        dexterity -= 100;
      } while (dexterity >= 0);
    });
    init_template.sort((a, b) => a.value - b.value);
    init_template.forEach(record => {
      this.initiative.push(record.uid);
    });
    this.turn_count = 0;
  }

  setPlayerIdle() {
    let self = this;
    let delay = this.config.turn_delay * (this.has_death ? 2 : 1);
    setTimeout(() => {
      self._turn_end();
      Combat_UI.setView("none");
      Combat_UI.updateView();
      this.state = state.combat.idle;
      Terminal.setWorking(true);
      this.turn_timer()
    }, delay);
  }
}
