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

            // const cellElement = document.querySelector(
            //     `div[data-cell='${cell}']`
            // );

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
            console.log(data);
        });
    }
}
