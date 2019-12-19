TerminalShell.commands['start'] = function(terminal) {
	//Check if there's a cookie - If so, Load.
	//Otherwise, get name, class, race.
	gameState.currentCase = gameState.start;
	terminal.print("Hello! Type \'new\' to begin, or \'load\' if you already have a profile.");
};

//Create player data.
TerminalShell.commands['new'] = function(terminal) {
	if (gameState.currentCase == gameState.start || gameState.currentCase == gameState.dead)
	{
		gameState.currentCase = gameState.playerName;
		terminal.print("What is your name?");
		//The rest of the input is taken care of during the command processing
	} else {
		terminal.print("You can't quit now!");
	}
}

TerminalShell.commands['help'] = function(terminal) {
  let help_list = `
<h3>Commands</h3>
<p>
Go [dir]     - Go in a direction</br>
Rest         - Rest and recover HP</br>
Save         - Save progress</br>
Load         - Load a saved game</br>
Stats        - Current character info</br>
Map	         - Displays the map and legend</br>
Fight        - Used when NPC encounter occurs</br>
Inspect      - In a fight, assess enemy</br>
Shop         - Enter a shop and purchase items</br>
Buy [item]   - Purchase items from the shop</br>
Exit Shop    - Leave the shop</br>
Equip [item] - Equip an item</br>
Inv [page]   - View your inventory</br>
Quest [page] - View a list of your current quests</br>
Help         - View this page
</p>
`;
	help_list = help_list.replace(/ /g, "&nbsp;");
	$("#gameInfo").html(help_list);
  terminal.print("Game commands can be found on the right-hand pane");
}

TerminalShell.commands['updates'] = function(terminal) {
	$("#gameInfo").html($("#updates").html());
	terminal.print("Updates to the game can be found on the right-hand pane");
}

TerminalShell.commands['about'] = function(terminal) {
    let about = `
<h3>About</h3>
<p>
<b>rpg the rpg: an mmorpg</b> is a monotonous monoplayer<br>
oldschool role-playing game that started out as<br>
an assignment in one of my classes. To be<br>
succinct, this is a game where you walk around<br>
and get in fights. Or not. I can't tell you<br>
what to do, I'm just some text on a screen.
</p>
`;
    $("#gameInfo").html(about);
    terminal.print("Information about the game can be found on the right-hand pane");
}

//Used for movement around map.
//Occasionally on move, an npc should be created.
// TODO only print 'You head [direction]' if successful
TerminalShell.commands['go'] = function(terminal) {
	if ([gameState.fight, gameState.shop, gameState.start, gameState.playerName, gameState.playerRace, gameState.playerClass].includes(gameState.currentCase)) {
		terminal.print("You can't go anywhere right now!");
		return;
	}

	let args = terminal.processArgs(arguments);
	let direction = args.join(' ');
	if (direction === '') {
		terminal.print("Go where?");
		return;
	}
	// Mean movements
	if (direction === 'away' || direction === 'to hell') {
		terminal.print(randomChoice([':(', 'I\'m sorry...', 'Was... was it something I said?']));
		terminal.suppressed = true;
		return;
	}
	// Silly movements
	if (direction === 'down') {
		if (gameState.currentCase == gameState.goDown) {
			terminal.print(randomChoice(['Sorry, it\'s all up from here.', 'Wow, bedrock already? Guess you\'re gonna have to turn around.', 'Careful! You\'ll anger the mole people!', 'No.']));
		} else if (map.getTile(player.X, player.Y).type == "W") {
			terminal.print("You can't swim!");
		} else {
			terminal.print('You start digging down. It is dark down here.');
			gameState.currentCase = gameState.goDown;
		}
		return;
	} else if (direction === 'up') {
		if (gameState.currentCase == gameState.goDown) {
			terminal.print('You\'re back on level ground. It\'s not as dark up here.');
			gameState.currentCase = gameState.normal;
		} else {
			terminal.print("What are you doing? You are not a bird. You cannot go up.");
		}
		return;
	}
	// Standard movements
	// TODO Current an issue when approaching non-contact space. "You head west. You can't swim!"
	gameState.currentCase = gameState.normal;
	switch (direction) {
		case 'right':
			terminal.print('My left or your left?');
			gameState.currentCase = gameState.goLeft;
			break;
		case 'left':
			terminal.print('My right or your right?');
			gameState.currentCase = gameState.goRight;
			break;
		case 'north':
		case 'south':
		case 'east':
		case 'west':
			terminal.print("You head " + direction + ".");
			player.move(...map.getUnitVectorFromDirection(direction));
			break;
		case 'back':
			terminal.print('You go back to where you were.');
			player.move(-1*player.prevDirection[0], -1*player.prevDirection[1]);
			break;
		case 'forward':
			player.move(player.prevDirection[0], player.prevDirection[1]);
			terminal.print('You continue forward.');
			break;
		default:
			terminal.print("I don't know that direction.");
			break;
	}
}

//Apologize after saying 'go away'
TerminalShell.commands['sorry'] = function(terminal) {
	terminal.suppressed = false;
	terminal.print(randomChoice(["It's okay c:", "I forgive you.", "Yay! Friends again!"]));
}

//Followup to go left/right
TerminalShell.commands['my'] = function(terminal) {
	let args = terminal.processArgs(arguments);
	let direction = args.join(' ');

	if (!['left', 'right'].includes(direction)) {
		terminal.print("What?");
		return;
	}
	gameState.currentCase = gameState.normal;
	if ((gameState.currentState == gameState.goRight && direction == "left") ||
		(gameState.currentState == gameState.goLeft && direction == "right")) {
		terminal.print("That's not what you said before.");
		return;
	}
	let direction_factor = direction === "left" ? -1 : 1;

	let h = player.prevDirection[0] * direction_factor;
	let v = player.prevDirection[1] * direction_factor;
	terminal.print("You head to your " + direction + ".");
	player.move(v, h);
}

//Followup to go left/right
TerminalShell.commands['your'] = function(terminal) {
	let args = terminal.processArgs(arguments);
	let direction = args.join(' ');
	if (
		(direction == 'left' && gameState.currentCase == gameState.goLeft) ||
		(direction == 'right' && gameState.currentCase == gameState.goRight)) {
		terminal.print('I\'m a computer. I have no sense of direction.');
	}	else {
		terminal.print('What?');
	}
}

//Resets player to full health
TerminalShell.commands['rest'] = function(terminal) {
	$('#game').fadeOut(2000, () => {
		terminal.setPromptActive(false);
		player.rest();
		terminal.clear();
		$('#game').fadeIn(2000, () => {
			terminal.print('You feel rested.');
			terminal.setPromptActive(true);
		});
	});
	$('#gameInfo').fadeOut(2000, () => {
		$('#gameInfo').fadeIn(2000);
	});
}

//Saves player data
TerminalShell.commands['save'] = function(terminal) {
	//Write data to save
	if (![gameState.normal, gameState.goLeft, gameState.goRight, gameState.goDown].includes(gameState.currentCase)) {
		terminal.print("You can't save right now!");
		return;
	}
	setCookie("player_save", {p:player}, 365);
	// Shops don't currently save
}

//If data exists, load the player
TerminalShell.commands['load'] = function(terminal) {
	let obj = checkCookie();
	if (obj == '') {
		terminal.print("No load data exists yet.");
		return;
	}
	player.load(obj.p);
  //shopList = obj.s.shopList;
	if (gameState.currentCase == gameState.dead) {
		terminal.print("Welcome back from the dead, " + player.name);
	} else {
		terminal.print("Welcome back, " + player.name);
	}
	gameState.currentCase = gameState.normal;
}

TerminalShell.commands['stats'] = function(terminal) {
	if (gameState.currentCase == gameState.start) {return;}
	currentDisplay = "STATS";
	//Use CLI script to make list formatting
	ui.drawStatsWindow();
	terminal.print("Stats are available in the top-right window.");
}

// Displays the map in the GameInfo pane
TerminalShell.commands['map'] = function(terminal) {
	if (gameState.currentCase >= gameState.normal && gameState.currentCase <= gameState.shop) {
		ui.drawMap(map);
		currentDisplay = "MAP"; // Update the gameInfo tab
		terminal.print("The map is available in the top-right window.");
	} else {
		terminal.print("You can't access the map right now!");
	}
}

TerminalShell.commands['fight'] = function(terminal) {
	if (gameState.currentCase == gameState.dead) { Terminal.print("That's what got you into this mess."); return; }
	if (gameState.currentCase == gameState.fight) {
		combat.setUpEncounter(player, npc);
	} else if (isNpcOnTile(player.X, player.Y)) {
    if (npcList[currentNpcIndex].npc == null) {
      npcList[currentNpcIndex].npc = new Npc();
      npcList[currentNpcIndex].npc.createNpc(false);
    }
		combat.setUpEncounter(player, npcList[currentNpcIndex].npc);
    currentNpcIndex = null;
  }	else {
		terminal.print("Fight what? There's nothing else around.");
	}
}

const inspect_npc = function(npc) {
	let npc_damage = npc.combat_stats.damageRollQty+"d"+npc.combat_stats.damageRollMax;
	if (npc.combat_stats.damageModifier > 0) {
		npc_damage += "+"+npc.combat_stats.damageModifier;
	} else if (npc.combat_stats.damageModifier < 0) {
		npc_damage += "-"+npc.combat_stats.damageModifier;
	}
	if (npc.combat_stats.attackSpeed != 1) {
		npc_damage += " x " + npc.combat_stats.attackSpeed;
	}
	let data = {
		list: {
			'Name':npc.name_mod,
			'Level':npc.level,
			'Health':npc.combat_stats.currentHP + "/" + npc.combat_stats.maxHP,
			'Damage':npc_damage,
			'Defense':npc.combat_stats.defense,
		},
	};
	if (typeof allNpcs[npc.name] !== "undefined") {
		data.display = {
			'Description': allNpcs[npc.name].description,
		}
	}
	return data;
}

TerminalShell.commands['inspect'] = function(terminal) {
	if (gameState.currentCase == gameState.fight) {
		ui.drawNpcInfo(inspect_npc(npc));
		terminal.print(randomChoice(["Hmm... Interesting.", "Cool!", "Ooh, seems tough.", "Inspect away!"]));
		terminal.print("What will you do? [Fight/Inspect/Run]");
	} else if (isNpcOnTile(player.X, player.Y)) {
		// If the character hasn't been cached, create it now
    if (npcList[currentNpcIndex].npc == null) {
      npcList[currentNpcIndex].npc = new Npc();
      npcList[currentNpcIndex].npc.createNpc(false);
    }
		// Not a fan of the global npc above or currentNpcIndex here.
		ui.drawNpcInfo(inspect_npc(npcList[currentNpcIndex]));
    terminal.print("What will you do? [Fight/Inspect/Talk/Leave]");
  }	else {
    terminal.print("Nothing to inspect");
	}
}

const runDirection = function(x, y) {
	runTimeout = setTimeout(function() {
		player.move(x, y);
		runDirection(x, y);
	}, 400);
	if (gameState.currentCase == gameState.fight || player.forcedStop)
	{
		clearTimeout(runTimeout);
		Terminal.promptActive = true;
    player.forcedStop = false;
	}
}

TerminalShell.commands['run'] = function(terminal) {
	if (gameState.currentCase == gameState.dead) {
		terminal.print("You should have done that sooner.");
		return;
	}
	if (gameState.currentCase == gameState.fight) {
		//Set fight to over
		gameState.currentCase = gameState.normal;
        player.forcedStop = false;

		terminal.print(randomChoice(
			["You ran from the " + npc.name_mod + ". Coward.",
			"You valiantly flee from the " + npc.name_mod + ", tail betwixt your legs.",
			"The " + npc.name_mod + " is probably making fun of you to their friends by now.",
			"You barely escape before the " + npc.name_mod + " could hurt you.",
			"Ooh, smart move. You run from the " + npc.name_mod + ".",
			"History will remember of the time that you almost fought the " + npc.name_mod + ".",
			"You ran from the " + npc.name_mod + ". It just wanted to be friends."]));

		ui.resumeDisplay();
		return;
	}
	if (gameState.currentCase != gameState.normal) {
		terminal.print("What?");
		return;
	}
	// Move in a direction until an npc is encountered.
	let args = terminal.processArgs(arguments);
	let direction = args.join(' ');
	if (!['north', 'south', 'east', 'west'].includes(direction)) {
		terminal.print("I don't know that direction.");
		return;
	}
	terminal.promptActive = false;
	Terminal.print("You start running " + direction + ".");
	runDirection(...map.getUnitVectorFromDirection(direction));
}

//Displays the user's inventory
TerminalShell.commands['inv'] = TerminalShell.commands['inventory'] = function(terminal) {
	let args = terminal.processArgs(arguments);
	let invPage = parseInt(args);
	if (isNaN(invPage) || invPage < 1) {
		invPage = 1;
	}
	ui.drawInventoryWindow(invPage);
	terminal.print("Inventory is available in the top-right window.");
}

//Displays all items currently wielded by player
TerminalShell.commands['wielding'] = TerminalShell.commands['equipped'] = TerminalShell.commands['equipment'] = function(terminal) {
	if (gameState.currentCase == gameState.dead || gameState.currentCase == gameState.currentCase.start) { return; }
	currentDisplay = "WIELDING";
  if (player.wielding.length == 0)
  {
    terminal.print("You don't have anything equipped!");
    return;
  }
  ui.drawEquippedWindow();
}

TerminalShell.commands['shop'] = TerminalShell.commands['enter'] = function(terminal) {
	if (![gameState.shop, gameState.normal].includes(gameState.currentState)) {
		terminal.print("This is a horrible time to go shopping.");
		return;
	}
	// Scan the world for shops on the tile
	if (gameState.currentCase == gameState.normal) {
		currentShopIndex = null;
		for (let i in shopList) {
			if (shopList[i].x != player.X || shopList[i].y != player.Y) {
				continue;
			}
			if (shopList[i].shop == null) {
				shopList[i].shop = new Shop(player);
				shopList[i].shop.init();
			}
			currentShopIndex = i;
			restock();
			gameState.currentCase = gameState.shop;
			terminal.print("You enter the shop");
			break;
		}
		if (currentShopIndex == null) {
			terminal.print("There's no shop here.");
			return;
		}
	}
	gameState.currentCase == gameState.shop && displayShopInfo();
}

// Purchases an object in shop inventory and adds it to player's inventory
// Future: Steal might be an option?
TerminalShell.commands['purchase'] = TerminalShell.commands['buy'] = function(terminal) {
	if (gameState.currentCase != gameState.shop) { Terminal.print("What?"); return }
	let selection = terminal.processArgs(arguments);
	let selection_index = shopList[currentShopIndex].shop.inventory.getIndexFromPattern(selection);
	if (selection_index == null) {
		terminal.print("There's nothing here by that name.");
		return;
	} else if (selection_index == -1) {
		terminal.print("You're going to have to be more specific.");
		return;
	}
	if (selection_index == null) {
		terminal.print("There's nothing here by that name.");
		return;
	}
	let item = shopList[currentShopIndex].shop.inventory[i];
	if (player.gold < item.cost) {
		terminal.print("You can't afford that!");
		return;
	}
	player.gold -= item.cost;
	shopList[currentShopIndex].shop.inventory.splice(selection_index, 1);
	player.inventory.push(item);
	terminal.print("You purchased the " + item.name + " for " + item.cost + " gold.");
	displayShopInfo();
}

// Sells any obtained items back to the shop for 1/2 gold
TerminalShell.commands['sell'] = function(terminal) {
	if (gameState.currentCase != gameState.shop) {
		terminal.print("Nobody here is interested."); return;
	}
	let selection = terminal.processArgs(arguments);
	let selection_index = player.wielding.getIndexFromPattern(selection);
	if (selection_index != null) {
		terminal.print("You can't sell something you're wearing! Take it off first.");
		return;
	}
	selection_index = player.inventory.getIndexFromPattern(selection);
	if (selection_index == null) {
		terminal.print("You don't have anything by that name.");
		return;
	} else if (selection_index == -1) {
		terminal.print("You're going to have to be more specific.");
		return;
	}
	let item = player.inventory.splice(selection_index, 1).shift();
	let cost = Math.floor(item.cost / 2);
	shopList[i].shop.inventory.push(item);
	player.gold += cost;
	terminal.print("You sell the " + item.name + " for " + cost + " gold.");
	displayShopInfo();
}

TerminalShell.commands['leave'] = TerminalShell.commands['exit'] = function(terminal) {
	if (gameState.currentCase != gameState.shop) {
		terminal.print("But we're having so much fun!")
		terminal.print("Be sure to save, but you don't need to tell me you're leaving.");
		return;
	}
	terminal.print("You leave the shop.");
	gameState.currentCase = gameState.normal;
	terminal.resetGameInfo();
}

TerminalShell.commands['equip'] = function(terminal) {
	// This should be a middleware for a player.equip, honestly
	let selection = terminal.processArgs(arguments);
	// TODO Use the same behavior as shop, checking for pattern-matched items.
	let selection_index = player.inventory.getIndexFromPattern(selection);
	if (selection_index == null) {
		terminal.print("You don't have anything by that name worth equipping.");
		return;
	} else if (selection_index == -1) {
		terminal.print("You're going to have to be more specific.");
		return;
	}
	// Each body part can only have one equipped item; unattach current items before wielding
	for (let i in player.wielding) {
		if (player.wielding[i].type == player.inventory[selection_index].type) {
			continue;
		}
		let old_item = player.wielding.splice(i, 1).shift();
		terminal.print("You unequip the " + old_item.name + ".");
		break;
	}
	player.wielding.push(player.inventory[selection_index]);
	terminal.print("You equip the " + player.inventory[selection_index].name + ".");
	player.applyWielding();
	// Update the player stat window when appropriate
	ui.resumeDisplay();
}

TerminalShell.commands['unequip'] = function(terminal) {
	if (player.wielding.length == 0) { terminal.print("Nothing to unequip"); return; }
	let selection = terminal.processArgs(arguments);
	let selection_index = player.wielding.getIndexFromPattern(selection);
	if (selection_index == null) {
		terminal.print("You don't have anything by that to unequip.");
		return;
	} else if (selection_index == -1) {
		terminal.print("You're going to have to be more specific.");
		return;
	}
	let item = player.wielding.splice(selection_index, 1).shift();
	terminal.print("You unequip the " + item.name + ".");// Update the player stat window when appropriate
	player.applyWielding();
	ui.resumeDisplay();
}

/* Used in quests */
TerminalShell.commands['talk'] = function(terminal) {
  /* If current tile has an NPC, talk to it to reveal information */
  if (!isNpcOnTile(player.X, player.Y)) {
    terminal.print("You're talking to yourself.");
		return;
  }
  terminal.print("You strike up a conversation");
  if (npcList[currentNpcIndex].npc == null) {
    npcList[currentNpcIndex].npc = new Npc();
    npcList[currentNpcIndex].npc.createNpc(false);
    player.quests[currentNpcIndex] = npcList[currentNpcIndex].npc.quest;
  }
  $("#gameInfo").html(getQuestText());
  updateQuest();
  currentNpcIndex = null;
}
