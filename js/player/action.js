class Action { // lawsuit
  id;
  name;
  description;
  constructor(name, description, minimum_level) {
    this.name = name;
    this.description = description;
    this.minimum_level = minimum_level;
  }
}

class Attack extends Action {
  damage_bounds;
  accuracy;
  total_hits; // Eh.
  source;
  target;
  successful_kill;

  constructor(name, description, minimum_level) {
    super(name, description, minimum_level);
  }

  setSource(source) {
    this.source = source;
  }

  // TODO target is a uid, while source is the object. Consistency.
  setTarget(target) {
    this.target = target;
  }

  // Events that will fire and are optionally built
  onStart() {}

  onBeforeHit() {}

  onHit() {}

  // TODO: Effects like "After scoring a critical, accuracy increases 10% for 5 turns"? Entity-centric
  onCritical() {}

  // TODO: Animations for "Heal 30% of the inflicted damage". Some sort of broadcast?
  onDamage() {}

  onMiss() {}

  onKill() {}

  onEnd() {}

  cleanup() {
    this.target = null;
    this.successful_kill = true;
  }

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
