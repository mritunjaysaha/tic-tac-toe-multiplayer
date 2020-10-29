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

        this.roomName = player.roomName;
        this.playerNumber = player.number;
        this.xoro = this.playerNumber === "1" ? "x" : "o";
        this.startGame = "";

        this.socket = socket;

        this.bindEvents();
    }

    bindEvents() {
        this.el.addEventListener("click", (e) => {
            const cell = e.target.dataset["cell"];

            const cellElement = document.querySelector(
                `div[data-cell='${cell}']`
            );

            this.socket.emit(
                "moves",
                String(cell),
                this.playerNumber,
                this.roomName
            );
            cellElement.innerText = this.xoro;
        });
    }
}
