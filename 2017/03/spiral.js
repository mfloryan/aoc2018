
function generateCircle(start, radius) {
    let points = [];
    let x = start[0];
    let y = start[1];
    // go up
    for (let i = 0; i < radius * 2; i++) {
        points.push([x + 1, y - i]);
    }
    
    // go left
    for (let i = 0; i < radius * 2; i++) {
        points.push([x - i, y - radius*2 + 1]);
    }

    // go down
    for (let i = 0; i < radius * 2; i++) {
        points.push([x - radius *2 + 1, y - radius*2 + 2 + i]);
    }

    // go right
    for (let i = 0; i < radius * 2; i++) {
        points.push([x - radius * 2 + 2 + i, y + 1]);
    }
    
    return points;
}

function buildSpiral(maxLength) {
    let spiral = [[0,0]];
    let i = 1;
    do {
        spiral = spiral.concat(generateCircle(spiral[spiral.length-1], i));
        i++;
    } while (spiral.length < maxLength);
    return spiral;
}

function distance(point) {
    return (Math.abs(point[0]) + Math.abs(point[1]));
}

let spiral =buildSpiral(277678); 
console.log(distance(spiral[12-1]) == 3);
console.log(distance(spiral[23-1]) == 2);
console.log(distance(spiral[1024-1]) == 31);

console.log("Part 1:")
console.log(distance(spiral[277678-1]));

let summedSpiral = [1];

function neighbours(point) {
    return [
        [point[0] - 1, point[1] + 1],
        [point[0] - 1, point[1] - 0],
        [point[0] - 1, point[1] - 1],
        [point[0] - 0, point[1] + 1],
        [point[0] - 0, point[1] - 0],
        [point[0] - 0, point[1] - 1],
        [point[0] + 1, point[1] + 1],
        [point[0] + 1, point[1] - 0],
        [point[0] + 1, point[1] - 1],
    ];
}

spiral = buildSpiral(1024); 
let newValue;
let lookingFor = 277678;
let i = 1;
do  {
    let point = spiral[i];
    let n = neighbours(point);
    let indexesOfNeighbours = n.map(i => spiral.findIndex(e => e[0] == i[0] && e[1] == i[1]));
    newValue = indexesOfNeighbours.map(i => summedSpiral[i]).filter(i => i != undefined).reduce((a,c) => a+c);
    summedSpiral[i] = newValue
    i++;
} while (newValue <= lookingFor);

console.log("Part 2:");
console.log(newValue);
