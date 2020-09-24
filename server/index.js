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
const selectedCell = new Array(9);

io.on("connection", (client) => {
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    client.emit("checkConnection", "connected to server");

    client.emit("init");

    client.on("player1", (message) => console.log(message));

    client.on("move", handleMoves);

    function handleMoves(cell, playerNumber) {
        console.log(cell, playerNumber);

        selectedCell[cell] = playerNumber;

        console.log(selectedCell);
    }

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];

        console.log({ room });

        clientRooms[client.id] = roomName;
        client.join(roomName);

        client.number = 2;
        client.emit("init", 2);
    }

    function handleNewGame() {
        const roomName = makeId();

        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1);

        console.log("client rooms: ", clientRooms[roomName]);
    }
});

io.on("disconnect", () => {
    console.log("user has left");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
