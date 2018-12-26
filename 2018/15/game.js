const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");
const bb = require('./rules');

let board = bb.parseInput(input);
let result = bb.playTheGame(board);
console.log("Part one: " + result);

let elfLosses = true;
let extraHP = 3;
do {
    extraHP++;
    let board = bb.parseInput(input, {E: extraHP, G: 3});
    let elfCount = board.aliveUnits.filter(u => u.type == 'E').length;
    result = bb.playTheGame(board);
    elfLosses = board.aliveUnits.filter(u => u.type == 'E').length < elfCount;
} while (elfLosses);

console.log(`Part two: ${result} - with ${extraHP}`);
