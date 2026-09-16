const shipImages = {
  Carrier: "",
  Battleship: "",
  Cruiser: "",
  Submarine: "",
  Destroyer: "",
};

const sounds = {
  ocean: null,
  click: null,
  hit: null,
  miss: null,
  victory: null,
};

export function loadSounds() {
  Object.keys(sounds).forEach((name) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = `./sounds/${name}.mp3`;
    sounds[name] = audio;
  });
}

export function playSound(name) {
  if (!sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play().catch(() => {});
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
      if (result) {
        cell.classList.add(result);
        playSound(result === "hit" ? "hit" : "miss");
      }

      const ship = gameboard?.getShipAt([row, col]);
      if (ship && !hideShips) {
        cell.classList.add("ship");
        cell.dataset.ship = ship.name;

        if (shipImages[ship.name]) {
          const image = document.createElement("img");
          image.className = "ship-image";
          image.src = `./images/ships/${shipImages[ship.name]}`;
          image.alt = ship.name;
          cell.appendChild(image);
        }
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

    const coordinate = [Number(cell.dataset.row), Number(cell.dataset.col)];
    const result = game.playTurn(coordinate);

    if (result === "already") return;

    cell.classList.add(result);
    playSound(result === "hit" ? "hit" : "miss");

    if (game.isGameOver()) onGameOver();
  });
}
