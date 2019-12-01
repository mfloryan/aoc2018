const assert = require('assert');
const fs = require('fs');

console.log("Day 01");

let input = fs.readFileSync('input.txt', {encoding: 'utf8'});

let modules = input.split('\n').map(n => parseInt(n));

function getFuel(mass) {
    return Math.floor(mass / 3)  - 2;
}

assert.strictEqual(getFuel(12),2);
assert.strictEqual(getFuel(14),2);
assert.strictEqual(getFuel(1969),654);
assert.strictEqual(getFuel(100756),33583);

let totalFuel = modules.map(m => getFuel(m)).reduce( (p,c) => p+c ,0);

console.log(totalFuel);