import "./styles/main.scss";
import { TicTacToe } from "./tictactoe";
import { Board } from "./board";
const socket = io("http://localhost:4000");
// const socket = io("https://ttt-multiplayer-server.herokuapp.com/");

const joinGameSection = document.getElementById("join-game-section");
const gameSection = document.getElementById("game-section");
const sectionGameCodeP1 = document.getElementById("section-game-code-p1");

const btnNewGameP1 = document.getElementById("btn-new-game");
const inputJoinGame = document.getElementById("input-join-game");
const btnJoinGame = document.getElementById("btn-join-game");
const gameCodeDisplay = document.getElementById("game-code");

let playerNumber;

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
    code = e.target.value;
});

btnJoinGame.addEventListener("click", () => {
    socket.emit("joinGame", code);
});

function handleInit(player) {
    playerNumber = player;
    console.log({ player });
    if (playerNumber) {
        init();
    }
}

function init() {
    joinGameSection.style.display = "none";

    gameSection.style.display = "flex";

    // new Board("#board");
    new TicTacToe("#board");
}

function handleGameCode(gameCode) {
    gameCode.innerText = gameCode;
}
