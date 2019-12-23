const fs = require('fs');
const path = require('path');
const Cpu = require('../Intcode');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });
const code = input.split(',').map(a => parseInt(a));

function partOne () {
  const nics = [];
  const networkBuffer = {};

  for (let i = 0; i < 50; i++) {
    networkBuffer[i] = [];
    const nic = new Cpu(code);
    nic.addInput(i);
    nics.push(nic);
  }

  while (true) {
    for (let i = 0; i < 50; i++) {
      const nic = nics[i];
      if (networkBuffer[i].length > 0) {
        while (networkBuffer[i].length > 0) {
          const message = networkBuffer[i].shift();
          nic.addInput(message.x);
          nic.addInput(message.y);
        }
      } else {
        nic.addInput(-1);
      }
      nic.run();
      const nicOutput = nic.getOutput();
      while (nicOutput.length > 0) {
        const packet = {
          addr: nicOutput.shift(),
          x: nicOutput.shift(),
          y: nicOutput.shift()
        };
        if (packet.addr === 255) {
          return packet.y;
        } else {
          networkBuffer[packet.addr].push(packet);
        }
      }
    }
  }
}

function partTwo () {
  const nics = [];
  const networkBuffer = {};

  for (let i = 0; i < 50; i++) {
    networkBuffer[i] = [];
    const nic = new Cpu(code);
    nic.addInput(i);
    nics.push(nic);
  }

  let nat;
  let lastY;

  while (true) {
    for (let i = 0; i < 50; i++) {
      const nic = nics[i];
      if (networkBuffer[i].length > 0) {
        while (networkBuffer[i].length > 0) {
          const message = networkBuffer[i].shift();
          nic.addInput(message.x);
          nic.addInput(message.y);
        }
      } else {
        nic.addInput(-1);
      }
      nic.run();
      const nicOutput = nic.getOutput();
      while (nicOutput.length > 0) {
        const packet = {
          addr: nicOutput.shift(),
          x: nicOutput.shift(),
          y: nicOutput.shift()
        };
        if (packet.addr === 255) {
          nat = packet;
        } else {
          networkBuffer[packet.addr].push(packet);
        }
      }
    }
    if (Object.values(networkBuffer).filter(a => a.length > 0).length === 0) {
      nics[0].addInput(nat.x);
      nics[0].addInput(nat.y);
      if (nat.y === lastY) {
        return nat.y;
      } else lastY = nat.y;
    }
  }
}

console.log(partOne());
console.log(partTwo());
