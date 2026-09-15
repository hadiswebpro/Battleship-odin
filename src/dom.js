export function createBoard(element, gameboard = null, playerName = "") {
  element.innerHTML = "";
  element.classList.add("board-wrapper");

  if (playerName) {
    const title = document.createElement("h2");
    title.classList.add("board-title");
    title.textContent = playerName;
    element.appendChild(title);
  }

  const board = document.createElement("div");
  board.classList.add("board");

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (gameboard && gameboard.getShipAt([row, col])) {
        cell.classList.add("ship");
        cell.textContent = "🚢";
      }

      board.appendChild(cell);
    }
  }

  element.appendChild(board);
}

export function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");

  const winner = game.getWinner();

  text.textContent = `${winner.name} wins! 🚢`;
  modal.classList.remove("hidden");
}

export function addAttackListener(boardElement, game, onGameOver) {
  boardElement.addEventListener("click", (event) => {
    const cell = event.target;

    if (!cell.classList.contains("cell")) return;

    const coordinate = [
      Number(cell.dataset.row),
      Number(cell.dataset.col),
    ];

    const result = game.playTurn(coordinate);

    if (result === "already") return;

    cell.classList.add(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) {
      onGameOver();
    }
  });
}
