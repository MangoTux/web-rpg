function UI() {
 // The object used to handle any specific gameInfo display data
}

/*
Run north:
- Remove $("tbody>tr:last")
- Get new tiles for y-10, $("tbody").prepend()
Run south:
- Remove $("tbody>tr:first")
- Get new tiles for y+9, $("tbody").append();
East and West are similar, but $("tbody>tr>td:first").forEach (and last)
*/
UI.prototype.drawFullMap = function(map) {
  let table = $("<table>");
  table.css("line-height", "4px");
  table.css("font-size", "4px");
  for (let y=-10; y<10; y++) {
    let row = $("<tr>");
    for (let x=-20; x<20; x++) {
      // Draw player on center
      let absolute_position = [x+player.position[0], + y+player.position[1]];
      if (environment.getShopOnTile(absolute_position)) {
        row.append($('<td>').text(map.custom_tiles.shop.symbol).css("color", map.custom_tiles.shop.style));
        continue;
      }
      if (environment.getNpcOnTile(absolute_position)) {
        row.append($('<td>').text(map.custom_tiles.npc.symbol).css("color", map.custom_tiles.npc.color));
        continue;
      }
      let world_tile = map.getTile(absolute_position);
      row.append($('<td>').text(world_tile.symbol).css("color", world_tile.style));
    }
    table.append(row);
  }
  mapInfo = "<br>";
  $(Terminal.selector.hud_main).html(table.html() + mapInfo);
}

UI.prototype.drawMap = function(map) {
  this.drawFullMap(map);
}

// Return
UI.prototype.resumeDisplay = function() {
  switch (currentDisplay) {
    case "SHOP": this.drawShowWindow(); break;
    case "MAP": this.drawMap(environment.map); break;
    case "STATS": this.drawStatsWindow(); break;
    case "INVENTORY": this.drawInventoryWindow(); break;
    default: Terminal.resetGameInfo();
  }
}

UI.prototype.drawShopWindow = function() {
  let inventory = $("<ul>");
  let shop = environment.getShopOnTile(player.position);
  if (shop == null) { $(Terminal.selector.hud_main).html("There's no shop here."); return; }
  for (let i = 0; i<shop.max_stock; i++) {
    if (i >= shop.inventory.length) {
      inventory.append($("<li>").html("Out of stock!<br>&nbsp;&nbsp;Please visit later."));
    } else {
      inventory.append($("<li>").html(`${shop.inventory[i].name}<br>&nbsp;&nbsp;Price:&nbsp;${shop.inventory[i].cost} gold.`));
    }
  }
  $(Terminal.selector.hud_main).html("<h3>" + shop.name + "</h3><ul>" + inventory.html() + "</ul><br><br>" + `You have: ${player.gold} gold.`);
}

// Print player stats
UI.prototype.drawStatsWindow = function() {
  let statList = $('<ul>');
	statList.append($('<li>').text(`Name: ${player.name}`));
	statList.append($('<li>').text(`Race: ${player.race.name}`));
	statList.append($('<li>').text(`Class: ${player.archetype.name}`));
	statList.append($('<li>').text(`Level: ${player.level}`));
	statList.append($('<li>').text(`Exp Needed: ${player.experience_needed}`));
	statList.append($('<li>').text(`Gold: ${player.gold}`));
	statList.append($('<li>').text(`Health: ${player.hp.now}/${player.hp.max}`));
  statList.append($('<li>').text(`Power: ${player.combat_stats.power}`));
  statList.append($('<li>').text(`Vitality: ${player.combat_stats.vitality}`));
  statList.append($('<li>').text(`Resilience: ${player.combat_stats.resilience}`));
  statList.append($('<li>').text(`Dexterity: ${player.combat_stats.dexterity}`));
  statList.append($('<li>').text(`Spirit: ${player.combat_stats.spirit}`));
  statList.append($('<li>').text(`Luck: ${player.combat_stats.luck}`));
	statList.append($('<li>').text("Location: " + player.position.toCoordinateString()));
	$(Terminal.selector.hud_main).html("<h3>Player Stats<br><ul>"+statList.html()+"</ul></h3>");
}

// Display the invPage-nth page of the Player's inventory
UI.prototype.drawInventoryWindow = function(invPage) {
  if (typeof invPage === "undefined") { invPage = 1; }
  let display = "<h3>Player Inventory</h3>";
  let invList = $('<ul>');
  if (player.inventory.length == 0) {
    invList.append($("<li>").html("You've got nothing!"));
  }
  // Display 6 items per inventory page
  let page_offset = (invPage-1)*5;
	for (let i = 0; page_offset+i<player.inventory.length && i<6; i++) {
		let page_index = page_offset+i;
    invList.append($('<li>').html(player.inventory[page_index].name + "<br>   " + toString(player.inventory[page_index])));
	}
  display += invList[0].outerHTML;
  $(Terminal.selector.hud_main).html(display);
}

// Display all items the user currently has equippedd
UI.prototype.drawEquippedWindow = function() {
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
      let item_name = "<i>None</i>";
      if (equip_slots[i]) {
        item_name = equip_slots[i].name
      }
      equipList.append($('<li>').html(i + ":" + padding.substr(0, 8-i.length).replace(/ /g, '&nbsp;') + item_name));
    }
  }
	$(Terminal.selector.hud_main).html("<h3>Equipped Items</h3><ul>" + equipList.html());
}

UI.prototype.drawNpcDialogue = function() {
  const npc = environment.getNpcOnTile(player.position);
  $(Terminal.selector.hud_main).html(`<h3>${npc.name} says:</h3><br><br>${npc.quest.description}`);
}

UI.prototype.drawNpcInfo = function(npcData) {
  var statList = $('<ul>');
  for (var i in npcData.list) {
    statList.append($('<li>').text(i + ": " + npcData.list[i]));
  }
  var gameText = "Stats<br><ul>"+statList.html()+"</ul>";
  if (npcData.display !== undefined) {
    gameText += "<br><i>"+npcData.display['Description']+"</i>";
  }
  $(Terminal.selector.hud_main).html("<h3>"+gameText+"</h3>");
}

UI.prototype.drawDefaultView = function() {
  const default_logo =
	"<h3><pre>                    _   _\n _ __ _ __   __ _  | |_| |__   ___   _ __ _ __   __ _ \n| '__| '_ \\ / _` | | __| '_ \\ / _ \\ | '__| '_ \\ / _` |\n| |  | |_) | (_| | | |_| | | |  __/ | |  | |_) | (_| |\n|_|  | .__/ \\__, |  \\__|_| |_|\\___| |_|  | .__/ \\__, |\n     |_|    |___/                        |_|    |___/ \n</pre></h3>"
	$(Terminal.selector.hud_main).animate({opacity: "0%"}, 100, "linear", () => {
    $(Terminal.selector.hud_main).html(default_logo);
    $(Terminal.selector.hud_main).animate({opacity: "100%"}, 2000, "linear");
  })
}

UI.prototype.drawTombstone = function() {
  const tombstone =
  "<h3><pre>              __.....__\n            .'         ':,\n           /  __  _  __  \\\\\n           | |_)) || |_))||\n           | | \\\\ || |   ||\n           |             ||   _,\n           |             ||.-(_{}\n           |             |/    `\n           |        ,_ (\\;|/)\n         \\\\|       {}_)-,||`\n         \\\\;/,,;;;;;;;,\\\\|//,\n        .;;;;;;;;;;;;;;;;,\n       \\,;;;;;;;;;;;;;;;;,//\n      \\\\;;;;;;;;;;;;;;;;,//\n     ,\\';;;;;;;;;;;;;;;;'\n    ,;;;;;;;;;;;;;;;;''`\n</pre></h3>";
  $(Terminal.selector.hud_main).animate({opacity: "0%"}, 100, "linear", () => {
    $(Terminal.selector.hud_main).html(tombstone);
    $(Terminal.selector.hud_main).animate({opacity: "100%"}, 2000, "linear");
  })
}
