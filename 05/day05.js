const fs = require('fs');

let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n").sort();

let polymer = "dabAcCaCBAcCcaDA";



function doReact(a,b) {
    if (a == b) return false;
    if (a.toUpperCase() == b || b.toUpperCase() ==a) return true;
    return false;
}

function react(polymer) {
    let result = '';
    let reacted = false;

    let i
    for (i = 0; i < polymer.length; i++) {
        if (doReact(polymer.charAt(i), polymer.charAt(i+1))) {
            reacted = true;
            i++;
        } else {
            result += polymer.charAt(i);
        }
    }
    if (i == polymer.length) result += polymer.charAt(i);
    
    return [reacted, result];
}

function reactAll(polymer) {
    let result = [false, polymer];
    do {
        result = react(result[1]);
    }
    while (result[0])
    return result[1];
}


let finalPolymer = reactAll(polymer);
console.log(finalPolymer.length);

let finalPolymer2 = reactAll(input[0]);
console.log(finalPolymer2.length);
