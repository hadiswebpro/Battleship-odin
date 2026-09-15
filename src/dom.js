export function createBoard(element, color) {


    element.classList.add("board");


    for(let row = 0; row < 8; row++) {


        for(let col = 0; col < 8; col++) {


            const cell = document.createElement("div");


            cell.classList.add("cell");


            cell.dataset.row = row;
            cell.dataset.col = col;


            cell.style.backgroundColor = color;


            element.appendChild(cell);

        }

    }

}


export function addAttackListener(boardElement, game){

    boardElement.addEventListener(
        "click",
        (event)=>{


            const cell = event.target;


            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);


            const result = game.player1.attack(
                game.player2.gameboard,
                [row,col]
            );


            if(result === "hit"){

                cell.classList.add("hit");

            } else {

                cell.classList.add("miss");

            }


        }
    );

}