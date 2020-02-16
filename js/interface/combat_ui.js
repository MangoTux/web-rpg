class Combat_UI {
  static selector = "#hud_combat";
  static page_limit = 5;
  static current_page = 1;
  // Full list of options for the current view
  static active_list = [];
  // this.page_limit elements that can be selected
  static active_elements = {};

  static promises = [];

  static animation_delay(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

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

  static drawMainHUD(ally_list, enemy_list) {
    let active_uid = null;
    if (environment.encounter.combat.active_entity) {
       active_uid = environment.encounter.combat.active_entity.uid;
    }
    if (typeof ally_list === "undefined") {
      ally_list = environment.encounter.combat.ally_list;
    }
    if (typeof enemy_list === "undefined") {
      enemy_list = environment.encounter.combat.enemy_list;
    }
    // Main HUD will show player and enemy(s) name/HP
    document.querySelector(Terminal.selector.hud_main).classList.add(Terminal.selector.combat.wrapper);

    document.querySelector(Terminal.selector.hud_main).innerHTML =
`<div id="${Terminal.selector.combat.ally}">
</div>
<div id="${Terminal.selector.combat.center}">
</div>
<div id="${Terminal.selector.combat.enemy}">
</div>`;

    ally_list.forEach((ally) => {
      let text = `
      <span class='participant_container container_ally' id='${ally.uid}'>
      <span class='participant_info'>
      <h2 class='${Terminal.selector.combat.name} ${ally.uid === active_uid ? 'active_entity':''}'>${ally.name}</h2>
      <h4 class='${Terminal.selector.combat.hp.wrapper}'>
      <span class='${Terminal.selector.combat.hp.now}'>${ally.hp.now}</span> /
      <span class='${Terminal.selector.combat.hp.max}'>${ally.hp.max}</span>`;
      if (ally.hp.buffer > 0) {
        text += `<span class='${Terminal.selector.combat.hp.buffer}'> (+${ally.hp.buffer})</span>`;
      }
      text += `
      </h4>
      </span>
      <span class='wrapper_delta'><span class='participant_delta'></span></span>
      </span>`;
      document.querySelector(`#${Terminal.selector.combat.ally}`).innerHTML += text;
    });

    enemy_list.forEach((enemy) => {
      let text = `
      <span class='participant_container container_enemy' id='${enemy.uid}'>
      <span class='wrapper_delta'><span class='participant_delta'></span></span>
      <span class='participant_info'>
      <h2 class='${Terminal.selector.combat.name} ${enemy.uid === active_uid ? 'active_entity':''}'>${enemy.name}</h2>
      <h4 class='${Terminal.selector.combat.hp.wrapper}'>
      <span class='${Terminal.selector.combat.hp.now}'>${enemy.hp.now}</span> /
      <span class='${Terminal.selector.combat.hp.max}'>${enemy.hp.max}</span>`;
      if (enemy.hp.buffer > 0) {
        text += `<span class='${Terminal.selector.combat.hp.buffer}'> (+${enemy.hp.buffer})</span>`;
      }
      text += `
      </h4>
      </span>
      </span>`;
      document.querySelector(`#${Terminal.selector.combat.enemy}`).innerHTML += text;
    });
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
    // Get available actions based on usages available, required properties, and player level
    this.active_list = player.available_actions;
    this.current_page = this.current_page.clamp(1, Math.ceil(this.active_list.length / this.page_limit));
    for (let i=0; i<this.page_limit && this._pageOffset(i) < this.active_list.length; i++) {
      const offset = this._pageOffset(i);
      const action = ActionCatalog.catalog[this.active_list[offset].id];
      const text = `<strong>${action.name}</strong>`;
      ui_instance.append($("<li>").html(text));
      this.active_elements[i+1] = this.active_list[offset];
    }
    let page_navigator = this.previous_text + this.forward_text;
    this._drawList("Actions", ui_instance.html(), page_navigator);
  }

  // For right now, this assumes that all actions can only target enemies.
  static drawTargetList() {
    let ui_instance = $("<ul>");
    this.active_list = environment.encounter.combat.enemy_list
      .slice()
      .filter(entity => !environment.encounter.combat.action.target.list.includes(entity.uid));
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

  static drawRestore(uid, bundle) {
    let text = "";
    if (bundle.buffer) {
      text = `<br><b class='combat__healing'>${bundle.buffer}</b>`;
    } else {
      text = `<br><b class='combat__healing'>+${bundle.restore}</b>`;
    }
    const restore_time = getRandomInt(850, 1150);
    const hp_shake_delay = getRandomInt(225, 275);
    const hp_shake_time = getRandomInt(450, 550);
    $(`#${uid} .participant_delta`)
    .html(text)
    .show()
    .effect(
      "puff",
      {},
      restore_time,
    );
    $(`#${uid} .combat_hp`)
    .delay(hp_shake_delay)
    .effect(
      "shake",
      {
        direction: "up",
        distance: 10,
        times: 1
      },
      hp_shake_time
    );
    return restore_time;
  }

  static drawDamage(uid, bundle) {
    const damage_time = getRandomInt(800, 1200);
    const hp_shake_time = getRandomInt(450, 550);
    const text = `<br><b class='combat__damage'>-${bundle.damage}</b>`;
    $(`#${uid} .participant_delta`)
    .html(text)
    .show()
    .effect(
      "puff",
      {},
      damage_time,
    );
    $(`#${uid} .combat_hp`)
    .effect(
      "shake",
      {
        direction: "left",
        distance: 15,
        times: 2
      },
      hp_shake_time
    );

    return damage_time;
  }

  static drawMiss(uid) {
    let text = `<br><b class='combat_miss'>Miss!</b>`;
    let miss_time = 1000;
    $(`#${uid} .participant_delta`)
    .html(text)
    .show()
    .effect("puff", miss_time);
    return miss_time;
  }

  static async drawFlee(uid) {
    let flee_time = 1000;
    $(`#${uid}`).effect(
      "pulsate",
      {
        times: 3,
      },
      flee_time,
      () => {
        this.drawMainHUD();
      }
    );
    await this.animation_delay(flee_time);
  }

  static async drawRemove(uid_list) {
    const remove_time = getRandomInt(800, 1200);
    uid_list.forEach(uid => {
      $(`#${uid}`).effect(
        "pulsate",
        {
          times: 3,
        },
        remove_time
      );
    });
    return this.animation_delay(remove_time);
  }

  static async drawEffects(bundle) {
    let wait_times = [];
    this.drawMainHUD();
    Object.keys(bundle).forEach(uid => {
      bundle[uid].forEach(event => {
        if (typeof event.damage !== "undefined") {
          let time = this.drawDamage(uid, event);
          wait_times.push(time);
        }
        if (typeof event.restore !== "undefined" || typeof event.buffer !== "undefined") {
          wait_times.push(this.drawRestore(uid, event));
        }
        if (typeof event.miss !== "undefined") {
          wait_times.push(this.drawMiss(uid, event));
        }
      })
    });
    if (wait_times.length == 0) { return; }

    return this.animation_delay(Math.max(...wait_times));
  }
}
