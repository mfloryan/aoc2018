let input = "439 players; last marble is worth 71307 points";

class Ring {
    constructor() {
        this.current = undefined;
    }

    addNextToCurrent(value) {
        let n = {value: value};
        if (!this.current) {
            n.left = n;
            n.right = n;
        } else {
            n.left = this.current;
            n.right = this.current.right;
            n.right.left = n;
            this.current.right = n;
        }
        this.current = n;
    }

    moveLeft(n) {
        for (let i = 0; i < n; i++) {
            this.current = this.current.left;
        }
    }

    moveRight(n) {
        for (let i = 0; i < n; i++) {
            this.current = this.current.right;
        }
    }

    removeCurrent() {
        let value = this.current.value;
        this.current.left.right = this.current.right;
        this.current.right.left = this.current.left;
        this.current = this.current.right;
        return value;
    }

    show() {
        let ring = [];
        let start = this.current;
        let next = start;
        do {
            ring.push(next.value);
            next = next.right;
        } while (next !== start)
        console.log(ring.join(" "));
    }

    showRight() {
        let ring = [];
        let start = this.current;
        let next = start;
        do {
            ring.push(next.value);
            next = next.left;
        } while (next !== start)
        console.log(ring.join(" "));
    }
}

function playTheGame(numberOfElfs, lastMarble) {

    let elfScores = new Array(numberOfElfs).fill(0);

    let r = new Ring();
    r.addNextToCurrent(0);

    for (let i=1; i <= lastMarble; i++) {
        let currentElf = (i%numberOfElfs);

        if (i % 23 == 0) {
            elfScores[currentElf] += i;
            r.moveLeft(7);
            elfScores[currentElf] += r.removeCurrent();
        } else {
            r.moveRight(1);
            r.addNextToCurrent(i);
        }
    }
    return elfScores.reduce((a,c) => Math.max(a,c),0)
}

console.log(playTheGame(9, 25) == 32);

console.log(playTheGame(10, 1618)== 8317);
console.log(playTheGame(13, 7999)== 146373);
console.log(playTheGame(17, 1104)== 2764);
console.log(playTheGame(21, 6111)== 54718);
console.log(playTheGame(30, 5807)== 37305);

console.log("Part 1:");
console.log(playTheGame(439,71307));
console.log("Part 2:");
console.log(playTheGame(439,100*71307));
