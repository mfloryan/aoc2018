const assert = require('assert');
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseInput (input) {
  function parseChemical (chemical) {
    let name, quantity;
    [quantity, name] = chemical.trim().split(' ');
    return {
      name,
      quantity: parseInt(quantity)
    };
  }
  const rows = input.split('\n');
  const result = rows.map(r => {
    let inputs, output;
    [inputs, output] = r.split('=>');
    const inputElements = inputs.split(',');
    return {
      inputs: inputElements.map(parseChemical),
      output: parseChemical(output)
    };
  });
  return result;
}

function generateDotOutput (reactions) {
  reactions.forEach(r => {
    r.inputs.forEach(i => {
      console.log(`${i.name} -> ${r.output.name} [taillabel="${i.quantity}" headlabel="${r.output.quantity}"]`);
    });
  });
}

function addChildren (root, nodes) {
  root.inputs.forEach(i => {
    const r = nodes.find(n => n.output.name === i.name);
    if (r) {
      i.r = r;
      addChildren(r, nodes);
    }
  });
};

function buildTree (reactions) {
  const fuel = reactions.find(r => r.output.name === 'FUEL');
  addChildren(fuel, reactions);
  return fuel;
}

function countNeeds (root, needs, requiredQuantityFromTop = 1, level = 0) {
  root.leftover = root.leftover || 0;
  const required = requiredQuantityFromTop - root.leftover;

  const multiple = Math.ceil(required / root.output.quantity);
  root.leftover = (root.output.quantity * multiple) - required;

  root.inputs.forEach(i => {
    const requestQuantity = i.quantity * multiple;

    if (needs[i.name]) {
      needs[i.name] += requestQuantity;
    } else {
      needs[i.name] = requestQuantity;
    }

    if (i.r) {
      countNeeds(i.r, needs, requestQuantity, level + 1);
    }
  });
}

function getRequiredOre (fuel, required = 1) {
  const needs = {};
  countNeeds(fuel, needs, required);
  return needs.ORE;
}

const exampleInput1 = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`;

const exampleInput2 = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`;

const exampleInput3 = `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`;

console.log('Day 14');

assert.strictEqual(getRequiredOre(buildTree(parseInput(exampleInput1))), 31);
assert.strictEqual(getRequiredOre(buildTree(parseInput(exampleInput2))), 165);
assert.strictEqual(getRequiredOre(buildTree(parseInput(exampleInput3))), 13312);
console.log(getRequiredOre(buildTree(parseInput(input))));

console.log(1000000000000);
console.log();

let tree = buildTree(parseInput(input));

let i = 4800000;
let result = 0;
while (result < 1000000000000) {
  i++;
  if (i % 10000 === 0) console.log(result.toString().padStart(13), i);
  result = getRequiredOre(tree, i);
}
console.log(result);
console.log(i - 1);
