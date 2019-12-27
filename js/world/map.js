class Map {
  rng = {
    elevation: null,
    moisture: null,
  };
  scale = {
    elevation: [ 1.00, 0.00, 0.00, 0.00, 0.00, 0.00 ],
    moisture:  [ 1.00, 0.75, 0.33, 0.33, 0.33, 0.50 ]
  };

  biome_map = [
    [{style:"#1F6AFC",symbol:"N",type:"W"}, {style:"#FFF28F",symbol:"-"}, {style:"#FFD258",symbol:"="}, {style:"#FFD258",symbol:"="}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#572316",symbol:"▲"}, {style:"#572316",symbol:"▲"}, {style:"#E8630C",symbol:"~",type:"L"}, {style:"#E8630C",symbol:"~",type:"L"}],
    [{style:"#1F6AFC",symbol:"N",type:"W"}, {style:"#FFF28F",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"^"}, {style:"#7AD467",symbol:"-"}, {style:"#50302B",symbol:"▲"}, {style:"#572316",symbol:"▲"}, {style:"#E8630C",symbol:"~",type:"L"}],
    [{style:"#1F6BFF",symbol:"N",type:"W"}, {style:"#7AD467",symbol:"="}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"-"}, {style:"#7AD467",symbol:"#"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#50302B",symbol:"▲"}, {style:"#50302B",symbol:"▲"}],
    [{style:"#1F6BFF",symbol:"N",type:"W"}, {style:"#7AD467",symbol:"="}, {style:"#4D7F47",symbol:"+"}, {style:"#4D7F47",symbol:"+"}, {style:"#4D7F47",symbol:"#"}, {style:"#4D7F47",symbol:"#"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#50302B",symbol:"▲"}],
    [{style:"#1F6BFF",symbol:"N",type:"W"}, {style:"#4D7F47",symbol:"+"}, {style:"#477542",symbol:"+"}, {style:"#477542",symbol:"+"}, {style:"#4D7F48",symbol:"#"}, {style:"#4D7F47",symbol:"#"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#493432",symbol:"▲"}],
    [{style:"#1750BF",symbol:"N",type:"W"}, {style:"#3A9C2E",symbol:"#"}, {style:"#3A9C2E",symbol:"#"}, {style:"#3A9C2E",symbol:"#"}, {style:"#578F51",symbol:"#"}, {style:"#4D7F47",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#194314",symbol:"^"}, {style:"#43383C",symbol:"▲"}],
    [{style:"#134FCB",symbol:"N",type:"W"}, {style:"#1F6BFF",symbol:"N",type:"W"}, {style:"#2C7523",symbol:"#"}, {style:"#2C7523",symbol:"#"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#43383C",symbol:"▲"}],
    [{style:"#0C317F",symbol:"M",type:"W"}, {style:"#1750BF",symbol:"N",type:"W"}, {style:"#358F2A",symbol:"#"}, {style:"#358F2A",symbol:"#"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#43383C",symbol:"▲"}, {style:"#43383C",symbol:"▲"}],
    [{style:"#0A2765",symbol:"M",type:"W"}, {style:"#1750BF",symbol:"N",type:"W"}, {style:"#1F6BFF",symbol:"N",type:"W"}, {style:"#358F2A",symbol:"#"}, {style:"#2A8F6E",symbol:"^"}, {style:"#2A8F6E",symbol:"^"}, {style:"#43383C",symbol:"▲"}, {style:"#43383C",symbol:"▲"}, {style:"#43383C",symbol:"▲"}, {style:"#43383C",symbol:"▲"}],
    [{style:"#081B40",symbol:"M",type:"W"}, {style:"#1750BF",symbol:"N",type:"W"}, {style:"#26756F",symbol:"≈",type:"W"}, {style:"#3CBCCC",symbol:"≈",type:"W"}, {style:"#3CBCCC",symbol:"~",type:"W"}, {style:"#3CBCCC",symbol:"~",type:"W"}, {style:"#43383C",symbol:"^"}, {style:"#43383C",symbol:"^"}, {style:"#B3D4FF",symbol:"▲"}, {style:"#B3D4FF",symbol:"▲"}]
  ];
  custom_tiles = {
    player: {style:"#FF0095",symbol:"@"},
    shop: {style:"#FFFF00", symbol:"$"},
    npc: {style:"#F3EFE0", symbol:"Q"},
  };

  constructor() {}

  seed(seed) {
    // Generates a unique seed each for the temperature and moisture
    this.detail = 64;
    this.rng.elevation = new SimplexNoise(seed + "_e");
    this.rng.moisture = new SimplexNoise(seed + "_m");
  }

  getScaled2D(style, x, y) {
    let rng = this.rng[style];
    let scale = this.scale[style];
    let value = 0;
    let divisor = 0;
    this.scale[style].forEach((factor, index) => {
      let multiple = Math.pow(2, index);
      value += factor * rng.noise2D(multiple * x / this.detail, multiple * y / this.detail);
      divisor += factor;
    });
    value /= divisor;
    value += 0.5;
    return Math.max(0, Math.min(0.99, value));
  }

  getTileData(position) {
    // These are intentionally flipped, due to not grokking arra
    return {
      moisture: Math.floor(10*this.getScaled2D("moisture", ...position)),
      elevation: Math.floor(10*this.getScaled2D("elevation", ...position))
    };
  }

  getTile(position) {
    let data = this.getTileData(position);
    return this.biome_map[data.moisture][data.elevation];
  }

  getNeighborCoordinates(position) {
    let neighbors = [];
    neighbors.push([position[0]+1, position[1]]);
    neighbors.push([position[0], position[1]+1]);
    neighbors.push([position[0]-1, position[1]]);
    neighbors.push([position[0], position[1]-1]);
    return neighbors;
  }

  canMove(position) {
    let tile = this.getTile(position);
    if (typeof tile.type === "undefined") { return {canMove: true}; }
    if (tile.type == "W" && player.hasWaterTravel()) { return {canMove: true}; }

    return {
      canMove: false,
      reason: tile.type
    };
  }

  static getUnitVectorFromDirection(direction_string) {
    switch (direction_string) {
      case 'north': return [0, -1];
      case 'south': return [0, 1];
      case 'east': return [1, 0];
      case 'west': return [-1, 0];
      case 'northeast': return [-1, -1];
      case 'southeast': return [-1, 1];
      case 'southwest': return [1, 1];
      case 'northwest': return [1, -1];
    }
  }
}
