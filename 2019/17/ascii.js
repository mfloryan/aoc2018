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
    end = true;
  } else if (nextStep.length > 1) {
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

function fromPathToInstructions(route) {
  let instructions = ['R'];

  let steps = 0;
  for (let i = 1; i < route.length - 1; i++) {
    const t2 = route[i - 1];
    const t1 = route[i];
    const t0 = route[i + 1];

    if (new Set([t2.x, t1.x, t0.x]).size === 1 || new Set([t2.y, t1.y, t0.y]).size === 1) {
      //moved forward
      steps++;
    } else {
      //turned
      steps++;
      instructions.push(steps);
      let dx = [ t1.x - t2.x, t0.x - t1.x];
      let dy = [ t1.y - t2.y, t0.y - t1.y];

      if (
        (dx[0] === 0 && dx[1] === 1 && dy[0] === -1 && dy[1] === 0) ||
        (dx[0] === 1 && dx[1] === 0 && dy[0] === 0 && dy[1] === 1) ||
        (dx[0] === 0 && dx[1] === -1 && dy[0] === 1 && dy[1] === 0) ||
        (dx[0] === -1 && dx[1] === 0 && dy[0] === 0 && dy[1] === -1)) {
        instructions.push('R');
      } else {
        instructions.push('L');
      }

      steps = 0;
    }
  }

  instructions.push(steps + 1);
  return instructions;
}

function compressInstructions(instructions) {
  let compressed = [];


  return compressed;
}

let awakeRobot = new Cpu(code);
awakeRobot.setMemory(0, 2);
awakeRobot.run();
let map2 = awakeRobot.getOutput();
awakeRobot.clearOutput();
console.log(map2.map(c => String.fromCharCode(c)).join('').trim());

let instructions = fromPathToInstructions(route);
console.log(instructions.join(''));

let routine = ['A,C,A,B,A,C,B,A,C,B\n','R,8,R,8,2,R,8,2\n','R,12,R,4,L,12,L,8,4\n','R,4,R,8,R,8,2,R,8,4\n'];
routine[0].split('').forEach((a, i) => { awakeRobot.addInput(routine[0].charCodeAt(i)); });
awakeRobot.run();
console.log(awakeRobot.getOutput().map(c => String.fromCharCode(c)).join('').trim());
awakeRobot.clearOutput();

routine[1].split('').forEach((a, i) => { awakeRobot.addInput(routine[1].charCodeAt(i)); });
awakeRobot.run();
console.log(awakeRobot.getOutput().map(c => String.fromCharCode(c)).join('').trim());
awakeRobot.clearOutput();

routine[2].split('').forEach((a, i) => { awakeRobot.addInput(routine[2].charCodeAt(i)); });
awakeRobot.run();
console.log(awakeRobot.getOutput().map(c => String.fromCharCode(c)).join('').trim());
awakeRobot.clearOutput();

routine[3].split('').forEach((a, i) => { awakeRobot.addInput(routine[3].charCodeAt(i)); });
awakeRobot.run();
console.log(awakeRobot.getOutput().map(c => String.fromCharCode(c)).join('').trim());
awakeRobot.clearOutput();

awakeRobot.addInput('n'.charCodeAt(0));
awakeRobot.addInput('\n'.charCodeAt(0));
awakeRobot.run();
console.log(awakeRobot.getOutput().pop());
awakeRobot.clearOutput();
