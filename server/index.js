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

    function handleMoves(cell, playerNumber) {
        console.log(typeof playerNumber);
        if (playerNumber === 1) {
            clientRooms.selectedCell[cell] = playerNumber;
        }

        console.log(clientRooms);
    }

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];

        console.log("room.sockets", room.sockets);

        console.log({ roomName }, { room });

        clientRooms[client.id] = roomName;
        client.join(roomName);

        client.number = 2;
        client.emit("init", 2);
    }

    function handleNewGame() {
        const roomName = makeId();

        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);
        clientRooms[client.id].selectedCell = new Array(9);

        state[roomName] = "started";

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1);

        console.log({ clientRooms });
    }
});

function emitGameState(room, gameState) {
    io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

io.on("disconnect", () => {
    console.log("user has left");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
