var npc;

function getName(player, isTitled, isHumanoid)
{
    var baseName;
    if (map.getTile(player.X, player.Y).type=="W")
    {
        baseName = randomChoice(npcs.waterNpcs);
    } // TODO arid npcs, map tiles
    // Extreme north or south; create arctic npcs
    else if (player.Y > 70 || player.Y < -70)
    {
        baseName = randomChoice(npcs.coldNpcs);
    }
    // Center of world, create people
    else if ((player.Y < 30 && player.Y > -30) && (player.X < 30 && player.X > -30))
    {
        baseName = randomChoice(npcs.peopleNpcs);
    }
    else if (player.level < 25)
    {
        baseName = randomChoice(npcs.easyNpcs.concat(npcs.normalNpcs));
    }
    else if (player.level > 60)
    {
        baseName = randomChoice(npcs.hardNpcs.concat(npcs.normalNpcs));
    }
    else
    {
        baseName = randomChoice(npcs.normalNpcs);
    }
    if (isTitled) {
        this.name_mod = mod.nameMod.replace("%", this.name);
    }
}

function npc(player)
{
	this.player = player;
	this.name = "";
  this.name_mod = "%";
	this.level = 0;
	this.maxHP = 0;
	this.luck = 0;
	this.baseDamage = 0;
	this.defense = 0;
	this.currentHP = 0;
	this.gold = 0;
	// TODO size modifier - Affects certain stats
	// TODO - Generate npcs based on map location
	// Creates the npc based on player info
	this.createnpc = function()
	{
    this.name = getName(this.player, true, false);

		var distance = Math.abs(player.X + player.Y);

    this.level = player.level;
    if (distance > 60)
    {
      this.level += getRandomInt(-Math.sqrt(distance)/2, Math.sqrt(distance));
    }
    this.level += getRandomInt(-1-(player.level/5), (player.level/5));
    this.level = Math.floor(this.level);
		if (this.level > 100)
			this.level = 100;
		if (this.level < 1)
			this.level = 1;

		this.gold = Math.floor(allNpcs[this.name].gold*Math.sqrt(this.level)/2);
		this.experience = Math.floor(allNpcs[this.name].baseXP*Math.sqrt(this.level)); // TODO
		this.maxHP = 30 + Math.floor(this.level*Math.sqrt(this.level+1)-getRandomInt(0, this.level+1));
		this.currentHP = this.maxHP;

		this.luck = getRandomInt(1, this.level+1);
		//TODO improve calculations
		this.baseDamage = Math.floor(allNpcs[this.name].damage+this.level*Math.sqrt(getRandomInt(0, this.level)));

		this.defense = Math.floor(allNpcs[this.name].defense+Math.sqrt(getRandomInt(0, this.level))); // TODO

    if (getRandomInt(0, 100)<5) {
      var mod = randomChoice(specialModifiers);

      this.luck = Math.floor(this.luck*mod.luckMod);

      this.baseDamage = Math.floor(this.baseDamage*mod.attackMod);

      this.defense = Math.floor(this.defense*mod.defenseMod);

      this.maxHP = Math.floor(this.maxHP*mod.hpMod);

      this.experience = Math.floor(this.experience*mod.rewardMod);
      this.gold = Math.floor(this.gold*mod.rewardMod);
      this.currentHP = this.maxHP;
      this.name_mod = mod.nameMod.replace("%", this.name);
    } else {
      this.name_mod = this.name;
    }
	};
}
