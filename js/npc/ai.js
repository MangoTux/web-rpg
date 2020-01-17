// Core behaviors with a "normal" thought process.
class AI {
  allies = [];
  enemies = [];
  constructor(scope) {
    this.scope = scope;
  }

  withParticipants(allies, enemies) {
    this.allies = allies;
    this.enemies = enemies;
    return this;
  }

  // Should only return something that damages
  getAttack() {

  }

  // Should only return something that buffs self or ally
  getBuff() {

  }

  // Should only return something that debuffs an enemy
  getDebuff() {

  }

  // Should only return an item usage
  getItem() {

  }

  getPlan() {
    return {
      plan: 'attack',
      target_id: randomChoice(getRandomInt(0, 100) < 3 ? this.allies : this.enemies).uid,
      action_id: randomChoice(this.scope.actions)
    };
  }
}

// Tries to stuff itself with items until it's above 1/2 HP. If it can't, it runs away.
class DefeatistAI extends AI {
  constructor(scope) {
    super(scope);
  }

  getPlan() {
    if (this.scope.hp.now + this.scope.hp.buffer < this.scope.hp.max / 4) {
      return { plan: 'flee' };
    }
    if (this.scope.hp.now + this.scope.hp.buffer < this.scope.hp.max / 2) {
      if (this.scope.consumable_list.length) {
        return {
          plan: 'item',
          item_id: randomChoice(this.scope.consumable_list)
        };
      } else {
        return { plan: 'flee' };
      }
    }
    return super.getPlan();
  }
}

// A loner has no allies. Also it sometimes has frenemies.
class LonerAI extends AI {
  aggression_level;
  constructor(scope) {
    super(scope);
    this.aggression_level = Math.random();
  }

  withParticipants(allies, enemies) {
    this.allies = [];
    this.enemies = enemies;
    if (this.aggression_level > 0.7) {
      this.enemies = this.enemies.concat(allies);
    }
  }

  getPlan() {
    return {
      plan: 'attack',
      target_id: randomChoice(this.enemies).uid,
      action_id: randomChoice(this.scope.actions)
    };
  }
}

// Has a chance each turn to change sides. This sometimes ends combat (and it steals XP)
class DefectAI extends AI {
  sabotage_level;
  constructor(scope) {
    super(scope);
    this.sabotage_level = Math.random();
    this.current_sabotage = this.sabotage_level;
  }

  getPlan() {
    // The higher the sabotage level, the more likely to defect
    if (Math.random() < this.sabotage_level) {
      this.current_sabotage = this.sabotage_level;
      return { plan: 'defect' };
    }
    // Increase sabotage each turn
    this.current_sabotage *= 1.1;
    return super.getPlan();
  }
}

class AI_Factory {
  static generate(npc) {
    // Should really implement weightedRandom
    switch (getRandomInt(0, 5)) {
      case 0:
      case 1:
      case 2: return new AI(npc);
      case 3: return new DefeatistAI(npc);
      case 4: return new LonerAI(npc);
      case 5: return new DefectAI(npc);
    }
  }
}
