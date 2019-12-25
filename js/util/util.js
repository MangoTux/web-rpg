Object.defineProperty(Array.prototype, "containsKey", {
  enumerable: false,
  value: function(obj) {
    for (let key in this) { if (key == obj) { return true; } return false; }
  }
});

Array.prototype.getIndexFromPattern = function(selection) {
  let selection_index = null;
  for (let i in this) {
    if (this[i].name.toLowerCase().indexOf(selection) == -1) {
      continue;
    }
    if (selection_index != null) {
      return -1;
    }
    selection_index = i;
  }
  return selection_index;
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max-min+1)) + min;
const randomChoice = (list) => list[getRandomInt(0, list.length-1)];


//Used for generating random names
var Mdict = function()
{
	this.d = [];

	this.getItem = function(key) { if (key in this.d) { return this.d[key]; } }
	// Adds or appends the given suffix to the prefix in the list
	this.addKey = function(pref, suff) { if (pref in this.d) { this.d[pref].push(suff); } else { this.d[pref] = [suff]; } }

	this.getSuffix = function(prefix) { return randomChoice(this.d[prefix]); }
}
//Used for generating random names
var MName = function()
{
	this.chainLen = 2;
	this.mcd = new Mdict()
	var s;
	for (p in namingTemplate)
	{
		s = "  " + namingTemplate[p];
		for (var i = 0; i<namingTemplate[p].length; i++)
			this.mcd.addKey(s.substring(i, i+this.chainLen), s.charAt(i+this.chainLen));
		this.mcd.addKey(s.substring(namingTemplate[p].length, namingTemplate[p].length+this.chainLen), "\n");
	}

	this.New = function()
	{
		var prefix = "  ";
		var name = "";
		var suffix = "";
		while (true) {
			suffix = this.mcd.getSuffix(prefix);
			if (suffix == "\n" || name.length > 9)
				break;
			else
			{
				name += suffix;
				prefix = prefix.charAt(1) + suffix;
			}
		}
		return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize name
	}
}
//Given a list of key/value pairs, returns a random key from list
function randomKey(obj) {
    let ret;
    let c = 0;
    for (let key in obj) {
      if (Math.random() < 1/++c) {
        ret = key;
      }
    }
    return ret;
}
