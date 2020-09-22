import { Board } from "./board";

export class TicTacToe extends Board {
    constructor(el) {
        super(el);
        this.bindEvents();
    }

    bindEvents() {
        this.el.addEventListener("click", (e) => {
            const cell = e.target.dataset["cell"];

            console.log(cell);
        });
    }
}
