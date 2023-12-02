const n = 4;
// https://tess-tac-toe.github.io/
// tic-tac-toe on tesseract (4 dimension cube)

function table({ n, item = (i, j) => "", name = "main", prefix = "m" }) {
    const body = new Array(n).fill().map((_, i) => {
        return "<tr>" + new Array(n).fill().map((_, j) =>
            `<td class="${name}" id="${prefix}_${i}_${j}">${item(i, j)}</td>`).join("") + "</tr>";
    }).join("");

    return `<table class="${name}"><tbody>${body}</tbody></table>`
}

function vec2id([i, j, k, l]) {
    return i + n * (j + n * (k + n * l));
}

function iterate(callback) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                for (let l = 0; l < n; l++) {
                    callback(i, j, k, l);
                }
            }
        }
    }
}

function render(n) {
    const axis = 'XYZD';
    const buttons = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
        .map(([a, b]) => `<button onclick="turn(${a}, ${b})">${axis[a]}${axis[b]}-axis</button>`)

    document.body.innerHTML = "Turn along plane: " + buttons.join(" ") + "<br/>" +
        table({ n, item: (i, j) => table({ n, name: "inner", prefix: `i_${i}_${j}` }) });
    let cells = new Array(n ** 4);

    iterate((i, j, k, l) => cells[vec2id([i, j, k, l])] = document.getElementById(`i_${i}_${j}_${k}_${l}`));

    return cells;
}

function turn(a, b) {
    let values = new Array(n ** 4), backgrounds = new Array(n ** 4);

    iterate((i, j, k, l) => {
        const fromVec = [i, j, k, l], from = vec2id(fromVec), toVec = [i, j, k, l];
        toVec[a] = fromVec[b];
        toVec[b] = fromVec[a];
        const to = vec2id(toVec);

        values[to] = cells[from].innerText;
        backgrounds[to] = cells[from].style.background;
    });

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = values[i];
        cells[i].style.background = backgrounds[i];
    }
}

function getChecks(n) {
    let options = ["u", "d"].concat(new Array(n).fill().map((_, i) => i)), checks = [];

    for (let o1 of options) {
        for (let o2 of options) {
            for (let o3 of options) {
                for (let o4 of options) {
                    let check = []
                    for (let i = 0; i < n; i++) {
                        let [a, b, c, d] = [o1, o2, o3, o4].map(v => {
                            if (v === "u") { return i; }
                            if (v === "d") { return n - 1 - i; }
                            return v;
                        });
                        let posId = a + n * (b + n * (c + n * d));
                        check.push(posId);
                    }
                    if (new Set(check).size === n) { checks.push(check); }
                }
            }
        }
    }

    return checks;
}

function checkWinner(opt) {
    if (winner) { return; }
    let ids = checks.find(ids => ids.every(id => cells[id].innerText === opt));
    if (!ids) { return; }

    winner = opt;
    winningCells = ids;
}

function play(id, isX) {
    if (winner) { return console.error("Game ended"); }
    if (nowX !== isX) { return console.error("Player mismatch"); }
    if (!cells[id]) { return console.error("Bad cell " + id); }

    cells[id].innerText = nowX ? 'X' : 'O';
    nowX = !nowX;

    checkWinner('X');
    checkWinner('O');
}

function findBestFor(isX) {
    const player = isX ? "X" : "O", opponent = isX ? "O" : "X";
    const suitable = checks.filter(ids => ids.every(id => cells[id].innerText !== opponent));
    const stats = suitable.map(ids => ({ ids, count: ids.filter(id => cells[id].innerText === player).length }));

    if (stats.length === 0) { return null; }

    const max = Math.max(...stats.map(e => e.count)),
        opts = stats.filter(e => e.count === max);

    if (max === n) { return null; }

    return opts[Math.floor(Math.random() * opts.length)];
}

function aiPlay(isX) {
    const suitableForMe = findBestFor(isX), suitableForOpponent = findBestFor(!isX);

    if (!suitableForMe && !suitableForOpponent) {
        console.error("No suitable for each player, game ended");
        return;
    }

    let chosen;

    if (!suitableForMe || (suitableForOpponent && suitableForOpponent.count === n - 1)) {
        chosen = suitableForOpponent.ids;
    } else {
        chosen = suitableForMe.ids;
    }

    const emptyIds = chosen.filter(id => cells[id].innerText === ""),
        chosenId = emptyIds[Math.floor(Math.random() * emptyIds.length)];

    play(chosenId, false);
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

let nowX = true, winner, winningCells, cells = render(n), checks = getChecks(n);

document.addEventListener("click", onClick);