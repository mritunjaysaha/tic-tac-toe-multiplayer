import "./styles/main.scss";
import { TicTacToe } from "./tictactoe";

export class App {
    constructor() {
        this.joinGameSection = document.getElementById("join-game-section");
        this.gameSection = document.getElementById("game-section");
        this.sectionGameCodeP1 = document.getElementById(
            "section-game-code-p1"
        );
        this.btnNewGameP1 = document.getElementById("btn-new-game");
        this.inputJoinGame = document.getElementById("input-join-game");
        this.btnJoinGame = document.getElementById("btn-join-game");
        this.gameCodeDisplay = document.getElementById("game-code");

        this.socket = io("http://localhost:4000") || io(process.env.SOCKET);
        this.player = {
            number: "",
            roomName: "",
        };
        this.gameActive = false;

        this.socket.on("gameCode", (roomName) => {
            this.gameCodeDisplay.innerText = roomName;
            this.player.roomName = roomName;
        });

        this.start();
        this.bindEvents();
    }

    start() {
        this.socket.on("checkConnection", (message) => console.log(message));
    }

    bindEvents() {
        this.btnNewGameP1.addEventListener("click", () => {
            this.player.number = "1";
            this.joinGameSection.style.display = "none";

            this.socket.emit("newGame");

            this.init();
        });

        this.btnJoinGame.addEventListener("click", () => {
            this.player.number = "2";
            const roomName = this.inputJoinGame.value;
            console.log({ roomName });
            this.player.roomName = roomName;
            this.gameCodeDisplay.innerText = roomName;
            this.socket.emit("joinGame", roomName);

            this.init();
        });
    }

    init() {
        this.sectionGameCodeP1.style.display = "block";

        this.joinGameSection.style.display = "none";
        this.gameSection.style.display = "flex";
        console.log("here", this.player);
        new TicTacToe("#board", this.player, this.socket);
        this.gameActive = true;
    }
}

new App();
