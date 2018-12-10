let input = "439 players; last marble is worth 71307 points";

function playTheGame(numberOfElfs, lastMarble) {

    let elfScores = new Array(numberOfElfs).fill(0);
    let board = [0];

    let currentMarblePosition = 0;

    console.log(lastMarble);
    let start = Date.now();
    let percent = 0;

    for (let i=1; i <= lastMarble; i++) {
        if (i%(lastMarble/100) == 0) {
            console.log(`${percent++}% time: ${Date.now() - start} ms \t i: ${i}`);
            start = Date.now();
        }
        let currentElf = (i%numberOfElfs);

        if (i % 23 == 0) {
            elfScores[currentElf] += i;
            let removeMarble = ((currentMarblePosition-7) % board.length);
            if (removeMarble < 0) removeMarble = board.length + removeMarble;
            elfScores[currentElf] += board.splice(removeMarble+1, 1)[0];
            currentMarblePosition = removeMarble;
        } else {
            let insertBeforeIndex = ((currentMarblePosition + 2) % board.length);
            currentMarblePosition = insertBeforeIndex;
            board.splice(insertBeforeIndex+1, 0, i);
        }
    }
    return elfScores.reduce((a,c) => Math.max(a,c),0)
}

// console.log(playTheGame(9, 25) == 32);
// console.log(playTheGame(10, 1618)== 8317);
// console.log(playTheGame(13, 7999)== 146373);
// console.log(playTheGame(17, 1104)== 2764);
// console.log(playTheGame(21, 6111)== 54718);
// console.log(playTheGame(30, 5807)== 37305);

console.log("Part 1:");
console.log(playTheGame(439,71307));
console.log("Part 2:");
console.log(playTheGame(439,100*71307));
