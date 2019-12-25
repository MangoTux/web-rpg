class Hash2D {
  constructor() {
    this.hash = {};
  }

  push(x, y, element) {
    if (typeof this.hash[x] === "undefined") {
      this.hash[x] = {};
    }
    this.hash[x][y] = element;
  }

  get(x, y) {
    if (typeof this.hash[x] === "undefined") {
      return null;
    }
    if (typeof this.hash[x][y] === "undefined") {
      return null;
    }
    return this.hash[x][y];
  }

  pop(x, y) {
    if (typeof this.hash[x] === "undefined") {
      return null;
    }
    if (typeof this.hash[x][y] === "undefined") {
      return null;
    }
    let object = this.hash[x][y];
    delete this.hash[y];
    if (jQuery.isObjectEmpty(this.hash[x])) {
      delete this.hash[x];
    }
    return object;
  }
}
