const fs = require('fs');
const path = require('path');

const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

function printBeam2(map) {
  console.log(map[0][0]);
  const picture = [];
  for (let y = 0; y < map.length; y++) {
    const row = [];
    row.push(map[y][0].y.toString().padStart(4));
    for (let x = 0; x < map[y].length; x++) {
      const mapLocation = map[y][x];
      if (mapLocation) row.push(mapLocation.b === 1? '#':' ');
      else row.push(' ');
    }
    picture.push(row);
  }
  console.log(picture.map(r => r.join('')).join('\n'));
}

function generateBeamImage(bounds) {
  const beam = [];
  for (let y = bounds.y[0]; y <= bounds.y[1]; y++) {
    const row = [];
    for (let x = bounds.x[0]; x <= bounds.x[1]; x++) {
      const emitter = new Cpu(code);
      emitter.addInput(x);
      emitter.addInput(y);
      emitter.run();
      row.push({ x, y, b: emitter.getOutput().pop() });
    }
    beam.push(row);
  }
  return beam;
}

let smallBeam = generateBeamImage({ x: [0, 49], y: [0, 49] });
console.log(smallBeam.map(r => r.filter(p => p.b === 1).length).reduce((p,c) => p + c));

const beam = generateBeamImage({ x: [400, 1000], y: [900, 1200] });

let count = 0;
for (let row = 0; row < beam.length - 100; row++) {
  for (let column = 0; column < beam[row].length - 100; column++) {
    let tl = beam[row][column];
    if (tl.b === 1) {
      let br = beam[row + 99][column + 99];
      let tr = beam[row][column + 99];
      let bl = beam[row + 99][column];
      if (tr.b === 1 && bl.b === 1 && br.b === 1) {
        count++;
        console.log(tl.x * 10000 + tl.y);
      }
    }
  }
  if (count > 0) break;
}

// console.log(map.filter(p => p.b === 1).length);

// printBeam2(map);

// let rows = map.map((r,y) => r.filter(p => p.b === 1).length);
let se = beam.map((r,y) => r.reduce((p,c) => {
  p.y = c.y;
  if (p.beam) {
    if (c.b === 0) {
      p.beam = false;
      p.x1 = c.x;
    }
  } else {
    if (c.b === 1) {
      p.x0 = c.x;
      p.beam = true;
    }
  }
  return p;
}, {beam : false, y:0, x0:0, x1: 0})).map(o => { return {y:o.y, s:o.x0, e:o.x1, l: (o.x1 - o.x0)};});
// console.log(rows);
// console.log(se);

function doesItFit(map, startX, startY) {
  for (let y = startY; y < startY + 100; y++) {
    for (let x = startX; x < startX + 100; x++) {
      const point = map.find(p => (p.x === x && p.y === y));
      if (!point) {
        console.log("out of map",x,y);
        return false;
      }
      if (point.b !== 1) {
        console.log("out of beam", x, y);
        return false;
      }
    }
  }
  console.log((startX * 10000) + startY);
  return true;
}
