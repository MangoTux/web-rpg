class Action { // lawsuit
  id;
  name;
  description;
  hooks = {};
  constructor(name, description, minimum_level) {
    this.name = name;
    this.description = description;
    this.minimum_level = minimum_level;
  }

  registerHook(hook, callback) {
    this.hooks[hook] = callback;
  }

  hook(target) {
    if (typeof this.hooks[target] !== "function") { return; }
    this.hooks[target](this);
  }
}

class Attack extends Action {
  damage;
  partial_damage = false;
  accuracy;
  hit_count;
  source;
  target;

  constructor(name, description, minimum_level) {
    super(name, description, minimum_level);

    this.hit_count = 1;
    this.target = {
      count: 1,
      list: [],
    };
  }

  setSource(source) {
    this.source = source;
    this.target = null;
  }

  setTargetCount(count) {
    this.target.count = count;
  }

  // TODO target is a uid, while source is the object. Consistency.
  addTarget(target_uid) {
    this.target.list.push(target_uid);
  }

  setDamageBounds(thresh_low, thresh_high) {
    this.damage = {
      type: "bounds",
      partial: false,
      range: [thresh_low, thresh_high]
    };
  }

  setDamageRoll(calc) {
    this.damage = {
      type: "roll",
      partial: false,
      roll: calc
    };
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

  cleanup() {}

  getDamage() {
    if (this.damage.type == "bounds") {
      let bounds = this.damage.range.map(i => typeof i === "function" ? i(this):i);
      return getRandomInt(...bounds);
    } else if (this.damage.type === "roll") {
      return this.damage.roll(this);
    }
  }
}

// One-per-encounter actions
class Power extends Action {
  constructor(name, description) {
    super(name, description);
  }
}

class ActionCatalog {
  static catalog = [];
}
