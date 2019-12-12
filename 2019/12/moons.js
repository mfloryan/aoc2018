
function parseMoons (moons) {
  return moons.map(m => {
    const c = m.substring(1, m.length - 1).split(',').map(c => parseInt(c.split('=')[1]));
    return { pos: { x: c[0], y: c[1], z: c[2] }, vel: { x: 0, y: 0, z: 0 } };
  });
}

function applyStepChange (moons) {
  const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  pairs.forEach(pair => {
    const a = moons[pair[0]];
    const b = moons[pair[1]];
    if (a.pos.x !== b.pos.x) {
      a.vel.x += Math.sign(b.pos.x - a.pos.x);
      b.vel.x += Math.sign(a.pos.x - b.pos.x);
    }
    if (a.pos.y !== b.pos.y) {
      a.vel.y += Math.sign(b.pos.y - a.pos.y);
      b.vel.y += Math.sign(a.pos.y - b.pos.y);
    }
    if (a.pos.z !== b.pos.z) {
      a.vel.z += Math.sign(b.pos.z - a.pos.z);
      b.vel.z += Math.sign(a.pos.z - b.pos.z);
    }
  });

  moons.forEach(m => {
    m.pos.x += m.vel.x;
    m.pos.y += m.vel.y;
    m.pos.z += m.vel.z;
  });
}

function calculateEnergy (moons, steps) {
  let step = 0;
  do {
    step++;
    applyStepChange(moons);
  } while (step < steps);

  const e = moons
    .map(
      m => (Math.abs(m.pos.x) + Math.abs(m.pos.y) + Math.abs(m.pos.z)) *
           (Math.abs(m.vel.x) + Math.abs(m.vel.y) + Math.abs(m.vel.z)))
    .reduce((p, c) => p + c);
  return e;
}

function sameState (m1, m2) {
  return m1
    .map(
      (m, i) => ((m.pos.x === m2[i].pos.x && m.pos.y === m2[i].pos.y && m.pos.z === m2[i].pos.z) &&
                 (m.vel.x === m2[i].vel.x && m.vel.y === m2[i].vel.y && m.vel.z === m2[i].vel.z)))
    .reduce((p, c) => p && c, true);
}

function sameState2 (m1, m2, coordinate) {
  return m1
    .map(
      (m, i) => ((coordinate(m.pos) === coordinate(m2[i].pos)) &&
                 (coordinate(m.vel) === coordinate(m2[i].vel))))
    .reduce((p, c) => p && c, true);
}

function findOriginalState (moons) {
  const originalMoons = JSON.parse(JSON.stringify(moons));

  let step = 0;
  do {
    step++;
    if (step % 100000000 === 0) console.log(`${step.toString().padStart(15)} - ${new Date()}`);
    applyStepChange(moons);
  } while (!sameState(moons, originalMoons));

  return step;
}

function findCycleForCoordinate(moons, coordinate) {
  const originalMoons = JSON.parse(JSON.stringify(moons));

  let step = 0;
  do {
    step++;
    if (step % 100000000 === 0) console.log(`${step.toString().padStart(15)} - ${new Date()}`);
    applyStepChange(moons);
  } while (!sameState2(moons, originalMoons, coordinate));

  return step;
}

const example = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

const moons = parseMoons(example.split('\n'));

console.log(calculateEnergy(moons, 10));
console.log(findOriginalState(moons));

const example2 = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;

console.log(calculateEnergy(parseMoons(example2.split('\n')), 100));
// console.log(findOriginalState(parseMoons(example2.split('\n'))));

const input = `<x=1, y=3, z=-11>
<x=17, y=-10, z=-8>
<x=-1, y=-15, z=2>
<x=12, y=-4, z=-4>`;

const inputMoons = parseMoons(input.split('\n'));

console.log(calculateEnergy(inputMoons, 1000));
// console.log(findOriginalState(inputMoons));

let xCycle = findCycleForCoordinate(inputMoons,(m) => m.x);
let yCycle = findCycleForCoordinate(inputMoons,(m) => m.y);
let zCycle = findCycleForCoordinate(inputMoons,(m) => m.z);

function denominator(a, b) {
  return b === 0 ? a : denominator(b, a % b);
}

function multiplier(a, b) {
  return (a * b) / denominator(a,b);
}

console.log(xCycle, yCycle, zCycle);
console.log(multiplier(multiplier(xCycle, yCycle), zCycle));
