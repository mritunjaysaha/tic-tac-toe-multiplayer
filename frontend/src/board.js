export class Board {
    constructor(el, rows = 3, cols = 3) {
        this.el = document.querySelector(el);
        this.rows = rows;
        this.cols = cols;

        this.generateBoard();
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

                cols.dataset["cell"] = count;
                count++;
                rows.appendChild(cols);
            }
            fragment.appendChild(rows);
        }

        this.el.appendChild(fragment);
    }
}
