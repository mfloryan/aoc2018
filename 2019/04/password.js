
const assert = require('assert');

function isValidPassword(password) {
  const digits = password.toString().split('');
  if (digits.length != 6) return false;
  let isIncreasing = true;
  let lastDigit = null;
  let isDouble = false;
  let groupLen = 0;

  digits.forEach(digit => {
    if (lastDigit) {
      if (parseInt(digit) < parseInt(lastDigit)) {
        isIncreasing = false;
      } else {
        if (lastDigit === digit) {
          if (groupLen === 0) groupLen = 2; else groupLen++;
        } else {
          if (groupLen === 2) {
            isDouble = true;
          }
          groupLen = 0;
        }
      }
    }
    lastDigit = digit;
  });

  if (groupLen === 2) isDouble = true;

  return isIncreasing && isDouble;
}

// assert.strictEqual(isValidPassword(111111), true);
assert.strictEqual(isValidPassword(223450), false);
assert.strictEqual(isValidPassword(123789), false);

assert.strictEqual(isValidPassword(123788), true);

assert.strictEqual(isValidPassword(223444), true);
assert.strictEqual(isValidPassword(122234), false);
assert.strictEqual(isValidPassword(123444), false);

assert.strictEqual(isValidPassword(122224), false);
assert.strictEqual(isValidPassword(112222), true);
assert.strictEqual(isValidPassword(111222), false);

assert.strictEqual(isValidPassword(125555), false);
assert.strictEqual(isValidPassword(222255), true);

let count = 0;
for (let i = 193651; i <= 649729; i++) {
  if (isValidPassword(i)) count++;
}

console.log(count);