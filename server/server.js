const { makeId } = require("./utils");

const io = require("socket.io")();

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
    client.on("newGame", handleNewGame);

    client.emit("checkConnection", "connected to server");

    client.emit("init");

    client.on("player1", (message) => console.log(message));

    function handleNewGame() {
        const roomName = makeId();
        console.log(roomName);
        client.emit("gameCode", roomName);
    }
});

io.listen(4000);
