import Game from "./game";
import {
  createBoard,
  createPlacementBoard,
  playSound,
} from "./dom";

let activeGame = null;

export function startGameFlow(mode = "computer") {
  const game = new Game(mode);
  activeGame = game;

  const playerBoard = document.querySelector("#player-board");

  if (playerBoard) {
    createPlacementBoard(playerBoard, game.player1, () => {
      showReadyModal(() => startBattle(game));
    });
  }

  connectBackButtons();

  return game;
}

function startBattle(game) {
  playSound("ocean");

  document.querySelector("#placement-screen")?.classList.add("hidden");
  document.querySelector("#game")?.classList.remove("hidden");

  createBoard(document.querySelector("#your-board"), game.player1.gameboard, game.player1.name, false);
  createBoard(document.querySelector("#enemy-board"), game.player2.gameboard, game.player2.name, true);

  connectEnemyBoard(game);
  connectBattleControls(game);
  updateTurn("Player Turn");
}

function connectEnemyBoard(game) {
  const board = document.querySelector("#enemy-board");
  if (!board) return;

  board.onclick = (event) => {
    const cell = event.target.closest(".cell");
    if (!cell || game.currentPlayer !== game.player1) return;

    const result = game.playTurn([
      Number(cell.dataset.row),
      Number(cell.dataset.col),
    ]);

    if (result === "already") return;

    cell.classList.add(result);
    playSound(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) {
      showWinnerModal(game);
      return;
    }

    updateTurn("Enemy Turn");

    if (game.mode === "computer") {
      setTimeout(() => {
        game.playComputerTurn?.();
        createBoard(document.querySelector("#your-board"), game.player1.gameboard, game.player1.name, false);

        if (game.isGameOver()) showWinnerModal(game);
        else updateTurn("Player Turn");
      }, 600);
    }
  };
}

function connectBattleControls() {
  document.querySelector("#quit-game")?.addEventListener("click", showQuitModal);

  document.querySelector("#main-menu")?.addEventListener("click", returnToStart);
  document.querySelector("#winner-main-menu")?.addEventListener("click", returnToStart);
  document.querySelector("#play-again")?.addEventListener("click", returnToStart);
  document.querySelector("#continue-game")?.addEventListener("click", () => {
    document.querySelector("#quit-modal")?.classList.add("hidden");
  });
}

function connectBackButtons() {
  document.querySelectorAll(".back-btn").forEach((button) => {
    button.onclick = () => {
      const placement = document.querySelector("#placement-screen");
      if (!placement?.classList.contains("hidden")) {
        placement.classList.add("hidden");
        document.querySelector("#mode-screen")?.classList.remove("hidden");
      }
    };
  });
}

function showQuitModal() {
  document.querySelector("#quit-modal")?.classList.remove("hidden");
}

function returnToStart() {
  window.location.reload();
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

  if (!modal || !button) return callback();

  modal.classList.remove("hidden");
  button.onclick = () => {
    modal.classList.add("hidden");
    callback();
  };
}

function updateTurn(text) {
  const turn = document.querySelector("#turn-status");
  if (turn) turn.textContent = text;
}
