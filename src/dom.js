export function createBoard(element, color, gameboard = null) {
  element.classList.add("board");

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.style.backgroundColor = color;

      if (gameboard && gameboard.getShipAt([row, col])) {
        cell.classList.add("ship");
      }

      element.appendChild(cell);
    }
  }
}

export function addAttackListener(boardElement, game) {
  boardElement.addEventListener("click", (event) => {
    const cell = event.target;

    if (!cell.classList.contains("cell")) {
      return;
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    const result = game.playTurn([row, col]);

    if (result === "already") {
      return;
    }

    if (result === "hit") {
      cell.classList.add("hit");
    } else {
      cell.classList.add("miss");
    }
  });
}
