const io = require("socket.io")();

io.on("connection", (client) => {
    client.emit("checkConnection", "connected to server");

    client.emit("init");

    client.on("player1", (message) => console.log(message));
});

io.listen(4000);
