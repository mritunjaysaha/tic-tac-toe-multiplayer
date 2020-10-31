import { Board } from "./board";

export class TicTacToe extends Board {
    /**
     * Generates the TicTacToe game
     * @param {String} el
     * @param {Number} playerNumber
     * @param {[Object object]} socket
     */
    constructor(el, player, socket) {
        super(el, 3, 3);
        console.log({ player });

        this.xFont = `<i class="uil uil-times-circle"></i>`;
        this.oFont = `<i class="uil uil-circle"></i>`;

        this.player = player;
        this.xoro = this.player.number === "1" ? this.xFont : this.oFont;
        this.startGame = "";

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
            alert(`winner is ${winner}`);
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

    updateScore() {}
}
