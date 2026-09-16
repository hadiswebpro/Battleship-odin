const shipImages = {
  Carrier: new URL("./images/ships/carrier.png", import.meta.url).href,
  Battleship: new URL("./images/ships/battleship.png", import.meta.url).href,
  Cruiser: new URL("./images/ships/cruiser.png", import.meta.url).href,
  Submarine: new URL("./images/ships/submarine.png", import.meta.url).href,
  Destroyer: new URL("./images/ships/destroyer.png", import.meta.url).href,
};

const sounds = {};

export function playSound(name) {
  if (!sounds[name]) return;
}

export function createPlacementBoard(boardElement, player, callback) {
  createBoard(boardElement, player.gameboard, player.name);
  enableShipPlacement(boardElement, player, callback);
}

export function enableShipPlacement(boardElement, player, onReady) {
  let selectedShip = null;
  let direction = "horizontal";

  document.querySelectorAll(".ship-option").forEach((button) => {
    button.onclick = () => {
      selectedShip = { name: button.dataset.ship, length: Number(button.dataset.length) };
      document.querySelectorAll(".ship-option").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
    };
  });

  document.querySelector(".rotate-ship")?.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
  });

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.onclick = () => {
      if (!selectedShip) return;
      const coordinates = getCoordinates(+cell.dataset.row, +cell.dataset.col, selectedShip.length, direction);
      if (!coordinates || !isValidPlacement(player, coordinates)) return;

      player.placeShip(selectedShip.length, coordinates, selectedShip.name);
      document.querySelector(`[data-ship="${selectedShip.name}"]`)?.classList.add("disabled");
      createBoard(boardElement, player.gameboard, player.name);
      enableShipPlacement(boardElement, player, onReady);
    };
  });

  document.querySelector(".confirm-placement")?.addEventListener("click", () => {
    if (player.gameboard.ships?.length !== 5) {
      showPlacementError();
      return;
    }
    onReady?.();
  });
}

function showPlacementError() {
  let error = document.querySelector("#placement-error");
  if (!error) {
    error = document.createElement("p");
    error.id = "placement-error";
    document.querySelector(".placement-screen .card")?.prepend(error);
  }
  error.textContent = "⚠ Please place all your ships before entering battle";
}

function getCoordinates(row, col, length, direction) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const r = direction === "vertical" ? row + i : row;
    const c = direction === "horizontal" ? col + i : col;
    if (r > 9 || c > 9) return null;
    result.push([r, c]);
  }
  return result;
}

function isValidPlacement(player, coordinates) {
  return !coordinates.some((c) => player.gameboard.getShipAt(c));
}

export function createBoard(element, gameboard = null, playerName = "", hideShips = false) {
  if (!element) return;
  element.innerHTML = "";
  const board = document.createElement("div");
  board.className = "board";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }

  element.appendChild(board);
  renderShips(element, gameboard, hideShips);
}

function renderShips(element, gameboard, hideShips) {
  if (hideShips) return;
  gameboard?.ships?.forEach((ship) => {
    const first = element.querySelector(`[data-row="${ship.coordinates[0][0]}"][data-col="${ship.coordinates[0][1]}"]`);
    if (!first) return;
    const img = document.createElement("img");
    img.src = shipImages[ship.name];
    img.className = `ship-image ${ship.direction || "horizontal"}`;
    first.appendChild(img);
  });
}
