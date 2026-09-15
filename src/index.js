import Game from "./game";
import "./style.css";

import {
  createBoard,
  createPlacementBoard,
  addAttackListener,
  showWinnerModal
} from "./dom";



let game;
let selectedMode = "computer";



// ======================
// SCREENS
// ======================

const startScreen =
  document.querySelector("#start-screen");

const modeScreen =
  document.querySelector("#mode-screen");

const placementScreen =
  document.querySelector("#placement-screen");

const gameScreen =
  document.querySelector("#game");

const winnerModal =
  document.querySelector("#winner-modal");



// ======================
// BUTTONS
// ======================

const startButton =
  document.querySelector("#start-game");


const playerModeButton =
  document.querySelector("#player-mode");


const computerModeButton =
  document.querySelector("#computer-mode");


const restartButton =
  document.querySelector("#restart-game");



// ======================
// BOARDS
// ======================


const placementBoard =
  document.querySelector("#placement-board");


const playerBoard =
  document.querySelector("#player-board");


const enemyBoard =
  document.querySelector("#enemy-board");




// ======================
// START SCREEN
// ======================


startButton.addEventListener(
  "click",
  ()=>{

    startScreen.classList.add("hidden");

    modeScreen.classList.remove("hidden");

  }
);




// ======================
// SELECT MODE
// ======================


computerModeButton.addEventListener(
  "click",
  ()=>{

    start("computer");

  }
);



playerModeButton.addEventListener(
  "click",
  ()=>{

    start("player");

  }
);






// ======================
// CREATE GAME
// ======================


function start(mode){


  selectedMode = mode;


  game = new Game(mode);



  modeScreen.classList.add("hidden");


  placementScreen.classList.remove("hidden");



  createPlacementBoard(

    placementBoard,

    game.player1,

    ()=>{

      console.log(
        "Player fleet ready"
      );

    }

  );


}







// ======================
// START BATTLE
// ======================


// چون confirm button داخل dom ساخته می‌شود
// بعد از کامل شدن placement پیدا می‌کنیم


document.addEventListener(
  "click",
  event=>{


    if(
      event.target.classList.contains(
        "confirm-placement"
      )
    ){


      placementScreen.classList.add(
        "hidden"
      );


      gameScreen.classList.remove(
        "hidden"
      );



      // computer ships

      game.player2.placeShips();




      // player board

      createBoard(

        playerBoard,

        game.player1.gameboard,

        game.player1.name

      );





      // enemy hidden

      createBoard(

        enemyBoard,

        game.player2.gameboard,

        game.player2.name,

        true

      );






      addAttackListener(

        enemyBoard,

        game,

        ()=>{

          showWinnerModal(game);

        }

      );


    }


  }

);







// ======================
// RESTART
// ======================


restartButton.addEventListener(
  "click",
  ()=>{


    winnerModal.classList.add(
      "hidden"
    );


    gameScreen.classList.add(
      "hidden"
    );



    placementScreen.classList.add(
      "hidden"
    );



    modeScreen.classList.add(
      "hidden"
    );



    startScreen.classList.remove(
      "hidden"
    );


  }
);