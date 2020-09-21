import "./styles/main.scss";
import { TicTacToe } from "./ttt";

const socket = io("http://localhost:4000");
// const socket = io("https://ttt-multiplayer-server.herokuapp.com/");

const joinGameSection = document.getElementById("join-game-section");
const gameSection = document.getElementById("game-section");
const sectionGameCode = document.getElementById("section-game-code-p1");

const btnNewGame = document.getElementById("btn-new-game");
const inputJoinGame = document.getElementById("input-join-game");
const btnJoinGame = document.getElementById("btn-join-game");
const gameCodeDisplay = document.getElementById("game-code");
const btnInnerJoinGame = document.getElementById("btn-join-game-p2");

socket.on("checkConnection", (message) => console.log(message));
socket.on("gameCode", (gameCode) => {
    gameCodeDisplay.innerText = gameCode;
});
socket.on("init", handleInit);

btnNewGame.addEventListener("click", () => {
    joinGameSection.style.display = "none";
    sectionGameCode.style.display = "block";

    socket.emit("newGame");
});

function handleInit() {
    init();
}

function init() {
    new TicTacToe(
        "#board",
        "#player-score",
        "#house-score",
        {
            modal: "#modal",
            contents: "#modal-contents",
        },
        "#btn-play-again",
        "#result"
    );
}

function handleGameCode(gameCode) {
    gameCode.innerText = gameCode;
}
