// https://github.com/tess-tac-toe/tess-tac-toe.github.io
// tic-tac-toe on tesseract (4 dimension cube)

function swap(key) {
    const states = SWAPS[key].map(id => ({ text: cells[id].innerText, color: cells[id].style.background }));

    for (let i = 0; i < SIZE; i++) {
        cells[i].innerText = states[i].text;
        cells[i].style.background = states[i].color;
    }
}

function makeTable({ item = () => "", name = "main", prefix = "m" }) {
    const createRow = (_, rowIndex) => {
        const createCell = (_, colIndex) =>
            `<td class="${name}" id="${prefix}_${rowIndex}_${colIndex}">${item(rowIndex, colIndex)}</td>`;

        return `<tr>${Array.from({ length: N }, createCell).join("")}</tr>`;
    };

    const body = Array.from({ length: N }, createRow).join("");
    return `<table class="${name}"><tbody>${body}</tbody></table>`;
}

function render() {
    const buttons = Object.keys(SWAPS).map(key => `<button onclick="swap('${key}')">Swap ${key}</button>`).join(""),
        table = makeTable({ item: (i, j) => makeTable({ name: "inner", prefix: `i_${i}_${j}` }) });

    document.body.innerHTML = `<center><div>${buttons}</div>${table}</center>`;

    let cells = new Array(N ** 4);
    forEachVec(([i, j, k, l]) => cells[vec2id([i, j, k, l])] = document.getElementById(`i_${i}_${j}_${k}_${l}`));
    return cells;
}

function getValues() {
    return cells.map(cell => cell.innerText);
}

function setValue(id, player) {
    cells[id].innerText = player;
}

function checkWinner() {
    const stats = getStats(getValues());

    if (stats.winner) {
        stats.highlight.forEach(id => cells[id].style.background = "lightgray");
        document.removeEventListener("click", onClick);
        return true;
    } else {
        return false;
    }
}

function onClick({ target }) {
    const id = cells.indexOf(target);
    if (id === -1) { return; }

    play(id, "X");
    if (checkWinner()) { return; }
    play(aiPlay("O"), "O");
    checkWinner();
}

const cells = render();
document.addEventListener("click", onClick);
