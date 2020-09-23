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

        this.start();
        this.bindEvents();
    }

    start() {
        let socket = io("http://localhost:4000");

        let playerNumber;

        socket.on("checkConnection", (message) => console.log(message));
        socket.on("gameCode", (gameCode) => {
            gameCodeDisplay.innerText = gameCode;
        });
        socket.on("init", handleInit);

        function handleInit(player) {
            playerNumber = player;
            if (playerNumber) {
                init();
            }
        }

        function init() {
            joinGameSection.style.display = "none";

            gameSection.style.display = "flex";
            console.log({ playerNumber });

            new TicTacToe("#board", playerNumber, socket);
        }

        function handleGameCode(gameCode) {
            gameCode.innerText = gameCode;
        }
    }

    bindEvents() {
        this.btnNewGameP1.addEventListener("click", () => {
            joinGameSection.style.display = "none";
            sectionGameCodeP1.style.display = "block";

            socket.emit("newGame");
        });

        this.inputJoinGame.addEventListener("change", (e) => {
            code = e.target.value;
        });

        this.btnJoinGame.addEventListener("click", () => {
            socket.emit("joinGame", code);
        });
    }
}

new App();
