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

io.on("connection", (client) => {
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    client.emit("checkConnection", "connected to server");

    client.emit("init");

    client.on("player1", (message) => console.log(message));

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];
        console.log(room);

        clientRooms[client.id] = roomName;
        client.join(roomName);
        client.number = 2;
        client.emit("init", 2);
    }

    function handleNewGame() {
        const roomName = makeId();
        console.log(roomName);
        client.emit("gameCode", roomName);

        clientRooms[client.id] = roomName;

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1);
    }
});

io.on("disconnect", () => {
    console.log("user has left");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
