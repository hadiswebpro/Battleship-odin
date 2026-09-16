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
  document.querySelector("#player-vs-computer")?.addEventListener("click", () => {
    startGame("computer");
  });

  document.querySelector("#player-vs-player")?.addEventListener("click", () => {
    startGame("player");
  });
}

export function enableShipPlacement(boardElement, player) {
  let selectedShip = null;
  let direction = "horizontal";

  document.querySelectorAll(".ship-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedShip = {
        name: button.dataset.ship,
        length: Number(button.dataset.length),
      };

      document.querySelectorAll(".ship-option").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      playSound("click");
    });
  });

  document.querySelector(".rotate-ship")?.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
  });

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      if (!selectedShip) return;
      showPlacementPreview(boardElement, cell, selectedShip.length, direction);
    });

    cell.addEventListener("mouseleave", clearPreview);

    cell.addEventListener("click", () => {
      if (!selectedShip) return;

      const coordinates = getCoordinates(
        Number(cell.dataset.row),
        Number(cell.dataset.col),
        selectedShip.length,
        direction
      );

      if (!coordinates) return;

      try {
        player.placeShip(
          selectedShip.length,
          coordinates,
          selectedShip.name
        );

        selectedShip = null;
        clearPreview();
        playSound("click");
      } catch (error) {}
    });
  });
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

function showPlacementPreview(board, cell, length, direction) {
  clearPreview();

  const coordinates = getCoordinates(
    Number(cell.dataset.row),
    Number(cell.dataset.col),
    length,
    direction
  );

  if (!coordinates) return;

  coordinates.forEach(([row, col]) => {
    board.querySelector(`[data-row="${row}"][data-col="${col}"]`)
      ?.classList.add("preview");
  });
}

function clearPreview() {
  document.querySelectorAll(".preview").forEach((cell) => {
    cell.classList.remove("preview");
  });
}

export function createBoard(element, gameboard = null, playerName = "", hideShips = false) {
  element.innerHTML = "";
  element.classList.add("board-wrapper");

  if (playerName) {
    const title = document.createElement("h2");
    title.className = "board-title";
    title.textContent = playerName;
    element.appendChild(title);
  }

  const board = document.createElement("div");
  board.className = "board";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      const result = gameboard?.getAttackResult([row, col]);
      if (result) cell.classList.add(result);

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

export function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");
  if (!modal || !text) return;

  text.textContent = `${game.getWinner().name} wins!`;
  modal.classList.remove("hidden");
  playSound("victory");
}

export function addAttackListener(boardElement, game, playerBoardElement, onGameOver) {
  boardElement.addEventListener("click", event => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const result = game.playTurn([
      Number(cell.dataset.row),
      Number(cell.dataset.col),
    ]);

    if (result === "already") return;

    cell.classList.add(result);
    playSound(result);

    if (game.isGameOver()) onGameOver();
  });
}
