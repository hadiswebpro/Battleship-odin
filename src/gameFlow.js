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
  const placementScreen = document.querySelector("#placement-screen");
  const modeScreen = document.querySelector("#mode-screen");

  if (!playerBoard || !placementScreen) return game;

  placementScreen.classList.remove("hidden");
  modeScreen?.classList.add("hidden");

  createPlacementBoard(playerBoard, game.player1, () => {
    showReadyModal(() => startBattle(game));
  });

  connectBackButtons();
  return game;
}

function startBattle(game) {
  const placementScreen = document.querySelector("#placement-screen");
  const gameScreen = document.querySelector("#game");
  const yourBoard = document.querySelector("#your-board");
  const enemyBoard = document.querySelector("#enemy-board");

  if (!gameScreen || !yourBoard || !enemyBoard) return;

  placementScreen?.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  createBoard(yourBoard, game.player1.gameboard, game.player1.name, false);
  createBoard(enemyBoard, game.player2.gameboard, game.player2.name, true);

  connectEnemyBoard(game);
  connectBattleControls();
  updateTurn("Player Turn");
  playSound("ocean");
}

function connectEnemyBoard(game) {
  const board = document.querySelector("#enemy-board");
  if (!board) return;

  board.onclick = (event) => {
    const cell = event.target.closest(".cell");
    if (!cell || game.currentPlayer !== game.player1 || game.isGameOver()) return;

    const coordinate = [Number(cell.dataset.row), Number(cell.dataset.col)];
    const result = game.attack(coordinate);

    if (result === "already") return;

    cell.classList.add(result);
    playSound(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) {
      showWinnerModal(game);
      return;
    }

    updateTurn("Enemy Turn");

    if (game.mode === "computer" && game.currentPlayer === game.player2) {
      board.style.pointerEvents = "none";

      setTimeout(() => {
        const computerResult = game.computerTurn();

        createBoard(
          document.querySelector("#your-board"),
          game.player1.gameboard,
          game.player1.name,
          false,
        );

        if (computerResult) {
          playSound(computerResult === "hit" ? "hit" : "miss");
        }

        if (game.isGameOver()) {
          showWinnerModal(game);
        } else {
          board.style.pointerEvents = "auto";
          updateTurn("Player Turn");
        }
      }, 600);
    }
  };
}

function connectBattleControls() {
  document.querySelector("#quit-game")?.addEventListener("click", showQuitModal);
  document.querySelector("#continue-game")?.addEventListener("click", hideQuitModal);

  document.querySelector("#main-menu")?.addEventListener("click", showExitModal);
  document.querySelector("#play-again")?.addEventListener("click", showExitModal);
  document.querySelector("#winner-main-menu")?.addEventListener("click", showExitModal);
  document.querySelector("#winner-cancel")?.addEventListener("click", hideWinnerModal);
}

function connectBackButtons() {
  document.querySelectorAll(".back-btn").forEach((button) => {
    button.onclick = () => {
      const placement = document.querySelector("#placement-screen");
      if (!placement || placement.classList.contains("hidden")) return;
      showExitModal();
    };
  });
}

function showReadyModal(callback) {
  const modal = document.querySelector("#ready-modal");
  const startButton = document.querySelector("#start-battle");
  const cancelButton = document.querySelector("#cancel-ready");

  if (!modal || !startButton) {
    callback();
    return;
  }

  modal.classList.remove("hidden");

  startButton.onclick = () => {
    modal.classList.add("hidden");
    callback();
  };

  if (cancelButton) {
    cancelButton.onclick = () => modal.classList.add("hidden");
  }
}

function showExitModal() {
  document.querySelector("#exit-modal")?.classList.remove("hidden");
}

function hideExitModal() {
  document.querySelector("#exit-modal")?.classList.add("hidden");
}

function hideQuitModal() {
  document.querySelector("#quit-modal")?.classList.add("hidden");
}

function hideWinnerModal() {
  document.querySelector("#winner-modal")?.classList.add("hidden");
}

function returnToStart() {
  window.location.reload();
}

function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");
  const winner = game.getWinner();

  if (!modal || !text || !winner) return;

  text.textContent = `${winner.name} wins!`;
  modal.classList.remove("hidden");
  playSound("victory");
}

function updateTurn(text) {
  const turn = document.querySelector("#turn-status");
  if (turn) turn.textContent = text;
}

const confirmExitButton = document.querySelector("#confirm-exit");
if (confirmExitButton) {
  confirmExitButton.onclick = returnToStart;
}

const cancelExitButton = document.querySelector("#cancel-exit");
if (cancelExitButton) {
  cancelExitButton.onclick = hideExitModal;
}
