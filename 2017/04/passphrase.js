const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split('\n');

function hasUniqueWords(list) {
    let uniqueWords = new Set(list);
    return uniqueWords.size == list.length;
}

console.log(hasUniqueWords("aa bb cc dd ee".split(" ")) == true);
console.log(hasUniqueWords("aa bb cc dd aa".split(" ")) == false);

let verified = input.map(i => i.split(" ")).map(hasUniqueWords).filter(a => a).length;
console.log(verified);

function containsNoAnagrams(list) {

    for (let i = 0; i < list.length; i++) {
        for (let j = i+1; j < list.length; j++) {
            if (list[i] == list[j]) return false;
            if (list[i].split("").sort().join("") == list[j].split("").sort().join("")) return false;
        }
    }
    return true;
}

console.log( containsNoAnagrams("abcde fghij".split(" ")) );
console.log( containsNoAnagrams("abcde xyz ecdab".split(" ")) );
console.log( containsNoAnagrams("a ab abc abd abf abj".split(" ")) );

console.log(input.map(i => i.split(" ")).map(containsNoAnagrams).filter(a => a).length)