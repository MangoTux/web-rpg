class Combat_UI {
  static selector = "#hud_combat";
  static page_limit = 5;
  static current_page = 1;
  // Full list of options for the current view
  static active_list = [];
  // this.page_limit elements that can be selected
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

  // Converts the current page + index to the "true" inventory offset
  static _pageOffset(index) {
    return this.page_limit * (this.current_page-1) + index;
  }

  static pageForward() {
    this.current_page++;
    this.updateView();
  }

  static pagePrevious() {
    this.current_page--;
    this.updateView();
  }

  static get previous_text() {
    this.can_page_previous = this.current_page > 1;
    return `<li class='navigation-item__previous ${this.can_page_previous ? '' : 'inactive'}'><strong>Previous</strong></li>`;
  }

  static get forward_text() {
    this.can_page_advance = (this.current_page < Math.ceil(this.active_list.length / this.page_limit));
    return `<li class='navigation-item__forward ${this.can_page_advance ? '' : 'inactive'}'><strong>Next</strong></li>`;
  }

  static _drawList(title, contents, navigator) {
    $(Terminal.selector.hud_combat).html(
      `<h2>${title}</h2>
      <br>
      <ol class='combat-list__selection'>
      ${contents}
      </ol>
      <ol class='combat-list__navigation' start='8'>
      ${navigator}
      </ol>
      <br>
      <ol class='combat-list__back'><li><strong>Go Back</strong></li></ol>`
    );
  }

  static drawItemList() {
    // Gets a count of each item's duplicates (e.g ["Bread", "Bread"] => {"Bread": 2})
    const item_map = (list) => { return list.reduce(function(prev, cur) { prev[cur.name] = (prev[cur.name] || 0) + 1; return prev; }, {}) }
    // Key-based duplicate removal
    const remove_duplicates = (list) => { return list.filter((a, i, s) => i === s.findIndex(t => t.name === a.name)) }
    let ui_instance = $("<ol>");
    this.active_list = player.consumable_list.sort();
    let list_map = item_map(this.active_list);
    this.active_list = remove_duplicates(this.active_list);

    this.current_page = this.current_page.clamp(1, Math.ceil(this.active_list.length / this.page_limit));
    for (let i=0; i<this.page_limit && this._pageOffset(i) < this.active_list.length; i++) {
      const offset = this._pageOffset(i);
      const text = `<strong>${this.active_list[offset].name}</strong> (x${list_map[this.active_list[offset].name]})<br>${this.active_list[offset].description}<br>`;
      ui_instance.append($("<li>").html(text));
      this.active_elements[i+1] = this.active_list[offset].id;
    }
    let page_navigator = this.previous_text + this.forward_text;
    this._drawList("Useable Items", ui_instance.html(), page_navigator);
  }

  static drawAttackList() {
    let ui_instance = $("<ul>");
    this.active_list = player.archetype.actions
      .filter(id => player.level >= ActionCatalog.catalog[id].minimum_level);
    this.current_page = this.current_page.clamp(1, Math.ceil(this.active_list.length / this.page_limit));
    for (let i=0; i<this.page_limit && this._pageOffset(i) < this.active_list.length; i++) {
      const offset = this._pageOffset(i);
      const action = ActionCatalog.catalog[this.active_list[offset]];
      const text = `<strong>${action.name}</strong>`;
      ui_instance.append($("<li>").html(text));
      this.active_elements[i+1] = this.active_list[offset];
    }
    let page_navigator = this.previous_text + this.forward_text;
    this._drawList("Actions", ui_instance.html(), page_navigator);
  }

  // For right now, this assumes that all actions can only target enemies.
  static drawTargetList() {let ui_instance = $("<ul>");
    this.active_list = environment.encounter.combat.enemy_list
      .slice();
    this.current_page = this.current_page.clamp(1, Math.ceil(this.active_list.length / this.page_limit));
    for (let i=0; i<this.page_limit && this._pageOffset(i) < this.active_list.length; i++) {
      const offset = this._pageOffset(i);
      const text = `<strong>${this.active_list[offset].name}</strong>`;
      ui_instance.append($("<li>").html(text));
      this.active_elements[i+1] = this.active_list[offset].uid;
    }
    let page_navigator = this.previous_text + this.forward_text;
    this._drawList("Targets", ui_instance.html(), page_navigator);
  }

  static drawRestore(entity, bundle) {
    let text = "";
    if (bundle.buffer) {
      text = `<br><br><b class='combat__healing'>Buffer!</b><br><b class='combat__healing'>${bundle.buffer}</b>`;
    } else {
      text = `<br><br><b class='combat__healing'>Healed!</b><br><b class='combat__healing'>+${bundle.restore}</b>`;
    }
    $("#combat_center")
    .html(text)
    .show()
    .effect({
      effect: "puff",
      duration: 1000,
      complete: () => {
        $(`#${entity.uid}>.combat_hp`).effect("shake",
          {
            direction: "up",
            distance: 10,
            times: 1
          },
          750,
          () => {
            environment.encounter.combat.updateMainHUD();
          }
        );
      }
    });
  }

  static drawDamage(entity, bundle, entity_removed) {
    console.log(entity.uid);
    const text = `<br><br><b class='combat__damage'>Hit!</b><br><b class='combat__damage'>-${bundle.damage}</b>`;

    $("#combat_center")
    .html(text)
    .show()
    .effect({
      effect: "puff",
      duration: 1000,
      complete: () => {
        environment.encounter.combat.updateMainHUD();
      }
    });

    $(`#${entity.uid}>.combat_hp`)
    .delay(250)
    .effect(
      "shake",
      {
        direction: "left",
        distance: 20,
        times: 2
      },
      500,
      () => {
        entity_removed && this.drawRemove(entity.uid);
      }
    );
  }

  static drawMiss() {
    let text = `<br><br><b class='combat_miss'>Miss!</b>`;
    $("#combat_center")
    .html(text)
    .show()
    .effect("puff", 1000);
  }

  static drawRemove(uid) {
    $(`#${uid}`).stop().effect(
      "pulsate",
      {
        times: 1,
      },
      5000,
      () => {
        environment.encounter.combat.updateMainHUD();
      }
    );
  }
}
