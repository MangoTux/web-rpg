function Terrain(detail)
{
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
	this.minValue = 1025;
	this.maxValue = -1025;
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
          square(x, y, half, getRandomInt(-450, 450));
        } else {
          square(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
    }
    for (y = 0; y <= self.max; y += half)
		{
      for (x = (y + half) % size; x <= self.max; x += size)
			{
        if (x == 256 && y == 256)
        {
          square(x, y, half, getRandomInt(-150, 150));
        } else {
				  diamond(x, y, half, Math.random() * scale * 2 - scale);
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
  this.elevation = new Terrain(9); // 2^n + 1 tiles
  this.rainfall = new Terrain(9);
  this.elevation.generate(1);
  this.rainfall.generate(1);
  for (var i=0; i<this.elevation.size; i++)
  {
    for (var j=0; j<this.elevation.size; j++)
    {
      this.elevation.set(i, j, scale(this.elevation, i, j));
      this.rainfall.set(i, j, scale(this.rainfall, i, j));
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
  /*
  Create a probability map: 100% probability of water where > 512 or < 0 for X or Y,
  */
  if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > 255)
  {
    return {style:"#134FCB",symbol:"N",type:"W"};
  }
  x += 256;
  y += 256;
  elevationVal = this.elevation.get(x, y);
  rainVal = this.rainfall.get(x, y);
  return this.biomeMap[elevationVal][rainVal];
}

Map.prototype.canMove = function(x, y)
{
  var tile = this.getTile(x, y);
  if (tile.type == undefined)
  {
    return {canMove:true}
  } else {
    if (tile.type == "W")
    {
      for (var i in player.inventory)
      {
        if (player.inventory[i].purpose_c == "waterTravel")
          return {canMove:true};
      }
    }
    // TODO check if inventory has boat;
    return {canMove:false, reason:tile.type};
  }
}
