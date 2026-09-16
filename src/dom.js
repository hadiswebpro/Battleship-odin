const shipImages = {
  Carrier: "carrier.png",
  Battleship: "battleship.png",
  Cruiser: "cruiser.png",
  Submarine: "submarine.png",
  Destroyer: "destroyer.png",
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

export function createPlacementBoard(boardElement, player, callback) {
  createBoard(boardElement, player.gameboard, player.name);
  enableShipPlacement(boardElement, player, callback);
}

export function enableShipPlacement(boardElement, player, onReady) {
  let selectedShip = null;
  let direction = "horizontal";

  document.querySelectorAll(".ship-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedShip = {
        name: button.dataset.ship,
        length: Number(button.dataset.length),
      };
      document.querySelectorAll(".ship-option").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      playSound("click");
    });
  });

  document.querySelector(".rotate-ship")?.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
  });

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!selectedShip) return;

      const coordinates = getCoordinates(
        Number(cell.dataset.row),
        Number(cell.dataset.col),
        selectedShip.length,
        direction
      );

      if (!coordinates || !isValidPlacement(player, coordinates)) return;

      player.placeShip(selectedShip.length, coordinates, selectedShip.name);
      buttonPlaced(selectedShip.name);
      selectedShip = null;
      createBoard(boardElement, player.gameboard, player.name);
      enableShipPlacement(boardElement, player, onReady);
    });
  });

  document.querySelector(".confirm-placement")?.addEventListener("click", () => onReady?.());
}

function buttonPlaced(name) {
  document.querySelector(`[data-ship="${name}"]`)?.classList.add("disabled");
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
