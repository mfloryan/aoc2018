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

class Graph {
    constructor(edges) {
        this.g = {};
        
        edges.forEach(n => {
            if (!this.g[n[0]]) {
                this.g[n[0]] = [n[1]];
            } else {
                this.g[n[0]].push(n[1]);
            }
        });
    }

    get graph() {
        return this.g;
    }

    getNext() {
        let nodes = Object.keys(this.g);
        if (nodes.length == 0) return undefined;
        
        let nextNodes = new Set(Object.keys(this.g).map(k => this.graph[k]).flatMap(_ => _));
        let firstNode = nodes.filter(n => !nextNodes.has(n)).sort();
        return firstNode;
    }

    remove(node) {
        if (Object.keys(this.g).length == 1) this.g[node].forEach(n => this.g[n] = []);
        delete this.g[node];
    }
}

function duration(node) {
    return node.charCodeAt(0)-4;
}

let g = new Graph(edges);

console.log(g.graph);

let workers = 5;

let time = 0;
let done = false;

let work = [];

do {
    work.forEach(w => w.d--);

    work.filter(w => w.d == 0).forEach(w => { g.remove(w.n); });
    work = work.filter(w => w.d != 0);

    if (work.length < workers) {
        let newTask = g.getNext();
        if (newTask) {
            let newTasksNotInProgress = newTask.filter(t => !work.map(w => w.n).includes(t));
            while (work.length < workers && newTasksNotInProgress.length > 0) {
                let task = newTasksNotInProgress.shift();
                work.push({n: task, d: duration(task)});
            }
        }
    }

    console.log(work);

    if (work.length == 0) done = true;
    time++;
} while (!done);

console.log(time);
