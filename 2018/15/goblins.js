const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let input1 = [
    '#########',
    '#G..G..G#',
    '#.......#',
    '#.......#',
    '#G..E..G#',
    '#.......#',
    '#.......#',
    '#G..G..G#',
    '#########',
];

let input2 = [
    '#######',
    '#.G...#',
    '#...EG#',
    '#.#.#G#',
    '#..G#E#',
    '#.....#',
    '#######',
];

let input3 = [
    '#######',
    '#E..G.#',
    '#...#.#',
    '#.G.#G#',
    '#######',
];

let input4 = [
    '#######',
    '#E..G.#',
    '#.G.#.#',
    '#.G.#G#',
    '#######',
];

let input5 = [
    '#######',
    '#.E...#',
    '#.....#',
    '#...G.#',
    '#######',
];

let input6 = [
    '#######',
    '#....G#',
    '#...#E#',
    '#..G..#',
    '#######',
];

function parseInput(input) {
    let walls = [];
    let units = [];

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == '#') walls.push({x, y}); else
            if (input[y][x] == 'G') units.push({x, y, hp: 200, type:"G"}); else
            if (input[y][x] == 'E') units.push({x, y, hp: 200, type: "E"});
        }
    }

    return { walls, units };
}

function drawBoard(board) {
    let coords = board.units.map(u => {return {x:u.x, y:u.y, c: u.type};})
                    .concat(board.walls.map(w => { return {x:w.x, y:w.y, c:"#"}}));

    let dim = coords.reduce((a,c) => { return {x: Math.max(a.x, c.x), y: Math.max(a.y, c.y)}}, {x:0, y:0});

    for (let y = 0; y <= dim.y; y++) {
        let row = "";
        for (let x = 0; x <= dim.x; x++) {
            let point = coords.find(c => c.x == x && c.y == y);
            if (point) row += point.c; else row += ".";
        }
        console.log(row);
    }
}

let surroundings =function(point) {
    const coords = [
        {x: 0, y: -1},
        {x: -1, y: 0},
        {x: +1, y: 0},
        {x: 0, y: +1},
    ];
    return coords.map(c => {return {x: c.x + point.x, y: c.y + point.y}});
} 

function exploreBoard(start, board, previousNeighbours, distance) {
    let newNeighbours = [];

    let possibleNext = start.flatMap(surroundings);

    possibleNext = possibleNext.filter(point => !board.walls.concat(board.units).some(p => (p.x == point.x && p.y == point.y) ));
    possibleNext = possibleNext.filter(point => !previousNeighbours.some(p => (p.x == point.x && p.y == point.y)));
    possibleNext.filter(point => !start.some(p => p.x == point.x && p.y == point.y));

    let nnDupes = possibleNext.map(p => {return {x: p.x, y: p.y, d: distance}});
    let nn = [];
    //remove duplicates
    nnDupes.forEach(n => {
        if (!nn.some(p => p.x == n.x && p.y == n.y)) nn.push(n);
    });

    if (nn.length > 0) {
        newNeighbours.push(...nn);

        let deeper = exploreBoard(nn, board, previousNeighbours.concat(newNeighbours), distance + 1);
        newNeighbours.push(...deeper);
    }

    return newNeighbours;
}

function countPath(board, start, previousNeighbours, distance, unit) {
    let possibleNext = start.flatMap(surroundings);
    possibleNext = possibleNext.filter(point => !board.walls.concat(board.units).some(p => (p.x == point.x && p.y == point.y) ));
    possibleNext = possibleNext.filter(point => !previousNeighbours.some(p => (p.x == point.x && p.y == point.y)));

    let nnDupes = possibleNext.map(p => {return {x: p.x, y: p.y, d: distance}});
    let nn = [];
    //remove duplicates
    nnDupes.forEach(n => {
        if (!nn.some(p => p.x == n.x && p.y == n.y)) nn.push(n);
    });

    let newNeighbours = [];
    if (nn.length > 0) {
        newNeighbours.push(...nn);

        let deeper = exploreBoard(nn, board, previousNeighbours.concat(newNeighbours), distance + 1);
        newNeighbours.push(...deeper);
    }

    return newNeighbours;
}

function findPath(board, start, destination) {

    let visited = [start];
    let queue = [{x: start.x, y: start.y, d: 0}];

    let paths = [];

    while (queue.length > 0) {
        let n = queue.shift();

        if (n.x == destination.x && n.y == destination.y) {
            let path = [];
            let parent = n;
            do {
                path.unshift({x: parent.x, y:parent.y, d:parent.d});
                parent = parent.parent;
            } while (parent.parent);
            return path;
            // paths.push(path);
            // visited.splice(visited.findIndex(v => v.x == n.x && v.y == n.y));
        } else {
            let possibleNext = surroundings(n);
            possibleNext = possibleNext.filter(point => !board.walls.concat(board.units).some(p => (p.x == point.x && p.y == point.y) ));
            possibleNext = possibleNext.filter(point => !visited.some(p => (p.x == point.x && p.y == point.y)));

            visited.push(...possibleNext);
            queue.push(...possibleNext.map(p => { return {x: p.x, y: p.y, d: n.d + 1, parent: n}}));
        }
    }

    return paths;
}

Array.prototype.inReadingOrder = function() {
    return this.sort((a,b) => a.x - b.x)
               .sort((a,b) => a.y - b.y);
};

function moveUnit(board, unit) {
    // is in range of target?

    // console.log();
    // console.log(`Unit:`);
    // console.log(unit);

    let otherUnits = board.units.filter(u => !(u.x == unit.x && u.y == unit.y));
    let targets = otherUnits.filter(u => u.type != unit.type);

    if (surroundings(unit).some(u => targets.some(ou => u.x == ou.x && u.y == ou.y))) return;

    let targetVicinity = targets
        .flatMap(surroundings)
        .filter( v => !board.walls.some(b => b.x == v.x && b.y == v.y) )
        .filter( v => !otherUnits.some(u => u.x == v.x && u.y == v.y) );

    let possibleMoves = exploreBoard([unit], board, [], 1);
    
    // drawBoard({walls: board.walls, units: board.units.concat(possibleMoves.map(m => {return {x:m.x, y:m.y, type:(m.d%10)}}))});

    let possibleTargets = possibleMoves
        .filter(m => targetVicinity.some(v => m.x == v.x && m.y == v.y))
        .sort((a,b) => a.d - b.d);

    if (possibleTargets.length > 0) {
        let minDistance = possibleTargets.reduce((a,c) => Math.min(c.d, a), Infinity);
        possibleTargets = possibleTargets
            .filter(t => t.d == minDistance)
            .inReadingOrder()
        
        let nextTarget = possibleTargets[0];
        if (nextTarget) {
            // console.log(`Will move to [${nextTarget.x}, ${nextTarget.y}]`);
            // let p = findPath(board, unit, {x:nextTarget.x, y: nextTarget.y});

            let p = countPath(board, [nextTarget], [], 1, unit);
            let s = surroundings(unit);
            let whereToMove = p.filter( n => s.some(node => n.x == node.x && n.y == node.y))
            .inReadingOrder()
            .sort((a,b) => a.d - b.d)

            if (whereToMove.length > 0) {
                unit.x = whereToMove[0].x;
                unit.y = whereToMove[0].y;
            }
        } else {
            // return unit;
        }
    } else {
        // return unit;
    }

}

function attackUnit(board, unit) {
    if (unit.hp < 1) return;

    let us = surroundings(unit);
    let enemies = board.units.filter(u => u.type != unit.type);

    let enemiesAround = enemies.filter(e => us.some(s => s.x == e.x && s.y == e.y));
    enemiesAround = enemiesAround.inReadingOrder().sort((a,b) => a.hp - b.hp);
    if (enemiesAround.length > 0) enemiesAround[0].hp -= 3;
}


function gameRound(board) {
    let units = board.units.inReadingOrder();

    if (new Set(board.units.map(u => u.type)).size == 1) return true;

    units.forEach(u => {
        moveUnit(board, u)
        attackUnit(board, u);
    });

    board.units = board.units.filter(u => u.hp > 0);

    return false;
}

input = input6;

let board = parseInput(input.map(r => r.split("")));

drawBoard(board);


// let battleEnded = false;
// let i =0;
// do {
//     i++;
//     battleEnded = gameRound(board);
//     console.log(i);
//     drawBoard(board);
//     if (i==27) {
//         console.log(board.units);
//     }
// } while (!battleEnded)


// for (let i = 0; i < 23; i++) {
//     console.log(i+1);
//     gameRound(board);
// }

// drawBoard(board);

gameRound(board);
drawBoard(board);

gameRound(board);
drawBoard(board);

// console.log(board.units);

// gameRound(board);
// drawBoard(board);

// console.log(board.units);

// gameRound(board);
// drawBoard(board);

// console.log(board.units);


// gameRound(board);
// drawBoard(board);

// console.log(board.units);

// gameRound(board);
// drawBoard(board);