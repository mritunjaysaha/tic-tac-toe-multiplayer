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
    }

    function handleJoinGame(roomName) {
        clientRooms[client.id] = roomName;
        state[roomName].isStarted = true;
        client.join(roomName);

        console.log("JOIN GAME", { state });
        client.number = 2;
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
            },
        });

        client.join(roomName);
        client.number = 1;

        console.log({ clientRooms });
        console.log({ state });
    }
});

io.on("disconnect", () => {
    console.log("user has left");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
