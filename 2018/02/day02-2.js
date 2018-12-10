const fs = require('fs');

console.log("Day 02-2");

let input = fs.readFileSync('day02-input.txt', {encoding: 'utf8'});

let boxIds = input.split('\n');

let testBoxIds = ['abcde','fghij','klmno','pqrst','fguij','axcye','wvxyz'];

function generatePairs(list) {
    let pairs = [];
    
    for (let i = 0; i < list.length; i++) {
        for (let j = i+1; j < list.length; j++) {
            pairs.push( [list[i], list[j]]);
        }
    }
    return pairs;
}

let pairs = generatePairs(boxIds);

function distance(pair) {
    let distance = 0;
    for (let i = 0; i < Math.min(pair[0].length, pair[1].length); i++) {
        if (pair[0][i] != pair[1][i]) distance++;        
    }
    return distance;
}

let distanceOfOne = pairs.filter( p => distance(p) == 1);

console.log(distanceOfOne);

console.log(distanceOfOne[0][0]);
console.log(distanceOfOne[0][1]);