


function cellPowerLevel(serial, coord) {
    let rackId = coord.x + 10;
    let power = rackId * coord.y;
    power += serial;
    power *= rackId;
    power = ((power - (power  % 100)) / 100) % 10;
    power -= 5;
    return power;
}

function powerOfSquare(serial, x, y) {
    let sum = 0;
    for (let i =0; i < 3; i++) {
        for (let j=0; j< 3; j++) {
            sum+= cellPowerLevel(serial, {x: x+i, y:y+j});
        }
    }
    return sum;
}


let serial = 9110;
let maxPower = {p:-Infinity, x:0, y:0};

for (let i =1; i <= 300-3; i++) {
    for (let j=1; j <= 300-3; j++) {
        let p = powerOfSquare(serial, i, j);
        if (p > maxPower.p) {
            maxPower.p = p;
            maxPower.x = i;
            maxPower.y = j;
        }
    }
}

console.log(maxPower);

console.log(cellPowerLevel(8, {x:3, y:5}));
console.log(cellPowerLevel(57, {x:122, y:79}));
console.log(cellPowerLevel(71, {x:101, y:153}));

console.log(powerOfSquare(18,33,45))
console.log(powerOfSquare(42,21,61))