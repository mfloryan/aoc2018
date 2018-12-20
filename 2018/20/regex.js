const assert = require('assert');

const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

function parseRegex(regex) {
    let result = [];
    if (!Array.isArray(regex)) {
        regex = regex.split("");
    }

    single = regex.shift();

    while (single) {
        if (single == "^") {
        } else if (single == "$") {
        } else if (single == "(") {
            result.push(parseGroup(regex));
        } else {
            result.push(single);
        }
        single = regex.shift();
    }

    return result;
}

function parseGroup(regex) {
    let branches = [];

    let branch = []
    single = regex.shift();

    while (single != ")") {
        if (single == "(") {
            branch.push(parseGroup(regex));
        } else if (single == "|") {
            branches.push(branch);
            branch = [];
        } else {
            branch.push(single);
        }
        single = regex.shift();
    }
    branches.push(branch);

    return branches;
}

let movement = {
    'N' : {x:0, y:-1},
    'S' : {x:0, y:1},
    'W' : {x:1, y:0},
    'E' : {x: -1, y: 0},
}

function changeToCoordinates(tree, start = {x:0,y:0}) {
    let coordinateTree = [  ];
    let currentLocation = start;

    tree.forEach(n => {
        if (Array.isArray(n)) {
            coordinateTree.push(changeToCoordinates(n, currentLocation));
        } else {
            currentLocation = {x: currentLocation.x + movement[n].x, 
                               y: currentLocation.y + movement[n].y };
            coordinateTree.push(currentLocation);
        }
    });

    return coordinateTree;
}

function findPaths(t, deep = 0) {
    let paths = [[]];
    t.forEach( n => {
        if (Array.isArray(n)) {
            let newPaths = n.flatMap(t => findPaths(t, deep++));
            let joinedPaths = [];
            paths.forEach(cp => {
                newPaths.forEach(np => {
                    joinedPaths.push(cp.concat(np));
                });
            });
            paths = joinedPaths;
        } else {
            paths.forEach(p => p.push(n));
        }
    });
    return paths;
}

function reducePath(path) {
    let newPath = [];
    
    path.forEach(n => {
        let alreadyInPath = newPath.findIndex(p => p.x == n.x && p.y == n.y);
        if (alreadyInPath >= 0) {
            newPath.splice(alreadyInPath);
        }
        newPath.push(n);
    });
    
    return newPath;
}

function executeRegex(regex) {
    console.log(regex);
    let t = parseRegex(regex);
    let ct = changeToCoordinates(t);
    // console.log(ct);
    // console.log(findFurthestPath(ct));
    // console.log();
    // console.log(findPaths(t).map(p => p.join("")));
    let allPaths = findPaths(ct, 0);
    // console.log(allPaths.map(p => p.length));
    let reducedPaths = allPaths.map(p => reducePath(p));
    // console.log(reducedPaths.map(p => p.length));
    let longestPath = reducedPaths.map(p => p.length).reduce((p,c) => Math.max(p,c),0);
    console.log(longestPath);
    return longestPath;
}

// 'NESW'
// 'NWSE'
// 'SENW'
// 'SWNE'
// 'ENWS'
// 'WNES'
// 'ESWN'
// 'WSEN'

assert.strictEqual(executeRegex('^WNE$'),3);
assert.strictEqual(executeRegex('^ENWWW(NEEE|SSE(EE|N))$'),10);
assert.strictEqual(executeRegex('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$'), 18);
assert.strictEqual(executeRegex('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$'),23);
assert.strictEqual(executeRegex('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$'),31);

executeRegex(input[0]);

// console.log(reducePath([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}]));
// console.log(reducePath([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:1, y:0}, {x:2, y:0}]));