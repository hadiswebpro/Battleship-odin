export default class Gameboard {

    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.board = new Map();
        this.attackedCoordinates = new Set();
    }

    placeShip(ship, coordinates) {
        if (coordinates.length !== ship.length) {
            throw new Error("Invalid ship placement");
        }

        coordinates.forEach(position => {
            const key = position.toString();

            if (this.board.has(key)) {
                throw new Error("Position already occupied");
            }

            this.board.set(key, ship);
        });

        this.ships.push(ship);
    }

    getShipAt(coordinate) {
        return this.board.get(coordinate.toString());
    }

    receiveAttack(coordinate) {
        const key = coordinate.toString();

        if (this.attackedCoordinates.has(key)) {
            return "already";
        }

        this.attackedCoordinates.add(key);

        const ship = this.board.get(key);

        if (ship) {
            ship.hit();
            return "hit";
        }

        this.missedAttacks.push(coordinate);
        return "miss";
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}
