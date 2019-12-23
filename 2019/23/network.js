const fs = require('fs');
const path = require('path');
const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

const nics = [];
const networkBuffer = {};
for (let i = 0; i < 50; i++) {
  networkBuffer[i] = [];
  const nic = new Cpu(code);
  nic.addInput(i);
  // nic.run();
  nics.push(nic);
}

let done = false;

while (!done) {
  for (let i = 0; i < 50; i++) {
    const nic = nics[i];

    if (networkBuffer[i].length > 0) {
      while (networkBuffer[i].length > 0) {
        const message = networkBuffer[i].shift();
        nic.addInput(message.x);
        nic.addInput(message.y);
        // console.log(j, i, '<', message);
      }
    } else {
      nic.addInput(-1);
    }

    nic.run();

    let nicOutput = nic.getOutput();
    while (nicOutput.length > 0) {
      const packet = {
        addr: nicOutput.shift(),
        x: nicOutput.shift(),
        y: nicOutput.shift()
      };
      // console.log(j, i, '>', packet);
      if (packet.addr === 255) {
        console.log(packet.y);
        done = true;
        break;
      }
      networkBuffer[packet.addr].push(packet);
    }
  }
}
