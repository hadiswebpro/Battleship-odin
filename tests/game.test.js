import Game from "../src/game";
import Player from "../src/player";


test("game creates two players", () => {

    const game = new Game();


    expect(game.player1)
        .toBeInstanceOf(Player);


    expect(game.player2)
        .toBeInstanceOf(Player);

});

test("player 1 starts the game", () => {

    const game = new Game();


    expect(game.currentPlayer)
        .toBe(game.player1);

});

test("switches turns between players", () => {

    const game = new Game();


    game.switchTurn();


    expect(game.currentPlayer)
        .toBe(game.player2);


    game.switchTurn();


    expect(game.currentPlayer)
        .toBe(game.player1);

});

import Ship from "../src/ship";


test("detects game over", () => {

    const game = new Game();

    const ship = new Ship(1);


    game.player2.gameboard.placeShip(
        ship,
        [[2,2]]
    );


    game.player2.gameboard.receiveAttack([2,2]);


    expect(game.isGameOver())
        .toBe(true);

});