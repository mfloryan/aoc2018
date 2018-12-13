const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

// input = [
//     '/>-<\\  ',
//     '|   |  ',
//     '| /<+-\\',
//     '| | | v',
//     '\\>+</ |',
//     '  |   ^',
//     '  \\<->/',
// ];

// ><^v
const directionCycle = [
    { '>':'^', 'v':'>', '<':'v', '^':'<'}, //turn left
    { '>':'>', 'v':'v', '<':'<', '^':'^'}, //straight
    { '>':'v', 'v':'<', '<':'^', '^':'>'}, //turn right
];

function getCartsAndMap(snapshot) {

    let map = [];
    let carts = [];
    let rowIndex = 0;
    let columnIndex = 0;
    snapshot.forEach( r => {
        let row = [];
        columnIndex =0;
        r.forEach( point => {
            
            switch(point) {
                case '>':
                case '<':
                    carts.push({r:rowIndex, c: columnIndex, direction: point, state: 0});
                    row.push("-");
                    break;
                case '^':
                case 'v':
                    carts.push({r:rowIndex, c: columnIndex, direction: point, state: 0});
                    row.push("|");
                break;
                default:
                    row.push(point);
                }

            columnIndex++;
        });
        map.push(row);
        rowIndex++;
    });
    return [map, carts];
}

function moveCarts(map, carts) {
    carts.sort((a,b) => a.r - b.r).sort((a,b) => a.c - b.c);
    let newCarts = [];

    for (let i =0; i < carts.length; i++) {
        let c = carts[i];        

        if (!c.crashed) {
            let nextTrackForCart;
            // move
            switch(c.direction) {
                case '>':
                    nextTrackForCart = map[c.r][c.c+1];
                    c.c++;
                    break;
                case '<':
                    nextTrackForCart = map[c.r][c.c-1];
                    c.c--;
                    break;
                case '^':
                    nextTrackForCart = map[c.r-1][c.c];
                    c.r--;
                    break;
                case 'v':
                    nextTrackForCart = map[c.r+1][c.c];
                    c.r++;
                    break;
            }

            if (nextTrackForCart == " ") console.error(" Off track!");

            //turn
            switch (nextTrackForCart) {
                case '\\':
                    if (c.direction == ">") c.direction = 'v'; else
                    if (c.direction == "v") c.direction = '>'; else
                    if (c.direction == "<") c.direction = '^'; else
                    if (c.direction == "^") c.direction = '<';
                    break;
                case '/':
                    if (c.direction == ">") c.direction = '^'; else
                    if (c.direction == "v") c.direction = '<'; else
                    if (c.direction == "<") c.direction = 'v'; else
                    if (c.direction == "^") c.direction = '>';
                    break;
                case '+':
                    c.direction = directionCycle[c.state][c.direction];
                    c.state = (c.state + 1) % 3;
                    break;
            }
            markCrash(carts);
        }
        newCarts.push(c);
    };

    return newCarts.filter(c => !c.crashed);
}

let [map, carts] = getCartsAndMap(input.map(r => r.split("")));

console.log(
    map.map(x=>x.join("")).join("\n")  
);

function markCrash(carts) {
    for (let i=0; i < carts.length; i++) {
        for (let j=i+1; j< carts.length; j++) {
            if (carts[i].crashed || carts[j].crashed) continue;
            if (carts[i].r == carts[j].r && carts[i].c == carts[j].c) {
                console.log(`X: ${carts[i].c},${carts[i].r}`);
                carts[i].crashed = true;
                carts[j].crashed = true;
                return true;
            }
        }
    }
}

console.log(carts);

let enoughCarts = true;
let tick = 0;
do {
    carts = moveCarts(map, carts);
    if (carts.length < 2) enoughCarts = false;
    tick++;
} while (enoughCarts);

console.log(`${carts[0].c},${carts[0].r}`);
