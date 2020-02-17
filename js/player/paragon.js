class Paragon {
  actions = [];
  features = [];
  stat_base = {};
  archetype_source = null;

  constructor() {

  }

  get name() {
    return this.name;
  }
}

class Champion extends Paragon {
  name = "Champion";
  archetype_source = "Warrior";
  stat_base = {
    power: 155,
    vitality: 100,
    dexterity: 45,
    resilience: 60,
    spirit: 25,
    luck: 2,
  }
}
class Thief extends Paragon {
  name = "Thief";
  archetype_source = "Warrior";
  stat_base = {
    power: 100,
    vitality: 55,
    dexterity: 130,
    resilience: 80,
    spirit: 20,
    luck: 7,
  }
}

class Hunter extends Paragon {
  name = "Champion";
  archetype_source = "Ranger";
  stat_base = {
    power: 85,
    vitality: 45,
    dexterity: 170,
    resilience: 110,
    spirit: 55,
    luck: 5,
  }
}
class Druid extends Paragon {
  name = "Champion";
  archetype_source = "Ranger";
  stat_base = {
    power: 80,
    vitality: 50,
    dexterity: 110,
    resilience: 30,
    spirit: 115,
    luck: 3,
  }
}

class Elementalist extends Paragon {
  name = "Elementalist";
  archetype_source = "Mage";
  stat_base = {
    power: 25,
    vitality: 25,
    dexterity: 75,
    resilience: 55,
    spirit: 215,
    luck: 1,
  }
}
class Necromancer extends Paragon {
  name = "Necromancer";
  archetype_source = "Mage";
  stat_base = {
    power: 20,
    vitality: 55,
    dexterity: 65,
    resilience: 85,
    spirit: 170,
    luck: 1,
  }
}

class Priest extends Paragon {
  name = "Priest";
  archetype_source = "Monk";
  stat_base = {
    power: 115,
    vitality: 80,
    dexterity: 95,
    resilience: 55,
    spirit: 50,
    luck: 8,
  }
}
class Sage extends Paragon {
  name = "Sage";
  archetype_source = "Monk";
  stat_base = {
    power: 100,
    vitality: 60,
    dexterity: 120,
    resilience: 30,
    spirit: 85,
    luck: 12,
  }
}
