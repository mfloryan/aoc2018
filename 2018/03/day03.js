const fs = require('fs');

let input = fs.readFileSync('day03-input.txt', {encoding: 'utf8'}).split("\n");

let coords = [
    '#1 @ 1,3: 4x4',
    '#2 @ 3,1: 4x4',
    '#3 @ 5,5: 2x2'
];

function parseCoords(coords) {
    let parts = coords.split(" ");
    let index = parts[0].substr(1);
    let xy = parts[2].split(',').map(_ => parseInt(_));
    let wh = parts[3].split('x').map(_ => parseInt(_));

    return {
        index: index,
        x: xy[0],
        y: xy[1],
        w: wh[0],
        h: wh[1],
    }
}

let fabric = [];

function fillFabric(fabric, elf) {
    for (let i = 0; i < elf.w; i++) {
        if (!fabric[elf.x+i]) fabric[elf.x+i] = [];
        for (let j=0; j < elf.h; j++) {
            if (!fabric[elf.x+i][elf.y+j]) fabric[elf.x+i][elf.y+j] =1;
            else fabric[elf.x+i][elf.y+j]++;
        }
    }
}

let overlapIds = [];

function addIfNotExists(id) {
    if (!overlapIds.includes(id)) {
        overlapIds.push(id);
    }
}

function markFabric(fabric, elf) {
    for (let i = 0; i < elf.w; i++) {
        if (!fabric[elf.x+i]) fabric[elf.x+i] = [];
        for (let j=0; j < elf.h; j++) {
            const element = fabric[elf.x+i][elf.y+j];
            if (!element) {
                fabric[elf.x+i][elf.y+j] = elf.index;
            } else {
                if (element != 'X') {
                    addIfNotExists(element);
                }
                addIfNotExists(elf.index);
                fabric[elf.x+i][elf.y+j] = 'X';
            }
        }
    }
}

input.map(parseCoords).forEach(c => markFabric(fabric, c));

// console.log(overlapIds);

console.log(input.map(parseCoords).map(x => x.index).filter(x => !overlapIds.includes(x)));

// console.log(fabric);

function countOverlaps(fabric) {
    let count = 0;
    for (let i = 0; i < fabric.length; i++) {
        if (fabric[i]) {
            for (let j=0; j < fabric[i].length; j++) {
                if (fabric[i][j] > 1) count++;
            }
        }
    }
    return count;
}
