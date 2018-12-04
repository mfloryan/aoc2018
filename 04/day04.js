const fs = require('fs');

let input = fs.readFileSync('day04-input.txt', {encoding: 'utf8'}).split("\n").sort();

let shifts = [
    '[1518-11-01 00:00] Guard #10 begins shift',
    '[1518-11-01 00:05] falls asleep',
    '[1518-11-01 00:25] wakes up',
    '[1518-11-01 00:30] falls asleep',
    '[1518-11-01 00:55] wakes up',
    '[1518-11-01 23:58] Guard #99 begins shift',
    '[1518-11-02 00:40] falls asleep',
    '[1518-11-02 00:50] wakes up',
    '[1518-11-03 00:05] Guard #10 begins shift',
    '[1518-11-03 00:24] falls asleep',
    '[1518-11-03 00:29] wakes up',
    '[1518-11-04 00:02] Guard #99 begins shift',
    '[1518-11-04 00:36] falls asleep',
    '[1518-11-04 00:46] wakes up',
    '[1518-11-05 00:03] Guard #99 begins shift',
    '[1518-11-05 00:45] falls asleep',
    '[1518-11-05 00:55] wakes up',
];

let guardId = '';

function parseShift(log) {

    let [date, time] = log.substring(1,17).split(" ");
    time = time.split(':');
    let message = log.substring(19)
    if (message.startsWith("Guard")) {
        guardId = message.split(" ")[1];
        message = "shift"
    }
    return {date, min:parseInt(time[1]), guardId, message }
}

let parsedLog = input.map(parseShift);

let agg = {};

let startTime = '';
parsedLog.forEach(e => {
    if (e.message == 'falls asleep') {
        startTime = e.min;
    }
    if (e.message == 'wakes up') {
        if (!agg[e.guardId]) agg[e.guardId] = 0;
        agg[e.guardId] += e.min - startTime;
    }
});

let guard_most_sleeping = Object.entries(agg).sort((a,b) => a[1] - b[1]).pop();

sleepyGuard = parsedLog.filter(e => e.guardId == guard_most_sleeping[0]);

let hour = Array(60).fill(0);
startTime = '';
sleepyGuard.forEach(e => {
    if (e.message == 'falls asleep') {
        startTime = e.min;
    }
    if (e.message == 'wakes up') {
        for (let i = startTime; i < e.min; i++) {
            hour[i]++;
        }
    }  
});

let minuteMostSleptIn = hour.indexOf(Math.max(...hour))

console.log(`Part 1 answer: ${guard_most_sleeping[0]} : ${minuteMostSleptIn} => ${(guard_most_sleeping[0].substring(1) * minuteMostSleptIn)}`);

let matrix = {};
startTime = '';
parsedLog.forEach(e => {
    if (e.message == 'falls asleep') {
        startTime = e.min;
    }
    if (e.message == 'wakes up') {
        if (!matrix[e.guardId]) matrix[e.guardId] = Array(60).fill(0);
        for (let i = startTime; i < e.min; i++) {
            matrix[e.guardId][i]++;
        }
    }
});

let arrayFromMatrix = Object.entries(matrix);

let maxGuardMinute = arrayFromMatrix.map(row => {
    let maxValue = row[1].reduce((a,b) => Math.max(a,b));
    return [row[0], maxValue, row[1].indexOf(maxValue)]
}).sort( (a,b) => a[1] - b[1]).pop();

console.log(`Part 2 answer: ${maxGuardMinute[0]} : ${maxGuardMinute[2]} => ${maxGuardMinute[0].substring(1) * maxGuardMinute[2]}`);
