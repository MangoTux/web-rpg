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

// Notes:
/*
Possibility for items to increase minimum damage
Have base damage, factor in inventory
Run test setup with Simpleton
*/
Combat.prototype.fight = function() {
  var numCrits, damage;
  console.log("Simulating attacker: ");
  numCrits = this.getCritRoll(this.attacker.combat_stats.luck);
  damage = this.getDamage(this.attacker);
  damage *= this.critValues[numCrits];
  damage -= this.defender.combat_stats.defense;
  if (damage < this.minimumDamage) { damage = this.minimumDamage; }
  console.log("Attacker deals " + damage + " damage");
  console.log("Simulating defender: ");
  numCrits = this.getCritRoll(this.defender.combat_stats.luck);
  damage = this.getDamage(this.defender);
  damage *= this.critValues[numCrits];
  damage -= this.attacker.combat_stats.defense;
  if (damage < this.minimumDamage) { damage = this.minimumDamage; }
  console.log("Defender deals " + damage + " damage");
}

Combat.prototype.initializeDisplay = function() {
  // Initialize the HTML layout for the fight
  document.getElementById("gameInfo").innerHTML = "<div id=\"leftSide\" class='col-xs-4'></div><div id=\"center\" class='col-xs-4'><div id='center-content' class='col-cs-12'></div></div><div id=\"rightSide\" class='col-xs-4'></div>";
  document.getElementById("leftSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + this.attacker.name_mod + "</h2><div id=\"leftFight\"></div>";
  document.getElementById("rightSide").innerHTML = "<h2 style=\"font-size:250%; text-decoration:underline;\">" + this.defender.name_mod + "</h2><div id=\"rightFight\"></div>";
  document.getElementById("leftFight").innerHTML = "<h4>"+this.attacker.combat_stats.currentHP+"/"+this.attacker.combat_stats.maxHP+"</h4>";
  document.getElementById("rightFight").innerHTML = "<h4>"+this.defender.combat_stats.currentHP+"/"+this.defender.combat_stats.maxHP+"</h4>";
}

Combat.prototype.animateAttack = function(damage, critString, side, character) {
  document.getElementById("center-content").innerHTML = "<br><br>"+critString+"<br><br><b class='combat__damage' style='color:red;'>-" + damage + "</b><br>";
  $("#center-content").show().effect("puff", 1000, function() {
    document.getElementById(side + "Fight").innerHTML = "<h4>"+character.combat_stats.currentHP + "/" + character.combat_stats.maxHP + "</h4>";
    $("#"+side+"Fight").effect("shake", { direction: "left", distance: 10, times: 3}, 500);
  });
}

Combat.prototype.animateHealing = function(restored, side, character) {
  var healingText = "<b class='combat__healing' style='color:limegreen'>Healed!</b>";
  document.getElementById("center-content").innerHTML = "<br><br>"+healingText+"<br><b class='combat__healing' style='color:green;'>+" + restored + "</b><br>";
  $("#center-content").show().effect("puff", 1000, function() {
    document.getElementById(side + "Fight").innerHTML = "<h4>" + character.combat_stats.currentHP + "/" + character.combat_stats.maxHP + "</h4>";
    $("#" + side + "Fight").effect("shake", { direction: "up", distance: 10, times: 1 }, 500);
  });
}

var npcLeft = new Npc(); npcLeft.createNpc(); var npcRight = new Npc(); npcRight.createNpc(); var combat = new Combat(); combat.setUpEncounter(npcLeft, npcRight); combat.initializeDisplay();
//combat.animateAttack(10, "<b style='color:red'>Double Critical!</b>", "right", npcRight);
combat.animateHealing(30, "left", npcLeft);
