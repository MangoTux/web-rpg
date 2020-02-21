class Action { // lawsuit
  id;
  name;
  description;
  hooks = {};
  required_properties = [];
  source;
  text;
  combat_quota;

  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.combat_quota = null;
  }

  setSource(source) {
    this.source = source;
  }

  setUseCount(count) {
    this.combat_quota = count;
  }

  get use_count() {
    if (typeof this.combat_quota === "function") { return this.combat_quota(this); }
    return this.combat_quota;
  }

  registerHook(hook, callback) {
    this.hooks[hook] = callback;
  }

  hook(target) {
    if (typeof this.hooks[target] !== "function") { return; }
    this.hooks[target](this);
  }

  cleanup() {}
}

class Attack extends Action {
  attack_type = "power"; // The stat keying power
  damage = {};
  partial_damage = false;
  accuracy;
  hit_count;
  target;

  constructor(name, description) {
    super(name, description);

    this.hit_count = 1;
    this.target = {
      count: 1,
      list: [],
    };
    this.critical_modifier = {
      base: 0,
      current: 0,
    };
  }

  setSource(source) {
    super.setSource(source);
    this.target.list = [];
  }

  setTargetCount(count) {
    this.target.count = count;
  }

  // TODO target is a uid, while source is the object. Consistency.
  addTarget(target_uid) {
    this.target.list.push(target_uid);
  }

  setAttackType(type) {
    this.attack_type = type;
  }

  hasMoreTargets() {
    return (this.target.list.length < this.target.count);
  }

  clearTargets() {
    this.target.list = [];
  }

  requireItemProperty(prop) {
    if (!(prop instanceof Array)) {
      prop = [ prop ];
    }
    this.required_properties = prop;
  }

  setPowerFunction(func) {
    this.damage.type = "function";
    this.damage.function = func;
  }

  // Deprecated
  setDamageBounds(thresh_low, thresh_high) {
    this.damage.type = "bounds";
    this.damage.range = [thresh_low, thresh_high];
  }

  // Deprecated
  setDamageRoll(calc) {
    this.damage.type = "roll";
    this.damage.roll = calc;
  }

  // On a miss/failed save, returns a partial damage calculation for a target
  allowPartialDamage(fraction) {
    this.damage.partial = fraction;
  }

  setAccuracy(accuracy) {
    this.accuracy = {
      base: accuracy,
      current: accuracy
    };
  }

  setCriticalModifier(mod) {
    this.critical_modifier = {
      base: mod,
      current: mod
    };
  }

  setHitCount(count) {
    this.hit_count = count;
  }

  doesHit() {
    return Math.random() <= this.accuracy.current;
  }

  establishBasePower() {
    let base_power;
    if (this.damage.type == "bounds") {
      let bounds = this.damage.range.map(i => typeof i === "function" ? i(this):i);
      base_power = getRandomInt(...bounds);
    } else if (this.damage.type === "roll") {
      base_power = this.damage.roll(this);
    } else if (this.damage.type == "function") {
      base_power = this.damage.function(this);
    }
    this.base_power = base_power;
  }

  getCritical() {
    /*
    // Roll 3d100 and accumulate for each value under this.source.getStat("luck").
    */
    let accumulator = 0;
    for (let i=0; i<3; i++) {
      if (getRandomInt(1, 100) < (this.source.get_stat("luck") + this.critical_modifier.current)) {
        accumulator++;
      }
    }
    switch (accumulator) {
      case 1: return {text: "Critical!", multiplier: 1.5};
      case 2: return {text: "Double Crit!", multiplier: 2};
      case 3: return {text: "Triple Crit!", multiplier: 3};
    }
    return false;
  }

  getDamage(resilience) {
    // TODO Crit details
    let comp_src = (2*this.source.level + 10) / 250;
    let attack_stat = this.source.get_stat(this.attack_type);
    let comp_stat = attack_stat / resilience;

    let modifier = 1.0;

    let damage = (comp_src * comp_stat * this.base_power + 2) * modifier;
    return Math.floor(damage.clamp(1, damage));
  }
}

// One-per-encounter actions
class Ability extends Action {
  constructor(name, description) {
    super(name, description);
  }

  setBehavior(callback) {
    this.resolve_function = callback;
  }

  resolve() {
    this.resolve_function(this);
  }
}

class ActionCatalog {
  static catalog = [];
}
