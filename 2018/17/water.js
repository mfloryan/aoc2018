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

let input3 = [
    'x=498, y=3..5',
    'x=502, y=3..5',
    'y=5, x=498..502',
    'x=496, y=7..10',
    'x=499, y=8..10',
    'x=501, y=8..10',
    'x=504, y=7..10',
    'y=10, x=496..499',
    'y=10, x=501..504',
    // 'x=499, y=13..15','x=501, y=13..15',
    // 'y=15, x=499..501',
];


let input4 = [
    'x=498, y=3..5',
    'x=504, y=3..5',
    'y=5, x=498..504',
    'x=496, y=10..13',
    'x=505, y=11..13',
    'y=13, x=496..505',
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

function drawMap(map, maxY = undefined) {

    let y = 0;
    map.forEach(r => {
        row = ".";
        r.forEach(c => {
            row += (c[1] == ' ')?((c[0] == ' ')?'.':c[0]):c[1];
        });
        if (maxY) {
            if (y < maxY) {
                console.log(row + ".");
            }
        } else console.log(row + ".");
        y++;
    });
}

function isWall(map, start) {
    if (!map[start.y][start.x]) return true;
    if (map[start.y][start.x][0] == "#") return true;
    return false;
}

function isWater(map, start) {
    if (!map[start.y][start.x]) return false;
    if (map[start.y][start.x][1] != " ") return true;
    return false;
}

function fillWithWater(map, maxY, start, direction = "", c = 0) {
    if (start.y > maxY) {
        return 1; //got to the end
    }
    if (isWall(map, start)) {
        return -1;
    }
    if (isWater(map, start)) {
        if (direction == "d" && map[start.y][start.x][1] == "|") return 0; else
         return -2;
    }
    // map[start.y][start.x][1] = "*";

    // if (start.y == 415 || start.y == 416) {
    //     drawMap(map, 460);
    //     console.log(c);
    //     console.log(start);
    // }

    map[start.y][start.x][1] = "*";
    console.log(c);
    drawMap(map);



    map[start.y][start.x][1] = "|";

    let down = fillWithWater(map, maxY, {x: start.x, y: start.y + 1}, "d", c+1);
    if (down == 1) return 1;

    if (down < 0) {
        let r1 = fillWithWater(map, maxY, {x: start.x - 1, y: start.y}, "l", c+1);
        if (r1 == -1) map[start.y][start.x][1] = "~";

        let r2 = fillWithWater(map, maxY, {x: start.x + 1, y: start.y}, "r", c+1);
        if (r2 == -1) map[start.y][start.x][1] = "~";

        return (r1 == 1 || r2 == 1)?"1":-1;
    }

}
function createBox(obstacles, boundaries) {
    let box = [];
    for (let y = 0; y <= boundaries.maxY; y++) {
        let row = [];
       for (let x = boundaries.minX-1; x <= boundaries.maxX+1; x++) {
            if (obstacles.some(p => p.x == x && p.y == y)) row.push(['#',' ']); else row.push([' ',' ']);
       }
       box.push(row);
    }
    return box;
}

function solveInput(input) {
    let veins = parseInput(input).flatMap(_ => _);

    let boundaries = veins.reduce((a,c) => { return {
        minX: Math.min(c.x, a.minX),
        maxX: Math.max(c.x, a.maxX),
        maxY: Math.max(c.y, a.maxY)}}, {minX: Infinity, maxX: -Infinity,  maxY:0});
    
    let map = createBox(veins, boundaries);
    map[0][500 - boundaries.minX + 1][0] = "+";
    
    drawMap(map);
    fillWithWater(map, boundaries.maxY, {x:500 - boundaries.minX + 1, y:0});

    console.log("\n****\n");
    drawMap(map);

    let waterCount = map.flatMap(r => r.map(c => c[1]).filter(i => i != ' ')).length - 1;
    console.log(waterCount);
    return waterCount;
}

// console.log(solveInput(input2) == 57);
console.log(solveInput(input3));
// console.log(solveInput(input4));

// console.log(solveInput(input));


// 72646 - too high
// 68530
// 201998
// 132455 