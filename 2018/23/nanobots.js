const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let input1 = [
    'pos=<0,0,0>, r=4',
    'pos=<1,0,0>, r=1',
    'pos=<4,0,0>, r=3',
    'pos=<0,2,0>, r=1',
    'pos=<0,5,0>, r=3',
    'pos=<0,0,3>, r=1',
    'pos=<1,1,1>, r=1',
    'pos=<1,1,2>, r=1',
    'pos=<1,3,1>, r=1',
];

let input2 = [
    'pos=<10,12,12>, r=2',
    'pos=<12,14,12>, r=2',
    'pos=<16,12,12>, r=4',
    'pos=<14,14,14>, r=6',
    'pos=<50,50,50>, r=200',
    'pos=<10,10,10>, r=5',
]

function parseInput(input) {
    let nanobots = [];

    input.forEach(line => {
        [pos, r] = line.split(", ");
        r = parseInt(r.split("=")[1]);
        pos = pos.split("=")[1];
        pos = pos.substr(1, pos.length-2).split(",").map(_ => parseInt(_));
        nanobots.push({pos, r});
    });

    return nanobots;
}

function manhattanDistance(a, b) {
    return (Math.abs(b[0] - a[0]) + Math.abs(b[1]- a[1]) + Math.abs(b[2] - a[2]));
}

function getNanobotsInRange(nanobots, nanobot) {
    let count = 0;
    for (let i = 0; i < nanobots.length; i++) {
        let d = manhattanDistance(nanobots[i].pos, nanobot.pos);
        if (d <= nanobot.r) count++;
    }
    return count;
}

function countNanobotsInRangeOfPoint(nanobots, point) {
    let count = 0;
    for (let i = 0; i < nanobots.length; i++) {
        let d = manhattanDistance(nanobots[i].pos, point.pos);
        if (d <= nanobots[i].r) count++;
    }
    return count;
}

function getNanobotsInStrongRange(nanobots) {
    nanobots.sort((a,b) => b.r - a.r);

    let strong = nanobots[0];
    return getNanobotsInRange(nanobots, strong);
}

let nanobots = parseInput(input2);
// console.log(getNanobotsInStrongRange(nanobots));

let xRanges = nanobots.flatMap(n => [{d: n.pos[0] - n.r,t: +1}, {d: n.pos[0] + n.r + 1, t: -1}]).sort((a,b) => (a.d - b.d));
let yRanges = nanobots.flatMap(n => [{d: n.pos[1] - n.r,t: +1}, {d: n.pos[1] + n.r + 1, t: -1}]).sort((a,b) => (a.d - b.d));
let zRanges = nanobots.flatMap(n => [{d: n.pos[2] - n.r,t: +1}, {d: n.pos[2] + n.r + 1, t: -1}]).sort((a,b) => (a.d - b.d));

function getIntervals(ranges) {
    let xR2 = {};
    let total = 0;
    let lastX = undefined;
    
    ranges.forEach(r => {
        total += r.t;
        if (r.d != lastX) {
            xR2[r.d] = total;
        }
    });
    let intervalBoundaries = Object.keys(xR2).map(k => { return {p: parseInt(k), c: xR2[k]}}).sort((a,b) => a.p - b.p);

    let intervals = [];
    let previous = undefined;
    intervalBoundaries.forEach( b => {
        if (previous) {
            intervals.push({s: previous.p, e: b.p - 1, c: previous.c})
        } 
        previous = b;
    });

    return intervals;
}

function getBestIntervals(intervals) {
    let i = intervals.sort((a, b) => b.c - a.c);
    return i[0];
}

console.log(getBestIntervals(getIntervals(xRanges)));
console.log(getBestIntervals(getIntervals(yRanges)));
console.log(getBestIntervals(getIntervals(zRanges)));

console.log(
    sweepSpace(nanobots, 
        [   getBestIntervals(getIntervals(xRanges)), 
            getBestIntervals(getIntervals(yRanges)), 
            getBestIntervals(getIntervals(zRanges))]));
// console.log(countNanobotsInRangeOfPoint(nanobots, {pos: [12, 12, 12]}));

function sweepSpace(nanobots, ranges) {

    let bestPoint = [0,0,0];
    let count = 0;

    for (let x = ranges[0].s; x <= ranges[0].e; x++) {
        for (let y = ranges[1].s; y <= ranges[1].e; y++) {
            for (let z = ranges[2].s; z <= ranges[2].e; z++) {
                let howManyHere = countNanobotsInRangeOfPoint(nanobots, {pos: [x, y, z]});
                if (howManyHere >= count) {
                    if (howManyHere == count) {
                        if (manhattanDistance([x, y, z], [0, 0, 0]) < manhattanDistance(bestPoint, [0, 0, 0])) {
                            bestPoint = [x, y, z];
                        }
                    } else {
                        bestPoint = [x,y,z];
                        count = howManyHere;
                    }
                }
            }
        }
    }
    console.log(`[${bestPoint}] with ${count} nanobots away by ${manhattanDistance(bestPoint, [0, 0, 0])}`);
    return manhattanDistance(bestPoint, [0, 0, 0]);
}

