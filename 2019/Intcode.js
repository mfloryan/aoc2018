module.exports = class Cpu {

  getParameterMode(opcode, parameterIndex) {
    return Math.round((opcode / Math.pow(10, parameterIndex+1)) % 10);
  }

  getParameterValue(index) {
    let parameterMode = this.getParameterMode(this.memory[this.pc], index);
    if (parameterMode == 0) {
      //positional
      return this.memory[this.memory[this.pc+index]];
    } else if (parameterMode == 1) {
      //immediate
      return this.memory[this.pc + index];
    } else if (parameterMode == 2) {
      //relative
      return this.memory[this.memory[this.pc + index] + this.relativeBase];
    } else {
      console.log("Invalid parameter mode: " + parameterMode);
    }
  }

  opcodes = {
    1: function add() {
      let writeOffset = this.getParameterMode(this.memory[this.pc], 3)==2? this.relativeBase : 0;
      this.memory[this.memory[this.pc+3] + writeOffset] = this.getParameterValue(1) + this.getParameterValue(2);
      this.pc += 4;
    },
    2: function multiply() {
      let writeOffset = this.getParameterMode(this.memory[this.pc], 3)==2? this.relativeBase : 0;
      this.memory[this.memory[this.pc+3] + writeOffset] = this.getParameterValue(1) * this.getParameterValue(2);
      this.pc += 4;
    },
    3: function input() {
      if (this.input.length < 1) {
        return false;
      }
      let input = this.input.shift();

      let writeOffset = this.getParameterMode(this.memory[this.pc], 1)==2? this.relativeBase : 0;
      this.memory[this.memory[this.pc+1] + writeOffset] =  input;
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
      let writeOffset = this.getParameterMode(this.memory[this.pc], 3)==2? this.relativeBase : 0;
      if (this.getParameterValue(1) < this.getParameterValue(2)) {
        this.memory[this.memory[this.pc+3] + writeOffset] = 1;
      } else {
        this.memory[this.memory[this.pc+3] + writeOffset] = 0;
      }
      this.pc += 4;
    },
    8: function equals() {
      let writeOffset = this.getParameterMode(this.memory[this.pc], 3)==2? this.relativeBase : 0;
      if (this.getParameterValue(1) === this.getParameterValue(2)) {
        this.memory[this.memory[this.pc+3] + writeOffset] = 1;
      } else {
        this.memory[this.memory[this.pc+3] + writeOffset] = 0;
      }
      this.pc += 4;
    },
    9: function adjust_relative_base() {
      this.relativeBase += this.getParameterValue(1);
      this.pc += 2;
    }
  };

  constructor (code) {
    this.memory = code.slice().concat(new Array(10000).fill(0));
    this.reset();
  }

   run () {
    while (this.memory[this.pc] !== 99) {

      let opcodeValue = this.memory[this.pc] % 100;
      const op = this.opcodes[opcodeValue];

      if (op) {
        if (op.apply(this) === false) {
          return false;
        }
      } else {
        console.error("Unknown opcode: " + op);
        break;
      }
    }
    return true;
  }

  reset() {
    this.pc = 0;
    this.input = [];
    this.output = [];
    this.relativeBase = 0;
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

  clearOutput() {
    this.output = [];
  }

};
