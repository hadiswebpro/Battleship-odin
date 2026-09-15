import Game from "./game";

import {
  createBoard,
  addAttackListener
} from "./dom";

let game;

const startScreen = document.querySelector("#start-screen");
const modeScreen = document.querySelector("#mode-screen");
const gameScreen = document.querySelector("#game");

const startButton = document.querySelector("#start-game");
const playerModeButton = document.querySelector("#player-mode");
const computerModeButton = document.querySelector("#computer-mode");

const playerBoard = document.querySelector("#player-board");
const enemyBoard = document.querySelector("#enemy-board");

const PLAYER_COLOR = "green";
const ENEMY_COLOR = "red";

function start(mode) {
  game = new Game(mode);

  startScreen.classList.add("hidden");
  modeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  createBoard(playerBoard, PLAYER_COLOR, game.player1.gameboard);
  createBoard(enemyBoard, ENEMY_COLOR);

  addAttackListener(enemyBoard, game);
}

startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  modeScreen.classList.remove("hidden");
});

computerModeButton.addEventListener("click", () => {
  start("computer");
});

playerModeButton.addEventListener("click", () => {
  start("player");
});
