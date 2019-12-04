
const assert = require('assert');

function isValidPassword(password) {
  const digits = password.toString().split('');
  if (digits.length != 6) return false;
  let isIncreasing = true;
  let lastDigit = null;
  let isDouble = false;
  
  digits.forEach(digit => {
    if (lastDigit) {
      if (parseInt(digit) < parseInt(lastDigit)) {
        isIncreasing = false;
      } else {
        if (lastDigit === digit) isDouble = true;
      }
    }
    lastDigit = digit;
  });

  return isIncreasing && isDouble;
}

assert.strictEqual(isValidPassword(111111), true);
assert.strictEqual(isValidPassword(223450), false);
assert.strictEqual(isValidPassword(123789), false);

assert.strictEqual(isValidPassword(123788), true);

let count = 0;
for (let i = 193651; i <= 649729; i++) {
  if (isValidPassword(i)) count++;
}

//33102 - too high

console.log(count);