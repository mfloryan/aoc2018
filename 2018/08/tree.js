const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

let data = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2".split(" ").map(i => parseInt(i));

data = input[0].split(" ").map(i => parseInt(i));

function parseNode(input) {
    let children = input.shift();
    let metadata = input.shift();
    
    let node = { c : [], m: []};

    for (let i =0; i < children; i++) {
        node.c.push(parseNode(input));
    }

    for (let j=0; j < metadata; j++) {
        node.m.push(input.shift());
    }

    return node;
}

let tree = parseNode(data);

function sumMetadata(tree) {
    let sum = 0;
    tree.c.forEach(n => sum += sumMetadata(n));
    sum += tree.m.reduce((a,c) => a+c,0);
    return sum;
}

console.log('Part one: ' + sumMetadata(tree));

function valueOfNode(node) {
    if (node.c.length < 1) {
        return node.m.reduce((a,c) => a+c,0);
    }

    let value = 0;
    node.m.forEach(m => {
        if (node.c[m-1]) value += valueOfNode(node.c[m-1]);
    });
    return value;
}

console.log('Part two: ' + valueOfNode(tree));