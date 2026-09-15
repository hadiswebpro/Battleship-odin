import Gameboard from "./gameboard";
import Ship from "./ship";

export default class Player {
  constructor(name, color) {
    this.gameboard = new Gameboard();
    this.name = name;
    this.color = color;
    this.attacksMade = new Set();

    this.placeShips();
  }

  placeShips() {
    const shipLengths = [5, 4, 3, 3, 2];

    shipLengths.forEach((length) => {
      let placed = false;

      while (!placed) {
        const ship = new Ship(length);
        const coordinates = this.generateCoordinates(length);

        try {
          this.gameboard.placeShip(ship, coordinates);
          placed = true;
        } catch (error) {
          placed = false;
        }
      }
    });
  }

  generateCoordinates(length) {
    const horizontal = Math.random() > 0.5;
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    const coordinates = [];

    for (let i = 0; i < length; i++) {
      const newRow = horizontal ? row : row + i;
      const newCol = horizontal ? col + i : col;

      if (newRow > 9 || newCol > 9) {
        return this.generateCoordinates(length);
      }

      coordinates.push([newRow, newCol]);
    }

    return coordinates;
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
