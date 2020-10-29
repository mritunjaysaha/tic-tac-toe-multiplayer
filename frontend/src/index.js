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

        this.socket = io("https://ttt-multiplayer-server.herokuapp.com/");
        this.playerNumber = 0;
        this.gameActive = false;

        this.start();
        this.bindEvents();
    }

    start() {
        this.socket.on("checkConnection", (message) => console.log(message));
        this.socket.on("gameCode", (gameCode) => {
            this.gameCodeDisplay.innerText = gameCode;
        });

        this.socket.on("gameState", (gameState) => {
            if (!this.gameActive) {
                console.log(this.gameActive);
                return;
            }

            const state = JSON.parse(gameState);

            console.log({ state });

            requestAnimationFrame((e) => {
                e.preventDefault();
                console.log("here", { state });
            });
        });
    }

    bindEvents() {
        this.btnNewGameP1.addEventListener("click", () => {
            this.joinGameSection.style.display = "none";
            this.sectionGameCodeP1.style.display = "block";

            this.socket.emit("newGame");

            this.init();
        });

        this.btnJoinGame.addEventListener("click", () => {
            const code = this.inputJoinGame.value;
            console.log({ code });
            this.socket.emit("joinGame", code);

            this.init();
        });
    }

    init() {
        this.joinGameSection.style.display = "none";
        this.gameSection.style.display = "flex";
        new TicTacToe("#board", this.playerNumber, this.socket);

        this.gameActive = true;
    }
}

new App();
