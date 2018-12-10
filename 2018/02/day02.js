const fs = require('fs');

console.log("Day 02");

let input = fs.readFileSync('day02-input.txt', {encoding: 'utf8'});

let boxIds = input.split('\n');

let testBoxIds = ['abcdef','bababc','abbcde','abcccd','aabcdd','abcdee','ababab'];

function letterCount(string) {
    return string.split("").reduce((a,element) => {
        a[element]?a[element]++:a[element]=1;
        return a;
    },{});
}

function categorise(counts) {
    return Object.keys(counts)
        .filter( k => (counts[k] == 2 || counts[k]== 3))
        .map(key => counts[key])
        .reduce((a,c) => {
            if (!a.includes(c)) a.push(c);
            return a;
        },[]);
}

let categorisedIds = boxIds.map(letterCount).flatMap(categorise);

let checksum = categorisedIds.reduce((a,c) => {
    if (c == 2) a[0]++;
    if (c == 3) a[1]++;
    return a;
},[0,0]);

console.log(checksum[0] * checksum[1]);