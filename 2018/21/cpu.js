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

let input = [
    '#ip 1',
    'seti 123 0 5',
    'bani 5 456 5',
    'eqri 5 72 5',
    'addr 5 1 1',
    'seti 0 0 1',
    'seti 0 6 5',
    'bori 5 65536 4',
    'seti 13431073 4 5',
    'bani 4 255 3',
    'addr 5 3 5',
    'bani 5 16777215 5',
    'muli 5 65899 5',
    'bani 5 16777215 5',
    'gtir 256 4 3',
    'addr 3 1 1',
    'addi 1 1 1',
    'seti 27 9 1',
    'seti 0 1 3',
    'addi 3 1 2',
    'muli 2 256 2',
    'gtrr 2 4 2',
    'addr 2 1 1',
    'addi 1 1 1',
    'seti 25 4 1',
    'addi 3 1 3',
    'seti 17 8 1',
    'setr 3 4 4',
    'seti 7 7 1',
    'eqrr 5 0 3',
    'addr 3 1 1',
    'seti 5 9 1',
];

function executeCode(input, register0) {
    let assignmend = input.shift().split(" ");
    cpu.ip_register = assignmend[1];

    let instructions = input.map(r => {
        let s = r.split(" ");
        return function() {
            cpu.opcodes[s[0]](parseInt(s[1]), parseInt(s[2]), parseInt(s[3]));
            // cpu.opcodes[s[0]](s[1], s[2], s[3]);
        }
    });

    let execute = true;
    cpu.registers[0] = register0;
    console.log(cpu.registers);

    // cpu.setRegisters([277, 10551309, 10, 789408, 0, 200]);
    // cpu.ip = 11;
    
    let i = 0;
    let lastR5 = 0;
    do {
        if (cpu.ip >= input.length || cpu.up < 0) break;

        let ip = cpu.ip;
        instruction = instructions[cpu.ip];
        cpu.registers[cpu.ip_register] = cpu.ip;
        instruction();
        cpu.ip = cpu.registers[cpu.ip_register];
        cpu.ip++;

        if (cpu.registers[5] != lastR5 && ip == 12 && cpu.registers[3] == cpu.registers[4]) {
            // console.log(cpu.registers[5]);
            lastR5 = cpu.registers[5];
            // console.log(`${ip.toString().padStart(2)} -> ${cpu.ip.toString().padStart(2)} R: [${cpu.registers.map(r => r.toString().padStart(8)).join("|")}] ${i.toString().padStart(4)}`);
            console.log(`${cpu.registers[5]},${i}`);
        }

        i++;
        if (i > 10000000000) i = 0;
        // if (i == 2000) break;
    } while (execute);

    console.log(cpu.registers);
    console.log(i);
}

executeCode(input, 3115806);// - part 1
