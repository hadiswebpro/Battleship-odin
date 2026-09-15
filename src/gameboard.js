export default class Gameboard {

    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.board = new Map();
        this.attackedCoordinates = [];
    }

    placeShip(ship, coordinates) {

        this.ships.push(ship);

        coordinates.forEach(position => {
           this.board.set(position.toString(), ship);
        });
    }

    receiveAttack(coordinate) {

    const key = coordinate.toString();

    if(this.attackedCoordinates.includes(key)){

        return "already";

    }
    
    const ship = this.board.get(key);


    if(ship){

        ship.hit();

        return "hit";

    } else {

        this.missedAttacks.push(coordinate);

        return "miss";

    }

}

    allShipsSunk() {

       return this.ships.every(ship => ship.isSunk());
    }


    
}