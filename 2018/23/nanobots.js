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

function parseInput(input) {
    let nanobots = [];

    input.forEach(line => {
        [pos, r] = line.split(", ");
        r = parseInt(r.split("=")[1]);
        pos = pos.split("=")[1];
        pos = pos.substr(1, pos.length-2).split(",");
        nanobots.push({pos, r});
    });

    return nanobots;
}

function manhattanDistance(a, b) {
    return (Math.abs(b[0] - a[0]) + Math.abs(b[1]- a[1]) + Math.abs(b[2] - a[2]));
}

let nanobots = parseInput(input);

function getNanobotsInStrongRange(nanobots) {
    nanobots.sort((a,b) => b.r - a.r);

    let strong = nanobots[0];
    
    let count = 0;
    for (let i = 0; i < nanobots.length; i++) {
        let d = manhattanDistance(nanobots[i].pos, strong.pos);
        console.log(`${strong.pos}, ${nanobots[i].pos} - ${d}`);
        if (d <= strong.r) count++;
    }
    
    return count;
}

console.log(getNanobotsInStrongRange(nanobots));
