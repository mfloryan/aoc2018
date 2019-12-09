const assert = require('assert');
console.log('Day 07');

class Cpu {

  getParameterMode(opcode, parameterIndex) {
    return Math.round((opcode / Math.pow(10, parameterIndex+1)) % 10);
  }

  getParameterValue(index) {
    return this.getParameterMode(this.memory[this.pc], index) == 1?this.memory[this.pc+index]:this.memory[this.memory[this.pc+index]];
  }

  opcodes = {
    1: function add() {
      this.memory[this.memory[this.pc+3]] = this.getParameterValue(1) + this.getParameterValue(2);
      this.pc += 4;
    },
    2: function multiply() {
      this.memory[this.memory[this.pc+3]] = this.getParameterValue(1) * this.getParameterValue(2);
      this.pc += 4;
    },
    3: function input() {
      if (this.input.length < 1) {
        console.log("Critical: input buffer empty");
      }
      let input = this.input.shift();
      this.memory[this.memory[this.pc+1]] = input;
      this.pc += 2;
    },
    4: function output() {
      this.output.push(this.getParameterValue(1));
      this.pc += 2;
    },
    5: function jump_if_true() {
      if (this.getParameterValue(1) !== 0) {
        this.pc = this.getParameterValue(2);
      } else {
        this.pc += 3;
      }
    },
    6: function jump_if_false() {
      if (this.getParameterValue(1) === 0) {
        this.pc = this.getParameterValue(2);
      } else {
        this.pc += 3;
      }
    },
    7: function less_than() {
      if (this.getParameterValue(1) < this.getParameterValue(2)) {
        this.memory[this.memory[this.pc+3]] = 1;
      } else {
        this.memory[this.memory[this.pc+3]] = 0;
      }
      this.pc += 4;
    },
    8: function equals() {
      if (this.getParameterValue(1) === this.getParameterValue(2)) {
        this.memory[this.memory[this.pc+3]] = 1;
      } else {
        this.memory[this.memory[this.pc+3]] = 0;
      }
      this.pc += 4;
    }
  };

  constructor (memory) {
    this.memory = memory.slice();
    this.pc = 0;
    this.input = [];
    this.output = [];
  }

  run () {
    this.pc = 0;
    while (this.memory[this.pc] !== 99) {

      let opcodeValue = this.memory[this.pc] % 100;
      const op = this.opcodes[opcodeValue];

      if (op) {
        op.apply(this);
      } else {
        console.log("Unknown opcode: " + op);
        break;
      }
    }
  }

  getMemory(address) {
    return this.memory[address];
  }

  setMemory(address, value) {
    this.memory[address] = value;
  }

  addInput(value) {
    this.input.push(value);
  }

  getOutput() {
    return this.output;
  }

};

function testPhaseSettings(code, phaseSettings) {
  let cpuA = new Cpu(code);
  cpuA.addInput(phaseSettings[0]);
  cpuA.addInput(0);
  cpuA.run();

  let cpuB = new Cpu(code);
  cpuB.addInput(phaseSettings[1]);
  cpuB.addInput(cpuA.getOutput()[0]);
  cpuB.run();

  let cpuC = new Cpu(code);
  cpuC.addInput(phaseSettings[2]);
  cpuC.addInput(cpuB.getOutput()[0]);
  cpuC.run();

  let cpuD = new Cpu(code);
  cpuD.addInput(phaseSettings[3]);
  cpuD.addInput(cpuC.getOutput()[0]);
  cpuD.run();

  let cpuE = new Cpu(code);
  cpuE.addInput(phaseSettings[4]);
  cpuE.addInput(cpuD.getOutput()[0]);
  cpuE.run();

  return cpuE.getOutput()[0]
}

let sampleCode01 = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
assert.strictEqual(testPhaseSettings(sampleCode01, [4,3,2,1,0]), 43210);

let sampleCode02 = [3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0];
assert.strictEqual(testPhaseSettings(sampleCode02, [0,1,2,3,4]), 54321);

let sampleCode03 = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0];
assert.strictEqual(testPhaseSettings(sampleCode03, [1,0,4,3,2]), 65210);

let inputCode = [3,8,1001,8,10,8,105,1,0,0,21,38,63,80,105,118,199,280,361,442,99999,3,9,102,5,9,9,1001,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,4,9,102,4,9,9,101,4,9,9,102,2,9,9,101,2,9,9,4,9,99,3,9,1001,9,5,9,102,4,9,9,1001,9,4,9,4,9,99,3,9,101,3,9,9,1002,9,5,9,101,3,9,9,102,5,9,9,101,3,9,9,4,9,99,3,9,1002,9,2,9,1001,9,4,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99];

console.log(testPhaseSettings(inputCode, [0,1,2,3,4]));
console.log(testPhaseSettings(inputCode, [0,1,2,4,3]));

function generatePermutations(length) {
  let sequence = [...Array(length).keys()];
  let permutations = [];
  p([], sequence, permutations);
  return permutations;
}

function p(prefix, array, permutations) {
  if (array.length == 1) permutations.push(prefix.concat(array));
  for (let i = 0; i < array.length; i++) {
    let head = array[i];
    let tail = array.slice(0,i);
    tail = tail.concat(array.slice(i+1,array.length));
    p(prefix.concat([head]), tail, permutations);
  }
}

let ps = generatePermutations(5);

let max = 0;
ps.forEach(p => {
  max = Math.max(max, testPhaseSettings(inputCode, p));
});

console.log(max);
