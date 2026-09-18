/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js"
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createBoard: () => (/* binding */ createBoard),\n/* harmony export */   createPlacementBoard: () => (/* binding */ createPlacementBoard),\n/* harmony export */   enableShipPlacement: () => (/* binding */ enableShipPlacement),\n/* harmony export */   playMusic: () => (/* binding */ playMusic),\n/* harmony export */   playSound: () => (/* binding */ playSound),\n/* harmony export */   showScreenLoader: () => (/* binding */ showScreenLoader),\n/* harmony export */   stopMusic: () => (/* binding */ stopMusic)\n/* harmony export */ });\nconst shipImages = {\n  Carrier: new URL(/* asset import */ __webpack_require__(/*! ./images/carrier.webp */ \"./src/images/carrier.webp\"), __webpack_require__.b).href,\n  Battleship: new URL(/* asset import */ __webpack_require__(/*! ./images/battleship.webp */ \"./src/images/battleship.webp\"), __webpack_require__.b).href,\n  Cruiser: new URL(/* asset import */ __webpack_require__(/*! ./images/cruiser.webp */ \"./src/images/cruiser.webp\"), __webpack_require__.b).href,\n  Submarine: new URL(/* asset import */ __webpack_require__(/*! ./images/submarine.webp */ \"./src/images/submarine.webp\"), __webpack_require__.b).href,\n  Destroyer: new URL(/* asset import */ __webpack_require__(/*! ./images/destroyer.webp */ \"./src/images/destroyer.webp\"), __webpack_require__.b).href\n};\nconst audioFiles = {\n  button: new URL(/* asset import */ __webpack_require__(/*! ./audio/button-wave.mp3 */ \"./src/audio/button-wave.mp3\"), __webpack_require__.b).href,\n  placement: new URL(/* asset import */ __webpack_require__(/*! ./audio/placement-sea.mp3 */ \"./src/audio/placement-sea.mp3\"), __webpack_require__.b).href,\n  battle: new URL(/* asset import */ __webpack_require__(/*! ./audio/battle-sea.mp3 */ \"./src/audio/battle-sea.mp3\"), __webpack_require__.b).href,\n  hit: new URL(/* asset import */ __webpack_require__(/*! ./audio/hit.mp3 */ \"./src/audio/hit.mp3\"), __webpack_require__.b).href,\n  miss: new URL(/* asset import */ __webpack_require__(/*! ./audio/miss.mp3 */ \"./src/audio/miss.mp3\"), __webpack_require__.b).href,\n  victory: new URL(/* asset import */ __webpack_require__(/*! ./audio/victory.mp3 */ \"./src/audio/victory.mp3\"), __webpack_require__.b).href\n};\nconst audioPool = Object.fromEntries(Object.entries(audioFiles).map(([name, src]) => {\n  const audio = new Audio(src);\n  audio.preload = \"auto\";\n  return [name, audio];\n}));\nlet currentMusic = null;\nfunction playMusic(name) {\n  stopMusic();\n  const music = audioPool[name];\n  if (!music) return;\n  currentMusic = music;\n  currentMusic.loop = true;\n  currentMusic.currentTime = 0;\n  currentMusic.volume = 0.35;\n  currentMusic.play().catch(() => {});\n}\nfunction stopMusic() {\n  if (!currentMusic) return;\n  currentMusic.pause();\n  currentMusic.currentTime = 0;\n  currentMusic.loop = false;\n  currentMusic = null;\n}\nfunction playSound(name) {\n  const source = audioPool[name];\n  if (!source) return;\n  const sound = source.cloneNode(true);\n  sound.preload = \"auto\";\n  sound.loop = false;\n  sound.volume = 0.45;\n  sound.currentTime = 0;\n  sound.play().catch(() => {});\n}\nfunction showScreenLoader(message, callback, duration = 750) {\n  const existing = document.querySelector(\".screen-loader\");\n  existing?.remove();\n  const loader = document.createElement(\"div\");\n  loader.className = \"screen-loader screen-enter\";\n  loader.innerHTML = `\n    <div class=\"screen-loader-card\">\n      <div class=\"loader-ship\">⚓</div>\n      <h2>${message}</h2>\n      <div class=\"loader-wave\" aria-hidden=\"true\">\n        <span></span><span></span><span></span>\n      </div>\n    </div>\n  `;\n  document.body.appendChild(loader);\n  window.setTimeout(() => {\n    loader.classList.add(\"screen-loader-leave\");\n    window.setTimeout(() => {\n      loader.remove();\n      callback?.();\n    }, 220);\n  }, duration);\n}\nfunction createPlacementBoard(boardElement, player, callback) {\n  createBoard(boardElement, player.gameboard, player.name);\n  enableShipPlacement(boardElement, player, callback);\n}\nfunction enableShipPlacement(boardElement, player, onReady) {\n  let selectedShip = null;\n  let direction = \"vertical\";\n  let preview = null;\n  let draggedShip = null;\n  let wasDragging = false;\n  let touchDragging = false;\n  const buttons = [...document.querySelectorAll(\".ship-option\")];\n  buttons.forEach(button => {\n    button.onclick = () => {\n      if (button.classList.contains(\"placed\")) return;\n      selectedShip = {\n        name: button.dataset.ship,\n        length: Number(button.dataset.length)\n      };\n      buttons.forEach(b => b.classList.remove(\"active\"));\n      button.classList.add(\"active\");\n    };\n  });\n  const confirmButton = document.querySelector(\"#confirm-placement\");\n  if (confirmButton) {\n    confirmButton.onclick = () => {\n      const ready = player.gameboard.ships.length === 5 && player.gameboard.ships.reduce((sum, ship) => sum + ship.length, 0) === 17;\n      if (!ready) {\n        showPlacementError();\n        return;\n      }\n      clearPlacementError();\n      onReady?.();\n    };\n  }\n  boardElement.querySelectorAll(\".cell\").forEach(cell => {\n    cell.onmouseenter = () => {\n      if (!selectedShip || touchDragging) return;\n      preview = {\n        row: +cell.dataset.row,\n        col: +cell.dataset.col\n      };\n      renderPreview(preview, boardElement, selectedShip, direction, player);\n    };\n    cell.onclick = () => {\n      if (!selectedShip || !preview || touchDragging) return;\n      const coordinates = getCoordinates(preview.row, preview.col, selectedShip.length, direction);\n      if (!coordinates || !isValidPlacement(player, coordinates)) return;\n      player.placeShip(selectedShip.length, coordinates, selectedShip.name);\n      document.querySelector(`[data-ship=\"${selectedShip.name}\"]`)?.classList.add(\"placed\");\n      selectedShip = null;\n      preview = null;\n      clearPlacementError();\n      createBoard(boardElement, player.gameboard, player.name);\n      enableShipPlacement(boardElement, player, onReady);\n    };\n    cell.ondragover = event => {\n      if (!draggedShip) return;\n      event.preventDefault();\n      event.dataTransfer.dropEffect = \"move\";\n      const ship = draggedShip.ship;\n      const row = Number(cell.dataset.row);\n      const col = Number(cell.dataset.col);\n      const shipDirection = ship.direction || \"vertical\";\n      renderPreview({\n        row,\n        col\n      }, boardElement, {\n        name: ship.name,\n        length: ship.length\n      }, shipDirection, ship);\n    };\n    cell.ondrop = event => {\n      event.preventDefault();\n      if (!draggedShip) return;\n      const ship = draggedShip.ship;\n      const coordinates = getCoordinates(Number(cell.dataset.row), Number(cell.dataset.col), ship.length, ship.direction || \"vertical\");\n      if (!coordinates || !isValidPlacement(player, coordinates, ship)) {\n        clearPreview(boardElement);\n        draggedShip = null;\n        return;\n      }\n      movePlacedShip(player, ship, coordinates);\n      draggedShip = null;\n      clearPreview(boardElement);\n      createBoard(boardElement, player.gameboard, player.name);\n      enableShipPlacement(boardElement, player, onReady);\n    };\n  });\n  boardElement.querySelectorAll(\".ship-image\").forEach(img => {\n    const shipName = img.dataset.ship;\n    const ship = player.gameboard.ships.find(item => item.name === shipName);\n    if (!ship) return;\n    img.draggable = true;\n    img.style.touchAction = \"none\";\n    img.onclick = event => {\n      event.stopPropagation();\n      if (wasDragging || touchDragging) {\n        wasDragging = false;\n        return;\n      }\n      rotatePlacedShip(boardElement, player, ship, onReady);\n    };\n    img.ondragstart = event => {\n      wasDragging = true;\n      draggedShip = {\n        ship\n      };\n      event.dataTransfer.effectAllowed = \"move\";\n      event.dataTransfer.setData(\"text/plain\", ship.name);\n      img.classList.add(\"dragging\");\n    };\n    img.ondragend = () => {\n      img.classList.remove(\"dragging\");\n      draggedShip = null;\n      clearPreview(boardElement);\n    };\n\n    // Native HTML drag-and-drop does not work reliably on touch screens.\n    // Pointer events provide the same drag/preview/drop behavior for phones and tablets.\n    img.onpointerdown = event => {\n      if (event.pointerType === \"mouse\") return;\n      event.preventDefault();\n      event.stopPropagation();\n      touchDragging = true;\n      wasDragging = true;\n      draggedShip = {\n        ship\n      };\n      img.classList.add(\"dragging\");\n      img.setPointerCapture?.(event.pointerId);\n\n      // Let elementFromPoint() see the board cells instead of the ship image.\n      img.style.pointerEvents = \"none\";\n      updateTouchPreview(event);\n    };\n    img.onpointermove = event => {\n      if (!touchDragging || event.pointerType === \"mouse\") return;\n      event.preventDefault();\n      updateTouchPreview(event);\n    };\n    img.onpointerup = event => {\n      if (!touchDragging || event.pointerType === \"mouse\") return;\n      event.preventDefault();\n      finishTouchDrag(event, img, ship);\n    };\n    img.onpointercancel = () => {\n      if (!touchDragging) return;\n      cancelTouchDrag(img);\n    };\n    function updateTouchPreview(event) {\n      const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(\".placement-screen #player-board .cell\");\n      if (!cell) {\n        clearPreview(boardElement);\n        preview = null;\n        return;\n      }\n      const row = Number(cell.dataset.row);\n      const col = Number(cell.dataset.col);\n      preview = {\n        row,\n        col\n      };\n      renderPreview(preview, boardElement, {\n        name: ship.name,\n        length: ship.length\n      }, ship.direction || \"vertical\", player, ship);\n    }\n    function finishTouchDrag(event, image, dragged) {\n      const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(\".placement-screen #player-board .cell\");\n      const coordinates = cell ? getCoordinates(Number(cell.dataset.row), Number(cell.dataset.col), dragged.length, dragged.direction || \"vertical\") : null;\n      if (coordinates && isValidPlacement(player, coordinates, dragged)) {\n        movePlacedShip(player, dragged, coordinates);\n        clearPlacementError();\n        cleanupTouchDrag(image);\n        createBoard(boardElement, player.gameboard, player.name);\n        enableShipPlacement(boardElement, player, onReady);\n        return;\n      }\n      clearPreview(boardElement);\n      cleanupTouchDrag(image);\n    }\n    function cancelTouchDrag(image) {\n      clearPreview(boardElement);\n      cleanupTouchDrag(image);\n    }\n    function cleanupTouchDrag(image) {\n      image.style.pointerEvents = \"\";\n      image.classList.remove(\"dragging\");\n      draggedShip = null;\n      preview = null;\n      touchDragging = false;\n      window.setTimeout(() => {\n        wasDragging = false;\n      }, 0);\n    }\n  });\n}\nfunction rotatePlacedShip(boardElement, player, ship, onReady) {\n  if (!ship.coordinates?.length) return;\n  const start = ship.coordinates[0];\n  const newDirection = ship.direction === \"vertical\" ? \"horizontal\" : \"vertical\";\n  const coordinates = getCoordinates(start[0], start[1], ship.length, newDirection);\n  if (!coordinates || !isValidPlacement(player, coordinates, ship)) {\n    showPlacementError(\"⚠ This ship can not turn this way\");\n    return;\n  }\n  movePlacedShip(player, ship, coordinates);\n  clearPlacementError();\n  createBoard(boardElement, player.gameboard, player.name);\n  enableShipPlacement(boardElement, player, onReady);\n}\nfunction movePlacedShip(player, ship, coordinates) {\n  ship.coordinates.forEach(coordinate => player.gameboard.board.delete(coordinate.toString()));\n  coordinates.forEach(coordinate => player.gameboard.board.set(coordinate.toString(), ship));\n  ship.coordinates = coordinates;\n  ship.direction = coordinates.length > 1 && coordinates[0][0] === coordinates[1][0] ? \"horizontal\" : \"vertical\";\n}\nfunction clearPreview(boardElement) {\n  boardElement.querySelectorAll(\".preview\").forEach(cell => cell.classList.remove(\"preview\", \"invalid\"));\n}\nfunction renderPreview(pos, boardElement, ship, direction, player, movingShip = null) {\n  clearPreview(boardElement);\n  const coords = getCoordinates(pos.row, pos.col, ship.length, direction);\n  if (!coords) return;\n  const invalid = !isValidPlacement(player, coords, movingShip);\n  coords.forEach(([r, c]) => {\n    boardElement.querySelector(`[data-row=\"${r}\"][data-col=\"${c}\"]`)?.classList.add(\"preview\", ...(invalid ? [\"invalid\"] : []));\n  });\n}\nfunction getCoordinates(row, col, length, direction) {\n  const result = [];\n  for (let i = 0; i < length; i++) {\n    const r = direction === \"vertical\" ? row + i : row;\n    const c = direction === \"horizontal\" ? col + i : col;\n    if (r > 9 || c > 9) return null;\n    result.push([r, c]);\n  }\n  return result;\n}\nfunction isValidPlacement(player, coordinates, movingShip = null) {\n  return !coordinates.some(coordinate => {\n    const occupyingShip = player.gameboard.getShipAt(coordinate);\n    return occupyingShip && occupyingShip !== movingShip;\n  });\n}\nfunction showPlacementError(message = \"⚠ Please place all your ships before entering battle\") {\n  const error = document.querySelector(\"#placement-error\");\n  if (!error) return;\n  error.textContent = message;\n  error.classList.remove(\"hidden\");\n  clearTimeout(showPlacementError.timer);\n  showPlacementError.timer = setTimeout(() => error.classList.add(\"hidden\"), 1800);\n}\nfunction clearPlacementError() {\n  clearTimeout(showPlacementError.timer);\n  document.querySelector(\"#placement-error\")?.classList.add(\"hidden\");\n}\nfunction createBoard(element, gameboard = null, playerName = \"\", hideShips = false) {\n  if (!element) return;\n  element.innerHTML = \"\";\n  const board = document.createElement(\"div\");\n  board.className = \"board\";\n  for (let row = 0; row < 10; row++) {\n    for (let col = 0; col < 10; col++) {\n      const cell = document.createElement(\"div\");\n      cell.className = \"cell\";\n      cell.dataset.row = row;\n      cell.dataset.col = col;\n      board.appendChild(cell);\n    }\n  }\n  element.appendChild(board);\n  renderShips(element, gameboard, hideShips);\n  renderAttackMarkers(element, gameboard);\n}\nfunction renderShips(element, gameboard, hideShips) {\n  if (hideShips) return;\n  gameboard?.ships?.forEach(ship => {\n    ship.coordinates.forEach(([r, c]) => {\n      element.querySelector(`[data-row=\"${r}\"][data-col=\"${c}\"]`)?.classList.add(\"occupied\");\n    });\n    const first = element.querySelector(`[data-row=\"${ship.coordinates[0][0]}\"][data-col=\"${ship.coordinates[0][1]}\"]`);\n    if (!first) return;\n    const img = document.createElement(\"img\");\n    img.src = shipImages[ship.name];\n    img.className = `ship-image ${ship.direction || \"vertical\"}`;\n    img.dataset.ship = ship.name;\n    img.style.setProperty(\"--ship-length\", ship.length);\n    img.draggable = true;\n    first.appendChild(img);\n  });\n}\nfunction renderAttackMarkers(element, gameboard) {\n  gameboard?.attackedCoordinates?.forEach(key => {\n    const [row, col] = key.split(\",\").map(Number);\n    const cell = element.querySelector(`[data-row=\"${row}\"][data-col=\"${col}\"]`);\n    if (!cell) return;\n    const result = gameboard.getAttackResult([row, col]);\n    const marker = document.createElement(\"span\");\n    marker.className = `attack-marker ${result}`;\n    marker.textContent = result === \"hit\" ? \"💥\" : \"💧\";\n    cell.appendChild(marker);\n  });\n}\n\n//# sourceURL=webpack://battleship/./src/dom.js?\n}");

/***/ },

/***/ "./src/game.js"
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ \"./src/player.js\");\n\nclass Game {\n  constructor(mode = \"computer\") {\n    this.mode = mode;\n    this.player1 = new _player__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"Player\", \"blue\", false);\n    this.player2 = new _player__WEBPACK_IMPORTED_MODULE_0__[\"default\"](mode === \"computer\" ? \"Computer\" : \"Player 2\");\n    this.currentPlayer = this.player1;\n  }\n  startGame() {\n    if (this.player1.gameboard.ships.length === 0) {\n      this.player1.placeShips();\n    }\n  }\n  switchTurn() {\n    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;\n  }\n  getOpponent(player) {\n    return player === this.player1 ? this.player2 : this.player1;\n  }\n  attack(coordinate) {\n    const opponent = this.getOpponent(this.currentPlayer);\n    const result = this.currentPlayer.attack(opponent.gameboard, coordinate);\n    if (result !== \"already\" && !this.isGameOver()) {\n      this.switchTurn();\n    }\n    return result;\n  }\n  computerTurn() {\n    if (this.mode !== \"computer\" || this.currentPlayer !== this.player2 || this.isGameOver()) {\n      return null;\n    }\n    const result = this.player2.computerAttack(this.player1.gameboard);\n    if (!this.isGameOver()) {\n      this.switchTurn();\n    }\n    return result;\n  }\n  playTurn(coordinate) {\n    const result = this.attack(coordinate);\n    if (this.mode === \"computer\" && result !== \"already\" && !this.isGameOver()) {\n      this.computerTurn();\n    }\n    return result;\n  }\n  isGameOver() {\n    return this.player1.gameboard.allShipsSunk() || this.player2.gameboard.allShipsSunk();\n  }\n  getWinner() {\n    if (this.player2.gameboard.allShipsSunk()) return this.player1;\n    if (this.player1.gameboard.allShipsSunk()) return this.player2;\n    return null;\n  }\n}\n\n//# sourceURL=webpack://battleship/./src/game.js?\n}");

/***/ },

/***/ "./src/gameFlow.js"
/*!*************************!*\
  !*** ./src/gameFlow.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   startGameFlow: () => (/* binding */ startGameFlow)\n/* harmony export */ });\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ \"./src/dom.js\");\n\n\nlet activeGame = null;\nlet computerTimer = null;\nfunction startGameFlow(mode = \"computer\", existingGame = null) {\n  const game = existingGame || new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"](mode);\n  activeGame = game;\n  clearTimeout(computerTimer);\n  const playerBoard = document.querySelector(\"#player-board\");\n  const placementScreen = document.querySelector(\"#placement-screen\");\n  const modeScreen = document.querySelector(\"#mode-screen\");\n  const gameScreen = document.querySelector(\"#game\");\n  const readyModal = document.querySelector(\"#ready-modal\");\n  const winnerModal = document.querySelector(\"#winner-modal\");\n  const quitModal = document.querySelector(\"#quit-modal\");\n  const exitModal = document.querySelector(\"#exit-modal\");\n  if (!playerBoard || !placementScreen) return game;\n  modeScreen?.classList.add(\"hidden\");\n  gameScreen?.classList.add(\"hidden\");\n  placementScreen.classList.remove(\"hidden\");\n  readyModal?.classList.add(\"hidden\");\n  winnerModal?.classList.add(\"hidden\");\n  quitModal?.classList.add(\"hidden\");\n  exitModal?.classList.add(\"hidden\");\n  document.querySelectorAll(\".ship-option\").forEach(button => {\n    button.classList.remove(\"placed\", \"active\");\n  });\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playMusic)(\"placement\");\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.createPlacementBoard)(playerBoard, game.player1, () => showReadyModal(() => startBattle(game)));\n  connectBackButtons();\n  connectGlobalExitControls();\n  return game;\n}\nfunction startBattle(game) {\n  const placementScreen = document.querySelector(\"#placement-screen\");\n  const gameScreen = document.querySelector(\"#game\");\n  const yourBoard = document.querySelector(\"#your-board\");\n  const enemyBoard = document.querySelector(\"#enemy-board\");\n  if (!gameScreen || !yourBoard || !enemyBoard) return;\n  placementScreen?.classList.add(\"hidden\");\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.showScreenLoader)(\"Entering battle...\", () => {\n    gameScreen.classList.remove(\"hidden\");\n    gameScreen.classList.remove(\"screen-enter\");\n    void gameScreen.offsetWidth;\n    gameScreen.classList.add(\"screen-enter\");\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playMusic)(\"battle\");\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.createBoard)(yourBoard, game.player1.gameboard, game.player1.name, false);\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.createBoard)(enemyBoard, game.player2.gameboard, game.player2.name, true);\n    connectEnemyBoard(game);\n    connectBattleControls();\n    updateTurn(\"Player Turn\");\n  });\n}\nfunction connectEnemyBoard(game) {\n  const board = document.querySelector(\"#enemy-board\");\n  if (!board) return;\n  board.onclick = event => {\n    const cell = event.target.closest(\".cell\");\n    if (!cell || game.currentPlayer !== game.player1 || game.isGameOver()) return;\n    const coordinate = [Number(cell.dataset.row), Number(cell.dataset.col)];\n    const result = game.attack(coordinate);\n    if (result === \"already\") return;\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.createBoard)(board, game.player2.gameboard, game.player2.name, true);\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(result === \"hit\" ? \"hit\" : \"miss\");\n    if (game.isGameOver()) {\n      showWinnerModal(game);\n      return;\n    }\n    updateTurn(\"Enemy Turn\");\n    board.style.pointerEvents = \"none\";\n    if (game.mode === \"computer\" && game.currentPlayer === game.player2) {\n      computerTimer = setTimeout(() => {\n        const computerResult = game.computerTurn();\n        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.createBoard)(document.querySelector(\"#your-board\"), game.player1.gameboard, game.player1.name, false);\n        if (computerResult) (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(computerResult === \"hit\" ? \"hit\" : \"miss\");\n        if (game.isGameOver()) {\n          showWinnerModal(game);\n        } else {\n          board.style.pointerEvents = \"auto\";\n          updateTurn(\"Player Turn\");\n        }\n      }, 2500);\n    }\n  };\n}\nfunction connectBattleControls() {\n  const quit = document.querySelector(\"#quit-game\");\n  const continueButton = document.querySelector(\"#continue-game\");\n  const mainMenu = document.querySelector(\"#main-menu\");\n  const restart = document.querySelector(\"#play-again\");\n  const winnerMenu = document.querySelector(\"#winner-main-menu\");\n  const winnerStay = document.querySelector(\"#winner-cancel\");\n  if (quit) quit.onclick = showQuitModal;\n  if (continueButton) continueButton.onclick = hideQuitModal;\n  if (mainMenu) mainMenu.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    returnToStart();\n  };\n  if (restart) restart.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    restartGame();\n  };\n  if (winnerMenu) winnerMenu.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    returnToStart();\n  };\n  if (winnerStay) winnerStay.onclick = hideWinnerModal;\n}\nfunction connectBackButtons() {\n  const placementBack = document.querySelector(\"#placement-back\");\n  if (placementBack) placementBack.onclick = showExitModal;\n  const modeBack = document.querySelector(\"#mode-back\");\n  if (modeBack) modeBack.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    returnToStart();\n  };\n}\nfunction connectGlobalExitControls() {\n  const confirmExit = document.querySelector(\"#confirm-exit\");\n  const cancelExit = document.querySelector(\"#cancel-exit\");\n  if (confirmExit) confirmExit.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    returnToStart();\n  };\n  if (cancelExit) cancelExit.onclick = hideExitModal;\n}\nfunction showReadyModal(callback) {\n  const modal = document.querySelector(\"#ready-modal\");\n  const startButton = document.querySelector(\"#start-battle\");\n  const cancelButton = document.querySelector(\"#cancel-ready\");\n  if (!modal || !startButton) {\n    callback();\n    return;\n  }\n  modal.classList.remove(\"hidden\");\n  startButton.onclick = () => {\n    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n    modal.classList.add(\"hidden\");\n    callback();\n  };\n  if (cancelButton) cancelButton.onclick = () => modal.classList.add(\"hidden\");\n}\nfunction showExitModal() {\n  document.querySelector(\"#exit-modal\")?.classList.remove(\"hidden\");\n}\nfunction hideExitModal() {\n  document.querySelector(\"#exit-modal\")?.classList.add(\"hidden\");\n}\nfunction showQuitModal() {\n  document.querySelector(\"#quit-modal\")?.classList.remove(\"hidden\");\n}\nfunction hideQuitModal() {\n  document.querySelector(\"#quit-modal\")?.classList.add(\"hidden\");\n}\nfunction hideWinnerModal() {\n  document.querySelector(\"#winner-modal\")?.classList.add(\"hidden\");\n}\nfunction returnToStart() {\n  clearTimeout(computerTimer);\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.stopMusic)();\n  window.location.reload();\n}\nfunction restartGame() {\n  clearTimeout(computerTimer);\n  const mode = activeGame?.mode || \"computer\";\n  startGameFlow(mode, new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"](mode));\n}\nfunction showWinnerModal(game) {\n  const modal = document.querySelector(\"#winner-modal\");\n  const text = document.querySelector(\"#winner-text\");\n  const winner = game.getWinner();\n  if (!modal || !text || !winner) return;\n  text.textContent = `${winner.name} wins!`;\n  modal.classList.remove(\"hidden\");\n}\nfunction updateTurn(text) {\n  const turn = document.querySelector(\"#turn-status\");\n  if (turn) turn.textContent = text;\n}\n\n//# sourceURL=webpack://battleship/./src/gameFlow.js?\n}");

/***/ },

/***/ "./src/gameboard.js"
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gameboard)\n/* harmony export */ });\nclass Gameboard {\n  constructor() {\n    this.ships = [];\n    this.board = new Map();\n    this.missedAttacks = [];\n    this.attackedCoordinates = new Set();\n  }\n  placeShip(ship, coordinates) {\n    if (coordinates.length !== ship.length) {\n      throw new Error(\"Invalid ship placement\");\n    }\n    const keys = coordinates.map(position => position.toString());\n    if (keys.some(key => this.board.has(key))) {\n      throw new Error(\"Position already occupied\");\n    }\n    keys.forEach(key => {\n      this.board.set(key, ship);\n    });\n    ship.coordinates = coordinates;\n    ship.direction = coordinates.length > 1 && coordinates[0][0] === coordinates[1][0] ? \"horizontal\" : \"vertical\";\n    this.ships.push(ship);\n  }\n  getShipAt(coordinate) {\n    return this.board.get(coordinate.toString());\n  }\n  receiveAttack(coordinate) {\n    const key = coordinate.toString();\n    if (this.attackedCoordinates.has(key)) {\n      return \"already\";\n    }\n    this.attackedCoordinates.add(key);\n    const ship = this.board.get(key);\n    if (ship) {\n      ship.hit();\n      return \"hit\";\n    }\n    this.missedAttacks.push(coordinate);\n    return \"miss\";\n  }\n  hasBeenAttacked(coordinate) {\n    return this.attackedCoordinates.has(coordinate.toString());\n  }\n  getAttackResult(coordinate) {\n    const key = coordinate.toString();\n    if (!this.attackedCoordinates.has(key)) {\n      return null;\n    }\n    return this.board.has(key) ? \"hit\" : \"miss\";\n  }\n  getShipStatus() {\n    return this.ships.map(ship => ({\n      name: ship.name,\n      length: ship.length,\n      hits: ship.hits,\n      sunk: ship.isSunk()\n    }));\n  }\n  allShipsSunk() {\n    return this.ships.length === 5 && this.ships.every(ship => ship.isSunk());\n  }\n  clear() {\n    this.ships = [];\n    this.board.clear();\n    this.missedAttacks = [];\n    this.attackedCoordinates.clear();\n  }\n}\n\n//# sourceURL=webpack://battleship/./src/gameboard.js?\n}");

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gameFlow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameFlow */ \"./src/gameFlow.js\");\n/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ \"./src/dom.js\");\n/* harmony import */ var _images_ship_webp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/ship.webp */ \"./src/images/ship.webp\");\n\n\n\n\n\n\nconst startScreen = document.querySelector(\"#start-screen\");\nconst modeScreen = document.querySelector(\"#mode-screen\");\nconst placementScreen = document.querySelector(\"#placement-screen\");\nconst startButton = document.querySelector(\"#start-game\");\nconst computerButton = document.querySelector(\"#computer-mode\");\nconst playerButton = document.querySelector(\"#player-mode\");\nconst modeBackButton = document.querySelector(\"#mode-back\");\nconst shipImage = document.querySelector(\".main-ship-image\");\nconst SCREEN_DELAY = 120;\nif (shipImage) shipImage.src = _images_ship_webp__WEBPACK_IMPORTED_MODULE_2__;\nif (\"serviceWorker\" in navigator) {\n  window.addEventListener(\"load\", () => {\n    navigator.serviceWorker.register(\"./sw.js\").catch(error => {\n      console.error(\"Service Worker registration failed:\", error);\n    });\n  });\n}\nfunction showScreen(screen) {\n  if (!screen) return;\n  screen.classList.remove(\"hidden\");\n  screen.classList.remove(\"screen-enter\");\n  void screen.offsetWidth;\n  screen.classList.add(\"screen-enter\");\n}\nfunction switchScreen(from, to) {\n  from?.classList.add(\"hidden\");\n  window.setTimeout(() => showScreen(to), SCREEN_DELAY);\n}\nstartButton?.addEventListener(\"click\", () => {\n  ;(0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n  switchScreen(startScreen, modeScreen);\n});\nmodeBackButton?.addEventListener(\"click\", () => {\n  switchScreen(modeScreen, startScreen);\n});\ncomputerButton?.addEventListener(\"click\", () => {\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.playSound)(\"button\");\n  modeScreen?.classList.add(\"hidden\");\n  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.showScreenLoader)(\"Preparing your fleet...\", () => (0,_gameFlow__WEBPACK_IMPORTED_MODULE_0__.startGameFlow)(\"computer\"));\n});\nplayerButton?.addEventListener(\"click\", () => {\n  alert(\"Player vs Player is not available yet.\");\n});\n\n//# sourceURL=webpack://battleship/./src/index.js?\n}");

/***/ },

/***/ "./src/player.js"
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ \"./src/gameboard.js\");\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\n\n\nclass Player {\n  constructor(name, color, autoPlace = true) {\n    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.name = name;\n    this.color = color;\n    this.attacksMade = new Set();\n    this.targetQueue = [];\n    this.fleet = [{\n      name: \"Carrier\",\n      length: 5\n    }, {\n      name: \"Battleship\",\n      length: 4\n    }, {\n      name: \"Cruiser\",\n      length: 3\n    }, {\n      name: \"Submarine\",\n      length: 3\n    }, {\n      name: \"Destroyer\",\n      length: 2\n    }];\n    this.shipLengths = this.fleet.map(({\n      length\n    }) => length);\n    if (autoPlace) this.placeShips();\n  }\n  placeShips() {\n    this.clearBoard();\n    for (const {\n      name,\n      length\n    } of this.fleet) {\n      let placed = false;\n      while (!placed) {\n        try {\n          this.placeShip(length, this.generateCoordinates(length), name);\n          placed = true;\n        } catch (error) {}\n      }\n    }\n  }\n  placeShip(length, coordinates, name = \"Ship\") {\n    const ship = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](length, name);\n    this.gameboard.placeShip(ship, coordinates);\n  }\n  generateCoordinates(length) {\n    const horizontal = Math.random() < 0.5;\n    const row = Math.floor(Math.random() * 10);\n    const col = Math.floor(Math.random() * 10);\n    const coordinates = [];\n    for (let i = 0; i < length; i++) {\n      const r = horizontal ? row : row + i;\n      const c = horizontal ? col + i : col;\n      if (r > 9 || c > 9) return this.generateCoordinates(length);\n      coordinates.push([r, c]);\n    }\n    return coordinates;\n  }\n  clearBoard() {\n    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  }\n  attack(enemyBoard, coordinate) {\n    if (this.attacksMade.has(coordinate.toString())) return \"already\";\n    this.attacksMade.add(coordinate.toString());\n    return enemyBoard.receiveAttack(coordinate);\n  }\n  computerAttack(enemyBoard) {\n    let coordinate;\n    do {\n      coordinate = this.targetQueue.shift() || [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];\n    } while (this.attacksMade.has(coordinate.toString()));\n    this.attacksMade.add(coordinate.toString());\n    const result = enemyBoard.receiveAttack(coordinate);\n    if (result === \"hit\") this.addTargetsAround(coordinate);\n    return result;\n  }\n  addTargetsAround([row, col]) {\n    [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {\n      if (r >= 0 && r < 10 && c >= 0 && c < 10) {\n        const key = [r, c].toString();\n        if (!this.attacksMade.has(key)) this.targetQueue.push([r, c]);\n      }\n    });\n  }\n}\n\n//# sourceURL=webpack://battleship/./src/player.js?\n}");

/***/ },

/***/ "./src/ship.js"
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ship)\n/* harmony export */ });\nclass Ship {\n  constructor(length, name = \"Ship\") {\n    this.name = name;\n    this.length = length;\n    this.hits = 0;\n  }\n  hit() {\n    this.hits++;\n  }\n  isSunk() {\n    return this.hits >= this.length;\n  }\n}\n\n//# sourceURL=webpack://battleship/./src/ship.js?\n}");

/***/ },

/***/ "./src/audio/battle-sea.mp3"
/*!**********************************!*\
  !*** ./src/audio/battle-sea.mp3 ***!
  \**********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"250ac02084e5536836bb.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/battle-sea.mp3?\n}");

/***/ },

/***/ "./src/audio/button-wave.mp3"
/*!***********************************!*\
  !*** ./src/audio/button-wave.mp3 ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"e8be16656f51e91bd1bc.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/button-wave.mp3?\n}");

/***/ },

/***/ "./src/audio/hit.mp3"
/*!***************************!*\
  !*** ./src/audio/hit.mp3 ***!
  \***************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"9c3205f5f124eb0c670b.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/hit.mp3?\n}");

/***/ },

/***/ "./src/audio/miss.mp3"
/*!****************************!*\
  !*** ./src/audio/miss.mp3 ***!
  \****************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"56cedb67a2f2e71a4fb6.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/miss.mp3?\n}");

/***/ },

/***/ "./src/audio/placement-sea.mp3"
/*!*************************************!*\
  !*** ./src/audio/placement-sea.mp3 ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"fc4dd5e7fe85103f256e.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/placement-sea.mp3?\n}");

/***/ },

/***/ "./src/audio/victory.mp3"
/*!*******************************!*\
  !*** ./src/audio/victory.mp3 ***!
  \*******************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"e6dd7b223b725697afa3.mp3\";\n\n//# sourceURL=webpack://battleship/./src/audio/victory.mp3?\n}");

/***/ },

/***/ "./src/images/battleship.webp"
/*!************************************!*\
  !*** ./src/images/battleship.webp ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"111210881c88772285c3.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/battleship.webp?\n}");

/***/ },

/***/ "./src/images/carrier.webp"
/*!*********************************!*\
  !*** ./src/images/carrier.webp ***!
  \*********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"72b7aee67a910fc503f3.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/carrier.webp?\n}");

/***/ },

/***/ "./src/images/cruiser.webp"
/*!*********************************!*\
  !*** ./src/images/cruiser.webp ***!
  \*********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"e103b6a84c8a1b46ec43.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/cruiser.webp?\n}");

/***/ },

/***/ "./src/images/destroyer.webp"
/*!***********************************!*\
  !*** ./src/images/destroyer.webp ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"945e39c546d7a80dbf4b.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/destroyer.webp?\n}");

/***/ },

/***/ "./src/images/ship.webp"
/*!******************************!*\
  !*** ./src/images/ship.webp ***!
  \******************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"96ba390dc4c8e347da8d.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/ship.webp?\n}");

/***/ },

/***/ "./src/images/submarine.webp"
/*!***********************************!*\
  !*** ./src/images/submarine.webp ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{module.exports = __webpack_require__.p + \"3d6de6657e8085067696.webp\";\n\n//# sourceURL=webpack://battleship/./src/images/submarine.webp?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^https?:/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:|[?#].*$/g, "").replace(/\/[^/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = (typeof document !== 'undefined' && document.baseURI) || self.location.href;
/******/ 		
/******/ 		// no installed chunks
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	let __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;