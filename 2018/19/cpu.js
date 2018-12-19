const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let cpu = {
    ip: 0,
    ip_register: 0,
    registers: [0, 0, 0, 0, 0, 0],
    setRegisters: function(values) {
        values.forEach((v,i) => this.registers[i] = v);
    },
    opcodes: {
        addr: function(a,b,c) { this.registers[c] = this.registers[a] + this.registers[b];},
        addi: function(a,b,c) { this.registers[c] = this.registers[a] + b; } ,  
        mulr: function(a,b,c) { this.registers[c] = this.registers[a] * this.registers[b]; },
        muli: function(a,b,c) { this.registers[c] = this.registers[a] * b; }, 
        banr: function(a,b,c) { this.registers[c] = this.registers[a] & this.registers[b]; },
        bani: function(a,b,c) { this.registers[c] = this.registers[a] & b; },
        borr: function(a,b,c) { this.registers[c] = this.registers[a] | this.registers[b]; },
        bori: function(a,b,c) { this.registers[c] = this.registers[a] | b; },
        setr: function(a,b,c) { this.registers[c] = this.registers[a]; },
        seti: function(a,b,c) { this.registers[c] = a; },
        gtir: function(a,b,c) { this.registers[c] = (a > this.registers[b])?1:0; },
        gtri: function(a,b,c) { this.registers[c] = (this.registers[a] > b)?1:0; },
        gtrr: function(a,b,c) { this.registers[c] = (this.registers[a] > this.registers[b])?1:0; },
        eqir: function(a,b,c) { this.registers[c] = (a == this.registers[b])?1:0; },
        eqri: function(a,b,c) { this.registers[c] = (this.registers[a] == b)?1:0; },
        eqrr: function(a,b,c) { this.registers[c] = (this.registers[a] == this.registers[b])?1:0; },
    },
}

Object.keys(cpu.opcodes).forEach(k => cpu.opcodes[k] = cpu.opcodes[k].bind(cpu));
cpu.setRegisters = cpu.setRegisters.bind(cpu);

let input0 = [
    '#ip 0',
    'seti 5 0 1',
    'seti 6 0 2',
    'addi 0 1 0',
    'addr 1 2 3',
    'setr 1 0 0',
    'seti 8 0 4',
    'seti 9 0 5',
];

function executeCode(input) {
    let assignmend = input.shift().split(" ");
    cpu.ip_register = assignmend[1];

    let instructions = input.map(r => {
        let s = r.split(" ");
        return function() {
            cpu.opcodes[s[0]](parseInt(s[1]), parseInt(s[2]), parseInt(s[3]));
        }
    });

    let execute = true;
    cpu.registers[0] = 1;
    console.log(cpu.registers);

    // cpu.setRegisters([277, 10551309, 10, 789408, 0, 200]);
    // cpu.ip = 11;
    
    let i = 0;
    do {
        if (cpu.ip >= input.length || cpu.up < 0) break;

        if (i % 10000000 == 0) {
            console.log(`${i.toString().padStart(10)}: ${cpu.ip.toString().padStart(2)} => ${cpu.registers.join("|")}`);
        }

        instruction = instructions[cpu.ip];
        cpu.registers[cpu.ip_register] = cpu.ip;
        instruction();
        cpu.ip = cpu.registers[cpu.ip_register];
        cpu.ip++;
        i++;
        if (i > 10000000000) i = 0;
    } while (execute);

    console.log(cpu.registers);
}

executeCode(input);


//p2 - 8 - nope
//p2 - 4 - nope
//p2 - 5 - nope
//p2 - ??


//10000000 => 4|10551309| 5|10518570|0|25
//11000000 => 4|10551309|10|   92261|0|26