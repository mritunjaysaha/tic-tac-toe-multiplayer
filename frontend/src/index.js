import "./styles/main.scss";
import { TicTacToe } from "./ttt";

const socket = io("http://localhost:4000");
// const socket = io("https://ttt-multiplayer-server.herokuapp.com/");

const joinGameSection = document.getElementById("join-game-section");
const gameSection = document.getElementById("game-section");
const sectionGameCodeP1 = document.getElementById("section-game-code-p1");

const btnNewGameP1 = document.getElementById("btn-new-game");
const inputJoinGame = document.getElementById("input-join-game");
const btnJoinGame = document.getElementById("btn-join-game");
const gameCodeDisplay = document.getElementById("game-code");

socket.on("checkConnection", (message) => console.log(message));
socket.on("gameCode", (gameCode) => {
    gameCodeDisplay.innerText = gameCode;
});
socket.on("init", handleInit);

btnNewGameP1.addEventListener("click", () => {
    joinGameSection.style.display = "none";
    sectionGameCodeP1.style.display = "block";

    socket.emit("newGame");
});
let code = "";
inputJoinGame.addEventListener("change", (e) => {
    console.log(e.target.value);
    code = e.target.value;
    console.log(code);
});

btnJoinGame.addEventListener("click", () => {
    socket.emit("joinGame", code);
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
