const Shell = class {
  static commands = {};
  static state = state.shell.standard;

  static process(cmd) {
    try {
      let cmd_args = cmd.split(' ');
      let cmd_name = cmd_args.shift();
      cmd_args.unshift();

      switch (player.state) {
        case state.player.name: this.handler_name(cmd); return;
        case state.player.race: this.handler_race(cmd); return;
        case state.player.archetype: this.handler_archetype(cmd); return;
        case state.player.combat: this.handler_combat(cmd); return;
      }

      if (!this.commands.hasOwnProperty(cmd_name)) {
        Terminal.print("What?");
        return;
      }
      if (
        player.state == state.player.dead &&
        !['start', 'new', 'help', 'updates', 'about', 'fight', 'run'].includes(cmd_name)
      ) {
        return;
      }

      this.commands[cmd_name].apply(this, cmd_args);
    } catch (e) {
      Terminal.error('Something happened: ' + e);
      console.log(e);
    }
  }

  static handler_name(name) {
    player.name = name.charAt(0).toUpperCase() + name.slice(1);
    environment.load_map(player.name);
    player.state = state.player.race;
    Terminal.print(`Okay, ${player.name}, what is your race? [Human/Elf/Dwarf/Goblin]`);
  }

  static handler_race(race) {
  	race = race.charAt(0).toUpperCase() + race.slice(1);
  	// Be optimistic after switching.
  	player.state = state.player.archetype;
  	switch (race) {
  		case Human.name:
  			player.race = new Human(); break;
  		case Elf.name:
  			player.race = new Elf(); break;
  		case Dwarf.name:
  			player.race = new Dwarf(); break;
  		case Goblin.name:
  			player.race = new Goblin(); break;
  		default:
  			player.state = state.player.race;
  	}
  	if (player.state == state.player.race) {
  		Terminal.print("What is your race? [Human/Elf/Dwarf/Goblin]");
  	} else {
  		Terminal.print("Final question: What is your class? [Warrior/Ranger/Mage/Monk]");
  	}
  }

  static handler_archetype(archetype) {
  	archetype = archetype.charAt(0).toUpperCase() + archetype.slice(1);
  	// Benefit of the doubt
  	player.state = state.player.standard;
  	switch (archetype) {
  		case Warrior.name:
  			player.archetype = new Warrior(); break;
  		case Ranger.name:
  			player.archetype = new Ranger(); break;
  		case Mage.name:
  			player.archetype = new Mage(); break;
  		case Monk.name:
  			player.archetype = new Monk(); break;
  		default:
  			player.state = state.player.archetype;
  	}
  	if (player.state == state.player.archetype) {
  		Terminal.print("What is your class? [Warrior/Ranger/Mage/Monk]");
  	} else {
  		Terminal.print(`Welcome to the world, ${player.name} the ${player.race.name} ${player.archetype.name}!`);
  		Terminal.print(`Type 'help' to view a list of commands.`);
  	}
  }

  static handler_profession(profession) {
    // TODO, once subarchetypes are built in.
  }

  static _combat_undo() {
    if ([state.combat.attack, state.combat.item].includes(environment.encounter.combat.state)) {
      Terminal.print("What would you like to do? [Attack/Item/Flee]");
      environment.encounter.combat.state = state.combat.plan;
      Combat_UI.setView("none");
    } else if (environment.encounter.combat.state == state.combat.target) {
      Terminal.print("Which attack will you use?");
      environment.encounter.combat.state = state.combat.attack;
      Combat_UI.setView("attack");
    }
    Combat_UI.updateView();
  }

  static _combat_state_plan(selection) {
    Combat_UI.setView("none");
    if (selection == "attack") {
      Terminal.print("Which attack will you use?");
      environment.encounter.combat.state = state.combat.attack;
      Combat_UI.setView("attack");
    } else if (selection == "item") {
      Terminal.print("Which item would you like to use?");
      environment.encounter.combat.state = state.combat.item;
      Combat_UI.setView("item");
    } else if (["flee", "run"].includes(selection)) {
      environment.encounter.fleeCombat();
    } else {
      Terminal.print("What?");
    }
  }

  static _combat_state_item(selection) {
    if (["8", "prev", "previous"].includes(selection)) {
      Combat_UI.can_page_previous && Combat_UI.pagePrevious();
      return;
    }
    if (["9", "next", "forward"].includes(selection)) {
      Combat_UI.can_page_advance && Combat_UI.pageForward();
      return;
    }
    if (!Object.keys(Combat_UI.active_elements).includes(selection)) {
      return;
    }
    let item_id = Combat_UI.active_elements[selection];
    let index = player.inventory.findIndex(item => item.id == item_id);
    let item = player.inventory.splice(index, 1)[0];
    let response = player.consume(item);
    Terminal.print(`You use the ${item.name}`);
    Combat_UI.drawRestore(player, response);
    // Find first of item_id in player.inventory, remove it, and Combat_UI apply effects.
    environment.encounter.combat.setPlayerIdle();
  }

  static _combat_state_attack(selection) {
    if (["8", "prev", "previous"].includes(selection)) {
      Combat_UI.can_page_previous && Combat_UI.pagePrevious();
      return;
    }
    if (["9", "next", "forward"].includes(selection)) {
      Combat_UI.can_page_advance && Combat_UI.pageForward();
      return;
    }
    if (!Object.keys(Combat_UI.active_elements).includes(selection)) {
      return;
    }
    let action_id = Combat_UI.active_elements[selection];
    let action = ActionCatalog.catalog[action_id];
    environment.encounter.combat.setAction(action);

    /*
    TODO
    If an action has multiple targets/randomly targets, skip this step.
    */
    Terminal.print(`Who will you target with the ${action.name}?`);
    environment.encounter.combat.state = state.combat.target;
    Combat_UI.setView("target");
  }

  static _combat_state_target(selection) {
    if (["8", "prev", "previous"].includes(selection)) {
      Combat_UI.can_page_previous && Combat_UI.pagePrevious();
      return;
    }
    if (["9", "next", "forward"].includes(selection)) {
      Combat_UI.can_page_advance && Combat_UI.pageForward();
      return;
    }
    if (!Object.keys(Combat_UI.active_elements).includes(selection)) {
      return;
    }
    let target_uid = Combat_UI.active_elements[selection];
    environment.encounter.combat.setTarget(target_uid);
    Terminal.print(`You use ${environment.encounter.combat.action.name} on the ${environment.encounter.combat.getTargetEntity().name}.`);
    environment.encounter.combat.resolveAction();

    environment.encounter.combat.setPlayerIdle();
  }

  static handler_combat(selection) {
    if (selection == "back") { return this._combat_undo(); }
    switch (environment.encounter.combat.state) {
      case state.combat.plan: this._combat_state_plan(selection); break;
      case state.combat.item: this._combat_state_item(selection); break;
      case state.combat.attack: this._combat_state_attack(selection); break;
      case state.combat.target: this._combat_state_target(selection); break;
    }
    Combat_UI.updateView();
  }
};

//const Shell = new ShellInterface();
