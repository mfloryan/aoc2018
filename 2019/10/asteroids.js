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

function getVector (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function getBestAsteroid (map) {
  const asteroids = map.flatMap((r, y) => r.map((a, x) => { return { x: x, y: y, a: a } ;})).filter(a => a.a === '#');
  const asteroidMap = asteroids.map(asteroid => {
    return {
      asteroid,
      sees: new Set(asteroids.filter(a => !(a.x === asteroid.x && a.y === asteroid.y)).map(a => getVector(asteroid, a))).size
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

console.log(getBestAsteroid(parseMap(input)).sees);
