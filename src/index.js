import Game from "./game";

import {
    createBoard,
    addAttackListener
} from "./dom";


const game = new Game();


const playerBoard =
document.querySelector("#player-board");


const enemyBoard =
document.querySelector("#enemy-board");



createBoard(
    playerBoard,
    "green"
);


createBoard(
    enemyBoard,
    "red"
);


addAttackListener(
    enemyBoard,
    game
);