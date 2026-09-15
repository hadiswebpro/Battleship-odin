import shipImage from "./images/ship.jpg";

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

      const ship = gameboard?.getShipAt([row, col]);

      if (ship) {
        cell.classList.add("ship");
        const image = document.createElement("img");
        image.src = shipImage;
        image.alt = "ship";
        cell.appendChild(image);
      }

      board.appendChild(cell);
    }
  }

  element.appendChild(board);
}

export function createPlacementBoard(element, player, onComplete) {
  let currentShipIndex = 0;
  let horizontal = true;
  const ships = player.shipLengths;

  player.clearBoard();
  renderPlacement();

  function renderPlacement() {
    createBoard(element, player.gameboard, player.name);

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship ↻";
    rotateButton.className = "rotate-ship";
    element.appendChild(rotateButton);

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm Placement 🚢";
    confirmButton.className = "confirm-placement";
    confirmButton.disabled = currentShipIndex !== ships.length;
    element.appendChild(confirmButton);

    rotateButton.addEventListener("click", () => {
      horizontal = !horizontal;
    });

    confirmButton.addEventListener("click", () => {
      if (currentShipIndex === ships.length) onComplete();
    });

    element.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("mouseenter", () => previewShip(cell));
      cell.addEventListener("mouseleave", clearPreview);
      cell.addEventListener("click", () => placeFromCell(cell));
    });
  }

  function previewShip(cell) {
    clearPreview();

    const coordinates = getCoordinates(cell);
    const invalid = !coordinates.length || coordinates.some(([r, c]) => {
      return player.gameboard.getShipAt([r, c]);
    });

    coordinates.forEach(([r, c]) => {
      const target = element.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      if (target) target.classList.add(invalid ? "invalid-preview" : "preview");
    });
  }

  function clearPreview() {
    element.querySelectorAll(".preview, .invalid-preview").forEach((cell) => {
      cell.classList.remove("preview", "invalid-preview");
    });
  }

  function getCoordinates(cell) {
    if (currentShipIndex >= ships.length) return [];

    const length = ships[currentShipIndex];
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const coordinates = [];

    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;

      if (r > 9 || c > 9) return [];
      coordinates.push([r, c]);
    }

    return coordinates;
  }

  function placeFromCell(cell) {
    const coordinates = getCoordinates(cell);
    if (!coordinates.length) return;

    const blocked = coordinates.some(([r, c]) => player.gameboard.getShipAt([r, c]));
    if (blocked) return;

    try {
      player.placeShip(ships[currentShipIndex], coordinates);
      currentShipIndex++;

      if (currentShipIndex < ships.length) {
        renderPlacement();
      } else {
        renderPlacement();
      }
    } catch (error) {}
  }
}

export function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");
  text.textContent = `${game.getWinner().name} wins! 🚢`;
  modal.classList.remove("hidden");
}

export function addAttackListener(boardElement, game, onGameOver) {
  boardElement.addEventListener("click", (event) => {
    const cell = event.target;
    if (!cell.classList.contains("cell")) return;

    const coordinate = [Number(cell.dataset.row), Number(cell.dataset.col)];
    const result = game.playTurn(coordinate);

    if (result === "already") return;
    cell.classList.add(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) onGameOver();
  });
}
