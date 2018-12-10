const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

let input0 = [
    'position=< 9,  1> velocity=< 0,  2>',
    'position=< 7,  0> velocity=<-1,  0>',
    'position=< 3, -2> velocity=<-1,  1>',
    'position=< 6, 10> velocity=<-2, -1>',
    'position=< 2, -4> velocity=< 2,  2>',
    'position=<-6, 10> velocity=< 2, -2>',
    'position=< 1,  8> velocity=< 1, -1>',
    'position=< 1,  7> velocity=< 1,  0>',
    'position=<-3, 11> velocity=< 1, -2>',
    'position=< 7,  6> velocity=<-1, -1>',
    'position=<-2,  3> velocity=< 1,  0>',
    'position=<-4,  3> velocity=< 2,  0>',
    'position=<10, -3> velocity=<-1,  1>',
    'position=< 5, 11> velocity=< 1, -2>',
    'position=< 4,  7> velocity=< 0, -1>',
    'position=< 8, -2> velocity=< 0,  1>',
    'position=<15,  0> velocity=<-2,  0>',
    'position=< 1,  6> velocity=< 1,  0>',
    'position=< 8,  9> velocity=< 0, -1>',
    'position=< 3,  3> velocity=<-1,  1>',
    'position=< 0,  5> velocity=< 0, -1>',
    'position=<-2,  2> velocity=< 2,  0>',
    'position=< 5, -2> velocity=< 1,  2>',
    'position=< 1,  4> velocity=< 2,  1>',
    'position=<-2,  7> velocity=< 2, -2>',
    'position=< 3,  6> velocity=<-1, -1>',
    'position=< 5,  0> velocity=< 1,  0>',
    'position=<-6,  0> velocity=< 2,  0>',
    'position=< 5,  9> velocity=< 1, -2>',
    'position=<14,  7> velocity=<-2,  0>',
    'position=<-3,  6> velocity=< 2, -1>',
]

function parseInput(line) {
    let i = line.split(" v").map(i => i.split("="));
    let s= [i[0][1],i[1][1]].map(s => s.substr(1,s.length - 2).split(",").map(_ => parseInt(_)));
    return { l : s[0], v: s[1]};
}

function boundingBox(skyMap) {
    return skyMap.reduce((a,c) => {
        return {
            l:Math.min(a.l, c.l[0]),
            r:Math.max(a.r, c.l[0]),
            t:Math.min(a.t, c.l[1]),
            b:Math.max(a.b, c.l[1]),                                   
        }
    },{l:Infinity,r:-Infinity,t:Infinity, b:-Infinity});
}

function paintTheSky(skyMap, boundingBox) {

    for (let x = boundingBox.t; x <= boundingBox.b; x++) {
        let r = [];
        for (let y = boundingBox.l; y <= boundingBox.r; y++) {
            if (skyMap.some(e => e.l[1] == x && e.l[0]== y)) {
                r.push('#');
            } else {
                r.push(' ');
            }
        }
        console.log(r.join(""));
    }
}

let skyMap = input.map(parseInput);

let aligned = false;
let time = 0;

// paintTheSky(skyMap, boundingBox(skyMap));

let bb=boundingBox(skyMap);
let previousArea = Math.abs(bb.r-bb.l) * Math.abs(bb.b - bb.t);

do {
    time++;

    skyMap.forEach(i => {
        i.l[0] += i.v[0];
        i.l[1] += i.v[1];
    });

    let box = boundingBox(skyMap);
    let area = Math.abs(box.r-box.l) * Math.abs(box.b - box.t);
    if (area < previousArea) {
        
        previousArea = area;
    } else {
        aligned = true;
    }
    // console.log(`${time}: ${area}`);

} while (!aligned)

console.log(time - 1);

skyMap = input.map(parseInput);
for (let i = 0; i < time - 1; i++) {
    skyMap.forEach(i => {
        i.l[0] += i.v[0];
        i.l[1] += i.v[1];
    });
}

console.log(boundingBox(skyMap));

paintTheSky(skyMap, boundingBox(skyMap));
