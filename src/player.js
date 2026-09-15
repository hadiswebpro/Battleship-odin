import Gameboard from "./gameboard";
import Ship from "./ship";

export default class Player {
  constructor(name, color) {
    this.gameboard = new Gameboard();
    this.name = name;
    this.color = color;
    this.attacksMade = new Set();

    this.placeDefaultShips();
  }

  placeDefaultShips() {
    const ships = [5, 4, 3, 3, 2];

    ships.forEach((length, index) => {
      const ship = new Ship(length);

      const coordinates = Array.from(
        { length },
        (_, position) => [index, position]
      );

      this.gameboard.placeShip(ship, coordinates);
    });
  }

  attack(enemyBoard, coordinate) {
    const key = coordinate.toString();

    this.attacksMade.add(key);

    return enemyBoard.receiveAttack(coordinate);
  }

  computerAttack(enemyBoard) {
    let coordinate;
    let key;

    do {
      coordinate = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];

      key = coordinate.toString();
    } while (this.attacksMade.has(key));

    this.attacksMade.add(key);

    return enemyBoard.receiveAttack(coordinate);
  }
}
