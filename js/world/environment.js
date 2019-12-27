class Environment {
  map;
  shops;
  npcs;

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
    this.populateRegion([-250, 250], [-250, 250]);
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
    // Not amazing
    return (getRandomInt(0, 100) < 10);
  }

  // Returns null if no shops are on the position
  getShopOnTile(position) {
    return this.shops.get(...position);
  }

  getNpcOnTile(position) {
    return this.npcs.get(...position);
  }
}
