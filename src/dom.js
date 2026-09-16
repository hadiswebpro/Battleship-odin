const shipImages = {
  Carrier: "",
  Battleship: "",
  Cruiser: "",
  Submarine: "",
  Destroyer: "",
};

const sounds = {};

export function loadSounds() {
  ["ocean", "click", "hit", "miss", "victory"].forEach((name) => {
    const audio = new Audio(`./sounds/${name}.mp3`);
    audio.preload = "auto";
    sounds[name] = audio;
  });
}

export function playSound(name) {
  if (!sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play().catch(() => {});
}

export function connectModeSelection(startGame) {
  document.querySelector("#player-vs-computer")?.addEventListener("click", () => startGame("computer"));
  document.querySelector("#player-vs-player")?.addEventListener("click", () => startGame("player"));
}

export function enableShipPlacement(boardElement, player, onReady) {
  let selectedShip = null;
  let direction = "horizontal";

  document.querySelectorAll(".ship-option").forEach((button) => {
    const select = () => {
      selectedShip = {
        name: button.dataset.ship,
        length: Number(button.dataset.length),
      };
      document.querySelectorAll(".ship-option").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      playSound("click");
    };

    button.addEventListener("click", select);
    button.draggable = true;
    button.addEventListener("dragstart", select);
  });

  document.querySelector(".rotate-ship")?.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
    playSound("click");
  });

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (selectedShip) showPlacementPreview(boardElement, cell, selectedShip, direction, player);
    });

    cell.addEventListener("mouseenter", () => {
      if (selectedShip) showPlacementPreview(boardElement, cell, selectedShip, direction, player);
    });

    cell.addEventListener("mouseleave", clearPreview);

    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      placeSelectedShip(cell);
    });

    cell.addEventListener("click", () => placeSelectedShip(cell));
  });

  document.querySelector(".confirm-placement")?.addEventListener("click", () => {
    onReady?.();
  });

  function placeSelectedShip(cell) {
    if (!selectedShip) return;

    const coordinates = getCoordinates(
      Number(cell.dataset.row),
      Number(cell.dataset.col),
      selectedShip.length,
      direction
    );

    if (!coordinates || !isValidPlacement(player, coordinates)) return;

    try {
      player.placeShip(selectedShip.length, coordinates, selectedShip.name);
      playSound("click");
      selectedShip = null;
      clearPreview();
      createBoard(boardElement.parentElement, player.gameboard, player.name, false);
    } catch (error) {}
  }
}

function isValidPlacement(player, coordinates) {
  return !coordinates.some((coordinate) => player.gameboard.getShipAt(coordinate));
}

function getCoordinates(row, col, length, direction) {
  const coordinates = [];

  for (let i = 0; i < length; i++) {
    const r = direction === "vertical" ? row + i : row;
    const c = direction === "horizontal" ? col + i : col;

    if (r > 9 || c > 9) return null;
    coordinates.push([r, c]);
  }

  return coordinates;
}

function showPlacementPreview(board, cell, ship, direction, player) {
  clearPreview();

  const coordinates = getCoordinates(
    Number(cell.dataset.row),
    Number(cell.dataset.col),
    ship.length,
    direction
  );

  const valid = coordinates && isValidPlacement(player, coordinates);

  if (!coordinates) return;

  coordinates.forEach(([row, col]) => {
    board.querySelector(`[data-row="${row}"][data-col="${col}"]`)
      ?.classList.add(valid ? "preview" : "invalid-preview");
  });
}

function clearPreview() {
  document.querySelectorAll(".preview,.invalid-preview").forEach((cell) => {
    cell.classList.remove("preview", "invalid-preview");
  });
}

export function createBoard(element, gameboard = null, playerName = "", hideShips = false) {
  element.innerHTML = "";
  const board = document.createElement("div");
  board.className = "board";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      const ship = gameboard?.getShipAt([row, col]);
      if (ship && !hideShips && shipImages[ship.name]) {
        const image = document.createElement("img");
        image.className = "ship-image";
        image.src = `./images/ships/${shipImages[ship.name]}`;
        image.alt = ship.name;
        cell.appendChild(image);
      }

      board.appendChild(cell);
    }
  }

  element.appendChild(board);
}
