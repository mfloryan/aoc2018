const fs = require('fs');
const path = require('path');

function getInput (name) {
  return fs.readFileSync(path.join(__dirname, name + '.txt'), { encoding: 'utf8' });
}

function parseMaze (maze) {
  let mazeMap = [];

  const parsedMaze = maze
    .split('\n')
    .map(r => r.split(''))
    .flatMap((r, y) => r.map((c, x) => { return { x, y, c }; }));

  mazeMap = parsedMaze.filter(p => p.c === '.');
  const dim = mazeMap.reduce((p, c) => {
    return {
      minX: Math.min(c.x, p.minX),
      maxX: Math.max(c.x, p.maxX),
      minY: Math.min(c.y, p.minY),
      maxY: Math.max(c.y, p.maxY)
    };
  }, { minX: 0, maxX: 0, minY: 0, maxY: 0 });

  const letters = parsedMaze.filter(mp => mp.c.charCodeAt(0) >= 'A'.charCodeAt(0) && mp.c.charCodeAt(0) <= 'Z'.charCodeAt(0));
  const labelLocation = [
    [{ x: -2, y: 0 }, { x: -1, y: 0 }],
    [{ x: 1, y: 0 }, { x: 2, y: 0 }],
    [{ x: 0, y: -2 }, { x: 0, y: -1 }],
    [{ x: 0, y: 1 }, { x: 0, y: 2 }]
  ];

  mazeMap.forEach(p => {
    const x = labelLocation.map(ll => {
      const possibleLabels = ll.map(lp => {
        const labelPart = letters.find(mp => mp.x === (p.x + lp.x) && mp.y === (p.y + lp.y));
        if (labelPart) return labelPart.c;
      }).join('');
      return possibleLabels;
    }).filter(l => l.length === 2);
    if (x.length === 1) {
      p.label = x[0];
      p.isOutside = (p.x - 2 === dim.minX || p.x === dim.maxX || p.y - 2 === dim.minY || p.y === dim.maxY);
    }
  });

  return mazeMap;
}

function getNextSteps (map, location) {
  const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  const aroundLocation = vicinity.map(vp => { return { x: vp.x + location.x, y: vp.y + location.y }; });
  const directNextSteps = map.filter(mp => aroundLocation.some(al => (mp.x === al.x && mp.y === al.y)));
  if (location.label && location.label !== 'ZZ') {
    const otherSide = map.find(ml => (ml.label === location.label) && !(ml.x === location.x && ml.y === location.y));
    if (otherSide) {
      directNextSteps.push(otherSide);
    }
  }
  return directNextSteps;
}

function findShortestPath (inputMap) {
  const map = JSON.parse(JSON.stringify(inputMap));
  const start = map.find(mp => mp.label === 'AA');

  const queue = [];
  start.visited = true;
  queue.push(start);
  while (queue.length > 0) {
    const location = queue.shift();
    // console.log(location);
    if (location.label === 'ZZ') {
      return location;
    }

    const nextSteps = getNextSteps(map, location).filter(p => !(p.visited && p.visited === true));
    // console.log(nextSteps);
    nextSteps.forEach(ns => {
      ns.visited = true;
      ns.parent = location;
      queue.push(ns);
    });
  }
}

function getNextStepsRecursive (map, location) {
  const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  const aroundLocation = vicinity.map(vp => { return { x: vp.x + location.x, y: vp.y + location.y }; });
  const directNextSteps = map.filter(mp => aroundLocation.some(al => (mp.x === al.x && mp.y === al.y)));
  directNextSteps.forEach(ns => { ns.z = location.z; });
  if (location.label && location.label !== 'ZZ') {
    if (!(location.z === 0 && location.isOutside === true)) {
      const otherSide = map.find(ml => (ml.label === location.label) && !(ml.x === location.x && ml.y === location.y));
      if (otherSide) {
        otherSide.z = otherSide.isOutside ? location.z + 1 : location.z - 1;
        directNextSteps.push(otherSide);
      }
    }
  }
  return directNextSteps;
}

function locationEquality(a, b) {
  return b => (a.x === b.x && a.y === b.y && a.z === b.z);
}

function findShortestPathRecusrive (inputMap) {
  const map = JSON.parse(JSON.stringify(inputMap));
  const start = map.find(mp => mp.label === 'AA');
  const visited = [];

  const queue = [];
  start.path = [];
  start.z = 0;
  visited.push(start);
  queue.push(start);

  let i = 0;
  while (queue.length > 0) {
    i++;
    const location = queue.shift();
    // console.log(`[${location.x},${location.y},${location.z}]`.padStart(14), location.label || '');

    if (location.z === 0 && location.label === 'ZZ') {
      return location;
    }

    const nextSteps = getNextStepsRecursive(map, location).filter(p => !(visited.some(locationEquality(p)))).filter(p => p.z < 19);
    // console.log('ns', nextSteps);
    nextSteps.forEach(ns => {
      ns.path = location.path.slice();
      ns.path.push({ x: location.x, y: location.y, z: location.z, label: location.label });
      visited.push({ x: ns.x, y: ns.y, z: ns.z });
      queue.push(ns);
    });

    // if (i === 800) break;
  }
}

function countPathLength (finalNode) {
  let node = finalNode;
  let length = 0;
  while (node.parent) {
    console.log(`[${node.x},${node.y}] - ${node.label}`);
    length++;
    node = node.parent;
  }
  return length;
}

function countPathLengthRecursive (finalNode) {
  return finalNode.path.length;
}

// console.log(countPathLength(findShortestPath(parseMaze(getInput('input')))));
// console.log(countPathLength(findShortestPath(parseMaze(getInput('example3')))));

const map = parseMaze(getInput('example3'));
const foundPath = findShortestPathRecusrive(map);
if (foundPath) {
  console.log(foundPath.path.filter(p => p.label));
  const shortestPath = countPathLengthRecursive(foundPath);
  console.log(shortestPath);
} else {
  console.log('Path not found. ☹️');
}
