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

        this.player = player;
        this.xoro = this.player.number === "1" ? "x" : "o";
        this.startGame = "";

        this.socket = socket;

        this.bindEvents();
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
            this.updateBoard();
        });
    }

    updateBoard() {
        this.socket.on("wrongMove", () => {
            console.log("WRONG MOVE");
        });
        this.socket.on("updateBoard", (data) => {
            console.log(JSON.parse(data));
            this.paintBoard(JSON.parse(data));
        });
    }

    paintBoard(array) {
        array.forEach((element) => {
            console.log(element);
        });

        for (let i = 0; i < 9; i++) {
            if (array[i]) {
                this.paint(array[i], i);
            }
        }
    }

    paint(data, cell) {
        const cellElement = document.querySelector(`div[data-cell='${cell}']`);
        cellElement.innerHTML = data === "1" ? "x" : "o";
    }
}
