
const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let cpu = {
    registers: [0, 0, 0, 0],
    setRegisters: function(values) {
        values.forEach((v,i) => this.registers[i] = v);
    },
    opcodes: [
        { name: 'addr', action: function(a,b,c) { this.registers[c] = this.registers[a] + this.registers[b];}},
        { name: 'addi', action: function(a,b,c) { this.registers[c] = this.registers[a] + b; }},
        { name: 'mulr', action: function(a,b,c) { this.registers[c] = this.registers[a] * this.registers[b]; }},
        { name: 'muli', action: function(a,b,c) { this.registers[c] = this.registers[a] * b; }}, 
        { name: 'banr', action: function(a,b,c) { this.registers[c] = this.registers[a] & this.registers[b]; }},
        { name: 'bani', action: function(a,b,c) { this.registers[c] = this.registers[a] & b; }},
        { name: 'borr', action: function(a,b,c) { this.registers[c] = this.registers[a] | this.registers[b]; }},
        { name: 'bori', action: function(a,b,c) { this.registers[c] = this.registers[a] | b; }},
        { name: 'setr', action: function(a,b,c) { this.registers[c] = this.registers[a]; }},
        { name: 'seti', action: function(a,b,c) { this.registers[c] = a; }},
        { name: 'gtir', action: function(a,b,c) { this.registers[c] = (a > this.registers[b])?1:0; }},
        { name: 'gtri', action: function(a,b,c) { this.registers[c] = (this.registers[a] > b)?1:0; }},
        { name: 'gtrr', action: function(a,b,c) { this.registers[c] = (this.registers[a] > this.registers[b])?1:0; }},
        { name: 'eqir', action: function(a,b,c) { this.registers[c] = (a == this.registers[b])?1:0; }},
        { name: 'eqri', action: function(a,b,c) { this.registers[c] = (this.registers[a] == b)?1:0; }},
        { name: 'eqrr', action: function(a,b,c) { this.registers[c] = (this.registers[a] == this.registers[b])?1:0; }},
    ],
}

cpu.opcodes.forEach(o => o.action = o.action.bind(cpu));
cpu.setRegisters = cpu.setRegisters.bind(cpu);

function findMatchingOpCodes(input, instructions, output) {
    let count = 0;
    cpu.opcodes.forEach(op => {
        cpu.setRegisters(input);
        op.action(instructions[1], instructions[2], instructions[3]);
        if (output[instructions[3]] == cpu.registers[instructions[3]]) {
            count++;
        }
    });
    return count;
}

let input0 = [
    'Before: [3, 2, 1, 1]',
    '9 2 1 2',
    'After:  [3, 2, 2, 1]',
    '',
];

function parseInput(input) {
    let i = 0;
    let counter = 0;
    while (input.length > 3) {
        if (input[0] == "") break;
        i++;
        let [before, instruction, after] = [input.shift(), input.shift(), input.shift()];
        input.shift();

        before = before.substring(before.indexOf('[')+1, before.indexOf(']')).split(",").map(_ => parseInt(_));
        instruction = instruction.split(" ").map(_ => parseInt(_));
        after = after.substring(after.indexOf('[')+1, after.indexOf(']')).split(",").map(_ => parseInt(_));;

        let ops = findMatchingOpCodes(before, instruction, after);
        if (ops >= 3) counter++;
    }
    return counter;
}

console.log(parseInput(input0) == 1);

console.log("Part 1: " + parseInput(input));
