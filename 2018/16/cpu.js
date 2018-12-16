
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
    let matchingOpcodes = [];
    cpu.opcodes.forEach(op => {
        cpu.setRegisters(input);
        op.action(instructions[1], instructions[2], instructions[3]);
        if (output[instructions[3]] == cpu.registers[instructions[3]]) {
            matchingOpcodes.push(op.name);
        }
    });
    return matchingOpcodes;
}

let input0 = [
    'Before: [3, 2, 1, 1]',
    '9 2 1 2',
    'After:  [3, 2, 2, 1]',
    '',
];

function parseInput(input) {
    let i = 0;
    let opcodesMapping = [];
    while (input.length > 3) {
        if (input[0] == "") break;
        i++;
        let [before, instruction, after] = [input.shift(), input.shift(), input.shift()];
        input.shift();

        before = before.substring(before.indexOf('[')+1, before.indexOf(']')).split(",").map(_ => parseInt(_));
        instruction = instruction.split(" ").map(_ => parseInt(_));
        after = after.substring(after.indexOf('[')+1, after.indexOf(']')).split(",").map(_ => parseInt(_));;

        let ops = findMatchingOpCodes(before, instruction, after);
        opcodesMapping.push({id: instruction[0], ops: ops});
    }
    return opcodesMapping;
}

console.log(parseInput(input0).map(o => o.ops.length).filter(c => c >= 3).length == 1);

let opcodesMapping = parseInput(input);
console.log("Part 1: " + opcodesMapping.map(o => o.ops.length).filter(c => c >= 3).length);

let candidates = {};

opcodesMapping.forEach(m => {
    if (!candidates[m.id]) candidates[m.id] = new Set();
    m.ops.forEach(o => candidates[m.id].add(o));
});

do {
    Object.keys(candidates).filter(k => candidates[k].size == 1).forEach(k => {
        let instruction = [...candidates[k].values()][0];
        Object.keys(candidates).forEach(key => {
            if (k != key) {
                candidates[key].delete(instruction);
            }
        });
    });
} while (Object.keys(candidates).map(k => candidates[k].size).filter(s => s > 1).length > 0);

let map = {};
Object.keys(candidates).forEach(k => map[k] = [...candidates[k]][0]);

console.log(map);

input.shift();
input.shift();

function executeCode(map, instructions) {
    cpu.setRegisters([0, 0, 0, 0]);
    instructions.forEach(i => {
        instruction = map[i[0]];
        let action = cpu.opcodes.find(op => op.name == instruction);
        action.action(i[1], i[2], i[3]);
    });
    return cpu.registers;
}

let registers = executeCode(map, input.map(r => r.split(" ").map(_ => parseInt(_))));
console.log(registers);

console.log("Part 2: " + registers[0]);
