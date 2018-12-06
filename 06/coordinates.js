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

//find coordinates that are not intifine


coords = inputCoords;

let maxArea = [];

maxArea = {
    l: coords.reduce((a,c) => Math.min(c[0],a),Infinity),
    t: coords.reduce((a,c) => Math.min(c[1],a),Infinity),
    r:coords.reduce((a,c) => Math.max(c[0],a),0),
    b:coords.reduce((a,c) => Math.max(c[1],a),0),
};

console.log(maxArea);

let middleCoords = coords.filter( c => !(c[0] == maxArea.l || c[0] == maxArea.r || c[1] == maxArea.t || c[1] == maxArea.b));

console.log(middleCoords);

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

console.log(
distances.reduce( (p,c) => {
     if (p[c]) p[c]++; else p[c]=1;
     return p; 
    },{})
);