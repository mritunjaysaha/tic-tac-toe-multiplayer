import { Board } from "./board";

export class TicTacToe extends Board {
    /**
     * Generates the TicTacToe game
     * @param {String} el
     * @param {[Object object]} player number and room name
     * @param {[Object object]} socket
     */
    constructor(el, player, socket) {
        super(el, 3, 3);

        this.player1ScoreEl = document.querySelector("#player1-score");
        this.player2ScoreEl = document.querySelector("#player2-score");
        this.player1Score = 0;
        this.player2Score = 0;

        this.resultModal = document.querySelector("#result-modal");
        this.pauseModal = document.querySelector("#pause-modal");

        this.resultModalWinner = document.querySelector("#result-p");
        this.pauseModalpEl = document.querySelector("#pause-p");

        this.playAgainBtn = document.querySelector("#btn-play-again");
        this.playNoBtn = document.querySelector("#btn-play-no");

        this.xFont = `<i class="uil uil-times-circle"></i>`;
        this.oFont = `<i class="uil uil-circle"></i>`;

        this.player = player;
        this.xoro = this.player.number === "1" ? this.xFont : this.oFont;

        this.socket = socket;

        this.bindEvents();

        this.socket.on("gameState", (data) => {
            const gameState = JSON.parse(data);

            requestAnimationFrame(() => {
                this.paintBoard(gameState);
            });
        });

        this.socket.on("gameOver", (winner) => {
            console.log({ winner });
            if (winner === "draw") {
                alert("Draw");
            }
            this.showModal(winner);
            this.updateScore(winner);
        });

        this.socket.on("pause", (player) => {
            console.log(
                "pause ",
                player,
                this.player.number,
                player == this.player.number
            );
            if (player == this.player.number) {
                console.log("pause ", player, this.player.number);

                this.pauseModal.style.display = "flex";
                this.pauseModalpEl.innerText = player;
            } else {
                this.pauseModal.style.display = "none";
            }
        });
    }

    bindEvents() {
        this.el.addEventListener("click", (e) => {
            const cell = e.target.dataset["cell"];

            this.socket.emit(
                "moves",
                String(cell),
                this.player.number,
                this.player.roomName
            );

            // checks for invalid moves
            this.socket.on("wrongMove", () => {
                console.log("WRONG MOVE");
            });
        });

        // play again button
        this.playAgainBtn.addEventListener("click", () => {
            this.resultModal.style.display = "none";

            this.resetBoard();
            this.socket.emit("playAgain", {
                number: this.player.number,
                roomName: this.player.roomName,
            });
        });

        // NO/exit button
        this.playNoBtn.addEventListener("click", () => {
            this.socket.emit("endGame", this.player.roomName);
        });
    }

    paintBoard(array) {
        for (let i = 0; i < 9; i++) {
            if (array[i]) {
                this.paint(array[i], i);
            }
        }
    }

    paint(data, cell) {
        const cellElement = document.querySelector(`div[data-cell='${cell}']`);
        cellElement.innerHTML = data === "1" ? this.xFont : this.oFont;
    }

    updateScore(winner) {
        if (winner === "1") {
            this.player1Score++;
            this.player1ScoreEl.innerText =
                this.player1Score < 10
                    ? `0${this.player1Score}`
                    : this.player1Score;
        }
        if (winner === "2") {
            this.player2Score++;
            this.player2ScoreEl.innerText =
                this.player2Score < 10
                    ? `0${this.player2Score}`
                    : this.player2Score;
        }
    }

    showModal(winner) {
        this.resultModal.style.display = "flex";
        this.resultModalWinner.innerText = `player ${winner}`;

        this.pauseModal.style.display = "none";
    }
}
