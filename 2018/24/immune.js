const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt', {encoding: 'utf8'}).split("\n");

let input2 = [
    'Immune System:',
    '17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2',
    '989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3',
    '',
    'Infection:',
    '801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1',
    '4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4',
];

function parseArmy(name, input) {
    const lineRe = /(.+) units each with (.+) hit points (\(.*\) ){0,1}with an attack that does (.+) damage at initiative (.+)/;
    let army = {name: name, groups: []};
    let line = input.shift();
    let i = 1;
    while (line && line != "") {
        let data = lineRe.exec(line);
        let group = {
            id: i,
            team: name,
            units : parseInt(data[1]),
            hp: parseInt(data[2]),
            initative: parseInt(data[5]),
            attack: data[4].split(" "),
            weak: [],
            immune: [],
        };
        group.attack[0] = parseInt(group.attack[0]);
        let wi = data[3];
        if (wi) {
            wi = wi.trim().substring(1,wi.length - 2).split(";");
            wi.forEach( x => {
                if (x.trim().startsWith("weak to")) {
                    group.weak = x.trim().substring(8).split(", ");
                } else if (x.trim().startsWith("immune to")) {
                    group.immune = x.trim().substring(10).split(", ");
                }
            });
        }
        army.groups.push(group);
        line = input.shift();
        i++;
    }
    return army;
}

function parseInput(input) {
    let setup = [];
    name = input.shift();
    while (name) {
        let army = parseArmy(name, input);
        setup.push(army);
        name = input.shift();
    }
    return setup;
}

function effectivePower(group) {
    return group.units * group.attack[0];
}

function calculateDamage(attacker, defender) {
    // console.log(`Damage of ${attacker.attack[1]} => i:${defender.immune}, w:${defender.weak}`);
    let damage = effectivePower(attacker);
    let attackType = attacker.attack[1];
    if (defender.immune.some(i => i == attackType)) {
        return 0;
    }
    if (defender.weak.some(i => i == attackType)) {
        return damage * 2;
    }
    return damage;
}

function targetSelection(attacker, defender) {
    let possibleTargets = defender.groups.slice().filter(x => x.units > 0);

    let targetSelection = [];

    let attackOrder = attacker.groups.slice()
        .sort((a,b) => b.initative - a.initative)
        .sort((a,b) => effectivePower(b) - effectivePower(a));

    attackOrder.forEach(a => {
        if (possibleTargets.length > 0) {
            
            possibleTargets
                .sort((a,b) => b.initative - a.initative)
                .sort((a,b) => effectivePower(b) - effectivePower(a))
                .sort((l,r) => calculateDamage(a,r) - calculateDamage(a,l));
            let damage = calculateDamage(a, possibleTargets[0]);

            if (damage > 0) {
                let ts = {a, d: possibleTargets.shift()};
                // console.log(`${ts.a.team} ${ts.a.id} -> ${ts.d.id} ${damage}`);
                targetSelection.push(ts);
            }
        }
    });

    return targetSelection;
}

function fight(armies) {
    let targets = targetSelection(armies[1], armies[0]);
    targets = targets.concat(...targetSelection(armies[0], armies[1]));
    targets.sort((a,b) => b.a.initative - a.a.initative);
    targets.forEach(t => {
        if (t.a.units > 0) {
            let damage = calculateDamage(t.a, t.d);
            let killed = Math.min(Math.floor(damage / t.d.hp), t.d.units);
            t.d.units -= killed;
            console.log(`${t.a.team} ${t.a.id} attacks defending group ${t.d.id}, killing ${killed} units`);
        }
    });
}

let setup = parseInput(input);

function allFights(setup) {
    let areFighting = true;
    let i = 0;
    do {
        i++;
    
        setup.forEach(a => {
            console.log(a.name);
            a.groups.filter(g => g.units >0).forEach(g => {
                console.log(`Group ${g.id} contains ${g.units} units`);
            })
        })
        console.log();
        fight(setup);
        console.log();
        if (i > 10) areFighting = false;
        areFighting = setup.map(a => a.groups.filter(x => x.units > 0).length).filter(x => x > 0).length > 1;
    } while (areFighting)
    
    return setup.flatMap(a => a.groups).reduce((a,c) => a + c.units, 0);
}

console.log(allFights(setup));
