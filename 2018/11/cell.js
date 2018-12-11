function cellPowerLevel(serial, coord) {
    let rackId = coord.x + 10;
    let power = rackId * coord.y;
    power += serial;
    power *= rackId;
    power = ((power - (power  % 100)) / 100) % 10;
    power -= 5;
    return power;
}

function powerOfSquare(serial, x, y, size) {
    let sum = 0;
    for (let i =0; i < size; i++) {
        for (let j=0; j< size; j++) {
            sum+= cellPowerLevel(serial, {x: x+i, y:y+j});
        }
    }
    return sum;
}

function findFixedSizeMaxPowerSquare(serial, size) {
    let maxPower = {p: -Infinity, x:0, y:0};

    for (let i =1; i <= 300-size; i++) {
        for (let j=1; j <= 300-size; j++) {
            let p = powerOfSquare(serial, i, j, size);
            if (p > maxPower.p) {
                maxPower.p = p;
                maxPower.x = i;
                maxPower.y = j;
            }
        }
    }
    return maxPower;
}

function findMaxPowerSquare(serial) {
    let maxPower = {p:-Infinity, size: 0, x:0, y:0};

    for (let size=1; size <= 300; size++) {
        // console.log("size: " + size);
        let mps = findFixedSizeMaxPowerSquare(serial, size);
        if (mps.p > maxPower.p) {
            maxPower.p = mps.p;
            maxPower.x = mps.i;
            maxPower.y = mps.j;
            maxPower.size = size;            
        }
    }
    return maxPower;    
}

let serial = 9110;

let mps1 = findFixedSizeMaxPowerSquare(serial,3);
console.log(`Part one: ${mps1.x},${mps1.y}`);

// let mps2 = findMaxPowerSquare(serial);
// console.log(`Part two: ${mps2.x},${mps2.y},${mps2.size});

console.log(cellPowerLevel(8, {x:3, y:5}) == 4);
console.log(cellPowerLevel(57, {x:122, y:79}) == -5);
console.log(cellPowerLevel(71, {x:101, y:153}) == 4);

console.log(powerOfSquare(18,33,45,3) == 29);
console.log(powerOfSquare(42,21,61,3) == 30);
