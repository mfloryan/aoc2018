const assert = require('assert');
const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");


function parseInput(input) {
    return input.map(l => l.split(",").map(_ => parseInt(_)));
}

let input1 = [
    '0,0,0,0',
    '3,0,0,0',
    '0,3,0,0',
    '0,0,3,0',
    '0,0,0,3',
    '0,0,0,6',
    '9,0,0,0',
    '12,0,0,0',
];

let input2 = [
    '-1,2,2,0',
    '0,0,2,-2',
    '0,0,0,-2',
    '-1,2,0,0',
    '-2,-2,-2,2',
    '3,0,2,-1',
    '-1,3,2,2',
    '-1,0,-1,0',
    '0,2,1,-2',
    '3,0,0,0',
];

let input3 = [
    '1,-1,0,1',
    '2,0,-1,0',
    '3,2,-1,0',
    '0,0,3,1',
    '0,0,-1,-1',
    '2,3,-2,0',
    '-2,2,0,0',
    '2,-2,0,-1',
    '1,-1,0,-1',
    '3,2,0,2',
];

let input4 = [
    '1,-1,-1,-2',
    '-2,-2,0,1',
    '0,2,1,3',
    '-2,3,-2,1',
    '0,2,3,-2',
    '-1,-1,1,-2',
    '0,-2,-1,0',
    '-2,2,3,-1',
    '1,2,2,0',
    '-1,-2,0,-2',
];

function manhattanDistance(a, b) {
    return (Math.abs(a[0] - b[0]) +
           Math.abs(a[1] - b[1]) +
           Math.abs(a[2] - b[2]) +
           Math.abs(a[3] - b[3]));
}

function countConstelations(points) {
    let constellations = [];

    points.forEach(p => {
        let c = constellations.filter(c => c.some(cp => manhattanDistance(p, cp) <= 3));
        if (c.length > 1) {
            let otherC = constellations.filter(c => !c.some(cp => manhattanDistance(p, cp) <= 3));
            let newC = c.flat();
            newC.push(p);
            constellations = [];
            constellations.push(newC);
            constellations.push(...otherC);
        } else {
            if (c.length == 1) c[0].push(p);
            else constellations.push([p]);
        }
    });
    return constellations;
}

assert.equal(countConstelations(parseInput(input1)).length, 2);
assert.equal(countConstelations(parseInput(input2)).length, 4);
assert.equal(countConstelations(parseInput(input3)).length, 3);
assert.equal(countConstelations(parseInput(input4)).length, 8);
console.log(countConstelations(parseInput(input)).length);