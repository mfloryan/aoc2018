const assert = require('assert');
console.log('Day 05');

const sampleCode = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
const day2InputCode = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 10, 1, 19, 1, 19, 9, 23, 1, 23, 6, 27, 1, 9, 27, 31, 1, 31, 10, 35, 2, 13, 35, 39, 1, 39, 10, 43, 1, 43, 9, 47, 1, 47, 13, 51, 1, 51, 13, 55, 2, 55, 6, 59, 1, 59, 5, 63, 2, 10, 63, 67, 1, 67, 9, 71, 1, 71, 13, 75, 1, 6, 75, 79, 1, 10, 79, 83, 2, 9, 83, 87, 1, 87, 5, 91, 2, 91, 9, 95, 1, 6, 95, 99, 1, 99, 5, 103, 2, 103, 10, 107, 1, 107, 6, 111, 2, 9, 111, 115, 2, 9, 115, 119, 2, 13, 119, 123, 1, 123, 9, 127, 1, 5, 127, 131, 1, 131, 2, 135, 1, 135, 6, 0, 99, 2, 0, 14, 0];
const day5InputCode = [3,225,1,225,6,6,1100,1,238,225,104,0,1002,36,25,224,1001,224,-2100,224,4,224,1002,223,8,223,101,1,224,224,1,223,224,223,1102,31,84,225,1102,29,77,225,1,176,188,224,101,-42,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,2,196,183,224,1001,224,-990,224,4,224,1002,223,8,223,101,7,224,224,1,224,223,223,102,14,40,224,101,-1078,224,224,4,224,1002,223,8,223,1001,224,2,224,1,224,223,223,1001,180,64,224,101,-128,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,1102,24,17,224,1001,224,-408,224,4,224,1002,223,8,223,101,2,224,224,1,223,224,223,1101,9,66,224,1001,224,-75,224,4,224,1002,223,8,223,1001,224,6,224,1,223,224,223,1102,18,33,225,1101,57,64,225,1102,45,11,225,1101,45,9,225,1101,11,34,225,1102,59,22,225,101,89,191,224,1001,224,-100,224,4,224,1002,223,8,223,1001,224,1,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,8,226,677,224,1002,223,2,223,1006,224,329,1001,223,1,223,108,226,226,224,1002,223,2,223,1006,224,344,1001,223,1,223,7,677,226,224,102,2,223,223,1005,224,359,101,1,223,223,7,226,677,224,102,2,223,223,1006,224,374,101,1,223,223,1008,677,226,224,1002,223,2,223,1006,224,389,101,1,223,223,8,677,677,224,1002,223,2,223,1005,224,404,101,1,223,223,8,677,226,224,102,2,223,223,1005,224,419,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,434,1001,223,1,223,1107,226,677,224,1002,223,2,223,1006,224,449,1001,223,1,223,107,677,226,224,1002,223,2,223,1005,224,464,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,479,1001,223,1,223,1108,677,226,224,1002,223,2,223,1006,224,494,1001,223,1,223,1108,677,677,224,1002,223,2,223,1006,224,509,1001,223,1,223,107,677,677,224,1002,223,2,223,1005,224,524,101,1,223,223,1007,677,226,224,102,2,223,223,1005,224,539,1001,223,1,223,1107,226,226,224,1002,223,2,223,1006,224,554,1001,223,1,223,1008,226,226,224,1002,223,2,223,1006,224,569,101,1,223,223,1108,226,677,224,1002,223,2,223,1006,224,584,101,1,223,223,108,677,677,224,1002,223,2,223,1006,224,599,1001,223,1,223,1007,677,677,224,102,2,223,223,1006,224,614,101,1,223,223,107,226,226,224,102,2,223,223,1006,224,629,101,1,223,223,1007,226,226,224,102,2,223,223,1005,224,644,1001,223,1,223,108,226,677,224,102,2,223,223,1005,224,659,1001,223,1,223,7,677,677,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226];

class Cpu {

  getParameterMode(opcode, parameterIndex) {
    // console.log(`${opcode} -> index ${parameterIndex}`);
    // console.log(`${Math.round((opcode / Math.pow(10, parameterIndex+1)) % 10)}`);
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
      this.memory[this.memory[this.pc+1]] = this.input;
      this.pc += 2;
    },
    4: function output() {
      this.output = this.getParameterValue(1);
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
    this.input = 0;
    this.output = 0;
  }

   run () {
    this.pc = 0;
    while (this.memory[this.pc] !== 99) {
      // console.log(`PC: ${this.pc}`);
      // console.log(this.memory.map((m,i) => m.toString().padStart(5,this.pc == i?'.':' ')).join("|"));

      let opcodeValue = this.memory[this.pc] % 100;
      const op = this.opcodes[opcodeValue];

      if (op) {
        // console.log(op);
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

  setInput(value) {
    this.input = value;
  }

  getOutput() {
    return this.output;
  }

};

let cpu1 = new Cpu(sampleCode);
cpu1.run();
assert.strictEqual(cpu1.getMemory(0), 3500);

let cpu2 = new Cpu(day2InputCode);
cpu2.setMemory(1, 12);
cpu2.setMemory(2, 2);
cpu2.run();
assert.strictEqual(cpu2.getMemory(0), 4138658);


let cpu3 = new Cpu([3,0,4,0,99]);
cpu3.setInput(30);
cpu3.run();
assert.strictEqual(cpu3.getOutput(), 30);

let cpu4 = new Cpu([1002,4,3,4,33]);
cpu4.run();

let cpu5 = new Cpu(day5InputCode);
cpu5.setInput(1);
cpu5.run();
console.log(cpu5.getOutput());
assert.strictEqual(cpu5.getOutput(), 3122865);

let cpu6 = new Cpu([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
cpu6.setInput(0);
cpu6.run();
assert.strictEqual(cpu6.getOutput(), 0)

cpu6.setInput(2);
cpu6.run();
assert.strictEqual(cpu6.getOutput(), 1);

let cpu7 = new Cpu([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
cpu7.setInput(0);
cpu7.run();
assert.strictEqual(cpu7.getOutput(), 0)

cpu7.setInput(2);
cpu7.run();
// assert.strictEqual(cpu7.getOutput(), 1);

let cpu8 = new Cpu([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
  1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
  999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);

cpu8.setInput(6);
cpu8.run();
assert.strictEqual(cpu8.getOutput(),999);

cpu8.setInput(8);
cpu8.run();
assert.strictEqual(cpu8.getOutput(),1000);

cpu8.setInput(10);
cpu8.run();
assert.strictEqual(cpu8.getOutput(),1001);

let cpuPartTwp = new Cpu(day5InputCode);
cpuPartTwp.setInput(5);
cpuPartTwp.run();
console.log(cpuPartTwp.getOutput());
