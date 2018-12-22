let assert = require('assert');

let depth = 510;
let target = {x: 10, y: 10};

let geoIndexMemory = [];

function getGeoIndex(coordinates, target, depth) {
    if (coordinates.x == 0 && coordinates.y == 0) {
        return 0;
    }

    if (coordinates.x == target.x && coordinates.y == target.y) {
        return 0;
    }

    if (coordinates.y == 0) {
        return coordinates.x * 16807;
    }

    if (coordinates.x == 0) {
        return coordinates.y * 48271;
    }

    let found = geoIndexMemory.find(m => m.x == coordinates.x && m.y == coordinates.y);
    if (found) {
        return found.gi;
    } else {
        let one = getErosionLevel(getGeoIndex({x: coordinates.x - 1, y: coordinates.y}, target, depth), depth);
        let two = getErosionLevel(getGeoIndex({x: coordinates.x, y: coordinates.y - 1}, target, depth), depth);
        geoIndexMemory.push({x: coordinates.x, y: coordinates.y, gi: one * two});
        return  one * two;
    }
}

function getErosionLevel(geoIndex, depth) {
    let value = (geoIndex + depth) % 20183;
    return value;
}

function getType(erosionLevel) {
    const type = ['.','=','|'];
    return type[erosionLevel % 3];
}

function getLocationType(location, target, depth) {
    return getType(getErosionLevel(getGeoIndex(location, target, depth), depth));
}

function getLocationRisk(location, target, depth) {
    return getErosionLevel(getGeoIndex(location, target, depth), depth) % 3;
}

assert.strictEqual(getLocationType({x:0,y:0}, target, depth), '.');
assert.strictEqual(getLocationType({x:1,y:0}, target, depth), '=');
assert.strictEqual(getLocationType({x:0,y:1}, target, depth), '.');
assert.strictEqual(getLocationType({x:1,y:1}, target, depth), '|');
assert.strictEqual(getLocationType({x:10,y:10}, target, depth), '.');

function getRiskLevel(target, depth) {
    let risk = 0;
    for (let x = 0; x <= target.x; x++) {
        for (let y = 0; y <= target.y; y++) {
            risk += getLocationRisk({x, y}, target, depth);
        }
    }
    return risk;
} 

console.log();

assert.strictEqual(getRiskLevel(target, depth), 114);
geoIndexMemory = [];
console.log(getRiskLevel({x:9, y:739}, 10914));

// not 7284