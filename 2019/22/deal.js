const fs = require('fs');
const path = require('path');
const assert = require('assert');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseInput (input, step2 = false) {
  const shuffleFunctions = [];
  const instructions = input.split('\n');
  instructions.forEach(i => {
    if (i === 'deal into new stack') shuffleFunctions.push(step2 ? getIndexOfdealIntoNewStack : dealIntoNewStack);
    if (i.startsWith('cut')) {
      const n = parseInt(i.split(' ')[1]);
      shuffleFunctions.push(step2 ? getIndexOfcutNcard.bind(null, n) : d => cutNcard(n, d));
    }
    if (i.startsWith('deal with increment')) {
      const n = parseInt(i.split(' ')[3]);
      shuffleFunctions.push(step2 ? getIndexOfdealWithIncrement.bind(null, n) : d => dealWithIncrement(n, d));
    }
  });
  return shuffleFunctions;
}

function getDeck (length) {
  return Array(length).fill(0).map((n, i) => i);
}

function dealIntoNewStack (deck) {
  return deck.reverse();
}

function cutNcard (n, deck) {
  return deck.slice(n).concat(deck.slice(0, n));
}

function getIndexOfdealIntoNewStack(index, length) {
  return (length - index - 1);
}

function getIndexOfcutNcard(n, index, length) {
  return ((index - n) + length) % length;
}

function getIndexOfdealWithIncrement(increment, index, length) {
  return ((index * increment) % length);
}

function dealWithIncrement (increment, deck) {
  const newDeck = Array(deck.length);
  deck.forEach((n, i) => { newDeck[(i * increment) % deck.length] = n; });
  return newDeck;
}

function shuffle (deck, instructions) {
  let thisDeck = deck;
  instructions.forEach(i => {
    thisDeck = i(thisDeck);
  });
  return thisDeck;
}

function trackCard(index, length, instructions) {
  let thisIndex = index;
  instructions.forEach(i => {
    thisIndex = i(thisIndex, length);
  });
  return thisIndex;
}

const example = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;

assert.strictEqual(dealWithIncrement(3, getDeck(10)).join(' '), '0 7 4 1 8 5 2 9 6 3');
assert.strictEqual(cutNcard(3, getDeck(10)).join(' '), '3 4 5 6 7 8 9 0 1 2');
assert.strictEqual(cutNcard(-4, getDeck(10)).join(' '), '6 7 8 9 0 1 2 3 4 5');

assert.strictEqual(shuffle(getDeck(10), parseInput(example)).join(' '), '9 2 5 8 1 4 7 0 3 6');

const shuffledDeck = shuffle(getDeck(10007), parseInput(input));
console.log(shuffledDeck.findIndex(c => c === 2019));
console.log(trackCard(2019, 10007, parseInput(input, true)));

// part 2
