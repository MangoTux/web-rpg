//Player object
function Player(name)
{
	//Info
	this.name = name;
	this.race = ""; //Human, Elf, Dwarf, Goblin
	this.playerClass = ""; //Warrior, Ranger, Mage, Monk

	this.level = 1;
	this.experience = 0;
	this.base_combat_stats = {
		damageRollMax: 1,
		damageRollQty: 1,
		damageModifier: 5,
		attackSpeed: 1,
		defense: 1,
		luck: 1,
		currentHP: 30,
		maxHP: 30
	};
	this.combat_stats = this.base_combat_stats;
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
		this.base_combat_stats = jsonObj.base_combat_stats;
		this.defense = jsonObj.defense;
		this.luck = jsonObj.luck;
		this.X = jsonObj.X;
		this.Y = jsonObj.Y;
		this.gold = jsonObj.gold;
		this.inventory = jsonObj.inventory;
		this.wielding = jsonObj.wielding;
		this.applyWielding();
	};

	this.move = function(h, v)
	{
    var moveable = map.canMove(this.X + h, this.Y + v);
    if (!moveable.canMove)
    {
      if (moveable.reason == "W")
      {
        Terminal.print("You can't swim!");
      } else if (moveable.reason == "L") {
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
		ui.resumeDisplay(currentDisplay);
	};

	//Performs all functions related to leveling up
	this.gainLevel = function()
	{
		this.level++;
		this.luck++;
		this.base_combat_stats.baseDamage += classes[this.playerClass].damage; // TODO DAMAGE
		this.base_combat_stats.defense += classes[this.playerClass].defense;
		this.base_combat_stats.maxHP += classes[this.playerClass].health;
    this.gold += 50*this.level;
		this.applyWielding()
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

	// Player has base_combat_stats and combat_stats, for which the latter is after all inventory items are applied. Calculate here
	this.applyWielding = function()
	{
		this.combat_stats = this.base_combat_stats;
		for (var i in this.wielding) {
			if (this.wielding[i].type != types.healing) {
			 // TODO
			 	for (var j in this.wielding[i].statChanges) {
					player.combat_stats[j] += this.wielding[i].statChanges[j]
				}
			  var data = {
					damageRollMax: 1,
					damageRollQty: 1,
					damageModifier: 5,
					attackSpeed: 1,
					defense: 1,
					luck: 1,
					currentHP: 30,
					maxHP: 30
				};
			}
		}
	}

	this.getInventoryLuck = function()
	{
		var invLuck = 0;
		for (var I in this.wielding) { if (this.wielding[I].type != types.healing) invLuck += this.wielding[I].luck; } return invLuck;
	}
}
