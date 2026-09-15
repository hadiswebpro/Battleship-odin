import Player from "./player";

export default class Game {
  constructor(mode = "computer") {
    this.mode = mode;

    this.player1 = new Player("Player", "green");
    this.player2 = new Player(
      mode === "computer" ? "Computer" : "Player 2",
      "red"
    );

    this.currentPlayer = this.player1;
  }

  switchTurn() {
    this.currentPlayer =
      this.currentPlayer === this.player1
        ? this.player2
        : this.player1;
  }

  getOpponent(player) {
    return player === this.player1 ? this.player2 : this.player1;
  }

  playTurn(coordinate) {
    const opponent = this.getOpponent(this.currentPlayer);
    const result = this.currentPlayer.attack(
      opponent.gameboard,
      coordinate
    );

    if (result !== "already") {
      this.switchTurn();

      if (this.mode === "computer" && this.currentPlayer === this.player2) {
        this.player2.computerAttack(this.player1.gameboard);
        this.switchTurn();
      }
    }

    return result;
  }

  isGameOver() {
    return (
      this.player1.gameboard.allShipsSunk() ||
      this.player2.gameboard.allShipsSunk()
    );
  }

  getWinner() {
    if (this.player2.gameboard.allShipsSunk()) return this.player1;
    if (this.player1.gameboard.allShipsSunk()) return this.player2;

    return null;
  }
}
