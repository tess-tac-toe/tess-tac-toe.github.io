// https://github.com/tess-tac-toe/tess-tac-toe.github.io
// tic-tac-toe on tesseract (4 dimension cube)

function swap(key) {
    const states = SWAPS[key].map(id => ({ text: cells[id].innerText, color: cells[id].style.background }));

    for (let i = 0; i < SIZE; i++) {
        cells[i].innerText = states[i].text;
        cells[i].style.background = states[i].color;
    }
}

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
    document.body.innerHTML = Object.keys(SWAPS).map(key => `<button onclick="swap('${key}')">Swap ${key}</button>`).join(" ") + "<br/>" +
        table({ item: (i, j) => table({ name: "inner", prefix: `i_${i}_${j}` }) });

    let cells = new Array(N ** 4);
    forEachVec(([i, j, k, l]) => cells[vec2id([i, j, k, l])] = document.getElementById(`i_${i}_${j}_${k}_${l}`));
    return cells;
}

function onClick({ target }) {
    const id = cells.indexOf(target);
    if (id === -1) { return; }
    let end;

    play(id, true);
    end = getStats(getValues()).end;

    if (!end) {
        aiPlay(false);
        end = getStats(getValues()).end;
    }

    if (end) {
        end.forEach(id => cells[id].style.background = "lightgray");
        document.removeEventListener("click", onClick);
    }
}

function getValues() {
    return cells.map(cell => cell.innerText);
}

const cells = render();
document.addEventListener("click", onClick);
