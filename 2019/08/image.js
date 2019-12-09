const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

console.log('2019 - Day 08');

function parseImageData (imageData, dimentions) {
  const layers = [];

  let r = 0;
  let c = 0;
  let layer = [];
  let row = [];

  for (const pixel of imageData.split('')) {
    row.push(pixel);
    c++;

    if (c === dimentions.w) {
      layer.push(row.slice());
      c = 0;
      r++;
      row = [];
    }

    if (r === dimentions.h) {
      layers.push(layer.slice());
      r = 0;
      layer = [];
    }
  }

  return layers;
}

// console.log(parseImageData('123456789012', { w: 3, h: 2 }));

const image = parseImageData(input, { w: 25, h: 6 });

const x = image.map((layer, i) => { return { i: i, c: layer.map(r => r.filter(p => p === '0').length).reduce((p, c) => p + c) }}).sort((a,b) => (a.c - b.c));

let pickedLayer = image[x[0].i];
let ones = pickedLayer.map(r => r.filter(p => p === '1').length).reduce((p, c) => p + c);
let twos = pickedLayer.map(r => r.filter(p => p === '2').length).reduce((p, c) => p + c);
console.log(ones * twos);

