import Game from "./game";
import { createBoard, createPlacementBoard, playSound } from "./dom";

let activeGame = null;
let computerTimer = null;

export function startGameFlow(mode = "computer", existingGame = null) {
  const game = existingGame || new Game(mode);
  activeGame = game;
  clearTimeout(computerTimer);

  const playerBoard = document.querySelector("#player-board");
  const placementScreen = document.querySelector("#placement-screen");
  const modeScreen = document.querySelector("#mode-screen");
  const gameScreen = document.querySelector("#game");
  const readyModal = document.querySelector("#ready-modal");
  const winnerModal = document.querySelector("#winner-modal");
  const quitModal = document.querySelector("#quit-modal");

  if (!playerBoard || !placementScreen) return game;

  modeScreen?.classList.add("hidden");
  gameScreen?.classList.add("hidden");
  placementScreen.classList.remove("hidden");
  readyModal?.classList.add("hidden");
  winnerModal?.classList.add("hidden");
  quitModal?.classList.add("hidden");

  createPlacementBoard(playerBoard, game.player1, () => showReadyModal(() => startBattle(game)));
  connectBackButtons();
  connectGlobalExitControls();
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

    createBoard(document.querySelector("#enemy-board"), game.player2.gameboard, game.player2.name, true);
    playSound(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) {
      showWinnerModal(game);
      return;
    }

    updateTurn("Enemy Turn");
    board.style.pointerEvents = "none";

    if (game.mode === "computer" && game.currentPlayer === game.player2) {
      computerTimer = setTimeout(() => {
        const computerResult = game.computerTurn();
        createBoard(document.querySelector("#your-board"), game.player1.gameboard, game.player1.name, false);

        if (computerResult) playSound(computerResult === "hit" ? "hit" : "miss");

        if (game.isGameOver()) {
          showWinnerModal(game);
        } else {
          board.style.pointerEvents = "auto";
          updateTurn("Player Turn");
        }
      }, 2500);
    }
  };
}

function connectBattleControls() {
  const quit = document.querySelector("#quit-game");
  const continueButton = document.querySelector("#continue-game");
  const mainMenu = document.querySelector("#main-menu");
  const restart = document.querySelector("#play-again");
  const winnerMenu = document.querySelector("#winner-main-menu");
  const winnerStay = document.querySelector("#winner-cancel");

  if (quit) quit.onclick = showQuitModal;
  if (continueButton) continueButton.onclick = hideQuitModal;
  if (mainMenu) mainMenu.onclick = returnToStart;
  if (restart) restart.onclick = restartGame;
  if (winnerMenu) winnerMenu.onclick = returnToStart;
  if (winnerStay) winnerStay.onclick = hideWinnerModal;
}

function connectBackButtons() {
  const placementBack = document.querySelector("#placement-back");
  if (placementBack) placementBack.onclick = showExitModal;

  const modeBack = document.querySelector("#mode-back");
  if (modeBack) modeBack.onclick = returnToStart;
}

function connectGlobalExitControls() {
  const confirmExit = document.querySelector("#confirm-exit");
  const cancelExit = document.querySelector("#cancel-exit");
  if (confirmExit) confirmExit.onclick = returnToStart;
  if (cancelExit) cancelExit.onclick = hideExitModal;
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
  if (cancelButton) cancelButton.onclick = () => modal.classList.add("hidden");
}

function showExitModal() {
  document.querySelector("#exit-modal")?.classList.remove("hidden");
}

function hideExitModal() {
  document.querySelector("#exit-modal")?.classList.add("hidden");
}

function showQuitModal() {
  document.querySelector("#quit-modal")?.classList.remove("hidden");
}

function hideQuitModal() {
  document.querySelector("#quit-modal")?.classList.add("hidden");
}

function hideWinnerModal() {
  document.querySelector("#winner-modal")?.classList.add("hidden");
}

function returnToStart() {
  clearTimeout(computerTimer);
  window.location.reload();
}

function restartGame() {
  clearTimeout(computerTimer);
  const mode = activeGame?.mode || "computer";
  const freshGame = new Game(mode);
  activeGame = freshGame;
  startGameFlow(mode, freshGame);
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
