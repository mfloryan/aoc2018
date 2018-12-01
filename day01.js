const fs = require('fs');

console.log("Day 01");

let input = fs.readFileSync('day01-input.txt', {encoding: 'utf8'});

let listOfAdjustments = input.split('\n').map(n => parseInt(n));
let result = listOfAdjustments.reduce((p,c) => p+c,0);

console.log(result);

let found = false;
let frequency = 0;
let frequencies = [];

let iteration = 0;
do {
    iteration++;
    console.log("Iteration: " + iteration);
    for (let i = 0; i < listOfAdjustments.length; i++) {
        const n = listOfAdjustments[i];
        frequency += n;
        if (frequencies.includes(frequency)) {
            console.log("Found: " + frequency);
            found = true;
            break;
        }
        frequencies.push(frequency);
    }
    // if (iteration == 1) console.log(frequencies);
    if (iteration%20 == 0) console.log(frequencies.length);
} while (!found);
