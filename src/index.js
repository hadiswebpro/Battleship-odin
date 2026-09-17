import "./style.css";
import { startGameFlow } from "./gameFlow";
import { playSound, showScreenLoader } from "./dom";
import mainShipImage from "./images/ship.webp";

const startScreen = document.querySelector("#start-screen");
const modeScreen = document.querySelector("#mode-screen");
const placementScreen = document.querySelector("#placement-screen");
const startButton = document.querySelector("#start-game");
const computerButton = document.querySelector("#computer-mode");
const playerButton = document.querySelector("#player-mode");
const modeBackButton = document.querySelector("#mode-back");
const shipImage = document.querySelector(".main-ship-image");

const SCREEN_DELAY = 120;

if (shipImage) shipImage.src = mainShipImage;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
  });
}

function showScreen(screen) {
  if (!screen) return;
  screen.classList.remove("hidden");
  screen.classList.remove("screen-enter");
  void screen.offsetWidth;
  screen.classList.add("screen-enter");
}

function switchScreen(from, to) {
  from?.classList.add("hidden");
  window.setTimeout(() => showScreen(to), SCREEN_DELAY);
}

startButton?.addEventListener("click", () => {
  playSound("button");
  switchScreen(startScreen, modeScreen);
});

modeBackButton?.addEventListener("click", () => {
  switchScreen(modeScreen, startScreen);
});

computerButton?.addEventListener("click", () => {
  playSound("button");
  modeScreen?.classList.add("hidden");
  showScreenLoader("Preparing your fleet...", () => startGameFlow("computer"));
});

playerButton?.addEventListener("click", () => {
  alert("Player vs Player is not available yet.");
});
