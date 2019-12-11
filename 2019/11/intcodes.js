const assert = require('assert');
console.log('Day 11');

const fs = require('fs');
const path = require('path');

const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

const code = input.split(',').map(a => parseInt(a));

let direction = '^';

const robotControl = {
  '^': { newDirection: ['<', '>'], shift: { x: 0, y: -1 } },
  '<': { newDirection: ['v', '^'], shift: { x: -1, y: 0 } },
  'v': { newDirection: ['>', '<'], shift: { x: 0, y: 1 } },
  '>': { newDirection: ['^', 'v'], shift: { x: 1, y: 0 } }
};

const body = [{ x: 0, y: 0, c: 1 }];
const position = { x: 0, y: 0 };

const robot = new Cpu(code);
robot.addInput(body[0].c);

let done = false;

do {
  done = robot.run();

  const newColor = robot.getOutput().shift();
  let bodyPosition = body.find(s => (s.x === position.x && s.y === position.y));
  bodyPosition.c = newColor;

  const turn = robot.getOutput().shift();
  direction = robotControl[direction].newDirection[turn];
  const moveOffset = robotControl[direction].shift;
  position.x += moveOffset.x;
  position.y += moveOffset.y;

  bodyPosition = body.find(s => s.x === position.x && s.y === position.y);

  if (bodyPosition) {
    robot.addInput(bodyPosition.c);
  } else {
    robot.addInput(0);
    body.push({ x: position.x, y: position.y, c: 0 });
  }
} while (!done);

console.log(`${position.x},${position.y} - ${body.length}`);

const dim = body.reduce(
  (p, c) => {
    return {
      minX: Math.min(p.minX, c.x),
      maxX: Math.max(p.maxX, c.x),
      minY: Math.min(p.minY, c.y),
      maxY: Math.max(p.maxY, c.y)
    };
  }, { minX: 0, maxX: 0, minY: 0, maxY: 0 });

let picture = [];
for (let y = dim.minY; y <= dim.maxY; y++) {
  let row = [];
  for (let x = dim.minX; x <= dim.maxX; x++) {
    let bodyPosition = body.find(s => s.x === x && s.y === y);
    if (!bodyPosition) row.push(' '); else { row.push(bodyPosition.c === 0 ? ' ' : '█'); }
  }
  picture.push(row);
}

console.log(picture.map(r => r.join('')));
