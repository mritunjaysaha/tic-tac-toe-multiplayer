import { Board } from "./board";

export class TicTacToe extends Board {
    /**
     *
     * @param {String} el
     * @param {String} xoro
     * @param {[Object object]} socket
     */
    constructor(el, xoro, socket) {
        super(el);

        this.xoro = xoro;

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
            this.socket.emit("move", cell);
            cellElement.innerText = this.xoro;
            console.log(cell, cellElement);
        });
    }
}
