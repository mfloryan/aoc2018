
function countscores(len) {
    let board = [3,7];

    elfOneIndex = 0;
    elfTwoIndex = 1;

    for (let i =0; i < len + 10; i++) {
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

console.log("Part one: ");
console.log(countscores(209231));

function findInputLocation(input) {
    let board = [3, 7];

    elfOneIndex = 0;
    elfTwoIndex = 1;

    let found = false;

    let i = 0;
    let tail = "";
    do {
        newRecipe = board[elfOneIndex] + board[elfTwoIndex];
        board.push(...newRecipe.toString().split("").map(_ => parseInt(_)));

        elfOneIndex = (elfOneIndex + 1 + board[elfOneIndex]) % board.length;
        elfTwoIndex = (elfTwoIndex + 1 + board[elfTwoIndex]) % board.length;

        tail += newRecipe;

        let isInString = tail.indexOf(input);
        if (isInString >= 0) {
            found = true;
            return board.length - tail.length + isInString;
        }

        if (tail.length > input.length) tail = tail.substr(tail.length - input.length);

        i++;
    } while (!found)
}

console.log(findInputLocation("51589") == 9);
console.log(findInputLocation("01245") == 5);
console.log(findInputLocation("92510") == 18);
console.log(findInputLocation("59414") == 2018);

console.log("Part two:")
console.log(findInputLocation("209231"));
