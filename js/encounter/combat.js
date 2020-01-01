class Combat {
  ally_list = [];
  enemy_list = [];
  participants = {};
  // Generate the full turn order at the start of each round
  initiative = [];
  turn_count = 0;
  // The timeout callback handler for AI turns, so it doesn't happen ASAP
  ai_timeout;

  constructor() {
    this.ally_list = [ player ];
    this.participants[player.uuid] = {
      side: "ally",
      entity: player,
      active_effects: [],
    };
  }

  versus(list) {
    // Building like this will allow for development on targeting, so your list of targets matches
    this.enemy_list = list;
    list.forEach((npc, element) => {
      this.participants[npc.uuid] = {
        side: "enemy",
        entity: npc,
        active_effects: [],
        ai: null, // Aggressive always attacks, Defeatist tries to run after 50%, Lucky rolls the dice
      };
    });
  }

  updateMainHUD() {
    // Main HUD will show player and enemy(s) name/HP
    document.querySelector(Terminal.selector.hud_main).classList.add(Terminal.selector.combat.wrapper);

    document.querySelector(Terminal.selector.hud_main).innerHTML =
`<div id="${Terminal.selector.combat.ally}">
</div>
<div id="${Terminal.selector.combat.center}">
</div>
<div id="${Terminal.selector.combat.enemy}">
</div>`;

    this.ally_list.forEach((ally) => {
    document.querySelector(`#${Terminal.selector.combat.ally}`).innerHTML +=
`
<span class='container_ally' id='${ally.uuid}'>
  <h2 class='${Terminal.selector.combat.name}'>${ally.name}</h2>
  <h4 class='${Terminal.selector.combat.hp.wrapper}'>
    <span class='${Terminal.selector.combat.hp.now}'>${ally.hp.now}</span> /
    <span class='${Terminal.selector.combat.hp.max}'>${ally.hp.max}</span>
  </h4>
</span>
`;
    });

    this.enemy_list.forEach((enemy) => {
      document.querySelector(`#${Terminal.selector.combat.enemy}`).innerHTML +=
`
<span class='container_enemy' id='${enemy.uuid}'>
  <h2 class='${Terminal.selector.combat.name}'>${enemy.name}</h2>
  <h4 class='${Terminal.selector.combat.hp.wrapper}'>
    <span class='${Terminal.selector.combat.hp.now}'>${enemy.hp.now}</span> /
    <span class='${Terminal.selector.combat.hp.max}'>${enemy.hp.max}</span>
  </h4>
</span>
`;
    });

    /*
    hud_main will show player status, enemy status, (initiative?)
    hud_combat will show move and targeting selection options (when available)
    */
  }

  updateCombatHUD() {

  }

  updateDisplay() {
    this.updateMainHUD();
    this.updateCombatHUD();
  }

  updateInitiative() {

  }
  /*
  A turn is composed of the following steps:
  - Start
  (Resolve onStart active effects)
  - Choose Action
  - Choose Target(s) (If applicable)
  - Resolve Action Against Targets
    - After each component, check that target is still a participant
  - End
  (Resolve onEnd active effects)
  */
}
