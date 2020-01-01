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

  static handler_combat(selection) {
    // Move to a combat function that [broadcasts text?] returns an array of messages on enemy defeat
    if (environment.encounter.combat.enemy_list.length > 0) {
      let weakest_link = environment.encounter.combat.enemy_list.pop();
      delete environment.encounter.combat.participants[weakest_link.uuid];
      Terminal.print(`You've defeated the ${weakest_link.name}!`);
      environment.encounter.combat.updateDisplay();
    }
    if (environment.encounter.combat.ally_list.length == 0) {
      // Death handler
      Terminal.resetGameInfo();
      ui.drawTombstone();
      Terminal.print("You died...");
      player.state = state.player.dead;
      return;
    }
    if (environment.encounter.combat.enemy_list.length == 0) {
      Terminal.resetGameInfo();
      Terminal.print("You won!");
      // TODO On defeated enemy, push rewards. No XP for fleeing?
      let reward = environment.encounter.rewards;
      if (reward.gold) {
        player.gold += reward.gold;
        Terminal.print(`You gained ${reward.gold} gold.`);
      }
      if (reward.items.length) {
        reward.items.forEach((item) => {
          Terminal.print(`You found an item: ${item.name}`);
          player.inventory.push(item);
        });
      }
      player.increase_experience(reward.experience).forEach((response) => {
        Terminal.print(response);
      });
      environment.encounter = null;
      player.state = state.player.standard;
      return;
    }

    // This is a temporary solution to make sure the lifecycle is functional.
    // 1. If an enemy exists, destroy randomly and update
    // 2. If no enemies exist on player's turn, win!
    // 2a. encounter.endCombat()
    // 2b. Print reward
    // 2c. Apply gold
    // 2d. Apply items
    // 2e. Apply experience and track levelling
    //------
    // TODO This will be a general combat choice, but allow for the following commands:
    // stats   ?
    // inspect ?

    /*
    Use combat lifecycle states:
    - Numeric selection [Attack] [Item] [Power?] [Flee] <state.combat.plan>
    - On item, display paginated consumables [Cancel] [item list] [?Previous Page] [?Next Page] <state.combat.item>
    - On attack, display paginated options [Cancel] [attack list] [?Previous Page] [?Next Page] <state.combat.attack>
    - After selected attack (target items?), list valid targets [Cancel] [target list]
    - After selected target, apply (In combat details) <state.combat.idle> for NPC movement
    Check if combat can continue, otherwise call endCombat()
    */
  }
};

//const Shell = new ShellInterface();
