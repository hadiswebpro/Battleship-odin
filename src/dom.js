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

      if (result === "hit") cell.classList.add("hit");
      if (result === "miss") cell.classList.add("miss");

      const ship = gameboard?.getShipAt([row, col]);

      if (ship && !hideShips) {
        cell.classList.add("ship");
        cell.dataset.ship = ship.name;
        cell.textContent = "🚢";
      }

      board.appendChild(cell);
    }
  }

  element.appendChild(board);
}

export function createPlacementBoard(element, player, onComplete) {
  let currentShipIndex = 0;
  let horizontal = true;

  player.clearBoard();

  const render = () => {
    createBoard(element, player.gameboard, player.name);

    const controls = document.createElement("div");
    controls.className = "placement-controls";

    const rotate = document.createElement("button");
    rotate.textContent = "Rotate ↻";
    rotate.className = "rotate-ship";
    rotate.onclick = () => {
      horizontal = !horizontal;
      render();
    };

    const info = document.createElement("p");
    const ship = player.fleet[currentShipIndex];
    info.textContent = ship
      ? `Place ${ship.name} (${ship.length})`
      : "Fleet ready 🚢";

    controls.append(rotate, info);
    element.appendChild(controls);

    element.querySelectorAll(".cell").forEach(cell => {
      cell.onclick = () => place(cell);
      cell.onmouseenter = () => preview(cell);
      cell.onmouseleave = clearPreview;
    });

    if (currentShipIndex === player.fleet.length) {
      const button = document.createElement("button");
      button.className = "confirm-placement";
      button.textContent = "Confirm Fleet 🚢";
      button.onclick = onComplete;
      element.appendChild(button);
    }
  };

  const getCoordinates = cell => {
    const ship = player.fleet[currentShipIndex];
    if (!ship) return [];

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const result = [];

    for (let i = 0; i < ship.length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;

      if (r > 9 || c > 9) return [];
      result.push([r, c]);
    }

    return result;
  };

  const clearPreview = () => {
    element.querySelectorAll(".preview,.invalid-preview").forEach(cell => {
      cell.classList.remove("preview", "invalid-preview");
    });
  };

  const preview = cell => {
    clearPreview();
    const coords = getCoordinates(cell);
    const invalid = !coords.length || coords.some(pos => player.gameboard.getShipAt(pos));

    coords.forEach(([r, c]) => {
      const target = element.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      if (target) target.classList.add(invalid ? "invalid-preview" : "preview");
    });
  };

  const place = cell => {
    const coords = getCoordinates(cell);
    if (!coords.length || coords.some(pos => player.gameboard.getShipAt(pos))) return;

    const ship = player.fleet[currentShipIndex];
    player.placeShip(ship.length, coords, ship.name);
    currentShipIndex++;
    render();
  };

  render();
}

export function showWinnerModal(game) {
  const modal = document.querySelector("#winner-modal");
  const text = document.querySelector("#winner-text");

  text.textContent = `${game.getWinner().name} wins! 🚢`;
  modal.classList.remove("hidden");
}

export function addAttackListener(boardElement, game, playerBoardElement, onGameOver) {
  boardElement.addEventListener("click", event => {
    const cell = event.target;
    if (!cell.classList.contains("cell")) return;

    const coordinate = [Number(cell.dataset.row), Number(cell.dataset.col)];
    const result = game.playTurn(coordinate);

    if (result === "already") return;

    cell.classList.add(result);

    if (game.isGameOver()) {
      onGameOver();
      return;
    }

    if (game.mode === "computer") {
      game.computerTurn();
      createBoard(playerBoardElement, game.player1.gameboard, game.player1.name);

      if (game.isGameOver()) onGameOver();
    }
  });
}
