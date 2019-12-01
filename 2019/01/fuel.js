const assert = require('assert');
const fs = require('fs');

console.log('Day 01');

const input = fs.readFileSync('input.txt', { encoding: 'utf8' });
const modules = input.split('\n').map(n => parseInt(n));

function getFuel (mass) {
  return Math.floor(mass / 3) - 2;
}

assert.strictEqual(getFuel(12), 2);
assert.strictEqual(getFuel(14), 2);
assert.strictEqual(getFuel(1969), 654);
assert.strictEqual(getFuel(100756), 33583);

const totalFuel = modules.map(m => getFuel(m)).reduce((p, c) => p + c, 0);
console.log(totalFuel);

function getFuelFuel (mass) {
  const fuels = [];
  let lastFuel = getFuel(mass);
  while (lastFuel > 0) {
    fuels.push(lastFuel);
    lastFuel = getFuel(lastFuel);
  };
  return fuels.reduce((a, c) => a + c);
}

assert.strictEqual(getFuelFuel(14), 2);
assert.strictEqual(getFuelFuel(1969), 966);
assert.strictEqual(getFuelFuel(100756), 50346);

const totalFuel2 = modules.map(m => getFuelFuel(m)).reduce((p, c) => p + c);
console.log(totalFuel2);
