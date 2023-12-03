// https://github.com/tess-tac-toe/tess-tac-toe.github.io
// tic-tac-toe on tesseract (4 dimension cube)

let nowX = true;

function vec2id([i, j, k, l]) {
    return i + N * (j + N * (k + N * l));
}

function iterate(callback) {
    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
            for (let k = 0; k < N; k++)
                for (let l = 0; l < N; l++)
                    callback(i, j, k, l);
}

function swap(a, b) {
    let values = new Array(N ** 4), backgrounds = new Array(N ** 4);

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

function getSets(values = getValues()) {
    const options = ["u", "d", ...Array.from({ length: N }, (_, i) => i)],
        sets = { "X": [], "O": [], "OX": [], "": [] };

    function addCheck(opts) {
        if (opts.every(opt => typeof opt === "number")) { return; }

        const ids = Array.from({ length: N }, (_, i) =>
            opts.map(v => v === "u" ? i : v === "d" ? N - 1 - i : v)).map(vec2id);

        const key = Array.from(new Set(ids.map(id => values[id]))).sort().join("");
        sets[key].push(ids);
    }

    for (let o1 of options)
        for (let o2 of options)
            for (let o3 of options)
                for (let o4 of options)
                    addCheck([o1, o2, o3, o4]);

    return sets;
}

function getStats(values = getValues()) {
    let sets = getSets(values), bestX = null, bestO = null, end = null;

    for (let ids of sets.X) {
        let count = ids.filter(id => values[id] === "X").length;
        if (!bestX || bestX.count < count) {
            bestX = { ids, count };
        }
    }

    for (let ids of sets.O) {
        let count = ids.filter(id => values[id] === "O").length;
        if (!bestO || bestO.count < count) {
            bestO = { ids, count };
        }
    }

    if (bestX?.count === N) {
        end = bestX.ids;
    } else if (bestO?.count === N) {
        end = bestO.ids;
    } else if (!bestX && !bestO) {
        end = Array.from({ length: N ** 4 }, (_, i) => i);
    }

    return { sets, bestX, bestO, end };
}

function play(id, isX) {
    if (nowX !== isX) { return console.error("Player mismatch"); }
    if (!cells[id]) { return console.error("Bad cell " + id); }
    if (cells[id].innerText) { return console.error("Already set"); }

    cells[id].innerText = nowX ? 'X' : 'O';
    nowX = !nowX;
}

function findBestFor(isX) {
    const player = isX ? "X" : "O", opponent = isX ? "O" : "X";
    const sets = getSets(), checks = [...sets.X, ...sets.O, ...sets.OX, ...sets['']];
    const suitable = checks.filter(ids => ids.every(id => cells[id].innerText !== opponent));
    const stats = suitable.map(ids => ({ ids, count: ids.filter(id => cells[id].innerText === player).length }));

    if (stats.length === 0) { return null; }

    const max = Math.max(...stats.map(e => e.count)),
        opts = stats.filter(e => e.count === max);

    if (max === N) { return null; }

    return opts[Math.floor(Math.random() * opts.length)];
}

function aiPlay(isX) {
    const suitableForMe = findBestFor(isX), suitableForOpponent = findBestFor(!isX);

    if (!suitableForMe && !suitableForOpponent) {
        console.error("No suitable for each player, game ended");
        return;
    }

    let chosen;

    if (!suitableForMe || (suitableForOpponent && suitableForOpponent.count === N - 1)) {
        chosen = suitableForOpponent.ids;
    } else {
        chosen = suitableForMe.ids;
    }

    const emptyIds = chosen.filter(id => cells[id].innerText === ""),
        chosenId = emptyIds[Math.floor(Math.random() * emptyIds.length)];

    play(chosenId, false);
}
