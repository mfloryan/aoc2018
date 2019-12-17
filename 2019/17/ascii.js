const assert = require('assert');
const fs = require('fs');
const path = require('path');

const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

const robot = new Cpu(code);

robot.run();
const view = robot.getOutput();

const map = view.map(c => String.fromCharCode(c)).join('').trim();
// map = `..#..........
// ..#..........
// #######...###
// #.#...#...#.#
// #############
// ..#...#...#..
// ..#####...^..`;
console.log(map);

const coords = map.split('\n').flatMap((row, y) => row.split('').map((t, x) => { return { x, y, t } ;}));
const start = coords.find(p => p.t === '^');
console.log(start);

const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];

let end = false;
let position = start;
let previousPosition;
const route = [];
const intersections = [];
let i = 0;
do {
  // console.log(i);
  // console.log('pp', previousPosition);
  route.push(position);
  i++;

  const possibleNextStep = vicinity
    .map(p => { return { x: p.x + position.x, y: p.y + position.y } ;})
    .filter(p => !previousPosition || !(p.x === previousPosition.x && p.y === previousPosition.y)
    );

  // console.log('pns', possibleNextStep);

  const nextStep = possibleNextStep.map(s => coords.find(p => s.x === p.x && s.y === p.y)).filter(p => p && p.t === '#');

  // console.log(nextStep);

  if (nextStep.length === 1) {
    previousPosition = position;
    position = nextStep[0];
  } else if (nextStep.length === 0) {
    console.log('No next step');
    end = true;
  } else if (nextStep.length > 1) {
    console.log('INTERSECTION');
    if (!intersections.some(p => p.x == position.x && p.y == position.y)) intersections.push(position);
    const vector = { x: position.x - previousPosition.x, y: position.y - previousPosition.y };
    // console.log('p', position, 'v', vector);
    previousPosition = position;
    position = { x: previousPosition.x + vector.x, y: previousPosition.y + vector.y };
    // console.log(nextStep);
  }

  // if (i > 25) end = true;
} while (!end);

console.log(intersections.length);
const result = intersections.map(p => p.x * p.y).reduce((p, c) => p + c);
console.log(result);
