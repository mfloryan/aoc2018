const fs = require('fs');
let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");

let initialState = "#..#.#..##......###...###";

let rules = [
    '...## => #'.split(" => "),
    '..#.. => #'.split(" => "),
    '.#... => #'.split(" => "),
    '.#.#. => #'.split(" => "),
    '.#.## => #'.split(" => "),
    '.##.. => #'.split(" => "),
    '.#### => #'.split(" => "),
    '#.#.# => #'.split(" => "),
    '#.### => #'.split(" => "),
    '##.#. => #'.split(" => "),
    '##.## => #'.split(" => "),
    '###.. => #'.split(" => "),
    '###.# => #'.split(" => "),
    '####. => #'.split(" => "),
];

function getNextState(currentState, rules) {
    let newState = [];
    for (let i = -2; i < currentState.length + 2; i++) {
        let neighbours = "";
        let currentIndex;
        if (i < 2 || i - 1 > currentState.length) {
            neighbours += ".";
        }
        else { 
            neighbours += currentState[i-2][1];
        }
        if (i < 1 || i > currentState.length) neighbours += "."; else neighbours += currentState[i-1][1];
        if (i < 0 || (i + 1 > currentState.length)) neighbours += "."; else neighbours += currentState[i][1];
        if (i < -1 || i + 2 > currentState.length) neighbours += "."; else neighbours += currentState[i+1][1];
        if (i < -2 || i + 3 > currentState.length) neighbours += "."; else neighbours += currentState[i+2][1];

        if (i < 0 || i > currentState.length-1) currentIndex = i + currentState[0][0]; else {
             currentIndex = currentState[i][0];
        }

        let matchingRule = rules.find(r => r[0] == neighbours);
        if (matchingRule) newState.push([currentIndex, matchingRule[1]]);
        else newState.push([currentIndex, "."]);
        
    }
    return newState;
}

let state = initialState.split("").map((p,i) => [i,p]);

state = input[0].substr(15).split("").map((p,i) => [i,p]);

input.shift();
input.shift();
rules = input.map(i => i.split(" => ")).filter(r => r[1] =="#");

console.log(rules);

let prevState = state.map(_ => _[1]).join("");
let i = 0;
for (i = 0; i < 301; i++) {
    state = getNextState(state, rules);

    let st = state.map(_ => _[1]).join("");
    let j1 = st.indexOf("#");
    let j2 = st.lastIndexOf("#");
    st = st.substring(j1,j2);
    if (st == prevState) {
        console.log("stable");
        break;
    }
    prevState = st;
}

console.log(prevState);

state.forEach( _ => {
    _[0] += (50000000000 - (i+1))
});

let sum = 0;
state.forEach( i => {
    if (i[1] == "#") sum += i[0];
});

console.log(sum);