const { makeId } = require("./utils");

const http = require("http");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const router = require("./router");
const { stat } = require("fs");

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

    console.log("client.id", client.id);

    function handleMoves(cell, playerNumber, roomName) {
        console.log("MOVES", cell, playerNumber, roomName);
        if (!state[roomName].board[cell]) {
            state[roomName].board[cell] = playerNumber;

            if (playerNumber === "1") {
                state[roomName].player1Moves++;
            } else {
                state[roomName].player2Moves++;
            }
        } else {
            client.emit("wrongMove");
        }

        console.log({ state });
        console.log(state[roomName].board);

        client.emit("updateBoard", JSON.stringify(state[roomName].board));
    }

    function handleJoinGame(roomName) {
        clientRooms[client.id] = roomName;
        state[roomName].isStarted = true;
        client.join(roomName);

        console.log("JOIN GAME", { state });
        client.number = 2;

        startGameInterval(roomName);
    }

    function handleNewGame() {
        const roomName = makeId();

        clientRooms[client.id] = roomName;
        console.log("client.id", client.id);
        client.emit("gameCode", roomName);
        clientRooms[client.id].selectedCells = ["1111"];
        Object.assign(state, {
            [roomName]: {
                isStarted: false,
                board: new Array(9),
                player1Moves: 0,
                player2Moves: 0,
            },
        });

        client.join(roomName);
        client.number = 1;

        console.log({ clientRooms });
        console.log({ state });
    }
});

function checkWinner(arrBoard, player1Moves, player2Moves) {
    if (player1Moves + player2Moves === 9) {
        return "draw";
    }

    let winner = null;

    winningCombinations.forEach((combo) => {
        if (
            (arrBoard &&
                arrBoard[combo[0]] === "1" &&
                arrBoard[combo[1]] === "1" &&
                arrBoard[combo[2]] === "1") ||
            (arrBoard[combo[0]] === "2" &&
                arrBoard[combo[1]] === "2" &&
                arrBoard[combo[2]] === "2")
        ) {
            winner = arrBoard[combo[0]];
            console.log("winner is ", winner, arrBoard);
        }
    });
    return winner;
}

/**
 * 1. Check for winner in an interval
 * 2. If there is no winner then update board
 * 3. Else declare winner and end the interval
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

function emitGameState(room, gameState) {
    io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
    io.sockets.in(room).emit("gameOver", winner);
}

io.on("disconnect", () => {
    console.log("user has left");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
