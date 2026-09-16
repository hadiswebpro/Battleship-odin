export default class Ship {
  constructor(length, name = "Ship") {
    this.name = name;
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
