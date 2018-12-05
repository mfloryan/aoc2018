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


let finalPolymer2 = reactAll(input[0]);
console.log(finalPolymer2.length);

let i2 = input[0];
let chemicals = new Set(i2.toUpperCase().split(""));

let min = [];

chemicals.forEach(c => {
    console.log(c);
    let newP = i2.split("").filter(x => x.toUpperCase() != c).join("");
    min.push([c,reactAll(newP).length])

});

console.log(min.sort((a,b) => a[1] - b[1])[0][1]);
