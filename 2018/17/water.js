const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let input2 = [
    'x=495, y=2..7',
    'y=7, x=495..501',
    'x=501, y=3..7',
    'x=498, y=2..4',
    'x=506, y=1..2',
    'x=498, y=10..13',
    'x=504, y=10..13',
    'y=13, x=498..504',
];


function parseInput(input) {
    let veins = [];
    input.forEach(line => {
        let coords = line.split(", ").map(i => i.split("="));
        coords[1][1] = coords[1][1].split("..").map(_ => parseInt(_));
        coords[0][1] = parseInt(coords[0][1]);
        let min = coords[1][1][0];
        let max = coords[1][1][1];
        let vein = [];
        for (let i = min; i <= max; i++) {
            if (coords[0][0] == 'x') {
                vein.push({x:coords[0][1], y: i});
            } else if (coords[0][0] == 'y') {
                vein.push({x:i, y:coords[0][1]});
            }
        }
        veins.push(vein);
    });
    return veins;
}


function drawMap(map, boundaries = undefined, filled = []) {

    if (!boundaries) {
        boundaries = map.reduce((a,c) => { return {
            minX: Math.min(c.x, a.minX),
            maxX: Math.max(c.x, a.maxX),
            maxY: Math.max(c.y, a.maxY)}}, {minX: Infinity, maxX: -Infinity,  maxY:0});
    }

    for (let y = 0; y <= boundaries.maxY; y++) {
        let row = "";
        for (let x = boundaries.minX - 1; x <= boundaries.maxX + 1; x++) {
            if (x == 500 && y == 0) row += "+"; else {
                if (map.some(c => c.x == x && c.y == y)) 
                    row += "#"; 
                else if (filled.some(c => c.x == x && c.y == y))
                    row += filled.find(c => c.x == x && c.y == y).t;
                else
                    row += " ";
            }
        }
        console.log(row);
    }
}

function canFlow(map, point) {
    return !map.some(p => p.x == point.x && p.y == point.y);
}

function fillWithWater(map, maxY, start, filled) {
    if (start.y > maxY) return true; //got to the end
    // can I flow here?
    if (!canFlow(map, start)) return false;
    // if (!canFlow(filled, start)) return false;
    let inFilled = filled.find(c => c.x == start.x && c.y == start.y);
    if (inFilled) {
        inFilled.t = '~';
        return false;
    }
    filled.push(start);

    if (fillWithWater(map, maxY, {x: start.x, y: start.y + 1, t:'|'}, filled)) {
        return true;
    } else {
        // don't go to the side if there is already water there
        let r1 = false;
        if (canFlow(filled, {x: start.x - 1, y: start.y})) {
            r1 = fillWithWater(map, maxY, {x: start.x - 1, y: start.y, t:'|'}, filled);
            if (!r1) {
                let find = filled.find(f => f.x == start.x - 1 && f.y == start.y);
                if (find) find.t = '~';
            }
        }
        let r2 = false;
        if (canFlow(filled, {x: start.x + 1, y: start.y})) {
        r2 = fillWithWater(map, maxY, {x: start.x + 1, y: start.y, t:'|'}, filled);
            if (!r2) {
                let find = filled.find(f => f.x == start.x + 1 && f.y == start.y);
                if (find) find.t = '~';
            }
        }
        return r1 || r2;
    }
}

let veins = parseInput(input);

let map = veins.flatMap(_ => _);
let boundaries = map.reduce((a,c) => { return {
    minX: Math.min(c.x, a.minX),
    maxX: Math.max(c.x, a.maxX),
    maxY: Math.max(c.y, a.maxY)}}, {minX: Infinity, maxX: -Infinity,  maxY:0});

drawMap(map);
console.log('-\n\n');
let filled = [];
fillWithWater(map, boundaries.maxY, {x:500, y:0, t:'+'}, filled);

console.log("\n\n****\n\n");

drawMap(map, undefined, filled);

console.log(filled.filter(f => (f.y > 0)).length);

// 72646 - too high