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
  	map = new Map(player.name); // TODO map.seed(player.name)
    player.onCreate(map);
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
  			player.archetype = new Elf(); break;
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
};

//const Shell = new ShellInterface();
