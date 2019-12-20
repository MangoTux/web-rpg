String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Alea prng, because javascript doesn't allow seeding by default.
// I could have imported P5js, but I didn't want to worry about that much overhead
// for an optimized RNG system that is only for the maps (For now)
function Alea(seed) {
  if(seed === undefined) {seed = +new Date() + Math.random();}
  function Mash() {
    var n = 4022871197;
    return function(r) {
      for(var t, s, u = 0, e = 0.02519603282416938; u < r.length; u++)
      s = r.charCodeAt(u), f = (e * (n += s) - (n*e|0)),
      n = 4294967296 * ((t = f * (e*n|0)) - (t|0)) + (t|0);
      return (n|0) * 2.3283064365386963e-10;
    }
  }
  return function() {
    var m = Mash(), a = m(" "), b = m(" "), c = m(" "), x = 1, y;
    seed = seed.toString(), a -= m(seed), b -= m(seed), c -= m(seed);
    a < 0 && a++, b < 0 && b++, c < 0 && c++;
    return function() {
      var y = x * 2.3283064365386963e-10 + a * 2091639; a = b, b = c;
      return c = y - (x = y|0);
    };
  }();
}

function Terrain(detail, seed)
{
  this.size = Math.pow(2, detail) + 1;
  this.max = this.size - 1;
  this.map = new Float32Array(this.size * this.size);
	this.minValue = 1025;
	this.maxValue = -1025;

  this.randomizer = Alea(seed);
}

Terrain.prototype.get = function(x, y)
{
    if (x < 0 || x > this.max || y < 0 || y > this.max)
		return -1;
    return this.map[x + this.size * y];
};

Terrain.prototype.set = function(x, y, val)
{
	if (val > this.maxValue) this.maxValue = val;
	if (val < this.minValue) this.minValue = val;
    this.map[x + this.size * y] = val;
};

Terrain.prototype.generate = function(roughness)
{
  var self = this;
  this.set(0, 0, self.max);
  this.set(this.max, 0, self.max / 2);
  this.set(this.max, this.max, 0);
  this.set(0, this.max, self.max / 2);
  divide(this.max);
  function divide(size)
	{
		var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;
    for (y = half; y < self.max; y += size)
		{
			for (x = half; x < self.max; x += size)
			{
        if (x == 256 && y == 256) {
          square(x, y, half, (900 * self.randomizer() - 450));
        } else {
          square(x, y, half, self.randomizer() * scale * 2 - scale);
        }
      }
    }
    for (y = 0; y <= self.max; y += half)
		{
      for (x = (y + half) % size; x <= self.max; x += size)
			{
        if (x == 256 && y == 256)
        {
          square(x, y, half, (300 * self.randomizer() - 150));
        } else {
				  diamond(x, y, half, self.randomizer() * scale * 2 - scale);
        }
      }
    }
    divide(size / 2);
  }

  function average(values)
  {
    var valid = values.filter(function(val) { return val !== -1; });
    var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
    return total / valid.length;
  }
  function square(x, y, size, offset)
	{
    var ave = average([
      self.get(x - size, y - size),   // upper left
      self.get(x + size, y - size),   // upper right
      self.get(x + size, y + size),   // lower right
      self.get(x - size, y + size)    // lower left
    ]);
    self.set(x, y, ave + offset);
  }

  function diamond(x, y, size, offset)
	{
    var ave = average([
      self.get(x, y - size),      // top
      self.get(x + size, y),      // right
      self.get(x, y + size),      // bottom
      self.get(x - size, y)       // left
    ]);
    self.set(x, y, ave + offset);
  }
};

function scale(map, x, y)
{
  var val = Math.floor(10*(map.get(x, y)-map.minValue)/(map.maxValue-map.minValue));
	if (val > 9)
		val = 9;
	if (val < 0)
		val = 0;
	return val;
}

function Map(seed)
{
  this.seed = seed;
  noise.seed(seed.hashCode());
  this.elevation = new Terrain(9, seed);
  this.elevation.generate(1);
  for (var i=0; i<this.elevation.size; i++) {
    for (var j=0; j<this.elevation.size; j++) {
      this.elevation.set(i, j, scale(this.elevation, i, j));
    }
  }
  this.biomeMap = [
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
  this.customTiles = {
    player: {style:"#FF0095",symbol:"@"},
    shop: {style:"#FFFF00",symbol:"$"},
    npc: {style:"#F3EFE0",symbol:"Q"}
  }
}

Map.prototype.getTile = function(x, y)
{
  function noisy(x, y) {
    return noise.perlin2(x, y)/2 + 0.5
  }
  var detail = 64;
  var height = this.elevation.get(x+256, y+256);
  var rain = (noisy(x / detail, y / detail) + 0.5 * noisy(2 * x / detail, 2 * y / detail) + 0.25 * noisy(4 * x / detail, 4 * y / detail)) / 1.75;
  rain = Math.floor(10*rain);
  return this.biomeMap[height][rain];
}

Map.prototype.canMove = function(x, y)
{
  var tile = this.getTile(x, y);
  if (tile.type == undefined) {
    return {canMove:true}
  }

  if (tile.type == "W") {
    for (var i in player.inventory)
    {
      if (player.inventory[i].purpose_c == "waterTravel")
        return {canMove:true};
    }
  }
  return {canMove:false, reason:tile.type};
}

Map.prototype.getNeighbors = function(x, y) {
  let neighbors = [];
  neighbors.push([x+1, y]);
  neighbors.push([x, y+1]);
  neighbors.push([x-1, y]);
  neighbors.push([x, y-1]);
  return neighbors;
}

// Simple BFS to find a tile that isn't in the excluded types
Map.prototype.findNearestTraversible = function(x, y)
{
  // Easier way of indexing coordinates
  const stringify = (a, b) => a + ":" + b;
  // Don't walk on water or lava
  let excluded_types = ["W", "L"];
  let frontier = [];
  let visited = {};
  visited[stringify(x, y)] = true;
  frontier.push([x, y]);

  while (frontier.length > 0) {
    let current = frontier.shift();
    let current_tile = this.getTile(...current);
    if (excluded_types.indexOf(current_tile.type) == -1) {
      return current;
    }
    let neighbors = this.getNeighbors(...current);
    neighbors.forEach((element, index) => {
      if (!(stringify(...element) in visited)) {
        frontier.push(neighbors[index]);
        visited[stringify(...neighbors[index])] = true;
      }
    });
  }
  return [x, y];
}

Map.prototype.getUnitVectorFromDirection = function(direction_string) {
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

// A secondary class to handle logic involving map interaction should be created
Map.prototype.hasEncounter = function() {
  return Math.random()<0.15;
}
