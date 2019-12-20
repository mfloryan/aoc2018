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
    if (x.length === 1) p.label = x[0];
  });

  return mazeMap;
}

function getNextSteps(map, location) {
  const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  let aroundLocation = vicinity.map(vp => {return {x: vp.x + location.x, y: vp.y + location.y};});
  return map.filter(mp => aroundLocation.some(al => (mp.x === al.x && mp.y === al.y)));
}

function findShortestPath(inputMap) {
  let map = JSON.parse(JSON.stringify(inputMap));
  let start = map.find(mp => mp.label === 'AA');
  let end = map.find(mp => mp.label === 'ZZ');

  let i = 0;
  let queue = [];
  start.visited = true;
  queue.push(start);
  while (queue.length > 0) {
    i++;
    const location = queue.shift();
    // console.log(location);
    if (location.label === 'ZZ') {
      return location;
    }

    let nextSteps = getNextSteps(map, location).filter(p => !(p.visited && p.visited === true));
    // console.log(nextSteps);
    nextSteps.forEach(ns => {
      ns.visited = true;
      ns.parent = location;
      queue.push(ns);
    });
    // if (i > 5) break;
  }
}

function countPathLength(finalNode) {
  let node = finalNode;
  let length = 0;
  while (node.parent) {
    length++;
    node = node.parent;
  }
  return length;
}

const map = parseMaze(getInput('example1'));
const shortestPath = countPathLength(findShortestPath(map));

console.log(shortestPath);
