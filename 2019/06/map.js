const assert = require('assert');
const fs = require('fs');

console.log('Day 06');

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf8' });
const inputOrbits = input.split('\n');

const sampleOrbits =
`COM)B
B)C
C)D
E)J
E)F
D)E
B)G
G)H
D)I
J)K
K)L`.split('\n');

function insertIntoTree (tree, parent, leaf, l = 0) {
  if (!tree.n) {
    tree.n = parent;
    tree.c = [{ n: leaf, c: [] }];
    return true;
  } else if (tree.n === parent) {
    tree.c.push({ n: leaf, c: [] });
    return true;
  } else if (tree.n === leaf) {
    // console.log(`Found at ${tree.n}: ${parent})${leaf}`);
    const tempN = tree.n;
    const tempC = tree.c.slice();
    tree.n = parent;
    tree.c = [{ n: tempN, c: tempC }];
    return true;
  } else {
    for (const n of tree.c) {
      if (insertIntoTree(n, parent, leaf, l + 1)) {
        return true;
      }
    }
    return false;
  }
}

function parseMap (map) {
  const parsedMap = {};

  let input = map;
  while (input.length > 0) {
    const orphans = [];
    input.forEach(pair => {
      let centre, orbit;
      [centre, orbit] = pair.split(')');
      // walk map and find elemen
      if (!insertIntoTree(parsedMap, centre, orbit)) {
        orphans.push(pair);
      }
    });
    input = orphans.slice();
  }

  return parsedMap;
}

function showTree (tree, indent = 0) {
  console.log(tree.n.padStart(indent * 2, ' '));
  tree.c.forEach(cn => {
    showTree(cn, indent + 1);
  });
}

function countOrbits (tree, depth = 0) {
  let total = 0;
  total += depth;
  tree.c.forEach(n => {
    total += countOrbits(n, depth + 1);
  });
  return total;
}

const tree = parseMap(inputOrbits);
console.log(countOrbits(tree));

const santaSampleOrbit =
`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split('\n');

function findPath (tree, node, path = []) {
  if (tree.n === node) {
    path.push(tree.n);
    return true;
  } else {
    for (const n of tree.c) {
      if (findPath(n, node, path)) {
        path.push(tree.n);
        return true;
      }
    }
  }
  return false;
}

const santaPath = [];
findPath(tree, 'SAN', santaPath);

const youPath = [];
findPath(tree, 'YOU', youPath);

let theSame = false;
do {
  if (santaPath[santaPath.length - 1] === youPath[youPath.length - 1]) {
    theSame = true;
    santaPath.pop();
    youPath.pop();
  } else {
    theSame = false;
  }
} while (theSame);

console.log(youPath.length + santaPath.length - 2);
