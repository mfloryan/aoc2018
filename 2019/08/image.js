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

const x = image.map((layer, i) => { return { i: i, c: layer.map(r => r.filter(p => p === '0').length).reduce((p, c) => p + c) } ;}).sort((a, b) => (a.c - b.c));

const pickedLayer = image[x[0].i];
const ones = pickedLayer.map(r => r.filter(p => p === '1').length).reduce((p, c) => p + c);
const twos = pickedLayer.map(r => r.filter(p => p === '2').length).reduce((p, c) => p + c);
console.log(ones * twos);

function renderImage (image) {
  const finalImage = [];

  for (let x = 0; x < image[0].length; x++) {
    const newRow = [];
    const row = image[0][x];
    for (let y = 0; y < row.length; y++) {
      const collectedLayers = image.map(i => i[x][y]).reduce((p, c) => p === '2' ? c : p, '2');
      newRow.push(collectedLayers);
    }
    finalImage.push(newRow);
  }
  return finalImage;
}

const finalImage = renderImage(image);

console.log(finalImage.map(r => r.map(p => p === '0' ? ' ' : '■').join('')).join('\n'));
