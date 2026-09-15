import Player from "./player";

export default class Game {
  constructor() {
    this.player1 = new Player(
    "Player 1",
    "green"
);


this.player2 = new Player(
    "Player 2",
    "red"
);

    this.currentPlayer = this.player1;
  }

  switchTurn() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  isGameOver() {
    return (
      this.player1.gameboard.allShipsSunk() ||
      this.player2.gameboard.allShipsSunk()
    );
  }

  getWinner() {

    if (this.player2.gameboard.allShipsSunk()) {
        return this.player1;
    }


    if (this.player1.gameboard.allShipsSunk()) {
        return this.player2;
    }


    return null;
}
}
