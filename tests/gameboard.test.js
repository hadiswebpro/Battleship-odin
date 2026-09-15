import Gameboard from "../src/gameboard.js";
import Ship from "../src/ship.js";

test("gameboard is created correctly", () => {
    const gameboard = new Gameboard();

    expect(gameboard.ships).toEqual([]);
    expect(gameboard.missedAttacks).toEqual([]);
    expect(gameboard.board).toBeInstanceOf(Map);
});

test("places ship on given coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [
        [2,3],
        [2,4],
        [2,5]
    ]);

    expect(gameboard.board.get("2,3")).toBe(ship);
    expect(gameboard.board.get("2,4")).toBe(ship);
    expect(gameboard.board.get("2,5")).toBe(ship);
});


test("attack on empty coordinate is recorded as miss", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([5,5]);

    expect(gameboard.missedAttacks).toContainEqual([5,5]);
});

test("attack on ship calls hit", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, [
        [2,3],
        [2,4],
        [2,5]
    ]);

    gameboard.receiveAttack([2,4]);

    expect(ship.hits).toBe(1);
});


test("reports false when ships are not all sunk", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2);

    gameboard.placeShip(ship, [
        [1,1],
        [1,2]
    ]);

    ship.hit();

    expect(gameboard.allShipsSunk()).toBe(false);
});

test("reports true when all ships are sunk", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2);

    gameboard.placeShip(ship, [
        [1,1],
        [1,2]
    ]);

    ship.hit();
    ship.hit();

    expect(gameboard.allShipsSunk()).toBe(true);
});
