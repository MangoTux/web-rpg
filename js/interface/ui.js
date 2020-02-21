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
  let height_radius = 10;
  let width_radius = 20;
  table.css("line-height", "4px");
  table.css("font-size", "4px");
  for (let y=-height_radius; y<height_radius; y++) {
    let row = $("<tr>");
    for (let x=-width_radius; x<width_radius; x++) {
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
  $(Terminal.selector.hud_main).html(`<table>${table.html()}</table>${mapInfo}`);
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
  statList.append($('<li>').text(`Power: ${player.get_stat("power")}`));
  statList.append($('<li>').text(`Resilience: ${player.get_stat("resilience")}`));
  statList.append($('<li>').text(`Dexterity: ${player.get_stat("dexterity")}`));
  statList.append($('<li>').text(`Spirit: ${player.get_stat("spirit")}`));
  statList.append($('<li>').text(`Luck: ${player.get_stat("luck")}`));
	statList.append($('<li>').text("Location: " + player.position.toCoordinateString()));
	$(Terminal.selector.hud_main).html("<h3>Player Stats<br><ul>"+statList.html()+"</ul></h3>");
}

// Display the invPage-nth page of the Player's inventory
UI.prototype.drawInventoryWindow = function(inv_page) {
  if (typeof inv_page === "undefined") { inv_page = 1; }
  let max_page = Math.ceil(player.inventory.length / 6);
  if (inv_page >= max_page) { inv_page = max_page }
  let display = "<h3>Player Inventory</h3><br>";
  let inv_list = $('<ul>');
  if (player.inventory.length == 0) {
    inv_list.append($("<li>").html("You've got nothing!"));
  }
  // Display 6 items per inventory page
  let page_offset = (inv_page-1)*5;
  player.inventory.forEach((item, index) => {
    if (index < page_offset || index >= page_offset + 6) { return; }
    let page_index = page_offset+i;
    inv_list.append($('<li>').html("<strong>"+player.inventory[page_index].name + "</strong><br>&nbsp;&nbsp;" + player.inventory[page_index].toString()));
  });
  display += inv_list[0].outerHTML;
  display += `<br>Page ${inv_page} of ${max_page}`;
  $(Terminal.selector.hud_main).html(display);
}

// Display all items the user currently has equippedd
UI.prototype.drawEquippedWindow = function() {
  let equip_list = $('<ul>');
  let padding = "        ";
  let equip_slots = {'Head': null, 'Neck': null, 'Chest': null, 'Arms': null, 'Legs': null, 'Feet': null, 'Weapon': null};
  player.wielding.forEach(item => {
    if (item.category == "weapon") {
      equip_slots['Weapon'] = item;
      return;
    }
    let region = "";
    switch (item.base_item.region) {
      case Item.region.head: region = 'Head'; break;
      case Item.region.neck: region = 'Neck'; break;
      case Item.region.chest: region = 'Chest'; break;
      case Item.region.arms: region = 'Arms'; break;
      case Item.region.legs: region = 'Legs'; break;
      case Item.region.feet: region = 'Feet'; break;
    }
    equip_slots[region] = item;
  });
  Object.keys(equip_slots).forEach(key => {
    let item_name = (equip_slots[key] === null) ? "<i>None</i>" : equip_slots[key].name;
    let listing = key + ":" + padding.substr(0, 8-key.length).replace(/ /g, '&nbsp;') + item_name;
    equip_list.append($('<li>').html(listing));
  })
	$(Terminal.selector.hud_main).html("<h3>Equipped Items</h3><ul>" + equip_list.html() + "</ul>");
}

UI.prototype.drawNpcDialogue = function() {
  const npc = environment.getNpcOnTile(player.position);
  $(Terminal.selector.hud_main).html(`<h3>${npc.name} says:</h3><br><br>${npc.quest.description}`);
}

UI.prototype.drawNpcInfo = function(npc_list) {
  let full_text = "<strong>Inspect</strong><br>";
  npc_list.forEach((npc) => {
    full_text += `<br>${npc.name}`;
    let $stats = $('<ul>');
    Object.keys(npc.listable).forEach(key => {
      $stats.append($('<li>').text(npc.listable[key]));
    });
    full_text += `<br><ul>${$stats.html()}</ul>`
  });
  $(Terminal.selector.hud_main).html("<h3>"+full_text+"</h3>");
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
