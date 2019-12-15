const assert = require('assert');
const fs = require('fs');
const path = require('path');

const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

function drawMap (map) {
  const dim = map.reduce((p, c) => {
    return {
      minX: Math.min(c.p[0], p.minX),
      maxX: Math.max(c.p[0], p.maxX),
      minY: Math.min(c.p[1], p.minY),
      maxY: Math.max(c.p[1], p.maxY)
    };
  }, { minX: 0, maxX: 0, minY: 0, maxY: 0 });

  console.log(dim);

  const picture = [];
  for (let y = dim.minY; y <= dim.maxY; y++) {
    const row = [];
    for (let x = dim.minX; x <= dim.maxX; x++) {
      const mapLocation = map.find(p => p.p[0] === x && p.p[1] === y);
      if (mapLocation) row.push(mapLocation.t);
      else row.push(' ');
    }
    picture.push(row);
  }

  console.log(picture.map(r => r.join('')).join('\n'));
}

function positionPredicate(position) {
  return mapPoint => mapPoint.p[0] === position[0] && mapPoint.p[1] === position[1];
}

function applyMove(position, move) {
  return position.map((p, i) => p + positionShift[move][i]);
}

let droid = new Cpu(code);

let mapOfTheWorld = [];
let position = [0, 0];
let positionShift = {
  1: [0, -1],
  2: [0, 1],
  3: [1, 0],
  4: [-1, 0]
};

let nextMove = 1;

let done = false;
let i = 0;
do {
  i++;

  droid.addInput(nextMove);
  droid.run();
  const result = droid.getOutput().shift();
  const newPosition = applyMove(position, nextMove);

  if (result === 0) {
    if (!mapOfTheWorld.some(positionPredicate(newPosition))) {
      mapOfTheWorld.push({ p: newPosition, t: '#' });
    }
  } else {
    if (!mapOfTheWorld.some(positionPredicate(newPosition))) {
      mapOfTheWorld.push({ p: newPosition, t: '.' });
    }
    position = newPosition;
    if (result === 2) {
      done = true;
      console.log(position);
    }
  }

  let goodNextMove;
  do {
    goodNextMove = true;
    nextMove = Math.floor(Math.random() * 4) + 1;
    let nextPosition = applyMove(position, nextMove);
    let mapKnown = mapOfTheWorld.find(positionPredicate(nextPosition));
    if (mapKnown) {
      if (mapKnown.t === '#') goodNextMove = false;
    }
  } while (!goodNextMove);

  // if (i > 1000) done = true;
} while (!done);

drawMap(mapOfTheWorld);
console.log(position);
