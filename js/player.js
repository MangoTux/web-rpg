//Player object
function Player(name)
{
	//Info
	this.name = name;
	this.race = ""; //Human, Elf, Dwarf, Goblin
	this.playerClass = ""; //Warrior, Ranger, Mage, Monk

	this.level = 1;
	this.experience = 0;
	this.baseDamage = 5; //TODO
	this.baseDefense = 1; //TODO
	this.maxHP = 30; //TODO
	this.currentHP = 30;
	this.luck = 1; //Chance of crit = 2/(103-luck)
	this.prevDirection = [0, -1]; // Start facing north
	this.X = 0;
	this.Y = 0;
	this.inventory = []; // All items in inventory, including food/HP items
	this.wielding = []; // Only wieldable items here
	this.forcedStop = false;
	this.gold = 250;
    this.quests = {}; // List of quests the player has currently started

	this.load = function(jsonObj)
	{
		this.name = jsonObj.name;
		this.race = jsonObj.race;
		this.playerClass = jsonObj.playerClass;
		this.level = jsonObj.level;
		this.experience = jsonObj.experience;
		this.baseDamage = jsonObj.baseDamage;
		this.defense = jsonObj.defense;
		this.maxHP = jsonObj.maxHP;
		this.currentHP = jsonObj.currentHP;
		this.luck = jsonObj.luck;
		this.X = jsonObj.X;
		this.Y = jsonObj.Y;
		this.gold = jsonObj.gold;
		this.damage = jsonObj.damage;
		this.inventory = jsonObj.inventory;
		this.wielding = jsonObj.wielding;
	};

	this.move = function(h, v)
	{
        var moveable = map.canMove(this.X + h, this.Y + v);
        if (!moveable.canMove)
        {
            if (moveable.reason == "W")
            {
                Terminal.print("You can't swim!");
            }
            else if (moveable.reason == "L")
            {
                Terminal.print("Lava is kinda hot, and you'll probably die if you go there.");
            }
            this.forcedStop = true;
            return;
        }
		this.X += h;
		this.Y += v;
		this.prevDirection = [h, v];
		if (getRandomInt(0, 100) < 15) // Change cutoff to be dependent on locations
		{
			npc = new Npc();
			npc.createNpc(true);
			Terminal.print("Oh no! You ran into a level " + npc.level + " " + npc.name_mod + "!");
			Terminal.print("What will you do? [Fight/Inspect/Run]");
			gameState.currentCase = gameState.fight;
            player.forcedStop = true;
		}
		if (currentDisplay == "MAP") // Update the map while the user has it displayed
		{
			map.drawMap();
		}
		UI.handleMovement(currentDisplay);
	};

	//Performs all functions related to leveling up
	this.gainLevel = function()
	{
		//TODO modify better
		this.level++;
		this.luck++;
		this.baseDamage += classes[this.playerClass].damage;
		this.defense += classes[this.playerClass].defense;
		this.maxHP += classes[this.playerClass].health;
        this.gold += 50*this.level;
	}

	// Returns the amount of total exp needed to get to the next level
	this.getExpNeeded = function()
	{
		var exp = 0;
		for (var i=1; i<this.level+1; i+=1)
		{
			exp += Math.floor((this.level+1) + 300*Math.pow(2, (this.level+1)/7.));
		}
		return exp-this.experience;
	};

	this.gainExperience = function(exp)
	{
		this.experience += exp;
		Terminal.print("You gained " + exp + " experience.");
		var expNeeded = this.getExpNeeded();
		while (expNeeded < 0)
		{
			this.gainLevel();
			Terminal.print("Congratulations! You're now level " + this.level);
            expNeeded = this.getExpNeeded();
		}
	}

	this.getInventoryDamage = function()
	{
		var invDamage = 0;
    	for (var I in this.wielding) { if (this.wielding[I].type != types.healing) invDamage += this.wielding[I].damage; } return invDamage;
	}

	this.getInventoryDefense = function()
	{
		var invDefense = 0;
		for (var I in this.wielding) { if (this.wielding[I].type != types.healing) invDefense += this.wielding[I].defense; } return invDefense;
	}

	this.getInventoryLuck = function()
	{
		var invLuck = 0;
		for (var I in this.wielding) { if (this.wielding[I].type != types.healing) invLuck += this.wielding[I].luck; } return invLuck;
	}
}

function getCritRoll(luck)
{
	var numCrits = 0;
	for (var i=0; i<3; i++)
	{
		if (getRandomInt(0, 103-luck) < 2)
		{
			numCrits++;
		}
	}
	return numCrits;
}

// Creates the fight scene
function Fight(player, npc)
{
	// Initialize the HTML layout for the fight
	document.getElementById("gameInfo").innerHTML = "<div id=\"leftSide\" class='col-xs-4'></div><div id=\"center\" class='col-xs-4'><div id='center-content' class='col-cs-12'></div></div><div id=\"rightSide\" class='col-xs-4'></div>";
	document.getElementById("leftSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + player.name + "</h2><div id=\"leftFight\"></div>";
	document.getElementById("rightSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + npc.name_mod + "</h2><div id=\"rightFight\"></div>";
	document.getElementById("leftFight").innerHTML = "<h4>"+player.currentHP+"/"+player.maxHP+"</h4>";
	document.getElementById("rightFight").innerHTML = "<h4>"+npc.currentHP+"/"+npc.maxHP+"</h4>";
	//ASCII here
	// TODO animate damage values and 'crit' marker
	Terminal.promptActive = false;
	var damage = 0;
	var turn = 0;
	var critString = "";
	var numCrits;

	var critValues = [1, 1.5, 2, 3];
	var critStrings = ["", "Critical Hit!", "Double Crit!", "Triple Crit!"];

	//Get total player stats at beginning of fight
	var playerDamage = player.baseDamage + player.getInventoryDamage();
	var playerDefense = player.baseDefense + player.getInventoryDefense();
	var playerLuck = player.luck + player.getInventoryLuck();

    //trimDown
	var interval = window.setInterval($.proxy(function fightStep()
	{
		if (turn % 2 == 0)
		{
			if (player.currentHP > 0) // If the player can fight
			{
				damage = playerDamage - npc.defense;
				critString = "";
				numCrits = getCritRoll(playerLuck);

				damage *= critValues[numCrits];
				critString = "<b style=\"color:red;\">"+critStrings[numCrits]+"</b>";
				damage = Math.floor(damage);
				//Balance caps
				if (damage < 1) damage = 1;

				if (getRandomInt(0, 103-npc.luck) < 2) // npc dodges
				{
					critString = "<b style=\"color:white;\">Miss!</b>";
					damage = 0;
				}
				else if (getRandomInt(0, 100) < 1) // Miss
				{
					critString = "<b style=\"color:limegreen;\">Dodged!</b>";
					damage = 0;
				}
				//Animation
				document.getElementById("center-content").innerHTML = "<br><br>"+critString+"<br><br><b style=\"color:red;\">-" + damage + "</b><br>";
				$('#center-content').show().effect("puff", 1000, function() {
					npc.currentHP -= damage;
					if (npc.currentHP < 0)	npc.currentHP = 0;
					document.getElementById("rightFight").innerHTML = "<h4>"+npc.currentHP+"/"+npc.maxHP+"</h4>";
					$('#rightFight').effect( "shake" , { direction: "left" , distance:10, times: 3 }, 500);
				});
			}
			else // Player died, unless player possesses healing item
			{
				var healed = false;
				for (var i in player.inventory) // Player can perform a last-minute heal
				{
					if (player.inventory[i].type == types.healing) // If inventory contains a healing element
					{
						healed = true;
						critString = "<b style=\"color:limegreen;\">Healed!</b>";
						var healedAmount = (player.inventory[i].HP>0)?player.inventory[i].HP:player.maxHP;
						Terminal.print("Just before you died, you consumed the " + player.inventory.splice(i, 1)[0].name + " and restored " + healedAmount + " HP!");
						document.getElementById("center-content").innerHTML = "<br><br>"+critString+"<br><b style=\"color:green;\">+" + healedAmount + "</b><br>";
						$('#center-content').show().effect( "puff", 1000, function() {
							player.currentHP += healedAmount;
							if (player.currentHP > player.maxHP)
								player.currentHP = player.maxHP;
							document.getElementById("leftFight").innerHTML = "<h4>"+player.currentHP+"/"+player.maxHP+"</h4>";
							$('#leftFight').effect( "shake" , {direction: "up" , distance:20, times: 1 }, 500);
						});
					}
				}
				if (!healed)
				{
					clearInterval(interval);
					Terminal.print("You died...");
					Terminal.drawTombstone();
					Terminal.promptActive = true;
					gameState.currentCase = gameState.dead;
				}
			}
		}
		else
		{
			if (npc.currentHP > 0) // While npc can still fight
			{
				damage = npc.baseDamage - playerDefense;

				numCrits = getCritRoll(npc.luck);
				damage *= critValues[numCrits];
				damage = Math.floor(damage);
				critString = "<b style=\"color:red;\">"+critStrings[numCrits]+"</b>"
				//Balance caps
				if (damage < 1) damage = 1;

				if (getRandomInt(0, 103-playerLuck < 2)) // Player dodges
				{
					critString = "<b style=\"color:limegreen;\">Dodged!</b>";
					damage = 0;
				}
				else if (getRandomInt(0, 100) < 1) // Miss
				{
					critString = "<b style=\"color:white;\">Miss!</b>";
					damage = 0;
				}
				//Animation
				document.getElementById("center-content").innerHTML = "<br><br>"+critString+"<br><br><b style=\"color:red;\">-" + damage + "</b><br>";
				$('#center-content').show().effect( "puff", 1000, function() {
					player.currentHP -= damage;
					if (player.currentHP < 0)	player.currentHP = 0;
					document.getElementById("leftFight").innerHTML = "<h4>"+player.currentHP+"/"+player.maxHP+"</h4>";
					$('#leftFight').effect( "shake" , { direction: "left" , distance:10, times: 3 }, 500);
				});
			}
			else // Player won the fight
			{
				clearInterval(interval);
				Terminal.promptActive = true;
				onPlayerWin(player, npc);
			}
		}
		turn++;
	}, this), 1650);
}

function onPlayerWin(player, npc)
{
	Terminal.resetGameInfo();
	Terminal.print("You won!");
	gameState.currentCase = gameState.normal;
	if (npc.gold > 0)
	{
		Terminal.print("You gained " + npc.gold + " gold.");
		player.gold += npc.gold;
	}
	player.gainExperience(npc.experience);
    updateQuest(npc);
    // TODO clear out currentNpcIndex on move
    if (currentNpcIndex != null) {
        Terminal.print("After killing " + npcList[currentNpcIndex].npc.name_mod + ", it feels like a weight has been lifted off of your shoulders.");
        npcList.splice(currentNpcIndex, 1);
        delete player.quests[currentNpcIndex];
        currentNpcIndex = null;
    }
}
