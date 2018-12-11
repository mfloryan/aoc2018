const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split('\n');

function calculateCaptcha(input) {
    let sum = 0;
    input.reduce((p,c) => {
        if (p == c) sum+= c;
        return c;
     }, input[input.length-1]);
    return sum;
}

let examples = ["1122","1111","1234","91212129"];

console.log(
    examples.map(a => calculateCaptcha(a.split("").map(_ => parseInt(_))))
);

console.log("Part one: ");
console.log(calculateCaptcha(input[0].split("").map(_ => parseInt(_))));

function calculateCircularCaptcha(input) {
    let sum = 0;
    input.forEach((d,i,a) => {
        if (d == a[(i + (a.length / 2)) % a.length]) sum += d;
    });
    return sum;
}

let examples2 = ["1212","1221","123425","123123","12131415"].map(x=> x.split("").map(_ => parseInt(_)));

console.log(examples2.map(calculateCircularCaptcha));

console.log("Part two: ");
console.log(calculateCircularCaptcha(input[0].split("").map(_ => parseInt(_))));
