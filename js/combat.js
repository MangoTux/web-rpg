function Combat() {
  this.critValues = [1, 1.5, 2, 3];
  this.critStrings = ["", "Critical Hit!", "Double Crit!", "Triple Crit!"];

  this.minimumDamage = 1;

  // Performs a damage roll for the character
  this.getDamage = function(character) {
    var total = 0;

    for (var i=0; i<character.combat_stats.damageRollQty; i++) {
      total += getRandomInt(1, character.combat_stats.damageRollMax);
    }

    total += character.combat_stats.damageModifier;
    return total;
  }

  this.getCritRoll = function(luck) {
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

  this.setUpEncounter = function(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
  }
}

Combat.prototype.combatTurn = function(attacker, defender) {
  if (attacker.combat_stats.currentHP == 0) {
    // Check inventory for healing. Health restoration uses an entire turn
    return;
  }
  var numCrits, damage, critString;
  numCrits = this.getCritRoll(attacker.combat_stats.luck);
  damage = Math.floor((this.getDamage(attacker)) * this.critValues[numCrits] - defender.combat_stats.defense);

  if (damage < this.minimumDamage) { damage = this.minimumDamage; }

  if (getRandomInt(0, 103-defender.combat_stats.luckModifier) < 2) {
    critString = "<b class='combat__dodge'>Dodged!</b>";
    damage = 0;
  } else if (getRandomInt(0, 100) < 1) {
    critString = "<b class='combat__miss'>Missed!</b>";
    damage = 0;
  } else {
    critString = "<b class='combat__damage'>"+this.critStrings[numCrits]+"</b>";
  }
  defender.combat_stats.currentHP -= damage;
  if (defender.combat_stats.currentHP < 0) { defender.combat_stats.currentHP = 0; }
  this.animateAttack(damage, critString, defender);
}
// Notes:
/*
Possibility for items to increase minimum damage
Have base damage, factor in inventory
Run test setup with Simpleton
*/
Combat.prototype.fight = function() {
  // The attacker shoud reliably go first.
  this.attacker.combatState = {
    turn: 0, //this.attacker.combat_stats.attackSpeed,
    currentAttackThreshold: 0, //Math.floor(this.attacker.combat_stats.attackSpeed),
    nextAttackThreshold: 0,
    side: "left"
  };
  this.defender.combatState = {
    turn: 0,
    currentAttackThreshold: 0,
    nextAttackThreshold: 0,
    side: "right"
  }
  var combatants = [
    this.attacker, this.defender
  ];
  var index = 0;
  var hasIncrementedTurn = false;
  var interval = window.setInterval($.proxy(function combatRound() {
    // while is used instead of if to skip past 'empty' turns
    while (combatants[index].combatState.turn < combatants[index].combatState.nextAttackThreshold) {
      // This line in conjunction with hasIncrementedTurn check is doubling expected attack speeds. TODO
      combatants[index].combatState.turn += combatants[index].combat_stats.attackSpeed;
      index = (index+1)%(combatants.length);
      hasIncrementedTurn = false;
    }
    this.combatTurn(combatants[index], combatants[(index+1)%combatants.length]);
    /* After an attack, increment the requirement for attacks */
    combatants[index].combatState.nextAttackThreshold++; // FP: 1 SP:
    if (!hasIncrementedTurn) {
      combatants[index].combatState.turn += combatants[index].combat_stats.attackSpeed;
      hasIncrementedTurn = true;
    }

    // Final victory check: TODO implement healing
    if (combatants[(index+1)%combatants.length].combat_stats.currentHP == 0) {
      clearInterval(interval);
    }
  }, this), 1650);
}

Combat.prototype.initializeDisplay = function() {
  // Initialize the HTML layout for the fight
  document.getElementById("gameInfo").innerHTML = "<div id=\"leftSide\" class='col-xs-4'></div><div id=\"center\" class='col-xs-4'><div id='center-content' class='col-cs-12'></div></div><div id=\"rightSide\" class='col-xs-4'></div>";
  document.getElementById("leftSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + this.attacker.name_mod + "</h2><div id=\"leftFight\"></div>";
  document.getElementById("rightSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + this.defender.name_mod + "</h2><div id=\"rightFight\"></div>";
  document.getElementById("leftFight").innerHTML = "<h4>"+this.attacker.combat_stats.currentHP+"/"+this.attacker.combat_stats.maxHP+"</h4>";
  document.getElementById("rightFight").innerHTML = "<h4>"+this.defender.combat_stats.currentHP+"/"+this.defender.combat_stats.maxHP+"</h4>";
}

Combat.prototype.animateAttack = function(damage, critString, character) {
  document.getElementById("center-content").innerHTML = "<br><br>"+critString+"<br><br><b class='combat__damage'>-" + damage + "</b><br>";
  $("#center-content").show().effect("puff", 1000, function() {
    document.getElementById(character.combatState.side + "Fight").innerHTML = "<h4>"+character.combat_stats.currentHP + "/" + character.combat_stats.maxHP + "</h4>";
    $("#"+character.combatState.side+"Fight").effect("shake", { direction: "left", distance: 10, times: 3}, 500);
  });
}

Combat.prototype.animateHealing = function(restored, character) {
  var healingText = "<b class='combat__healing'>Healed!</b>";
  document.getElementById("center-content").innerHTML = "<br><br>"+healingText+"<br><b class='combat__healing'>+" + restored + "</b><br>";
  $("#center-content").show().effect("puff", 1000, function() {
    document.getElementById(character.combatState.side + "Fight").innerHTML = "<h4>" + character.combat_stats.currentHP + "/" + character.combat_stats.maxHP + "</h4>";
    $("#" + character.combatState.side + "Fight").effect("shake", { direction: "up", distance: 10, times: 1 }, 500);
  });
}

var npcLeft = new Npc(); npcLeft.createNpc(); var npcRight = new Npc(); npcRight.createNpc(); var combat = new Combat(); combat.setUpEncounter(npcLeft, npcRight); combat.initializeDisplay();
npcLeft.combat_stats.attackSpeed = 1;
combat.fight();
