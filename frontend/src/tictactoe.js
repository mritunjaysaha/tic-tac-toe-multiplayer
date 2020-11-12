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
        this.askPlayAgainP = document.querySelector("#ask-play-again-p");
        this.pauseModalJoke = document.querySelector("#pause-p-joke");
        this.askPlayAgainModal = document.querySelector(
            "#ask-play-again-modal"
        );
        this.waitingModal = document.querySelector("#waiting-modal");
        this.initialWaitingModal = document.querySelector(
            "#initial-waiting-modal"
        );

        this.playAgainBtn = document.querySelector("#btn-play-again");
        this.playNoBtn = document.querySelector("#btn-play-no");
        this.askPlayAgainYesBtn = document.querySelector("#ask-play-again-yes");
        this.askPlayAgainNoBtn = document.querySelector("#ask-play-again-no");
        this.waitingP = document.querySelector("#waiting-p");
        this.initialWaitingModalP = document.querySelector(
            "#initial-waiting-modal-p"
        );

        // tokens
        this.player1Token = document.querySelector("#player-1-token");
        this.player2Token = document.querySelector("#player-2-token");

        console.log(this.player1Token, this.player2Token);

        // fonts
        this.xFont = `<i class="uil uil-times-circle"></i>`;
        this.oFont = `<i class="uil uil-circle"></i>`;

        this.player = player;
        this.gamesPlayed = 0;
        this.socket = socket;
        this.initialWaitingScreenLoaded = false;

        this.bindEvents();
        this.sockets();
        this.setToken();
    }

    sockets() {
        /**
         * get the game state and re-paint the board
         */
        this.socket.on("gameState", (data) => {
            const gameState = JSON.parse(data);

            requestAnimationFrame(() => {
                this.paintBoard(gameState);
            });
        });

        /**
         * show the modal to start a new game and update the score
         */
        this.socket.on("gameOver", (winner) => {
            this.showModal(winner);
            this.updateScore(winner);
        });

        /**
         * Pause the moves for the user, if it is not
         * their turn to make the move
         */
        this.socket.on("pause", (player) => {
            if (this.initialWaitingScreenLoaded) {
                this.initialWaitingModal.style.display = "none";
            }
            if (player == this.player.number) {
                this.pauseModal.style.display = "flex";
                this.pauseModalpEl.innerText = player;
            } else {
                this.pauseModal.style.display = "none";
            }
        });

        /**
         * Show the play again modal
         */
        this.socket.on("DoYouWantToPlayAgain", (playerNumber) => {
            if (this.player.number !== playerNumber) {
                this.askPlayAgainModal.style.display = "flex";
                this.askPlayAgainP.innerText = `Player ${playerNumber} wants to play again`;
            } else {
                this.waitingModal.style.display = "flex";
                this.waitingP.innerText = `waiting for player ${
                    playerNumber === 1 ? 2 : 1
                } to accept`;
            }
        });

        this.socket.on("startNewGame", (playerNumber) => {
            if (this.player.number === playerNumber) {
                this.waitingModal.style.display = "none";
            }
            this.resetBoard();
            this.setToken();
        });

        /**
         * show the waiting screen while the second player uses
         * the game code to join the game.
         */
        this.socket.on("initialWaitingScreen", () => {
            this.initialWaitingModal.style.display = "flex";
            this.initialWaitingScreenLoaded = true;
        });

        /**
         * show the game code to the first user
         */
        this.socket.on("gameCode", (roomName) => {
            this.player.roomName = roomName;

            this.initialWaitingModalP.innerText = roomName;
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

            this.gamesPlayed++;

            this.socket.emit(
                "playAgain",
                {
                    number: this.player.number,
                    roomName: this.player.roomName,
                },
                this.gamesPlayed
            );
        });

        // NO/exit button
        this.playNoBtn.addEventListener("click", () => {
            this.socket.emit("endGame", this.player.roomName);
        });

        // button to start next game
        this.askPlayAgainYesBtn.addEventListener("click", () => {
            this.gamesPlayed++;
            this.socket.emit("startNextGame", this.player, this.gamesPlayed);
            this.askPlayAgainModal.style.display = "none";
            this.resultModal.style.display = "none";
        });

        // button stop next game
        this.askPlayAgainNoBtn.addEventListener("click", () => {
            this.socket.emit("endGame", this.player.roomName);
            this.askPlayAgainModal.style.display = "none";
            this.resultModal.style.display = "none";
        });
    }

    userToken(data) {
        console.log(this.player.number, this.gamesPlayed);
        if (this.gamesPlayed % 2 === 0) {
            if (
                (this.player.number === 1 && data === 1) ||
                (this.player.number === 2 && data === 1)
            ) {
                return this.xFont;
            }
        } else {
            if (
                (this.player.number === 1 && data === 2) ||
                (this.player.number === 2 && data === 2)
            ) {
                return this.xFont;
            }
        }

        return this.oFont;
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
        cellElement.innerHTML = this.userToken(data);
    }

    updateScore(winner) {
        if (winner === 1) {
            this.player1Score++;
            this.player1ScoreEl.innerText =
                this.player1Score < 10
                    ? `0${this.player1Score}`
                    : this.player1Score;
        }
        if (winner === 2) {
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

    setToken() {
        const xFont = `<i class="uil uil-times-circle token"></i>`;
        const oFont = `<i class="uil uil-circle token"></i>`;
        if (this.gamesPlayed % 2 === 0) {
            this.player1Token.innerHTML = xFont;
            this.player2Token.innerHTML = oFont;
        } else {
            this.player1Token.innerHTML = oFont;
            this.player2Token.innerHTML = xFont;
        }
    }
}
