import "./style.css";
import { startGameFlow } from "./gameFlow";

const startScreen = document.querySelector("#start-screen");
const modeScreen = document.querySelector("#mode-screen");
const startButton = document.querySelector("#start-game");
const computerButton = document.querySelector("#computer-mode");
const playerButton = document.querySelector("#player-mode");

startButton?.addEventListener("click", () => {
  startScreen?.classList.add("hidden");
  modeScreen?.classList.remove("hidden");
});

computerButton?.addEventListener("click", () => {
  modeScreen?.classList.add("hidden");
  startGameFlow("computer");
});

playerButton?.addEventListener("click", () => {
  alert("Player vs Player is not available yet.");
});
