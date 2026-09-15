export function createBoard(
  element,
  gameboard = null,
  playerName = "",
  hideShips = false
) {

  element.innerHTML = "";
  element.classList.add("board-wrapper");


  if (playerName) {

    const title = document.createElement("h2");
    title.classList.add("board-title");
    title.textContent = playerName;

    element.appendChild(title);
  }


  const board = document.createElement("div");
  board.classList.add("board");


  for (let row = 0; row < 10; row++) {

    for (let col = 0; col < 10; col++) {


      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.dataset.row = row;
      cell.dataset.col = col;


      const attackResult =
        gameboard?.getAttackResult([row, col]);


      if (attackResult === "hit") {
        cell.classList.add("hit");
      }


      if (attackResult === "miss") {
        cell.classList.add("miss");
      }



      const ship =
        gameboard?.getShipAt([row, col]);


      if (ship && !hideShips) {

        cell.classList.add("ship");

        const shipIcon =
          document.createElement("span");

        shipIcon.textContent = "🚢";

        cell.appendChild(shipIcon);

      }


      board.appendChild(cell);

    }

  }


  element.appendChild(board);

}

export function createPlacementBoard(
  element,
  player,
  onComplete
) {


  let currentShipIndex = 0;

  let horizontal = true;


  const ships = player.shipLengths;



  player.clearBoard();



  render();



  function render(){


    createBoard(
      element,
      player.gameboard,
      player.name
    );



    const controls =
      document.createElement("div");

    controls.className =
      "placement-controls";



    const rotateButton =
      document.createElement("button");


    rotateButton.textContent =
      "Rotate ↻";

    rotateButton.className =
      "rotate-ship";



    controls.appendChild(rotateButton);



    const info =
      document.createElement("p");


    if(currentShipIndex < ships.length){

      info.textContent =
      `Place ship length ${ships[currentShipIndex]}`;

    }
    else{

      info.textContent =
      "Fleet ready 🚢";

    }


    controls.appendChild(info);



    element.appendChild(controls);



    rotateButton.addEventListener(
      "click",
      ()=>{

        horizontal = !horizontal;

      }
    );



    element
    .querySelectorAll(".cell")
    .forEach(cell=>{


      cell.addEventListener(
        "mouseenter",
        ()=>previewShip(cell)
      );


      cell.addEventListener(
        "mouseleave",
        clearPreview
      );



      cell.addEventListener(
        "click",
        ()=>placeShip(cell)
      );


    });


  }





  function getCoordinates(cell){


    if(currentShipIndex >= ships.length)
      return [];



    const length =
      ships[currentShipIndex];



    const row =
      Number(cell.dataset.row);


    const col =
      Number(cell.dataset.col);



    const coordinates=[];



    for(let i=0;i<length;i++){


      const r =
      horizontal
      ? row
      : row+i;



      const c =
      horizontal
      ? col+i
      : col;



      if(r>9 || c>9)
        return [];



      coordinates.push([r,c]);

    }


    return coordinates;

  }






  function previewShip(cell){


    clearPreview();


    const coordinates =
      getCoordinates(cell);



    const invalid =
      !coordinates.length ||
      coordinates.some(([r,c])=>
        player.gameboard.getShipAt([r,c])
      );



    coordinates.forEach(([r,c])=>{


      const target =
      element.querySelector(
        `[data-row="${r}"][data-col="${c}"]`
      );



      if(target){

        target.classList.add(
          invalid
          ? "invalid-preview"
          : "preview"
        );

      }

    });

  }







  function clearPreview(){


    element
    .querySelectorAll(
      ".preview,.invalid-preview"
    )
    .forEach(cell=>{

      cell.classList.remove(
        "preview",
        "invalid-preview"
      );

    });


  }







  function placeShip(cell){


    const coordinates =
      getCoordinates(cell);



    if(!coordinates.length)
      return;



    const blocked =
    coordinates.some(([r,c])=>
      player.gameboard.getShipAt([r,c])
    );



    if(blocked)
      return;




    try{


      player.placeShip(
        ships[currentShipIndex],
        coordinates
      );



      currentShipIndex++;



      if(currentShipIndex < ships.length){

        render();

      }
      else{

        render();


        const done =
        document.createElement("button");


        done.textContent =
        "Confirm Fleet 🚢";


        done.className =
        "confirm-placement";


        element.appendChild(done);



        done.addEventListener(
          "click",
          onComplete
        );

      }





    }
    catch(error){

      console.log(error);

    }


  }


}

export function showWinnerModal(game){


  const modal =
  document.querySelector(
    "#winner-modal"
  );


  const text =
  document.querySelector(
    "#winner-text"
  );



  text.textContent =
  `${game.getWinner().name} wins! 🚢`;



  modal.classList.remove(
    "hidden"
  );

}








export function addAttackListener(
  boardElement,
  game,
  playerBoardElement,
  onGameOver
) {

  boardElement.addEventListener(
    "click",
    event => {

      const cell = event.target;


      if (!cell.classList.contains("cell"))
        return;



      const coordinate = [
        Number(cell.dataset.row),
        Number(cell.dataset.col)
      ];



      const result =
        game.playTurn(coordinate);



      if (result === "already")
        return;



      // نمایش نتیجه حمله بازیکن روی برد دشمن
      cell.classList.add(
        result === "hit"
          ? "hit"
          : "miss"
      );




      // اجرای حمله کامپیوتر
      if (
        game.mode === "computer" &&
        !game.isGameOver()
      ) {


        setTimeout(() => {


          createBoard(
            playerBoardElement,
            game.player1.gameboard,
            game.player1.name
          );


        }, 600);

      }





      if (game.isGameOver())
        onGameOver();


    }
  );

}

