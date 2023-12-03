// https://github.com/tess-tac-toe/tess-tac-toe.github.io
// tic-tac-toe on tesseract (4 dimension cube)

const N = 4, SIZE = N ** 4;

function vec2id([i, j, k, l]) {
    return i + N * (j + N * (k + N * l));
}

function forEachVec(callback) {
    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
            for (let k = 0; k < N; k++)
                for (let l = 0; l < N; l++)
                    callback([i, j, k, l]);
}

function buildSwaps() {
    const axes = 'XYZW', swaps = {}, pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

    for (let [a, b] of pairs) {
        const swap = swaps[axes[a] + axes[b]] = new Array(SIZE);

        forEachVec(([i, j, k, l]) => {
            const fromVec = [i, j, k, l], toVec = [i, j, k, l];

            toVec[a] = fromVec[b];
            toVec[b] = fromVec[a];

            swap[vec2id(fromVec)] = vec2id(toVec);
        });
    }

    return swaps;
}

function buildChecks() {
    const checks = [], options = ["u", "d", ...Array.from({ length: N }, (_, i) => i)];

    function addCheck(opts) {
        if (opts.every(opt => typeof opt === "number")) { return; }

        const ids = Array.from({ length: N }, (_, i) =>
            opts.map(v => v === "u" ? i : v === "d" ? N - 1 - i : v)).map(vec2id);

        checks.push(ids);
    }

    for (let o1 of options)
        for (let o2 of options)
            for (let o3 of options)
                for (let o4 of options)
                    addCheck([o1, o2, o3, o4]);

    return checks;
}

const SWAPS = buildSwaps(), CHECKS = buildChecks();
