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
	// You can't go anywhere right now belongs here if not applicable
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
			terminal.print('You head north.');
			player.move(0, -1);
			break;
		case 'south':
			terminal.print('You head south.');
			player.move(0, 1);
			break;
		case 'east':
			terminal.print('You head east.');
			player.move(1, 0);
			break;
		case 'west':
			terminal.print('You head west.');
			player.move(-1, 0);
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
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	if (
		(cmd_args.join(' ') == 'left' && gameState.currentCase == gameState.goLeft) ||
		(cmd_args.join(' ') == 'right' && gameState.currentCase == gameState.goRight)) {
		terminal.print('I\'m a computer. I have no sense of direction.');
	}
	else {
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
	if (gameState.currentCase >= gameState.normal && gameState.currentCase <= gameState.goRight)
	{
        //4093 byte limit for cookies - Save seed instead and get implemented
		setCookie("player_save", {p:player/*, s:{shopList}*/}, 365); //Store all data in player object for one year
        //setCookie("shop", shopList, 365);
		terminal.print('Data has been saved.');
	} else {
		terminal.print('You can\'t save right now!');
	}
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

//Examine npc to see
TerminalShell.commands['inspect'] = function(terminal) {
	if (gameState.currentCase == gameState.fight) {
		var npc_damage = npc.combat_stats.damageRollQty+"d"+npc.combat_stats.damageRollMax;
		if (npc.combat_stats.damageModifier > 0) {
	    npc_damage += "+"+npc.combat_stats.damageModifier;
	  } else if (npc.combat_stats.damageModifier < 0) {
	    npc_damage += "-"+npc.combat_stats.damageModifier;
	  }
	  if (npc.combat_stats.attackSpeed != 1) {
	    npc_damage += " x " + npc.combat_stats.attackSpeed;
	  }
		var npcData = {
			list: {
				'Name':npc.name_mod,
				'Level':npc.level,
				'Health':npc.combat_stats.currentHP + "/" + npc.combat_stats.maxHP,
				'Damage':npc_damage,
				'Defense':npc.combat_stats.defense,
			},
			display: {
				'Description': allNpcs[npc.name].description
			}
		};
		ui.drawNpcInfo(npcData);
		terminal.print(randomChoice(["Hmm... Interesting.", "Cool!", "Ooh, seems tough.", "Inspect away!"]));
		terminal.print("What will you do? [Fight/Inspect/Run]");
	} else if (isNpcOnTile(player.X, player.Y)) {
    if (npcList[currentNpcIndex].npc == null) {
      npcList[currentNpcIndex].npc = new Npc();
      npcList[currentNpcIndex].npc.createNpc(false);
    }
		var npcData = {
			list: {
				'Name':npc.name_mod,
				'Level':npc.level,
				'Health':npcList[currentNpcIndex].npc.currentHP + "/" + npcList[currentNpcIndex].npc.maxHP
			}
		}
		ui.drawNpcInfo(npcData);
    terminal.print("What will you do? [Fight/Inspect/Talk/Leave]");
  }	else {
    terminal.print("Nothing to inspect");
	}
}

function runDirection(x, y) {
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
	}
	else if (gameState.currentCase == gameState.normal)
	{
		// Move in a direction until an npc is encountered.
		var cmd_args = Array.prototype.slice.call(arguments);
		cmd_args.shift();
		if (cmd_args.join(' ') == 'north')
		{
			Terminal.print('You start running north.');
			terminal.promptActive = false;
			runDirection(0, -1);
		}
		else if (cmd_args.join(' ') == 'south')
		{
			terminal.print('You start running south.');
			terminal.promptActive = false;
			runDirection(0, 1);
		}
		else if (cmd_args.join(' ') == 'east')
		{
			terminal.print('You start running east.');
			terminal.promptActive = false;
			runDirection(1, 0);
		}
		else if (cmd_args.join(' ') == 'west')
		{
			terminal.print('You start running west.');
			terminal.promptActive = false;
			runDirection(-1, 0);
		}
		else
		{
			terminal.print("What?");
		}
	}
	else
	{
		terminal.print("What?");
	}
}

//Displays the user's inventory
TerminalShell.commands['inv'] = TerminalShell.commands['inventory'] = function(terminal)
{
	if (gameState.currentCase == gameState.dead || gameState.currentCase == gameState.start) {return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var invPage = parseInt(cmd_args.join(' ')); // Will yield a number or NaN - in which case, display page 1
	if (isNaN(invPage) || invPage < 1)
	{
		invPage = 1;
	}
	if (player.inventory.length == 0)
	{
		$("#gameInfo").html("<h3>Player Inventory</h3><ul><li>You\'ve got nothing!</li></ul>Page " + (invPage) + " of " + Math.ceil(player.inventory.length/5) + ".");
	}
	else
	{
		ui.drawInventoryWindow(invPage);
		currentDisplay = "INVENTORY";
	}
	terminal.print("Inventory is available in the top-right window.");
}

//Displays all items currently wielded by player
TerminalShell.commands['wielding'] = TerminalShell.commands['equipped'] = TerminalShell.commands['equipment'] = function(terminal)
{
	if (gameState.currentCase == gameState.dead || gameState.currentCase == gameState.currentCase.start) { return; }
	currentDisplay = "WIELDING";
  if (player.wielding.length == 0)
  {
    terminal.print("You don't have anything equipped!");
    return;
  }
  ui.drawEquippedWindow();
}

TerminalShell.commands['shop'] = TerminalShell.commands['enter'] = function(terminal)
{
	if (gameState.currentCase == gameState.shop)
	{ displayShopInfo(); }
	else if (gameState.currentCase == gameState.normal)
	{
		currentShopIndex = -1;
		//Check here if a map exists on current square, else print no shops
		for (var i in shopList)
		{
			if (shopList[i].x == player.X && shopList[i].y == player.Y)
			{
        if (shopList[i].shop == null) {
          shopList[i].shop = new Shop(player);
          shopList[i].shop.init();
        }
				currentShopIndex = i;
				restock();
        Terminal.print("You enter the shop.");
        gameState.currentCase = gameState.shop;
        displayShopInfo();
				return;
			}
		}
		if (currentShopIndex == -1)
		{
      Terminal.print("There's not a shop here!");
		}
	} else {
    Terminal.print("This is a horrible time to go shopping.");
  }
}

//Purchases an object in shop inventory and adds it to player's inventory
TerminalShell.commands['purchase'] = TerminalShell.commands['buy'] = function(terminal)
{
	if (gameState.currentCase != gameState.shop) { Terminal.print("What?"); return }
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var selection = cmd_args.join(' ');
	for (var i in shopList[currentShopIndex].shop.inventory)
	{
		if (shopList[currentShopIndex].shop.inventory[i].name.toLowerCase().indexOf(selection) > -1)
		{
			var cost = shopList[currentShopIndex].shop.inventory[i].cost;
			if (player.gold >= cost)
			{
				//Add item to player inventory, remove from shop inventory
				player.inventory.push(shopList[currentShopIndex].shop.inventory.splice(i, 1).shift());
				Terminal.print("You purchased the " + player.inventory[player.inventory.length-1].name + " for " + cost + " gold.");
				player.gold -= cost;
			}
			else
			{
				terminal.print("You can't afford that!");
			}
			displayShopInfo();
			break;
		}
	}
}

// Sells any obtained items back to the shop for 1/2 gold
TerminalShell.commands['sell'] = function(terminal)
{
	if (gameState.currentCase != gameState.shop) { Terminal.print("What?"); return }
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var selection = cmd_args.join(' ');
	for (var i in player.wielding)
	{
		if (player.wielding[i].name.toLowerCase().indexOf(selection) > -1)
		{
			terminal.print("You can't sell something you're wearing! Take it off first.");
			return;
		}
	}
	for (var i in player.inventory)
	{
		if (player.inventory[i].name.toLowerCase().indexOf(selection) > -1)
		{
      var cost = Math.floor(player.inventory[i].cost*3/4);
			//TODO add to shop stock if it's already there
			player.gold += cost;
			terminal.print("You sell the " + player.inventory.splice(i, 1)[0].name + " for " + cost + " gold.");
			displayShopInfo();
			break;
		}
	}
}

TerminalShell.commands['leave'] = TerminalShell.commands['exit'] = TerminalShell.commands['quit'] = function(terminal)
{
	if (gameState.currentCase == gameState.shop)
	{
		terminal.print("You leave the shop.");
		gameState.currentCase = gameState.normal;
		Terminal.resetGameInfo();
	}
}

TerminalShell.commands['equip'] = function(terminal)
{
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var item = cmd_args.join(' '); // The item to equip
	if (item.length<4) //Soup is the shortest
	{ terminal.print("Please specify an item to equip."); return; }
	var itemIndex = -1;
	for (var i in player.inventory)
	{
		if (player.inventory[i].name.toLowerCase() == item)
		{
			if (player.inventory[i].type == types.healing) { terminal.print("You can't equip that!"); return; }
			itemIndex = i;
			break;
		}
	}
	if (itemIndex == -1) { Terminal.print("You need to own an item to equip it!"); return; }
	for (i in player.wielding)
	{
		if (player.wielding[i].type == player.inventory[itemIndex].type)
		{
			terminal.print("You unequip the " + player.wielding.splice(i, 1)[0].name + ".");
		}
	}
	player.wielding.push(player.inventory[itemIndex]);
	terminal.print("You equip the " + player.wielding[player.wielding.length-1].name + ".");
	player.applyWielding();
	// Update the player stat window when appropriate
	ui.resumeDisplay();
}

TerminalShell.commands['unequip'] = function(terminal) {
	if (player.wielding.length == 0) {terminal.print("Nothing to unequip"); return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var item = cmd_args.join(' '); // The item to unequip
	for (i in player.wielding)
	{
		if (player.wielding[i].name.toLowerCase() == item)
		{
			terminal.print("You unequip the " + player.wielding.splice(i, 1)[0].name + ".");// Update the player stat window when appropriate
			player.applyWielding();
			ui.resumeDisplay();
			return;
		}
	}
	terminal.print("You need to be wearing an item to unequip it!");
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
