import { Board } from "./board";

export class TicTacToe extends Board {
    /**
     *
     * @param {String} el
     * @param {Number} playerNumber
     * @param {[Object object]} socket
     */
    constructor(el, playerNumber, socket) {
        super(el, 3, 3);

        this.playerNumber = playerNumber;
        this.xoro = this.playerNumber === 1 ? "x" : "o";

        this.socket = socket;

        this.socket.emit("ttt", "here");

        this.bindEvents();
    }

    bindEvents() {
        this.el.addEventListener("click", (e) => {
            const cell = e.target.dataset["cell"];

            const cellElement = document.querySelector(
                `div[data-cell='${cell}']`
            );
            this.socket.emit("move", cell, this.playerNumber);
            cellElement.innerText = this.xoro;
            console.log(cell, cellElement);
        });
    }
}
