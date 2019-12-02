const assert = require('assert');
const fs = require('fs');
// const input = fs.readFileSync('input.txt', { encoding: 'utf8' });

console.log('Day 02');

let sampleCode = [1,9,10,3,2,3,11,0,99,30,40,50];

let codePartOne = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,19,9,23,1,23,6,27,1,9,27,31,1,31,10,35,2,13,35,39,1,39,10,43,1,43,9,47,1,47,13,51,1,51,13,55,2,55,6,59,1,59,5,63,2,10,63,67,1,67,9,71,1,71,13,75,1,6,75,79,1,10,79,83,2,9,83,87,1,87,5,91,2,91,9,95,1,6,95,99,1,99,5,103,2,103,10,107,1,107,6,111,2,9,111,115,2,9,115,119,2,13,119,123,1,123,9,127,1,5,127,131,1,131,2,135,1,135,6,0,99,2,0,14,0];

function RunCode(code) {
    let run = true;
    let position = 0;

    do {
        let opcode = code[position];
        // console.log(opcode);
        if (opcode == 99) run = false;
        else if (opcode == 1) {
            code[code[position+3]] = code[code[position +1]] + code[code[position+2]];
        } else if (opcode == 2) {
            code[code[position+3]] = code[code[position+1]] * code[code[position+2]];
        }
        position += 4;
    } while (run);

    console.log(code);
}


console.log(RunCode(sampleCode));

let c2 = [1,0,0,0,99];

console.log(RunCode(c2));

let c3 = [2,3,0,3,99];
console.log(RunCode(c3));

let c4 = [2,4,4,5,99,0];
console.log(RunCode(c4));

codePartOne[1] = 12;
codePartOne[2] = 2;
RunCode(codePartOne);