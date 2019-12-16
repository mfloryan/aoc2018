const assert = require('assert');
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

let basePattern = [0, 1, 0, -1];

function getPatternMultiplier(digitIndex, position) {
  return basePattern[(Math.floor((position) / (digitIndex))) % basePattern.length];
}

function shiftPhase(input) {
  let digits = input.toString().split('').map(d => parseInt(d));
  let result = [];
  for (let i = 0; i < digits.length; i++) {
    let mutiplied = 0;
    for (let j = 0; j < digits.length; j++) {
      mutiplied += digits[j] * getPatternMultiplier(i+1, j+1);
    }
    result.push(Math.abs(mutiplied % 10));
  }
  return result.join('');
}

// console.log(shiftPhase('12345678'));

// let ex1 = '80871224585914546619083218645595';
// for (let index = 0; index < 100; index++) {
//   ex1 = shiftPhase(input);
// }
// console.log(ex1);

let p = input;
for (let index = 0; index < 100; index++) {
  p = shiftPhase(p);
}
console.log(p.substr(0,8));
