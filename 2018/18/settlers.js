const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let inputExample = [
    '.#.#...|#.',
    '.....#|##|',
    '.|..|...#.',
    '..|#.....#',
    '#.#|||#|#|',
    '...#.||...',
    '.|....|...',
    '||...#|.#|',
    '|.||||..|.',
    '...#.|..|.',
];

function parseInput(input) {
    return input.map(r => r.split(""));
}

let vicinity =function(point) {
    let around = [
        {r: 0, c: -1},
        {r: 0, c: +1},
        {r: 1, c: -1},
        {r: 1, c: 0},
        {r: 1, c: 1},
        {r: -1, c: -1},
        {r: -1, c: 0},
        {r: -1, c: 1},
    ];
    return around.map(c => {return {r: c.r + point.r, c: c.c + point.c}});
}

function oneIteration(area) {
    let newArea = [];

    for (let r = 0; r < area.length; r++) {
        let row = area[r];
        let newRow = [];
        for (let c = 0; c < row.length; c++) {
            let acre = area[r][c];
            let around = vicinity({r,c}).filter(acre => !(acre.r < 0 || acre.c < 0 || acre.c >= row.length || acre.r >= area.length));
            let contents = around.map(acre => area[acre.r][acre.c]).reduce((a,c) => {a[c]++; return a;}, {'.':0, '|':0, '#':0});
            if (acre == '.') {
                if (contents['|'] >= 3) newRow.push('|');
                else newRow.push(acre);
            } 
            if (acre == '|') {
                if (contents['#'] >= 3) newRow.push('#');
                else newRow.push(acre);
            }
            if (acre == '#') {
                if (contents['#'] > 0 && contents['|'] > 0) newRow.push('#');
                else newRow.push('.')
            }
        }
        newArea.push(newRow);
    }

    return newArea;
}

function resourceValue(area) {
    let wood = area.flatMap(r => r.filter(c => c == "|")).length;
    let lumber = area.flatMap(r => r.filter(c => c == "#")).length;
    return wood * lumber;
}

let start = parseInput(input);

function findCycles(start) {
    let cycle = [];
    let cycleStart = 0;
    let foundCycles = [];

    let inCycle = false;
    let cycleValidation = 0;

    for (let i =0; i< 16000; i++) {
        start = oneIteration(start);
        // console.log(start.map(r => r.join("")).join("\n"));
        // console.log("\n");

        if (i > 1000) {
            // let wood = start.flatMap(r => r.filter(c => c == "|")).length;
            // let lumber = start.flatMap(r => r.filter(c => c == "#")).length;
            // let value = wood * lumber;
            let flatMap = start.map(r => r.join("")).join("");
            if (cycle.length == 0) {
                cycle.push(flatMap);
            } else {
                if (!inCycle) {
                    if (cycle[i % cycle.length] == flatMap) {
                        console.log(`Maybe cycle: ${i}, ${cycle.length}`);
                        foundCycles.push({i: i, len: cycle.length});
                        inCycle = true;
                        cycleValidation = cycle.length;
                        alternativeCycle = cycle.slice();
                    } else {
                        cycle.push(flatMap);
                    }
                } else {
                    alternativeCycle.push(flatMap);
                    if (cycleValidation > 0) {
                        if (cycle[i % cycle.length] != flatMap ) {
                            console.log("Broken " + i);
                            cycle =[];
                            inCycle = false;
                        } else {
                            cycleValidation--;
                        }
                    } else {
                        console.log(`Cycle validated ${i}`);
                        break;
                    }
                }
            }
        }
    }
}

function travelThroughTime(area, minutes) {
    let myArea = area;
    for (let i = 0; i < minutes; i++) {
        myArea = oneIteration(myArea);
    }
    return resourceValue(myArea);
}

function getCycleValues(area, start, length, times) {
    let myArea = area;
    let values = new Array(length)
    for (let i = 0; i < (start + (length * times)); i++) {
        myArea = oneIteration(myArea);
        if (i >= start) {
            values[i % length] = resourceValue(myArea);
        }
    }
    return values;
}

console.log(`Part one: ${travelThroughTime(parseInput(input), 10)}`);
let cycleValues = getCycleValues(start,7918,28,2);
console.log(`Part two: ${cycleValues[(1000000000-1) % 28]}`);
