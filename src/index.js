import "./style.css";
import { startGameFlow } from "./gameFlow";
import mainShipImage from "./images/ship.webp";

const startScreen = document.querySelector("#start-screen");
const modeScreen = document.querySelector("#mode-screen");
const placementScreen = document.querySelector("#placement-screen");
const startButton = document.querySelector("#start-game");
const computerButton = document.querySelector("#computer-mode");
const playerButton = document.querySelector("#player-mode");
const shipImage = document.querySelector(".main-ship-image");

if (shipImage) shipImage.src = mainShipImage;

startButton?.addEventListener("click", () => {
  startScreen?.classList.add("hidden");
  modeScreen?.classList.remove("hidden");
});

computerButton?.addEventListener("click", () => {
  modeScreen?.classList.add("hidden");
  placementScreen?.classList.remove("hidden");
  startGameFlow("computer");
});

playerButton?.addEventListener("click", () => {
  alert("Player vs Player is not available yet.");
});
