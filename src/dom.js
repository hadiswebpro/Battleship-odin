const shipImages = {
  Carrier: new URL("./images/carrier.webp", import.meta.url).href,
  Battleship: new URL("./images/battleship.webp", import.meta.url).href,
  Cruiser: new URL("./images/cruiser.webp", import.meta.url).href,
  Submarine: new URL("./images/submarine.webp", import.meta.url).href,
  Destroyer: new URL("./images/destroyer.webp", import.meta.url).href,
};

export function playSound() {}

export function createPlacementBoard(boardElement, player, callback) {
  createBoard(boardElement, player.gameboard, player.name);
  enableShipPlacement(boardElement, player, callback);
}

export function enableShipPlacement(boardElement, player, onReady) {
  let selectedShip = null;
  let direction = "vertical";
  let preview = null;
  let draggedShip = null;

  const buttons = [...document.querySelectorAll(".ship-option")];

  buttons.forEach((button) => {
    button.onclick = () => {
      if (button.classList.contains("placed")) return;
      selectedShip = {
        name: button.dataset.ship,
        length: Number(button.dataset.length),
      };
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
    };
  });

  document.querySelector(".rotate-ship")?.addEventListener("click", () => {
    direction = direction === "vertical" ? "horizontal" : "vertical";
    if (preview && selectedShip) {
      renderPreview(preview, boardElement, selectedShip, direction, player);
    }
  });

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.onmouseenter = () => {
      if (!selectedShip) return;
      preview = { row: +cell.dataset.row, col: +cell.dataset.col };
      renderPreview(preview, boardElement, selectedShip, direction, player);
    };

    cell.onclick = () => {
      if (!selectedShip || !preview) return;
      const coordinates = getCoordinates(
        preview.row,
        preview.col,
        selectedShip.length,
        direction,
      );
      if (!coordinates || !isValidPlacement(player, coordinates)) return;

      player.placeShip(selectedShip.length, coordinates, selectedShip.name);
      document
        .querySelector(`[data-ship="${selectedShip.name}"]`)
        ?.classList.add("placed");
      selectedShip = null;
      preview = null;
      createBoard(boardElement, player.gameboard, player.name);
      enableShipPlacement(boardElement, player, onReady);
    };

    cell.ondragover = (event) => {
      if (!draggedShip) return;
      event.preventDefault();
      const ship = draggedShip.ship;
      const coords = getCoordinates(
        +cell.dataset.row,
        +cell.dataset.col,
        ship.length,
        ship.direction || "vertical",
      );
      if (!coords) return;
      renderPreview(
        { row: +cell.dataset.row, col: +cell.dataset.col },
        boardElement,
        { name: ship.name, length: ship.length },
        ship.direction || "vertical",
        player,
        ship,
      );
    };

    cell.ondrop = (event) => {
      event.preventDefault();
      if (!draggedShip) return;

      const ship = draggedShip.ship;
      const coordinates = getCoordinates(
        +cell.dataset.row,
        +cell.dataset.col,
        ship.length,
        ship.direction || "vertical",
      );

      if (!coordinates || !isValidPlacement(player, coordinates, ship)) {
        clearPreview(boardElement);
        draggedShip = null;
        return;
      }

      movePlacedShip(player, ship, coordinates);
      draggedShip = null;
      clearPreview(boardElement);
      createBoard(boardElement, player.gameboard, player.name);
      enableShipPlacement(boardElement, player, onReady);
    };
  });

  boardElement.querySelectorAll(".ship-image").forEach((img) => {
    const shipName = img.dataset.ship;
    const ship = player.gameboard.ships.find((item) => item.name === shipName);
    if (!ship) return;

    img.draggable = true;
    img.dataset.ship = ship.name;
    img.classList.add("draggable-ship");

    img.ondragstart = (event) => {
      draggedShip = { ship };
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", ship.name);
      img.classList.add("dragging");
    };

    img.ondragend = () => {
      img.classList.remove("dragging");
      draggedShip = null;
      clearPreview(boardElement);
    };
  });

  document.querySelector(".confirm-placement")?.addEventListener("click", () => {
    const ready = player.gameboard.isFleetReady
      ? player.gameboard.isFleetReady()
      : player.gameboard.ships.length === 5 &&
        player.gameboard.ships.reduce((sum, ship) => sum + ship.length, 0) === 17;
    if (!ready) return showPlacementError();
    onReady?.();
  });
}

function movePlacedShip(player, ship, coordinates) {
  ship.coordinates.forEach((coordinate) => {
    player.gameboard.board.delete(coordinate.toString());
  });

  coordinates.forEach((coordinate) => {
    player.gameboard.board.set(coordinate.toString(), ship);
  });

  ship.coordinates = coordinates;
  ship.direction =
    coordinates.length > 1 && coordinates[0][0] === coordinates[1][0]
      ? "horizontal"
      : "vertical";
}

function clearPreview(boardElement) {
  boardElement
    .querySelectorAll(".preview")
    .forEach((cell) => cell.classList.remove("preview", "invalid"));
}

function renderPreview(pos, boardElement, ship, direction, player, movingShip = null) {
  clearPreview(boardElement);
  const coords = getCoordinates(pos.row, pos.col, ship.length, direction);
  if (!coords) return;
  const invalid = !isValidPlacement(player, coords, movingShip);
  coords.forEach(([r, c]) => {
    const cell = boardElement.querySelector(
      `[data-row="${r}"][data-col="${c}"]`,
    );
    cell?.classList.add("preview", ...(invalid ? ["invalid"] : []));
  });
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

function isValidPlacement(player, coordinates, movingShip = null) {
  return !coordinates.some((coordinate) => {
    const occupyingShip = player.gameboard.getShipAt(coordinate);
    return occupyingShip && occupyingShip !== movingShip;
  });
}

function showPlacementError() {
  let error = document.querySelector("#placement-error");
  if (!error) {
    error = document.createElement("p");
    error.id = "placement-error";
    document.querySelector(".placement-screen .card")?.append(error);
  }
  error.textContent = "⚠ Please place all your ships before entering battle";
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
    ship.coordinates.forEach(([r, c]) => {
      element
        .querySelector(`[data-row="${r}"][data-col="${c}"]`)
        ?.classList.add("occupied");
    });

    const first = element.querySelector(
      `[data-row="${ship.coordinates[0][0]}"][data-col="${ship.coordinates[0][1]}"]`,
    );
    if (!first) return;

    const img = document.createElement("img");
    img.src = shipImages[ship.name];
    img.className = `ship-image ${ship.direction || "vertical"}`;
    img.dataset.ship = ship.name;
    img.style.setProperty("--ship-length", ship.length);
    img.draggable = true;
    first.appendChild(img);
  });
}
