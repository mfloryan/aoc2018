const fs = require('fs');

console.log("Day 01");

let input = fs.readFileSync('day01-input.txt', {encoding: 'utf8'});

let listOfAdjustments = input.split('\n').map(n => parseInt(n));
let result = listOfAdjustments.reduce((p,c) => p+c,0);

console.log(result);
