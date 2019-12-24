class Action { // lawsuit
  id;
  name;
  description;
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Attack extends Action {
  damage_bounds;
  accuracy;
  minimum_level;
  total_hits; // Eh.
  target;

  constructor(name, description, details) {
    super(name, description);
  }

  setTarget(target) {
    this.target = null;
  }

  // Events that will fire and are optionally built
  onStart() {}

  onBeforeHit() {}

  onHit() {}

  onCritical() {}

  onDamage() {}

  onMiss() {}

  onKill() {}

  onEnd() {}

  cleanup() { this.target = null; }
  
  getDamageBounds() {
    return this.damage_bounds.map(i => typeof i === "function" ? i():i);
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
