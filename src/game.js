import Player from "./player";

export default class Game {
  constructor(mode = "computer") {
    this.mode = mode;

    this.player1 = new Player("Player", "blue", false);
    this.player2 = new Player(
      mode === "computer" ? "Computer" : "Player 2"
    );

    this.currentPlayer = this.player1;
  }

  startGame() {
    if (this.player1.gameboard.ships.length === 0) {
      this.player1.placeShips();
    }
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

  attack(coordinate) {
    const opponent = this.getOpponent(this.currentPlayer);
    const result = this.currentPlayer.attack(
      opponent.gameboard,
      coordinate
    );

    if (result !== "already") {
      this.switchTurn();
    }

    return result;
  }

  computerTurn() {
    if (
      this.mode !== "computer" ||
      this.currentPlayer !== this.player2 ||
      this.isGameOver()
    ) {
      return null;
    }

    const result = this.player2.computerAttack(
      this.player1.gameboard
    );

    this.switchTurn();

    return result;
  }

  playTurn(coordinate) {
    const result = this.attack(coordinate);

    if (result !== "already") {
      this.computerTurn();
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
