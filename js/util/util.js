Object.defineProperty(Array.prototype, "containsKey", {
  enumerable: false,
  value: function(obj) {
    for (let key in this) { if (key == obj) { return true; } return false; }
  }
});
Number.prototype.clamp = function(min, max) {
  return Math.max(Math.min(this, max), min);
}

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

Array.prototype.toCoordinateString = function() {
  let coord = "";
  if (this[1] > 0) {
		coord = this[1] + "S";
	} else {
		coord = (-1*this[1]) + "N";
  }
	coord += ", "
	if (this[0] >= 0) {
		coord += this[0] + "E";
	} else {
		coord += (-1*this[0]) + "W";
  }
  return coord;
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max-min+1)) + min;
const randomChoice = (list) => list[getRandomInt(0, list.length-1)];
const randomKey = (obj) => {
  let ret, c = 0;
  for (let key in obj) {
    if (Math.random() < 1/++c) {
      ret = key;
    }
  }
  return ret;
};
const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  return keys[keys.length * Math.random() << 0];
}


//Used for generating random names
class Mdict {
	d = [];

	getItem(key) {
    if (key in this.d) {
      return this.d[key];
    }
  }

	// Adds or appends the given suffix to the prefix in the list
	addKey(pref, suff) {
    if (pref in this.d) {
      this.d[pref].push(suff);
    } else {
      this.d[pref] = [suff];
    }
  }

	getSuffix(prefix) {
    return randomChoice(this.d[prefix]);
  }
}
//Used for generating random names
class MName {
	chainLen = 2;
	mcd = new Mdict();

  constructor() {
    let s;
  	for (let p in namingTemplate)	{
  		s = "  " + namingTemplate[p];
  		for (let i = 0; i<namingTemplate[p].length; i++)
  			this.mcd.addKey(s.substring(i, i+this.chainLen), s.charAt(i+this.chainLen));
  		this.mcd.addKey(s.substring(namingTemplate[p].length, namingTemplate[p].length+this.chainLen), "\n");
  	}
  }

	New()	{
		let prefix = "  ";
		let name = "";
		let suffix = "";
		while (true) {
			suffix = this.mcd.getSuffix(prefix);
			if (suffix == "\n" || name.length > 9) { break; }
			name += suffix;
			prefix = prefix.charAt(1) + suffix;
		}
		return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize name
	}
}

const uid = () => "id" + Math.random().toString(16).slice(2);
