const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split('\n');

let offsets = [0,3,0,1,-3];

offsets = input.map(_ => parseInt(_));


function howManySteps(offsets) {

    let outside = false;
    let step = 0;
    let position = 0;
    do {
        step++;
        let oldPosition = position;
        position += offsets[position];
        offsets[oldPosition]++;        

        if (position < 0 || position >= offsets.length) outside = true;

    } while (!outside)

    return step;
}

console.log("Part 1: " + howManySteps(offsets.slice()));

function howManySteps2(offsets) {
    let outside = false;
    let step = 0;
    let position = 0;
    do {
        step++;
        let oldPosition = position;
        position += offsets[position];
        if (offsets[oldPosition] >= 3)
            offsets[oldPosition]--;
        else
            offsets[oldPosition]++;

        if (position < 0 || position >= offsets.length) outside = true;

    } while (!outside)

    return step;
}

console.log("Part 2: " + howManySteps2(offsets.slice()));