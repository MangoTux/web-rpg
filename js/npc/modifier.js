specialModifiers = [
  {
    nameModifier: "Giant %",
    damageModifier:4,
		attackSpeed:1,
    defenseModifier:2,
    luckModifier:0,
    hpModifier:0.5,
    rewardModifier:6
  },
  {
    nameModifier: "Tiny %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:0.5,
    luckModifier:0,
    hpModifier:2,
    rewardModifier:0.25
  },
  {
    nameModifier: "Puny %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:2,
    luckModifier:4,
    hpModifier:1,
    rewardModifier:1
  },
  {
    nameModifier: "Trash %",
    damageModifier:0.5,
		attackSpeed:1,
    defenseModifier:0.6,
    luckModifier:0,
    hpModifier:0.5,
    rewardModifier:0
  },
  {
    nameModifier: "Collosal %",
    damageModifier:10,
		attackSpeed:1,
    luckModifier:0,
    defenseModifier:10,
    hpModifier:2,
    rewardModifier:100
  },
  {
    nameModifier: "Quick %",
    damageModifier:.3,
		attackSpeed:2,
    luckModifier:5,
    defenseModifier:2,
    hpModifier:.9,
    rewardModifier:2
  },
  {
    nameModifier: "Slow %",
    damageModifier:1,
		attackSpeed:0.5,
    luckModifier:0,
    defenseModifier:0.5,
    hpModifier:2,
    rewardModifier:0.25
  },
  {
    nameModifier: "King of the %s",
    damageModifier: 4,
		attackSpeed:1,
    luckModifier: 0,
    defenseModifier: 2,
    hpModifier:5,
    rewardModifier:100
  },
  {
    nameModifier: "Queen of the %s",
    damageModifier: 3,
		attackSpeed:1,
    luckModifier:4,
    defenseModifier:0,
    hpModifier:1,
    rewardModifier:100
  }
];

class NPC_Modifier {
  name;
  damage_factor;
  damage_delta;
  luck_factor;
  luck_delta;
  health_factor;
  health_delta;
  reward_factor;
  constructor() {}

  get damage() {
    return {
      factor: (typeof this.damage_delta !== "undefined") ? this.damage_factor : 1,
      delta: (typeof this.damage_delta !== "undefined") ? this.damage_delta : 0
    };
  }
  get luck() {
    return {
      factor: (typeof this.luck_delta !== "undefined") ? this.luck_factor : 1,
      delta: (typeof this.luck_delta !== "undefined") ? this.luck_delta : 0
    };
  }
  get defense() {
    return {
      factor: (typeof this.defense_delta !== "undefined") ? this.defense_factor : 1,
      delta: (typeof this.defense_delta !== "undefined") ? this.defense_delta : 0
    };
  }
  get health() {
    return {
      factor: (typeof this.health_delta !== "undefined") ? this.health_factor : 1,
      delta: (typeof this.health_delta !== "undefined") ? this.health_delta : 0
    };
  }
}

// const instead
class Giant_Mod extends NPC_Modifier {
  constructor() {
    super();
    this.name = "Giant %",
    this.damage_factor = 4;
    this.luck_factor = 0;
    this.health_delta = 50;
    this.reward_factor = 6;
  }
}

class Tiny_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Puny_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Trash_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Collosal_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Quick_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Slow_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Kind_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}

class Queen_Mod extends NPC_Modifier {
  constructor() {
    super();
  }
}
