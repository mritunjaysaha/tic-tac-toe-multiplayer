const { checkWinner } = require("../index");

test("Check Winner function exists", () => {
    expect(checkWinner).toBeDefined();
});

test("check winner should return 1", () => {
    const player1Moves = 3;
    const player2Moves = 2;
    const arr = [1, 1, 1, 2, 2, null, null, null, null];

    expect(checkWinner(arr, player1Moves, player2Moves)).toEqual(1);
});

test("check winner should return 2", () => {
    const player1Moves = 3;
    const player2Moves = 2;
    const arr = [2, 2, 2, 1, 1, null, null, null, null];

    expect(checkWinner(arr, player1Moves, player2Moves)).toEqual(2);
});

test("check winner should return 2", () => {
    const player1Moves = 2;
    const player2Moves = 3;
    const arr = [2, 2, 2, 1, 1, null, null, null, null];

    expect(checkWinner(arr, player1Moves, player2Moves)).toEqual(2);
});

test("check winner should return draw", () => {
    const player1Moves = 4;
    const player2Moves = 5;
    const arr = [2, 1, 2, 1, 2, 1, 2, 2, 1];

    expect(checkWinner(arr, player1Moves, player2Moves)).toEqual("draw");
});
