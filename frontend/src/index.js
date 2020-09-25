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

        this.socket = io("http://localhost:4000");
        this.playerNumber = 0;
        this.code;

        this.start();
        this.bindEvents();
    }

    start() {
        this.socket.on("checkConnection", (message) => console.log(message));
        this.socket.on("gameCode", (gameCode) => {
            this.gameCodeDisplay.innerText = gameCode;
        });

        this.socket.on("init", (player) => {
            this.playerNumber = player;
            if (this.playerNumber) {
                this.init();
            }
        });
    }

    bindEvents() {
        this.btnNewGameP1.addEventListener("click", () => {
            this.joinGameSection.style.display = "none";
            this.sectionGameCodeP1.style.display = "block";

            this.socket.emit("newGame");
        });

        this.inputJoinGame.addEventListener("change", (e) => {
            this.code = e.target.value;
        });

        this.btnJoinGame.addEventListener("click", () => {
            this.socket.emit("joinGame", code);
        });
    }

    init() {
        this.joinGameSection.style.display = "none";

        this.gameSection.style.display = "flex";

        new TicTacToe("#board", this.playerNumber, this.socket);
    }
}

new App();
