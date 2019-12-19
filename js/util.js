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

// TODO Save State Management
// - Player
// - Map
// - Shops
