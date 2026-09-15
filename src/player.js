import Gameboard from "./gameboard";
import Ship from "./ship";

export default class Player {
  constructor(name, color, autoPlace = true) {
    this.gameboard = new Gameboard();
    this.name = name;
    this.color = color;
    this.attacksMade = new Set();
    this.targetQueue = [];
    this.shipLengths = [5, 4, 3, 3, 2];

    if (autoPlace) this.placeShips();
  }

  placeShips() {
    this.shipLengths.forEach((length) => {
      let placed = false;

      while (!placed) {
        try {
          this.placeShip(length, this.generateCoordinates(length));
          placed = true;
        } catch (error) {}
      }
    });
  }

  placeShip(length, coordinates) {
    const ship = new Ship(length);
    this.gameboard.placeShip(ship, coordinates);
  }

  generateCoordinates(length) {
    const horizontal = Math.random() > 0.5;
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    const coordinates = [];

    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;

      if (r > 9 || c > 9) return this.generateCoordinates(length);
      coordinates.push([r, c]);
    }

    return coordinates;
  }

  clearBoard() {
    this.gameboard = new Gameboard();
  }

  attack(enemyBoard, coordinate) {
    this.attacksMade.add(coordinate.toString());
    return enemyBoard.receiveAttack(coordinate);
  }

  computerAttack(enemyBoard) {
    let coordinate;

    do {
      coordinate = this.targetQueue.length
        ? this.targetQueue.shift()
        : [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    } while (this.attacksMade.has(coordinate.toString()));

    this.attacksMade.add(coordinate.toString());
    const result = enemyBoard.receiveAttack(coordinate);

    if (result === "hit") this.addTargetsAround(coordinate);
    return result;
  }

  addTargetsAround([row, col]) {
    [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].forEach(([r,c])=>{
      const key=[r,c].toString();
      if(r>=0&&r<10&&c>=0&&c<10&&!this.attacksMade.has(key)) this.targetQueue.push([r,c]);
    });
  }
}
