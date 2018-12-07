const fs = require('fs');

let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

let inputCoords = input.map(s => s.split(',').map(i => parseInt(i)));

let coords = [
    [1, 1],
    [1, 6],
    [8, 3],
    [3, 4],
    [5, 5],
    [8, 9],
]

coords = inputCoords;

let maxArea = {
    l: coords.reduce((a,c) => Math.min(c[0],a),Infinity),
    t: coords.reduce((a,c) => Math.min(c[1],a),Infinity),
    r:coords.reduce((a,c) => Math.max(c[0],a),0),
    b:coords.reduce((a,c) => Math.max(c[1],a),0),
};

function manhatanDistance(a,b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

let distances = [];

for (let col = maxArea.l; col <= maxArea.r; col++) {
    for (let row = maxArea.t; row <= maxArea.b; row++) {

        let closest = coords
            .map((c,i) => {return {i:i, d:manhatanDistance(c,[col,row])};})
            .sort((a,b) => a.d - b.d);

        distances.push((closest[0].d == closest[1].d)?'.':closest[0].i);
    }
}

let areaByCoordinate = distances.reduce( (p,c) => {
    if (p[c]) p[c]++; else p[c]=1;
    return p;
   },{});

console.log('Part one: ' +
    Object.entries(areaByCoordinate).sort((a,b) => a[1]-b[1]).pop()[1]
);

let regionSize = 0;
const maxRegionDistance = 10000;

for (let row = maxArea.t; row <= maxArea.b; row++) {
    for (let col = maxArea.l; col <= maxArea.r; col++) {
        let totalDistance = coords.map(c => manhatanDistance([col, row],c)).reduce((p,c) => p+c);
        if (totalDistance < maxRegionDistance) regionSize++;
    }
}
console.log('Part two: ' + regionSize);
