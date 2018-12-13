const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

// input = [
//     "/->-\\        ",
//     '|   |  /----\\',
//     "| /-+--+-\\  |",
//     "| | |  | v  |",
//     "\\-+-/  \\-+--/",
//     "  \\------/ ",
// ];

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

// ><^v
const directionCycle = [
    { '>':'^', 'v':'>', '<':'v', '^':'<'}, //turn left
    { '>':'>', 'v':'v', '<':'<', '^':'^'}, //straight
    { '>':'v', 'v':'<', '<':'^', '^':'>'}, //turn right
];

const turns = {
    '\\' : {'<' : '^', '^' : '<', '>' : 'v', 'v': '>'},
    '/'  : {'<' : 'v', '^' : '>', '>' : '^', 'v': '<'},
};

function moveCarts(map, carts) {

    function moveSingleCart(map, cart) {
        switch(cart.direction) {
            case '>':
                cart.c++;
                break;
            case '<':
                cart.c--;
                break;
            case '^':
                cart.r--;
                break;
            case 'v':
                cart.r++;
                break;
        }
        return map[cart.r][cart.c];
    }

    function turnSingleCart(nextTrackForCart, cart) {
        switch (nextTrackForCart) {
            case '\\':
            case '/':
                cart.direction = turns[nextTrackForCart][cart.direction];
                break;
            case '+':
                cart.direction = directionCycle[cart.state][cart.direction];
                cart.state = (cart.state + 1) % 3;
                break;
        }
    }

    function isCrash(carts) {
        for (let i=0; i < carts.length; i++) {
            for (let j=i+1; j< carts.length; j++) {
                if (carts[i].r == carts[j].r && carts[i].c == carts[j].c) {
                    console.log(`X: ${carts[i].c},${carts[i].r}`);
                    return true;
                }
            }
        }
    }

    carts.sort((a,b) => a.r - b.r).sort((a,b) => a.c - b.c);

    for (let i =0; i < carts.length; i++) {
        let c = carts[i];

        turnSingleCart(
            moveSingleCart(map, c), c);

        if (isCrash(carts)) return;
    };

    return carts;
}

let [map, carts] = getCartsAndMap(input.map(r => r.split("")));

console.log( map.map(x=>x.join("")).join("\n") );

let crash = false;
let tick = 0;
do {
    carts = moveCarts(map, carts);
    if (!carts) {
        crash = true;
    }
    tick++;
} while (!crash)
