const fs = require('fs');

let input = fs.readFileSync('input.txt', {encoding: 'utf8'}).split("\n");


let steps = [
'Step C must be finished before step A can begin.',
'Step C must be finished before step F can begin.',
'Step A must be finished before step B can begin.',
'Step A must be finished before step D can begin.',
'Step B must be finished before step E can begin.',
'Step D must be finished before step E can begin.',
'Step F must be finished before step E can begin.',
];

steps = input;

let edges = steps.map(s => { let parts = s.split(" "); return [parts[1], parts[7]]});

console.log(edges);

let graph = {};

edges.forEach(n => {
    if (!graph[n[0]]) {
        graph[n[0]] = [n[1]]
    } else {
        graph[n[0]].push(n[1])
    }
});

let answer = '';

do {

    let nodes = Object.keys(graph);
    let nextNodes = new Set(Object.keys(graph).map(k => graph[k]).flatMap(_ => _));
    let firstNode = nodes.filter(n => !nextNodes.has(n)).sort();

    console.log(graph);

    answer += firstNode[0];
    if (nodes.length == 1) answer+= graph[firstNode[0]].join("");
    delete graph[firstNode[0]];

    console.log(graph);
    console.log('-');

} while (Object.keys(graph).length>0);


console.log(answer);


