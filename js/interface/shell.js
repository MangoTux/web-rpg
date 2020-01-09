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
    // Might be simple to implement a combat-level state machine.
    // environment.encounter.combat.pushState({state, text});
    // if (selection == "back") { let response = environment.encounter.combat.popState(); Terminal.print(response); }
    if (environment.encounter.combat.state == state.combat.plan) {
      if (selection == "attack") {
        Terminal.print("Which attack will you use?");
        environment.encounter.combat.state = state.combat.attack;
      } else if (selection == "item") {
        Terminal.print("Which item would you like to use?");
        environment.encounter.combat.state = state.combat.item;
      } else if (["flee", "run"].includes(selection)) {
        environment.encounter.fleeCombat();
        environment.cleanEncounter();
      }
    } else if (environment.encounter.combat.state == state.combat.item) {
      if (selection == "back") {
        Terminal.print("What would you like to do? [Attack/Item/Flee]");
        environment.encounter.combat.state = state.combat.plan;
      } else {
        Terminal.print("I haven't figured out how to show your items yet!");
      }
    } else if (environment.encounter.combat.state == state.combat.attack) {
      if (selection == "back") {
        Terminal.print("What would you like to do? [Attack/Item/Flee]");
        environment.encounter.combat.state = state.combat.plan;
      } else {
        Terminal.print("I'll pretend that you're going to punch.");
        Terminal.print("Who are you going to punch?");
        environment.encounter.combat.state = state.combat.target;
      }
    } else if (environment.encounter.combat.state == state.combat.target) {
      if (selection == "back") {
        Terminal.print("What would you like to do? [Attack/Item/Flee]");
        environment.encounter.combat.state = state.combat.plan;
      } else {
        Terminal.print("I'll pretend that you're targeting the last guy.");
        let weakest_link = environment.encounter.combat.enemy_list.pop();
        // TODO player.updateQuestProgress("kill", weakest_link name)
        delete environment.encounter.combat.participants[weakest_link.uuid];
        Terminal.print(`You've defeated the ${weakest_link.name}!`);
        environment.encounter.combat.setPlayerIdle();
      }
    }
  }
};

//const Shell = new ShellInterface();
