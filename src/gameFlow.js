import Game from "./game";
import {
  createBoard,
  enableShipPlacement,
  playSound,
} from "./dom";

let activeGame = null;

export function startGameFlow(mode = "computer") {
  const game = new Game(mode);
  activeGame = game;

  const playerBoard = document.querySelector("#player-board");

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

  connectEnemyBoard(game);
  updateTurn("Your Turn");
  connectBattleControls(game);
}

function connectEnemyBoard(game) {
  const board = document.querySelector("#enemy-board");
  if (!board) return;

  board.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell || game.currentPlayer !== game.player1) return;

    const coordinate = [
      Number(cell.dataset.row),
      Number(cell.dataset.col),
    ];

    const result = game.playTurn(coordinate);

    if (result === "already") return;

    cell.classList.add(result);
    playSound(result === "hit" ? "hit" : "miss");

    updateTurn(
      game.isGameOver()
        ? "Game Over"
        : game.currentPlayer === game.player1
        ? "Your Turn"
        : "Enemy Turn"
    );

    if (game.isGameOver()) {
      showWinnerModal(game);
      return;
    }

    if (game.mode === "computer") {
      setTimeout(() => {
        updateTurn("Enemy Turn");

        createBoard(
          document.querySelector("#your-board"),
          game.player1.gameboard,
          game.player1.name,
          false
        );

        if (game.isGameOver()) {
          showWinnerModal(game);
        } else {
          updateTurn("Your Turn");
        }
      }, 600);
    }
  });
}

function updateTurn(text) {
  const turn = document.querySelector("#turn-status");
  if (turn) turn.textContent = text;
}

function connectBattleControls(game) {
  const quitButton = document.querySelector("#quit-game");
  quitButton?.addEventListener("click", () => {
    showQuitModal();
  });

  document.querySelector("#main-menu")?.addEventListener("click", () => {
    window.location.reload();
  });

  document.querySelector("#play-again")?.addEventListener("click", () => {
    window.location.reload();
  });
}

function showQuitModal() {
  const modal = document.querySelector("#quit-modal");
  modal?.classList.remove("hidden");
}

function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");

  if (!modal || !text) return;

  text.textContent = `${game.getWinner().name} wins!`;
  modal.classList.remove("hidden");
  playSound("victory");
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
