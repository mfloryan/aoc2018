const fs = require('fs');
const path = require('path');

const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

let droid = new Cpu(code);

droid.run();
console.log(droid.getOutput().map(x => String.fromCharCode(x)).join(''));

let springscript = `OR A J
AND B J
AND C J
NOT J J
AND D J
WALK
`;

springscript.split('').map(c => c.charCodeAt(0)).forEach(n => droid.addInput(n));
droid.clearOutput();

droid.run();
console.log(droid.getOutput().map(x => String.fromCharCode(x)).join(''));
console.log(droid.getOutput().pop());