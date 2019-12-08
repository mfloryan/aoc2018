const assert = require('assert');
const fs = require('fs');

console.log('Day 06');

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf8' });
const inputOrbits = input.split('\n');

let sampleOrbits =
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
    let tempN = tree.n;
    let tempC = tree.c.slice();
    tree.n = parent;
    tree.c = [ {n: tempN, c: tempC} ];
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
  let i =0;
  while (input.length > 0) {
    i++;
    console.log(i);
    let orphans = [];
    input.forEach(pair => {
      let centre, orbit;
      [centre, orbit] = pair.split(")");
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

function countOrbits(tree, depth = 0) {
  let total = 0;
  total += depth;
  tree.c.forEach(n => {
    total += countOrbits(n, depth + 1);
  });
  return total;
}

let tree = parseMap(inputOrbits);
showTree(tree);
console.log(countOrbits(tree));
