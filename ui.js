function table({ item = () => "", name = "main", prefix = "m" }) {
    const createRow = (_, rowIndex) => {
        const createCell = (_, colIndex) =>
            `<td class="${name}" id="${prefix}_${rowIndex}_${colIndex}">${item(rowIndex, colIndex)}</td>`;

        return `<tr>${Array.from({ length: N }, createCell).join("")}</tr>`;
    };

    const body = Array.from({ length: N }, createRow).join("");
    return `<table class="${name}"><tbody>${body}</tbody></table>`;
}

function render() {
    const axis = 'XYZW';
    const buttons = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
        .map(([a, b]) => `<button onclick="swap(${a}, ${b})">Swap ${axis[a]}${axis[b]}</button>`)

    document.body.innerHTML = buttons.join(" ") + "<br/>" +
        table({ item: (i, j) => table({ name: "inner", prefix: `i_${i}_${j}` }) });

    let cells = new Array(N ** 4);
    iterate((i, j, k, l) => cells[vec2id([i, j, k, l])] = document.getElementById(`i_${i}_${j}_${k}_${l}`));
    return cells;
}

function onClick({ target }) {
    const id = cells.indexOf(target);
    if (id === -1) { return; }
    let winner;

    play(id, true);
    winner = checkWinner('X');

    if (!winner) {
        aiPlay(false);
        winner = checkWinner('O');
    }

    if (winner) {
        winner.ids.forEach(id => cells[id].style.background = "lightgray");
        document.removeEventListener("click", onClick);
    } else if (!nowX) {
        cells.forEach(cell => cell.style.background = "lightgray");
        document.removeEventListener("click", onClick);
    }
}

function getValues() {
    return cells.map(cell => cell.innerText);
}

const cells = render();
document.addEventListener("click", onClick);
