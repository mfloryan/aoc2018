const assert = require('assert');
console.log('Day 02');

const sampleCode = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
const inputCode = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 10, 1, 19, 1, 19, 9, 23, 1, 23, 6, 27, 1, 9, 27, 31, 1, 31, 10, 35, 2, 13, 35, 39, 1, 39, 10, 43, 1, 43, 9, 47, 1, 47, 13, 51, 1, 51, 13, 55, 2, 55, 6, 59, 1, 59, 5, 63, 2, 10, 63, 67, 1, 67, 9, 71, 1, 71, 13, 75, 1, 6, 75, 79, 1, 10, 79, 83, 2, 9, 83, 87, 1, 87, 5, 91, 2, 91, 9, 95, 1, 6, 95, 99, 1, 99, 5, 103, 2, 103, 10, 107, 1, 107, 6, 111, 2, 9, 111, 115, 2, 9, 115, 119, 2, 13, 119, 123, 1, 123, 9, 127, 1, 5, 127, 131, 1, 131, 2, 135, 1, 135, 6, 0, 99, 2, 0, 14, 0];

const opcodes = {
  1: (x, y) => x + y,
  2: (x, y) => x * y
};

function RunCode (initialCode) {
  const code = initialCode.slice();
  let run = true;
  let programCounter = 0;

  do {
    const opcode = code[programCounter];
    if (opcode === 99) run = false;
    else {
      const op = opcodes[code[programCounter]];
      if (op) {
        code[code[programCounter + 3]] = op(code[code[programCounter + 1]], code[code[programCounter + 2]]);
      }
      programCounter += 4;
    }
  } while (run);

  return code[0];
}

assert.strictEqual(RunCode(sampleCode), 3500);

const c2 = [1, 0, 0, 0, 99];
assert.strictEqual(RunCode(c2), 2);

const c3 = [2, 3, 0, 3, 99];
assert.strictEqual(RunCode(c3), 2);

const c4 = [2, 4, 4, 5, 99, 0];
assert.strictEqual(RunCode(c4), 2);

inputCode[1] = 12;
inputCode[2] = 2;
console.log(RunCode(inputCode));

for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++) {
    inputCode[1] = noun;
    inputCode[2] = verb;
    const output = RunCode(inputCode);
    // console.log(`${noun},${verb},${output}`);
    if (output === 19690720) {
      console.log(100 * noun + verb);
      break;
    }
  }
}
