

function countscores(len) {

    let board = [3,7];

    elfOneIndex = 0;
    elfTwoIndex = 1;

    for (let i =0; i < len+10; i++) {
        newRecipe = board[elfOneIndex] + board[elfTwoIndex];
        board.push(...newRecipe.toString().split("").map(_ => parseInt(_)));

        elfOneIndex = (elfOneIndex + 1 + board[elfOneIndex]) % board.length;
        elfTwoIndex = (elfTwoIndex + 1 + board[elfTwoIndex]) % board.length;

    }

    return board.splice(len,10).join("");
}

console.log(countscores(9) == "5158916779");
console.log(countscores(5) == "0124515891");
console.log(countscores(18) == "9251071085");
console.log(countscores(2018) == "5941429882");

console.log(countscores(209231));