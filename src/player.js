import Gameboard from "./gameboard";

export default class Player {
  constructor(name, color) {
    this.gameboard = new Gameboard();
    this.name = name;
    this.color = color;
    this.attacksMade = [];

  }

  attack(enemyBoard, coordinate) {

    return enemyBoard.receiveAttack(coordinate);

}

  computerAttack(enemyBoard) {
    let coordinate;

    do {
      coordinate = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
      ];
    } while (
      this.attacksMade.some(
        (attack) => attack[0] === coordinate[0] && attack[1] === coordinate[1],
      )
    );

    this.attacksMade.push(coordinate);

    enemyBoard.receiveAttack(coordinate);
  }
}
