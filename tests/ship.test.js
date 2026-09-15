import Ship from "../src/ship.js";

test("ship is created with correct length and zero hits", () => {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
});

test("hit increases ship hits", () => {
    const ship = new Ship(3);

    ship.hit();

    expect(ship.hits).toBe(1);
});

test("ship is not sunk before enough hits", () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(false);
});

test("ship is sunk after enough hits", () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
});