class Combat_UI {
  static selector = "#hud_combat";
  static page_limit = 5;
  static current_page = 1;
  static active_elements = {};

  static setView(view) {
    this.active_view = view;
  }

  static updateView() {
    this.can_page_previous = false;
    this.can_page_advance = false;
    this.active_elements = {};
    switch (this.active_view) {
      case "item": this.drawItemList(); break;
      case "attack": this.drawAttackList(); break;
      case "target": this.drawTargetList(); break;
      default: $(Terminal.selector.hud_combat).html('');
    }
  }

  static pageForward() {
    this.current_page++;
    this.updateView();
  }

  static pagePrevious() {
    this.current_page--;
    this.updateView();
  }

  static drawItemList() {
    // Converts the current page + index to the "true" inventory offset
    const page_offset = (index) => { return this.page_limit * (this.current_page-1) + index; }
    // Gets a count of each item's duplicates (e.g ["Bread", "Bread"] => {"Bread": 2})
    const item_map = (list) => { return list.reduce(function(prev, cur) { prev[cur.name] = (prev[cur.name] || 0) + 1; return prev; }, {}) }
    // Key-based duplicate removal
    const remove_duplicates = (list) => { return list.filter((a, i, s) => i === s.findIndex(t => t.name === a.name)) }
    let ui_instance = $("<ol>");
    let list = player.inventory
      .filter(item => item.category == "consumable")
      .sort();
    let list_map = item_map(list);
    list = remove_duplicates(list);

    this.current_page = this.current_page.clamp(1, Math.ceil(list.length / this.page_limit));
    for (let i=0; i<this.page_limit && page_offset(i) < list.length; i++) {
      const offset = page_offset(i);
      const text = `<strong>${list[offset].name}</strong> (x${list_map[list[offset].name]})<br>${list[offset].description}<br>`;
      ui_instance.append($("<li>").html(text));
      this.active_elements[i+1] = list[offset].id;
    }
    let page_navigator = "";
    if (this.current_page > 1) {
      this.can_page_previous = true;
      page_navigator += "<br>(8) <strong>Previous</strong>";
    }
    if (this.current_page < Math.ceil(list.length / this.page_limit)) {
      this.can_page_advance = true;
      page_navigator += "<br>(9) <strong>Next</strong>";
    }
    $(Terminal.selector.hud_combat).html(
      "<h2>Useable Items</h2>" +
      "<br>" +
      "<ol class='combat-list__inventory'>"+ui_instance.html()+"</ol>" +
      page_navigator
    );
  }

  static drawAttackList() {
    let ui_instance = $("<ul>");
    let list = player.archetype.actions
      .filter(id => player.level >= ActionCatalog.catalog[id].minimum_level);
    // Display 6*page through 6*page+5

  }

  static drawTargetList() {

  }

  static drawRestore(entity, bundle) {
    let text = "";//<br><br><b class='combat__healing'>Healed!</b><br><b class='combat_healing'>";
    if (bundle.buffer) {
      text = `<br><br><b class='combat__healing'>Buffer!</b><br><b class='combat_healing'>${bundle.buffer}</b>`;
    } else {
      text = `<br><br><b class='combat__healing'>Healed!</b><br><b class='combat_healing'>+${bundle.restore}</b>`;
    }
    console.log(text);
    $("#combat_center")
    .html(text)
    .show()
    .effect("puff", 1000, () => {
      $(`#${entity.uuid}>.combat_name`).effect("shake", {
        direction: "up",
        distance: 10,
        times: 1
      }, 750);
      environment.encounter.combat.updateMainHUD();
    });
  }
}
