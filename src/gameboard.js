export default class Gameboard {

  constructor() {

    this.ships = [];

    this.board = new Map();

    this.missedAttacks = [];

    this.attackedCoordinates = new Set();

  }



  placeShip(ship, coordinates) {


    if (coordinates.length !== ship.length) {

      throw new Error(
        "Invalid ship placement"
      );

    }



    coordinates.forEach(position => {


      const key =
        position.toString();



      if(this.board.has(key)){

        throw new Error(
          "Position already occupied"
        );

      }



      this.board.set(
        key,
        ship
      );


    });



    this.ships.push(ship);

  }





  getShipAt(coordinate){


    return this.board.get(
      coordinate.toString()
    );


  }






  receiveAttack(coordinate){


    const key =
      coordinate.toString();



    // جلوگیری از تیر دوباره

    if(
      this.attackedCoordinates.has(key)
    ){

      return "already";

    }




    this.attackedCoordinates.add(key);




    const ship =
      this.board.get(key);




    if(ship){


      ship.hit();


      return "hit";


    }




    this.missedAttacks.push(
      coordinate
    );



    return "miss";


  }







  hasBeenAttacked(coordinate){


    return this.attackedCoordinates.has(
      coordinate.toString()
    );


  }







  getAttackResult(coordinate){


    const key =
      coordinate.toString();



    if(
      !this.attackedCoordinates.has(key)
    ){

      return null;

    }



    return this.board.has(key)
      ? "hit"
      : "miss";


  }







  allShipsSunk(){


    return this.ships.length > 0 &&
      this.ships.every(
        ship => ship.isSunk()
      );


  }







  clear(){


    this.ships = [];

    this.board.clear();

    this.missedAttacks = [];

    this.attackedCoordinates.clear();


  }

}