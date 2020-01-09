class Environment {
  map;
  shops;
  npcs;
  active_encounter;

  constructor() {
    this.map = new Map();
    this.shops = new Hash2D();
    this.npcs = new Hash2D();
  }

  // In the future, create smaller chunks that cache data. When the player exist, boundary, populate anew
  populateRegion(bounds_x, bounds_y) {
    // This might be better suited for a function to populate within a radius
    // If a player wanders outside of the nearest shop, generate new ones
    for (let i = 1; i<500; i++) {
      let position = [getRandomInt(...bounds_x), getRandomInt(...bounds_y)];
      while (this.getShopOnTile(position) != null) {
        position = [getRandomInt(...bounds_x), getRandomInt(...bounds_y)];
      }
      this.shops.push(...position, new Shop());
    }
    for (let i = 1; i<750; i++) {
      let position = [getRandomInt(...bounds_x), getRandomInt(...bounds_y)];
      while (this.getShopOnTile(position) != null && this.getNpcOnTile(position) != null) {
        position = [getRandomInt(...bounds_x), getRandomInt(...bounds_y)];
      }
      this.npcs.push(...position, NPC_Factory.getRandomQuestable());
    }
  }

  load_map() {
    this.map.seed(player.name);
    if (!this.map.canMove(player.position).canMove) {
      player.position = this.findNearestTraversible(player.position);
    }
    this.populateRegion([-1000, 1000], [-1000, 1000]);
  }

  findNearestTraversible(position) {
    // Key storage
    const stringify = (a, b) => a + ":" + b;
    let excluded_types = ["W", "L"];
    let frontier = [];
    let visited = {};
    visited[stringify(...position)] = true;
    frontier.push(position);

    while (frontier.length) {
      let current = frontier.shift();
      let current_tile = this.map.getTile(current);
      if (excluded_types.indexOf(current_tile.type) == -1) {
        return current;
      }
      let neighbors = this.map.getNeighborCoordinates(current);
      neighbors.forEach((element, index) => {
        if (!(stringify(element) in visited)) {
          frontier.push(neighbors[index]);
          visited[stringify(neighbors[index])] = true;
        }
      });
    }
    return position;
  }

  hasEncounter() {
    // Allow one space between encounters
    return player.step_count%2 && getRandomInt(0, 100) < 15;
  }

  createWildEncounter() {
    player.state = state.player.encounter;
    this.encounter = new Encounter();
    this.encounter.generate();

    return this.encounter;
  }

  createNpcEncounter() {
    player.state = state.player.encounter;
    this.encounter = new Encounter();
    this.encounter.enemy_list = [ this.getNpcOnTile(player.position) ];
    // When the combat ends, the NPC can no longer be of service.
    // TODO Remove active quests belonging to this guy and alert?
    this.encounter.on_victory.push(() => {
      this.npcs.pop(...player.position);
    });

    return this.encounter;
  }

  cleanEncounter() {
    // TODO Check for victory, apply on_victory ()
    this.encounter = null;
  }

  // Returns null if no shops are on the position
  getShopOnTile(position) {
    return this.shops.get(...position);
  }

  getNpcOnTile(position) {
    return this.npcs.get(...position);
  }
}
