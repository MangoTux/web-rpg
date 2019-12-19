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
