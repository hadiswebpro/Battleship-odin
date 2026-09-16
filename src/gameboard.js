export default class Gameboard {
  constructor() {
    this.ships = [];
    this.board = new Map();
    this.missedAttacks = [];
    this.attackedCoordinates = new Set();
  }

  placeShip(ship, coordinates) {
    if (coordinates.length !== ship.length) {
      throw new Error("Invalid ship placement");
    }

    const keys = coordinates.map((position) => position.toString());

    if (keys.some((key) => this.board.has(key))) {
      throw new Error("Position already occupied");
    }

    keys.forEach((key) => {
      this.board.set(key, ship);
    });

    this.ships.push(ship);
  }

  getShipAt(coordinate) {
    return this.board.get(coordinate.toString());
  }

  receiveAttack(coordinate) {
    const key = coordinate.toString();

    if (this.attackedCoordinates.has(key)) {
      return "already";
    }

    this.attackedCoordinates.add(key);

    const ship = this.board.get(key);

    if (ship) {
      ship.hit();
      return "hit";
    }

    this.missedAttacks.push(coordinate);
    return "miss";
  }

  hasBeenAttacked(coordinate) {
    return this.attackedCoordinates.has(coordinate.toString());
  }

  getAttackResult(coordinate) {
    const key = coordinate.toString();

    if (!this.attackedCoordinates.has(key)) {
      return null;
    }

    return this.board.has(key) ? "hit" : "miss";
  }

  getShipStatus() {
    return this.ships.map((ship) => ({
      name: ship.name,
      length: ship.length,
      hits: ship.hits,
      sunk: ship.isSunk(),
    }));
  }

  allShipsSunk() {
    return (
      this.ships.length === 5 &&
      this.ships.every((ship) => ship.isSunk())
    );
  }

  clear() {
    this.ships = [];
    this.board.clear();
    this.missedAttacks = [];
    this.attackedCoordinates.clear();
  }
}
