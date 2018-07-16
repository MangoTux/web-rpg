function UI() {

}

UI.prototype.drawMap = function() {
  var isShop, isNPC;
  var table = $("<table>");
  table.css("line-height", "4px");
  table.css("font-size", "4px");
  for (var y=-10; y<10; y++)
  {
    var row = $("<tr>");
    for (var x=-20; x<20; x++)
    {
      if (x == 0 && y == 0)
      {
        var player_tile = $('<td>').text(this.customTiles.player.symbol).css("color", this.customTiles.player.style);
        row.append(player_tile);
      } else {
        isShop = false;
        isNPC = false;
        for (var i in shopList)
        {
          if (shopList[i].x == x+player.X && shopList[i].y == y+player.Y)
          {
            row.append($('<td>').text(this.customTiles.shop.symbol).css("color", this.customTiles.shop.style));
            isShop = true;
            continue;
          }
        }
        for (var i in npcList)
        {
          if (npcList[i].x == x+player.X && npcList[i].y == y+player.Y)
          {
            row.append($('<td>').text(this.customTiles.npc.symbol).css("color", this.customTiles.npc.color));
            isNPC = true;
            continue;
          }
        }
        if (!isShop && !isNPC)
        {
          var tile = this.getTile(x+player.X, y+player.Y);
          row.append($('<td>').text(tile.symbol).css("color", tile.style));
        }
      }
    }
    table.append(row);
  }
  mapInfo = "<br>";
  $("#gameInfo").html(table.html() + mapInfo);
}

// Return
UI.prototype.resumeDisplay = function() {
  switch (currentDisplay) {
    case "MAP": this.drawMap(); break;
    case "STATS": this.drawStats(); break;
    case "INVENTORY": this.drawInventory(); break;
    default: Terminal.resetGameInfo();
  }
}

//Print player stats
UI.prototype.drawStats() {
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
// Display the invPage-nth page of the Player's inventory
UI.prototype.drawInventory(invPage) {
  if (typeof invPage === "undefined") { invPage = 1; }
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

// Display all items the user currently has equippedd
UI.prototype.drawEquipped() {
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

UI.prototype.drawNpcInfo(npcData) {
  var statList = $('<ul>');
  for (var i in npcData.list) {
    statList.append($('<li>').text(i + ": " + npcData[i]);
  }
  var gameText = "Stats<br><ul>"+statList.html()+"</ul>";
  if (npcData.display !== undefined) {
    gameText += "<br><i>"+npcData.display['Description']+"</i>";
  }
  $("#gameInfo").html("<h3>"+gameText+"</h3>");
}

UI.prototype.drawTombstone() {
  document.getElementById("gameInfo").innerHTML =
  "<h3><pre>              __.....__\n            .'         ':,\n           /  __  _  __  \\\\\n           | |_)) || |_))||\n           | | \\\\ || |   ||\n           |             ||   _,\n           |             ||.-(_{}\n           |             |/    `\n           |        ,_ (\\;|/)\n         \\\\|       {}_)-,||`\n         \\\\;/,,;;;;;;;,\\\\|//,\n        .;;;;;;;;;;;;;;;;,\n       \\,;;;;;;;;;;;;;;;;,//\n      \\\\;;;;;;;;;;;;;;;;,//\n     ,\\';;;;;;;;;;;;;;;;'\n    ,;;;;;;;;;;;;;;;;''`\n</pre></h3>";
  $('#gameInfo').hide().fadeIn(2000);
}
