const fs = require('fs');
const path = require('path');
const assert = require('assert');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseInput (input) {
  const shuffleFunctions = [];
  const instructions = input.split('\n');
  instructions.forEach(i => {
    if (i === 'deal into new stack') shuffleFunctions.push(dealIntoNewStack);
    if (i.startsWith('cut')) {
      shuffleFunctions.push(d => cutNcard(parseInt(i.split(' ')[1]), d));
    }
    if (i.startsWith('deal with increment')) {
      shuffleFunctions.push(d => dealWithIncrement(parseInt(i.split(' ')[3]), d));
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

const f = parseInput(`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`);

assert.strictEqual(dealWithIncrement(3, getDeck(10)).join(' '), '0 7 4 1 8 5 2 9 6 3');
assert.strictEqual(cutNcard(3, getDeck(10)).join(' '), '3 4 5 6 7 8 9 0 1 2');
assert.strictEqual(cutNcard(-4, getDeck(10)).join(' '), '6 7 8 9 0 1 2 3 4 5');

assert.strictEqual(shuffle(getDeck(10), f).join(' '), '9 2 5 8 1 4 7 0 3 6');

const shuffledDeck = shuffle(getDeck(10007), parseInput(input));
console.log(shuffledDeck.findIndex(c => c === 2019));
