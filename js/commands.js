TerminalShell.commands['start'] = function(terminal)
{
	//Check if there's a cookie - If so, Load.
	//Otherwise, get name, class, race.
	specialCase.currentCase = specialCase.start;
	terminal.print("Hello! Type \'new\' to begin, or \'load\' if you already have a profile.");
};
//Create player data.
TerminalShell.commands['new'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.start || specialCase.currentCase == specialCase.dead)
	{
		specialCase.currentCase = specialCase.playerName;
		terminal.print("What is your name?");
		//The rest of the input is taken care of during the command processing
	}
	else
	{
		terminal.print("You can't quit now!");
	}
}
TerminalShell.commands['help'] = function(terminal)
{
    var helpList = 
        "<h3>Commands</h3>" +
        "<p>" +
        "Go [dir]	 - Go in a direction</br>" +
        "Rest		 - Rest and recover HP</br>" +
        "Save		 - Save progress</br>" +
        "Load        - Load a saved game</br>" +
        "Stats		 - Current character info</br>" +
        "Map	     - Displays the map and legend</br>" +
        "Fight 		 - Used when NPC encounter occurs</br>" +
        "Inspect     - In a fight, assess enemy</br>" +
        "Shop        - Enter a shop and purchase items</br>" +
        "Buy [item]  - Purchase items from the shop</br>" +
        "Exit Shop   - Leave the shop</br>" +
        "Equip [item]- Equip an item</br>" +
        "Inv [page]  - View your inventory</br>" +
        //"Quest [page]- View a list of your current quests</br>" +
        "Help        - View this page</p>";
    $("#gameInfo").html(helpList);
    Terminal.print("Game commands can be found on the right-hand pane");
}
TerminalShell.commands['updates'] = function(terminal)
{
    var updateList = "<h3>Updates</h3>" +
        "<p>Site Layout</br>" +
        "Npcs and fighting!</br>" +
        "Shops!</br>" +
        "Maps!</p>" +
        "<h3>Planned Updates</h3>" +
        "<p>Bugfixes</p>" +
        "<p>New game option clears previous data</p>" +
        "<p>Load data is functional</p>" +
        "<p>Map stuff</p>";
    $("#gameInfo").html(updateList);
    Terminal.print("Updates to the game can be found on the right-hand pane");
}
TerminalShell.commands['about'] = function(terminal)
{
    var about = "<h3>About</h3><p><b>rpg the rpg: an mmorpg</b> is a monotonous monoplayer<br>oldschool role-playing game that started out as<br>an assignment in one of my classes. To be<br>succinct, this is a game where you walk around<br>and get in fights. Or not. I can't tell you<br>what to do, I'm just some text on a screen.</p>";
    $("#gameInfo").html(about);
    Terminal.print("Information about the game can be found on the right-hand pane");
}
//Used for movement around map.
//Occasionally on move, an npc should be created.
// TODO only print 'You head [direction]' if successful
TerminalShell.commands['go'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	if (specialCase.currentCase >= specialCase.normal && specialCase.currentCase <= specialCase.goRight)
	{
		if (cmd_args.join(' ') == 'north')
		{
			Terminal.print('You head north.');
			specialCase.currentCase = specialCase.normal;
			player.move(0, -1);
		}
		else if (cmd_args.join(' ') == 'south')
		{
			terminal.print('You head south.');
			specialCase.currentCase = specialCase.normal;
			player.move(0, 1);
		}
		else if (cmd_args.join(' ') == 'east')
		{	
			terminal.print('You head east.');
			specialCase.currentCase = specialCase.normal;
			player.move(1, 0);
		}
		else if (cmd_args.join(' ') == 'west')
		{
			terminal.print('You head west.');
			specialCase.currentCase = specialCase.normal;
			player.move(-1, 0);
		}
		else if (cmd_args.join(' ') == 'left')
		{
			terminal.print('My left or your left?');
			specialCase.currentCase = specialCase.goLeft;
		}
		else if (cmd_args.join(' ') == 'right')
		{
			terminal.print('My right or your right?');
			specialCase.currentCase = specialCase.goRight;
		}
		else if (cmd_args.join(' ') == 'up')
		{
			terminal.print('What are you doing? You are not a bird. You cannot go up.');
			specialCase.currentCase = specialCase.normal;
		}
		else if (cmd_args.join(' ') == 'down')
		{
			if (map.getTile(player.X, player.Y).type == "W")
			{
				terminal.print("You can't swim!");
			}
			else { // TODO Special moleperson fight
				terminal.print('You start digging down. It is dark down here.');
				specialCase.currentCase = specialCase.goDown;
			}
		}
		else if (cmd_args.join(' ') == 'back')
		{
			terminal.print('You go back to where you were.'); 
			player.move(-1*player.prevDirection[0], -1*player.prevDirection[1]);
		}
		else if (cmd_args.join(' ') == 'forward')
		{
			player.move(player.prevDirection[0], player.prevDirection[1]); 
			terminal.print('You continue forward.');
		}
		else if (cmd_args.join(' ') == 'away' || cmd_args.join(' ') == 'to hell')
		{
			terminal.print(randomChoice([':(', 'I\'m sorry...', 'Was... was it something I said?']));
			terminal.suppressed = true;
		}
		else
		{
			terminal.print("I don't know that direction.");
		}
	}
	else if (specialCase.currentCase == specialCase.goDown)
	{
		if (cmd_args.join(' ') == 'up')
		{
			terminal.print('You\'re back on level ground. It\'s not as dark up here.');
			specialCase.currentCase = specialCase.normal;
		}
		else if (specialCase.currentCase == specialCase.goDown)
			terminal.print(randomChoice(['Sorry, it\'s all up from here.', 'Wow, bedrock already? Guess you\re gonna have to turn around.', 'Careful! You\'ll anger the mole people!', 'No.']));
		else
			terminal.print('You\'re underground. It would probably be wiser to go up first.');
	}
	else
	{
		terminal.print("You can't go anywhere right now!");
	}
}
//Apologize after saying 'go away'
TerminalShell.commands['sorry'] = function(terminal)
{
	terminal.suppressed = false;
	terminal.print(randomChoice(["It's okay c:", "I forgive you.", "Yay! Friends again!"]));
}
//Followup to go left/right
TerminalShell.commands['my'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	if (cmd_args.join(' ') == 'left')
	{
		if (specialCase.currentCase == specialCase.goLeft)
		{
			terminal.print('You head to your left.');
			var h = player.prevDirection[0];
			var v = player.prevDirection[1];
			if (h == 1)
				player.move(0, -1);
			else if (h == -1)
				player.move(0, 1);
			else if (v == -1)
				player.move(-1, 0);
			else
				player.move(1, 0);
		}
		else if (specialCase.currentCase == specialCase.goRight)
			terminal.print('That\'s not what you said before.');
		else
			terminal.print('What?');
	}
	else if (cmd_args.join(' ') == 'right')
	{
		if (specialCase.currentCase == specialCase.goRight)
		{
			terminal.print('You head to your right.');
			var h = player.prevDirection[0];
			var v = player.prevDirection[1];
			if (h == 1)
				player.move(0, 1);
			else if (h == -1)
				player.move(0, -1);
			else if (v == -1)
				player.move(1, 0);
			else
				player.move(-1, 0);
		}
		else if (specialCase.currentCase == specialCase.goLeft)
			terminal.print('That\'s not what you said before.');
		else
			terminal.print('What?');
	}
	else
		terminal.print('What?');
	specialCase.currentCase = specialCase.normal;
}
//Followup to go left/right
TerminalShell.commands['your'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	if ((cmd_args.join(' ') == 'left' && specialCase.currentCase == specialCase.goLeft) || (cmd_args.join(' ') == 'right' && specialCase.currentCase == specialCase.goRight))
	{
		terminal.print('I\'m a computer. I have no sense of direction.');
	}
	else
		terminal.print('What?');
}
//Resets player to full health
TerminalShell.commands['rest'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	$('#game').fadeOut(2000, function() {
		terminal.setPromptActive(false);
		player.currentHP = player.maxHP;
		terminal.clear();
		$('#game').fadeIn(2000, function() {
			terminal.print('You feel rested.');
			terminal.setPromptActive(true);
		});
	});
	$('#gameInfo').fadeOut(2000, function() {
		$('#gameInfo').fadeIn(2000); });
}
//Saves player data
TerminalShell.commands['save'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	//Write data to save
	if (specialCase.currentCase >= specialCase.normal && specialCase.currentCase <= specialCase.goRight)
	{
        //4093 byte limit for cookies - Save seed instead and get implemented
		setCookie("player_save", {p:player/*, s:{shopList}*/}, 365); //Store all data in player object for one year
        //setCookie("shop", shopList, 365);
		terminal.print('Data has been saved.');
	}
	else
	{
		terminal.print('You can\'t save right now!');
	}
}
//If data exists, load the player
TerminalShell.commands['load'] = function(terminal)
{
	var obj = checkCookie();
	if (obj == '')
	{
		Terminal.print("No load data exists yet.");
	}
	else
	{
		player.load(obj.p);
        //shopList = obj.s.shopList;
		if (specialCase.currentCase == specialCase.dead)
			Terminal.print("Welcome back from the dead, " + player.name);
		else
			Terminal.print("Welcome back, " + player.name);
		// Reset game state to original
		specialCase.currentCase = specialCase.normal;
	}
}
//Print player stats
function drawStatsWindow()
{
	var statList = $('<ul>');
	statList.append($('<li>').text("Name: " + player.name));
	statList.append($('<li>').text("Race: " + player.race.charAt(0).toUpperCase() + player.race.slice(1)));
	statList.append($('<li>').text("Class: " + player.playerClass.charAt(0).toUpperCase() + player.playerClass.slice(1)));
	statList.append($('<li>').text("Level: " + player.level));
	statList.append($('<li>').text("Exp Needed: " + player.getExpNeeded()));
	statList.append($('<li>').text("Gold: " + player.gold));
	statList.append($('<li>').text("Health: " + player.currentHP + "/" + player.maxHP));
	statList.append($('<li>').text("Damage: " + (player.baseDamage + player.getInventoryDamage())));
	statList.append($('<li>').text("Defense: " + (player.baseDefense + player.getInventoryDefense())));
	var coord;
	if (player.Y > 0)
		coord = player.Y + "S";
	if (player.Y == 0)
		coord = player.Y;
	if (player.Y < 0)
		coord = (-1*player.Y) + "N";
	coord += ", "
	if (player.X > 0)
		coord += player.X + "E";
	if (player.X == 0)
		coord += player.X;
	if (player.X < 0)
		coord += (-1*player.X) + "W";
	statList.append($('<li>').text("Location: " + coord));
	$("#gameInfo").html("<h3>Player Stats<br><ul>"+statList.html()+"</ul></h3>");
}

TerminalShell.commands['stats'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead || specialCase.currentCase == specialCase.start) {return;}
	currentDisplay = "STATS";
	//Use CLI script to make list formatting
	drawStatsWindow();
	terminal.print("Stats are available in the top-right window.");
}
// Displays the map in the GameInfo pane
TerminalShell.commands['map'] = function(terminal)
{
	if (specialCase.currentCase >= specialCase.normal && specialCase.currentCase <= specialCase.shop)
	{
		map.drawMap();
		currentDisplay = "MAP"; // Update the gameInfo tab
		terminal.print("The map is available in the top-right window.");
	}
	else
		terminal.print("You can't access the map right now!");
}
TerminalShell.commands['fight'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {Terminal.print("That's what got you into this mess.");return;}
	if (specialCase.currentCase == specialCase.fight)
	{
		Fight(player, npc);
	}
    else if (isNpcOnTile(player.X, player.Y)) 
    {
        if (npcList[currentNpcIndex].npc == null) {
            npcList[currentNpcIndex].npc = new Npc();
            npcList[currentNpcIndex].npc.createNpc(false);
        }
        Fight(player, npcList[currentNpcIndex].npc);
        currentNpcIndex = null;
    }
	else
	{
		terminal.print("Fight what? There's nothing else around.");
	}
}
//Examine npc to see 
TerminalShell.commands['inspect'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {return;}
	if (specialCase.currentCase == specialCase.fight)
	{
		var statList = $('<ul>');
		statList.append($('<li>').text("Name: " + npc.name_mod)); // Include npc name modifier here - Tiny or Giant
		statList.append($('<li>').text("Level: "+npc.level));
		statList.append($('<li>').text("Health: "+npc.currentHP + "/" + npc.maxHP));
		statList.append($('<li>').text("Damage: "+npc.baseDamage));
		statList.append($('<li>').text("Defense: "+npc.defense));
		$("#gameInfo").html("<h3>Enemy Stats<br><ul>"+statList.html()+"</ul><br><i>"+allNpcs[npc.name].description+"</i></h3>");
		terminal.print(randomChoice(["Hmm... Interesting.", "Cool!", "Ooh, seems tough.", "Inspect away!"]));
		terminal.print("What will you do? [Fight/Inspect/Run]");
	}
    else if (isNpcOnTile(player.X, player.Y)) {
        if (npcList[currentNpcIndex].npc == null) {
            npcList[currentNpcIndex].npc = new Npc();
            npcList[currentNpcIndex].npc.createNpc(false);
        }
		var statList = $('<ul>');
		statList.append($('<li>').text("Name: " + npcList[currentNpcIndex].npc.name_mod)); // Include npc name modifier here - Tiny or Giant
		statList.append($('<li>').text("Level: "+npcList[currentNpcIndex].npc.level));
		statList.append($('<li>').text("Health: "+npcList[currentNpcIndex].npc.currentHP + "/" + npcList[currentNpcIndex].npc.maxHP));
        
		$("#gameInfo").html("<h3>Stats<br><ul>"+statList.html()+"</ul>");
        terminal.print("What will you do? [Fight/Inspect/Talk/Walk away]");
    }
	else // if npc on mapTile
	{
        terminal.print("Nothing to inspect");
		//terminal.print(specialCase.currentCase);
	}
}

function runDirection(x, y)
{
	runTimeout = setTimeout(function() {
		player.move(x, y);
		runDirection(x, y);
	}, 400);
	if (specialCase.currentCase == specialCase.fight || player.forcedStop)
	{
		clearTimeout(runTimeout);
		Terminal.promptActive = true;
        player.forcedStop = false;
	}
}
TerminalShell.commands['run'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead) {Terminal.print("You should have done that sooner."); return;}
	if (specialCase.currentCase == specialCase.fight)
	{
		//Set fight to over
		specialCase.currentCase = specialCase.normal;
        player.forcedStop = false;
        
		terminal.print(randomChoice(["You ran from the " + npc.name_mod + ". Coward.", "You valiantly flee from the " + npc.name_mod + ", tail betwixt your legs.", "The " + npc.name_mod + " is probably making fun of you to their friends by now.", "You barely escape before the " + npc.name_mod + " could hurt you.", "Ooh, smart move. You run from the " + npc.name_mod + ".", "History will remember of the time that " + player.name + " almost fought the " + npc.name_mod + ".", "You ran from the " + npc.name_mod + ". It just wanted to be friends."]));
		if (currentDisplay == "MAP")
			map.drawMap();
		else if (currentDisplay == "STATS")
			drawStatsWindow();
		else if (currentDisplay == "INVENTORY")
			drawInventoryWindow();
		else
			Terminal.resetGameInfo();
	}
	else if (specialCase.currentCase == specialCase.normal)
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

function drawInventoryWindow(invPage)
{
	var invList = $('<ul>');
	for (var i = 0; (invPage-1)*5+i<player.inventory.length && i<6; i++)
	{
		var I = 5*(invPage-1)+i;
		if (player.inventory[I].type == types.healing)
			invList.append($('<li>').html(player.inventory[I].name + "<br>   Type: " + player.inventory[I].type + "; Heals " + ((player.inventory[I].HP>0)?player.inventory[I].HP:"all of your") + " HP."));
		else if (player.inventory[I].type == types.tool)
        {
            invList.append($('<li>').html(player.inventory[I].name + "<br>   Purpose: " + player.inventory[I].purpose));
        }
        else
		{
			invList.append($('<li>').html(player.inventory[I].name + "<br>   Type: " + player.inventory[I].type + "; Damage: " + player.inventory[I].damage + "; Defense: " + player.inventory[I].defense));
		}
	}
	$("#gameInfo").html("<h3>Player Inventory</h3><ul>" + invList.html()+"</ul>Page " + (invPage) + " of " + Math.ceil(player.inventory.length/5) + ".");
}

//Displays the user's inventory
TerminalShell.commands['inv'] = TerminalShell.commands['inventory'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead || specialCase.currentCase == specialCase.start) {return;}
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
		drawInventoryWindow(invPage);
		currentDisplay = "INVENTORY";
	}
	terminal.print("Inventory is available in the top-right window.");
}

function drawWieldingWindow()
{
	var equipList = $('<ul>');
    var padding = "        ";
    for (var i = 0; i<player.inventory.length; i++)
    {
        var equip_slots = {'Head':0, 'Neck':0, 'Chest':0, 'Arms':0, 'Legs':0, 'Feet':0, 'Weapon':0}
        for (var i in equip_slots)
        {
            for (var j=0; j<player.wielding.length; j++)
            {
                if (player.wielding[j].type == i || player.wielding[j].type == 'Wield' && i == "Weapon")
                {
                    equip_slots[i] = player.wielding[j];
                    continue;
                }
            }
            if (equip_slots[i] != 0)
            {
                equipList.append($('<li>').html(i + ":" + padding.substr(0, 8-i.length).replace(/ /g, '&nbsp;') + equip_slots[i].name));
            }
            else
            {
                equipList.append($('<li>').html(i + ":" + padding.substr(0, 8-i.length).replace(/ /g, '&nbsp;') + "<i>None</i>"));
            }
        }
    }
	$("#gameInfo").html("<h3>Equipped Items</h3><ul>" + equipList.html());
}
//Displays all items currently wielded by player
TerminalShell.commands['wielding'] = TerminalShell.commands['equipped'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.dead || specialCase.currentCase == specialCase.currentCase.start) { return; }
	currentDisplay = "WIELDING";
    if (player.wielding.length == 0)
    {
        terminal.print("You don't have anything equipped!");
        return;
    }
    drawWieldingWindow();
}

TerminalShell.commands['shop'] = TerminalShell.commands['enter'] = function(terminal)
{
	if (specialCase.currentCase == specialCase.shop)
	{ displayShopInfo(); }
	else if (specialCase.currentCase == specialCase.normal)
	{
		currentShopIndex = -1;
		//Check here if a map exists on current square, else print no shops
		for (var i in shopList)
		{
			if (shopList[i].x == player.X && shopList[i].y == player.Y)
			{
                if (shopList[i].shop == null)
                {
                    shopList[i].shop = new Shop(player);
                    shopList[i].shop.init();
                }
				currentShopIndex = i;
				restock();
                Terminal.print("You enter the shop.");
                specialCase.currentCase = specialCase.shop;
                displayShopInfo();
				return;
			}
		}
		if (currentShopIndex == -1)
		{
            Terminal.print("There's not a shop here!");
		}
	}
    else
    {
        Terminal.print("This is a horrible time to go shopping.");
    }
}

//Purchases an object in shop inventory and adds it to player's inventory
TerminalShell.commands['purchase'] = TerminalShell.commands['buy'] = function(terminal)
{
	if (specialCase.currentCase != specialCase.shop) { Terminal.print("What?"); return }
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
	if (specialCase.currentCase != specialCase.shop) { Terminal.print("What?"); return }
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
	if (specialCase.currentCase == specialCase.shop)
	{
		terminal.print("You leave the shop.");
		specialCase.currentCase = specialCase.normal;
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
	// Update the player stat window when appropriate
	if (currentDisplay == "STATS")
		drawStatsWindow();
}

TerminalShell.commands['unequip'] = function(terminal)
{
	if (player.wielding.length == 0) {terminal.print("Nothing to unequip"); return;}
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift();
	var item = cmd_args.join(' '); // The item to unequip
	for (i in player.wielding)
	{
		if (player.wielding[i].name.toLowerCase() == item)
		{
			terminal.print("You unequip the " + player.wielding.splice(i, 1)[0].name + ".");// Update the player stat window when appropriate
			if (currentDisplay == "STATS")
				drawStatsWindow();
			return;
		}
	}
	terminal.print("You need to be wearing an item to unequip it!");
}

/* Used in quests */
TerminalShell.commands['talk'] = function(terminal)
{
    /* If current tile has an NPC, talk to it to reveal information */
    if (isNpcOnTile(player.X, player.Y)) {
        terminal.print("You strike up a conversation");
        if (npcList[currentNpcIndex].npc == null) {
            npcList[currentNpcIndex].npc = new Npc();
            npcList[currentNpcIndex].npc.createNpc(false);
            player.quests[currentNpcIndex] = npcList[currentNpcIndex].npc.quest;
        }
        $("#gameInfo").html(getQuestText());
        updateQuest();
    } else {
        terminal.print("You're talking to yourself.");
    }
    currentNpcIndex = null;
}