function table({ item = () => "", name = "main", prefix = "m" }) {
    const body = new Array(N).fill().map((_, i) => {
        return "<tr>" + new Array(N).fill().map((_, j) =>
            `<td class="${name}" id="${prefix}_${i}_${j}">${item(i, j)}</td>`).join("") + "</tr>";
    }).join("");

    return `<table class="${name}"><tbody>${body}</tbody></table>`
}

function render() {
    const axis = 'XYZW';
    const buttons = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
        .map(([a, b]) => `<button onclick="turn(${a}, ${b})">${axis[a]}${axis[b]}-axis</button>`)

    document.body.innerHTML = "Turn along plane: " + buttons.join(" ") + "<br/>" +
        table({ item: (i, j) => table({ name: "inner", prefix: `i_${i}_${j}` }) });
    let cells = new Array(N ** 4);

    iterate((i, j, k, l) => cells[vec2id([i, j, k, l])] = document.getElementById(`i_${i}_${j}_${k}_${l}`));

    return cells;
}

function onClick({ target }) {
    const id = cells.indexOf(target);
    if (id === -1) { return; }

    play(id, true);
    aiPlay(false);

    if (winner) {
        winningCells.forEach(id => cells[id].style.background = "lightgray");
        document.removeEventListener("click", onClick);
    } else if (!nowX) {
        cells.forEach(cell => cell.style.background = "lightgray");
        document.removeEventListener("click", onClick);
    }
}