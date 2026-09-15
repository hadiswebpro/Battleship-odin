import Game from "./game";

import {
  createBoard,
  addAttackListener
} from "./dom";


const game = new Game();

const PLAYER_COLOR = "green";
const ENEMY_COLOR = "red";

const playerBoard = document.querySelector("#player-board");
const enemyBoard = document.querySelector("#enemy-board");

createBoard(
  playerBoard,
  PLAYER_COLOR
);

createBoard(
  enemyBoard,
  ENEMY_COLOR
);

addAttackListener(
  enemyBoard,
  game
);