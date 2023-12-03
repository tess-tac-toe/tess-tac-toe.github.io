// https://github.com/tess-tac-toe/tess-tac-toe.github.io
// tic-tac-toe on tesseract (4 dimension cube)

function getStats(values = getValues()) {
    let xOptions = Array.from({ length: N }, () => ([])),
        oOptions = Array.from({ length: N }, () => ([])),
        stalled = true;

    for (let ids of CHECKS) {
        let counts = { "X": 0, "O": 0, "": 0 }, options = ids.map(id => values[id] === "");
        ids.forEach(id => counts[values[id]]++);

        if (counts.X === N) { return { winner: "X", highlight: ids }; }
        if (counts.O === N) { return { winner: "O", highlight: ids }; }

        if (counts.X >= 0 && counts.O === 0) { xOptions[counts.X].push(options); stalled = false; }
        if (counts.X === 0 && counts.O >= 0) { oOptions[counts.O].push(options); stalled = false; }
    }

    if (stalled) { return { winner: "stalled", highlight: Array.from({ length: SIZE }, (_, i) => i) }; }
    return { xOptions, oOptions };
}


// Old AI

function getSets(values = getValues()) {
    const sets = { "X": [], "O": [], "OX": [], "": [] };

    CHECKS.forEach(ids => {
        const key = Array.from(new Set(ids.map(id => values[id]))).sort().join("");
        sets[key].push(ids);
    });

    return sets;
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

    return chosenId;
}
