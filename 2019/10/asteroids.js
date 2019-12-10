const assert = require('assert');
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseMap (map) {
  return map.split('\n').map(r => r.split(''));
}

function drawMap (map, extraPoints = []) {
  const rows = [];
  let line = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      let point = map[y][x];
      if (extraPoints.some(p => p.x === x && p.y === y)) point = '*';
      line.push(point);
    }
    rows.push(line);
    line = [];
  }
  rows.push(line);

  console.log(rows.map(r => r.join('')).join('\n'));
}

function getVectorDirection (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function getVectorMagnitude (p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getBestAsteroid (map) {
  const asteroids = map.flatMap((r, y) => r.map((a, x) => { return { x: x, y: y, a: a }; })).filter(a => a.a === '#');
  const asteroidMap = asteroids.map(asteroid => {
    return {
      asteroid,
      sees: new Set(asteroids.filter(a => !(a.x === asteroid.x && a.y === asteroid.y)).map(a => getVectorDirection(asteroid, a))).size
    };
  }).sort((a, b) => b.sees - a.sees);
  return asteroidMap[0];
}

const map = `.#..#
.....
#####
....#
...##`;

assert.strictEqual(getBestAsteroid(parseMap(map)).sees, 8);

const map3 = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

assert.strictEqual(getBestAsteroid(parseMap(map3)).sees, 33);

const map4 = `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

assert.strictEqual(getBestAsteroid(parseMap(map4)).sees, 35);

const map5 = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;

assert.strictEqual(getBestAsteroid(parseMap(map5)).sees, 41);

const map6 = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;
assert.strictEqual(getBestAsteroid(parseMap(map6)).sees, 210);

let mapB = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.........###..
..#.#.....#....##`;

let mapForPartTwo = parseMap(input);
let station = getBestAsteroid(mapForPartTwo);

drawMap(mapForPartTwo);

console.log(station);

let pos = station.asteroid;

function getAsteroids(map) {
  return map.flatMap((r, y) => r.map((a, x) => { return { x: x, y: y, a: a }; })).filter(a => a.a === '#');
}

let asteroids = getAsteroids(mapForPartTwo)
  .map(a => {
    const dir = getVectorDirection(pos, a);
    return {
      x: a.x,
      y: a.y,
      d: dir < -(Math.PI / 2) ? dir + 2 * Math.PI : dir,
      m: getVectorMagnitude(pos, a)
    };
  }).filter(a => !(a.x === pos.x && a.y === pos.y));

asteroids.sort((a, b) => (a.d === b.d) ? (a.m - b.m) : (a.d - b.d));

console.log(asteroids);

function vaporiseAsteroidsOnce(asteroids) {
  let index = 0;
  let previousAsteroids = asteroids;
  let newAsteroids;
  do {
    newAsteroids = [];
    let lastD;
    for (let i = 0; i < previousAsteroids.length; i++) {
      const element = previousAsteroids[i];
      if (element.d === lastD) {
        newAsteroids.push(element);
      } else {
        index++;
        if ([1, 2, 3, 10, 20, 50, 100, 199, 200, 201, 299].some(i => i === index)) {
          console.log(`${index.toString().padStart(3)} - [${element.x},${element.y}]`);
        }
      }
      lastD = element.d;
    }
    previousAsteroids = newAsteroids;
  } while (newAsteroids.length > 0);
}

vaporiseAsteroidsOnce(asteroids);
