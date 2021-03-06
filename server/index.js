const { makeId } = require("./utils");

const http = require("http");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const router = require("./router");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(router);

const io = socket(server);

const state = {};
const clientRooms = {};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

io.on("connection", (client) => {
    client.emit("checkConnection", "connected to server");
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);
    client.on("moves", handleMoves);
    client.on("playAgain", handlePlayAgain);
    client.on("endGame", handleEndGame);
    client.on("startNextGame", handleStartNextGame);

    function handleStartNextGame(player, gamesPlayed) {
        state[player.roomName] = {
            isStarted: true,
            board: new Array(9),
            player1Moves: 0,
            player2Moves: 0,
            gamesPlayed: gamesPlayed,
        };
        emitStartNewGame(player);
        emitPauseMove(player.roomName, gamesPlayed % 2 === 0 ? 2 : 1);
        startGameInterval(player.roomName);
    }

    function handleEndGame(roomName) {
        emitEndGame(roomName);
    }

    function handlePlayAgain(player) {
        if (player.number === 1 || player.number === 2) {
            emitWantToPlayAgain(player);
        }
    }

    function handleMoves(cell, playerNumber, roomName) {
        const player1Moves = state[roomName].player1Moves;
        const player2Moves = state[roomName].player2Moves;

        if (!state[roomName].board[cell]) {
            state[roomName].board[cell] = playerNumber;

            if (playerNumber === 1) {
                state[roomName].player1Moves++;
            } else {
                state[roomName].player2Moves++;
            }
        } else {
            client.emit("wrongMove");
        }

        client.emit("updateBoard", JSON.stringify(state[roomName].board));

        const total = player1Moves + player2Moves;

        const pausePlayer = () => {
            if (state[roomName].gamesPlayed % 2 === 0) {
                if (total % 2 === 0) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                if (total % 2 === 0) {
                    return 2;
                } else {
                    return 1;
                }
            }
        };

        emitPauseMove(roomName, pausePlayer());
    }

    function handleJoinGame(roomName) {
        clientRooms[client.id] = roomName;
        state[roomName].isStarted = true;
        client.join(roomName);
        client.number = 2;

        startGameInterval(roomName);

        emitPauseMove(roomName, 2);
    }

    function handleNewGame() {
        const roomName = makeId();

        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);
        Object.assign(state, {
            [roomName]: {
                isStarted: false,
                board: new Array(9),
                player1Moves: 0,
                player2Moves: 0,
                gamesPlayed: 0,
            },
        });

        client.join(roomName);
        client.number = 1;

        emitInitialWaitingScreen(roomName);
    }
});

/**
 * Checks whether there is a wineer
 * or the game ends in a draw.
 * @param {Array} arrBoard
 * @param {Number} player1Moves
 * @param {Number} player2Moves
 */

function checkWinner(arrBoard, player1Moves, player2Moves) {
    let winner = null;

    winningCombinations.forEach((combo) => {
        if (
            (arrBoard &&
                arrBoard[combo[0]] === 1 &&
                arrBoard[combo[1]] === 1 &&
                arrBoard[combo[2]] === 1) ||
            (arrBoard[combo[0]] === 2 &&
                arrBoard[combo[1]] === 2 &&
                arrBoard[combo[2]] === 2)
        ) {
            winner = arrBoard[combo[0]];
        }
    });

    if (winner !== 1 || winner !== 2) {
        if (player1Moves + player2Moves === 9) {
            return "draw";
        }
    }
    return winner;
}

/**
 * Start the game interval and check
 * for the winner. If there are no winners
 * then emit the status of the board, else
 * emit the name of the winner.
 * @param {String} roomName
 */

function startGameInterval(roomName) {
    const intervalID = setInterval(() => {
        const winner = checkWinner(
            state[roomName].board,
            state[roomName].player1Moves,
            state[roomName].player2Moves
        );
        if (!winner) {
            emitGameState(roomName, state[roomName].board);
        } else {
            emitGameState(roomName, state[roomName].board);

            setTimeout(() => {
                emitGameOver(roomName, winner);
                state[roomName] = null;
                clearInterval(intervalID);
            }, 0);
        }
    }, 1000);
}

/**
 * emit the status of the current board cells that
 * has been occupied
 * @param {String} room
 * @param {Array} gameState
 */
function emitGameState(room, gameState) {
    io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

/**
 * emit the winner of the game and
 * reset the board.
 * @param {String} room
 * @param {String} winner
 */
function emitGameOver(room, winner) {
    io.sockets.in(room).emit("gameOver", winner);

    state[room].board = new Array(9);
}

/**
 * Emit end event to all the users in the room.
 * @param {String} room
 */
function emitEndGame(room) {
    io.sockets.in(room).emit("end");
}

/**
 * Emit pause event to the frontend to block the moves of
 * one of the user.
 * @param {String} room
 * @param {Number} player
 */
function emitPauseMove(room, player) {
    io.sockets.in(room).emit("pause", player);
}

/**
 * emit event to show the modal if they want
 * to play another game
 * @param {[Object object]} player
 */
function emitWantToPlayAgain(player) {
    io.sockets.in(player.roomName).emit("DoYouWantToPlayAgain", player.number);
}

/**
 *
 * @param {[Object object]} player
 */
function emitStartNewGame(player) {
    io.sockets
        .in(player.roomName)
        .emit("startNewGame", player.number === 1 ? 2 : 1);
}

/**
 *
 * @param {String} room
 */
function emitInitialWaitingScreen(room) {
    io.sockets.in(room).emit("initialWaitingScreen");
}

io.on("disconnect", () => {
    console.log("DISCONNECTED");
});

const PORT = process.env.PORT || 4000;

// server.listen(PORT, () => {
//     console.log(`Server has started on http://localhost:${PORT}`);
// });

module.exports = { checkWinner };
