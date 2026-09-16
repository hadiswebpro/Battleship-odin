import Game from "./game";
import {
  createBoard,
  enableShipPlacement,
  playSound,
} from "./dom";

export function startGameFlow(mode = "computer") {
  const game = new Game(mode);
  let screen = document.querySelector(".placement-screen");

  const playerBoard = document.querySelector("#player-board");
  const battlePlayerBoard = document.querySelector("#your-board");
  const enemyBoard = document.querySelector("#enemy-board");

  if (playerBoard) {
    createBoard(playerBoard, game.player1.gameboard, game.player1.name);

    enableShipPlacement(playerBoard, game.player1, () => {
      showReadyModal(() => startBattle(game));
    });
  }

  return game;
}

function startBattle(game) {
  playSound("ocean");

  createBoard(
    document.querySelector("#your-board"),
    game.player1.gameboard,
    game.player1.name,
    false
  );

  createBoard(
    document.querySelector("#enemy-board"),
    game.player2.gameboard,
    game.player2.name,
    true
  );
}

function showReadyModal(callback) {
  const modal = document.querySelector("#ready-modal");
  const button = document.querySelector("#start-battle");

  if (!modal || !button) {
    callback();
    return;
  }

  modal.classList.remove("hidden");
  button.onclick = () => {
    modal.classList.add("hidden");
    callback();
  };
}
