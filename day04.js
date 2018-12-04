const fs = require('fs');

let input = fs.readFileSync('day04-input.txt', {encoding: 'utf8'}).split("\n").sort();

// console.log(input);

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
    date = date.split('-');
    time = time.split(':');
    let message = log.substring(19)
    if (message.startsWith("Guard")) {
        guardId = message.split(" ")[1];
        message = "shift"
    }
    return {date, y: date[0], 'm': date[1], d: date[2], hour: time[0], min:parseInt(time[1]), guardId, message }
}

let parsedLog = input.map(parseShift);

// console.log(parsedLog);

let agg = [];

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

console.log(agg);

let hour = Array(60).fill(0);

sleepyGuard = parsedLog.filter(e => e.guardId == "#523");

startTime = '';
sleepyGuard.forEach(e => {
    if (e.message == 'falls asleep') {
        startTime = e.min;
    }
    if (e.message == 'wakes up') {
        // console.log(`${startTime} -> ${e.min}`);
        for (let i = startTime; i < e.min; i++) {
            hour[i]++;
        }
    }  
});

// hour.forEach((v,i) => console.log(`${i}: ${v}`));

console.log(hour.indexOf(Math.max(...hour)));