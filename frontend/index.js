const socket = io("http://localhost:4000");

const joinGameSection = document.getElementById("join-game-section");
const gameSection = document.getElementById("game-section");
const sectionGameCode = document.getElementById("section-game-code");

const btnNewGame = document.getElementById("btn-new-game");
const inputJoinGame = document.getElementById("input-join-game");
const btnJoinGame = document.getElementById("btn-join-game");
const gameCodeDisplay = document.getElementById("game-code");

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

class TicTacToe {
    /**
     *
     * @param {DOMElement id} el
     * @param {DOMElement id} userScore
     * @param {DOMElement id} houseScore
     * @param {DOMElement id} modal
     * @param {DOMElement id} btnPlayAgain
     * @param {DOMElement id} winner
     */
    constructor(el, userScore, houseScore, modal, btnPlayAgain, winner) {
        this.el = document.querySelector(el);
        this.rows = 3;
        this.cols = 3;
        this.modal = document.querySelector(modal.modal);
        this.modalContents = document.querySelector(modal.contents);
        this.userScoreEl = document.querySelector(userScore);
        this.houseScoreEl = document.querySelector(houseScore);
        this.btnPlayAgain = document.querySelector(btnPlayAgain);
        this.winner = document.querySelector(winner);

        this.winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        this.selectedCells = ["", "", "", "", "", "", "", "", ""];
        this.userMoves = 0;
        this.playerCells = [];
        this.houseCells = [];
        this.userScore = 0;
        this.houseScore = 0;
        this.wonBy = "";
        this.winnerFound = false;
        this.playerFirst = false;

        this.generateBoard();
        this.bindEvents();
    }

    changeTurns() {
        if (this.playerFirst) {
            console.log("User first");
        } else {
            console.log("House first");
            this.decideHouseMove();
        }
    }

    bindEvents() {
        this.el.addEventListener("click", (e) => {
            const cell = e.target.dataset["cell"];
            this.selectedCells[cell] = "x";
            this.userMoves++;
            this.selectPlayerMove(cell);
        });

        this.btnPlayAgain.addEventListener("click", () => {
            this.modalContents.classList.add("flicker-out-1");
            setTimeout(() => {
                this.modal.style.display = "none";
                this.modalContents.classList.remove("bounce-top");
                this.resetBoard();
                this.modalContents.classList.remove("flicker-out-1");
            }, 1000);
        });
    }

    resetBoard() {
        this.el.innerHTML = "";
        this.selectedCells = ["", "", "", "", "", "", "", "", ""];

        this.generateBoard();
        this.userMoves = 0;
        this.playerCells = [];
        this.houseCells = [];
        this.wonBy = "";
        this.winnerFound = false;
        this.playerFirst = !this.playerFirst;
        this.houseScoreEl.classList.remove("jello-vertical");
        this.userScoreEl.classList.remove("jello-vertical");

        this.changeTurns();
    }

    showModal() {
        this.modal.style.display = "flex";
        this.modalContents.classList.add("bounce-top");
    }

    updateScore() {
        this.showModal();
        if (this.wonBy === "x") {
            this.userScoreEl.innerHTML =
                this.userScore < 10 ? `0${this.userScore}` : this.userScore;
            this.userScoreEl.classList.add("jello-vertical");
            this.winner.innerText = "You won";
        } else if (this.wonBy === "o") {
            this.houseScoreEl.innerHTML =
                this.houseScore < 10 ? `0${this.houseScore}` : this.houseScore;
            this.houseScoreEl.classList.add("jello-vertical");
            this.winner.innerText = "House won";
        } else {
            this.winner.innerText = "Draw";
        }
    }

    /**
     *
     * @param {String} cell
     */
    selectPlayerMove(cell) {
        const selectedCell = document.querySelector(`div[data-cell='${cell}']`);

        this.playerCells.push(Number.parseInt(cell, 10));
        selectedCell.innerHTML = `<i class="uil uil-times-circle"></i>`;

        socket.emit("player1", cell);
        // this.checkWinner();

        // if (this.wonBy === "x") {
        //     this.userScore++;
        //     this.updateScore();
        // }

        // if (this.wonBy === "Draw") {
        //     this.updateScore();
        // }

        // if (!this.winnerFound) {
        //     this.decideHouseMove();
        // }
    }

    decideHouseMove() {
        const cell = this.getHouseCell();
        this.selectedCells[cell] = "o";
        this.houseCells.push(cell);

        const selectedCell = document.querySelector(`div[data-cell='${cell}']`);

        selectedCell.innerHTML = `<i class="uil uil-circle"></i>`;
        this.checkWinner();
        if (this.wonBy === "o") {
            this.houseScore++;
            this.updateScore();
        }

        if (this.wonBy === "Draw") {
            this.updateScore();
        }
    }

    checkWinner() {
        let winner = null;

        if (this.userMoves < 3) {
            return null;
        }

        this.winningCombinations.forEach((combo) => {
            if (
                this.selectedCells &&
                this.selectedCells[combo[0]] === this.selectedCells[combo[1]] &&
                this.selectedCells[combo[0]] === this.selectedCells[combo[2]]
            ) {
                winner = this.selectedCells[combo[0]];
            }
        });

        if (winner) {
            this.wonBy = winner;
            this.winnerFound = true;
        } else if (!this.selectedCells.includes("")) {
            this.wonBy = "Draw";
        }
    }

    getHouseCell() {
        const cell = this.generateRandomNumber();

        if (
            !this.playerCells.includes(cell) &&
            !this.houseCells.includes(cell)
        ) {
            return cell;
        }
        return this.getHouseCell();
    }

    /**
     *
     * @param {Number} max
     */
    generateRandomNumber(max = 9) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    generateBoard() {
        const fragment = document.createDocumentFragment();
        let count = 0;
        for (let i = 0; i < this.rows; i++) {
            const rows = document.createElement("div");

            rows.classList.add("div-board-rows");

            for (let j = 0; j < this.cols; j++) {
                const cols = document.createElement("div");

                cols.classList.add("div-board-cols");
                cols.dataset["cell"] = `${count}`;
                count++;
                rows.appendChild(cols);
            }

            fragment.appendChild(rows);
        }

        this.el.appendChild(fragment);
    }
}
