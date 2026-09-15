import Player from "../src/player";
import Gameboard from "../src/gameboard";
import Ship from "../src/Ship";


test("player has a gameboard", () => {

    const player = new Player("Player 1", "green");

    expect(player.gameboard)
        .toBeInstanceOf(Gameboard);

});


test("player has name and color", () => {

    const player = new Player("Player 1", "green");

    expect(player.name).toBe("Player 1");
    expect(player.color).toBe("green");

});


test("player can attack enemy gameboard", () => {

    const player = new Player("Player 1", "green");

    const enemyBoard = new Gameboard();

    const ship = new Ship(2);


    enemyBoard.placeShip(ship, [
        [1,1],
        [1,2]
    ]);


    player.attack(enemyBoard, [1,1]);


    expect(ship.hits).toBe(1);

});