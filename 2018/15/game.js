const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");
const bb = require('./rules');

let board = bb.parseInput(input);
let result = bb.playTheGame(board);
console.log(result);