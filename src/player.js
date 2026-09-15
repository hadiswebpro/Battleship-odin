import Gameboard from "./gameboard";

export default class Player {
  constructor(name, color) {
    this.gameboard = new Gameboard();
    this.name = name;
    this.color = color;
    this.attacksMade = new Set();
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
