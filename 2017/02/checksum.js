const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split('\n');

let sheet = [
    "5 1 9 5".split(" "),
    "7 5 3".split(" "),
    "2 4 6 8".split(" "),
];

sheet = input.map(r => r.split("\t"));

function rowChecksum(row) {
    let mm = row.reduce((a,c) => {
        return {
            min: Math.min(a.min, c),
            max:  Math.max(a.max, c)
        }},
        {min: Infinity, max: -Infinity});
    return Math.abs(mm.min - mm.max);
}

console.log("Part one: " + sheet.map(rowChecksum).reduce((a,c) => a+c));

let sheet2 = [
    "5 9 2 8".split(" ").map(_ => parseInt(_)),
    "9 4 7 3".split(" ").map(_ => parseInt(_)),
    "3 8 6 5".split(" ").map(_ => parseInt(_)),
];

function rowResult(row) {
    for (let i=0; i < row.length; i++) {
        for (let j = i+1; j < row.length; j++) {
            let x = Math.max(row[i], row[j]);
            let y = Math.min(row[i], row[j]);
            if (Math.round(x/y) == x/y) return x/y;
        }
    }
    return 0;
}

console.log(sheet.map(rowResult).reduce((a,c) => a+c));