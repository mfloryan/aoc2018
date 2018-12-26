let surroundings = function(point) {
    const coords = [
        {x: 0, y: -1},
        {x: -1, y: 0},
        {x: +1, y: 0},
        {x: 0, y: +1},
    ];
    return coords.map(c => {return {x: c.x + point.x, y: c.y + point.y}});
}

Array.prototype.inReadingOrder = function() {
    return this.slice()
               .sort((a,b) => a.x - b.x)
               .sort((a,b) => a.y - b.y);
};

let isSamePoint = function(a, b) {
    return a.x == b.x && a.y == b.y;
}

let pointEquality = function(a) {
    return (b) => isSamePoint(a,b);
}

class Board {
    constructor(walls, units) {
        this._walls = walls;
        this._units = units;
    }

    get walls() {
        return this._walls;
    }

    get units() {
        return this._units;
    }

    get aliveUnits() {
        return this._units.filter(u => u.hp > 0);
    }

    show() {
        let coords = this.aliveUnits
            .map(u => {return {x:u.x, y:u.y, c: u.type};})
            .concat(this.walls.map(w => { return {x:w.x, y:w.y, c:"#"}}));

        let dim = coords.reduce((a,c) => { 
            return {x: Math.max(a.x, c.x), y: Math.max(a.y, c.y)}
        }, {x:0, y:0});

        let rows = [];
        for (let y = 0; y <= dim.y; y++) {
            let row = "";
            for (let x = 0; x <= dim.x; x++) {
                let point = coords.find(c => c.x == x && c.y == y);
                if (point) row += point.c; else row += ".";
            }
            rows.push(row);
        }
        return rows.join("\n");
    }

    getTotalHitPoints() {
        return this.aliveUnits.reduce((a,c) => a+c.hp, 0);
    }

    moveUnit(unit) {

        if (!this.shouldUnitMove(unit)) return;

        // console.log(`Moving: ${unit.type} from [${unit.x},${unit.y}]`);
        let targets = this.findTargets(unit.type);
        let destinations = this.getDestinations(targets);

        let board = this.distanceFromGivenPoint(unit);

        destinations = destinations.map(d => {
            let distanceToDestination = board.find(pointEquality(d));
            if (distanceToDestination) {
                return {x: d.x, y: d.y, d: distanceToDestination.d}
            } else {
                return {x: d.x, y: d.y, d: -1}
            }
        }).filter(d => d.d > 0)
        .inReadingOrder()
        .sort((a,b) => a.d - b.d);

        if (destinations.length > 0) {
            let destination = destinations[0];
            // console.log(`Moving towards: ${destination.x} - ${destination.y}`);

            let newLocation = this.findFirstStepTowards(destination, unit);
            // console.log(`Next step: ${newLocation.x} - ${newLocation.y}`);
            unit.x = newLocation.x;
            unit.y = newLocation.y;
        }
    }

    attack(unit) {
        let us = surroundings(unit);
        let enemies = this.aliveUnits.filter(u => u.type != unit.type);
    
        if (enemies.length < 1) return false;

        let enemiesAround = enemies.filter(e => us.some(pointEquality(e)));
        if (enemiesAround.length > 0) {
            enemiesAround = enemiesAround.inReadingOrder().sort((a,b) => a.hp - b.hp);
            enemiesAround[0].hp -= 3;
        }
        return true;
    }

    playRound() {
        let units = this.aliveUnits.inReadingOrder();
        // console.log(units.map(u => `${u.type}[${u.x},${u.y}]`).join("-"));

        // console.log(this.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`).join("-"));
        for (let i = 0; i < units.length; i++) {
            let u = units[i];
            if (u.hp > 0) {
                this.moveUnit(u);
                let canAttack = this.attack(u);
                if (!canAttack) {
                    return 1;
                }
            }
        }
        // console.log(this.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`).join("-"));

        return 0;
    }

    shouldUnitMove(unit) {
        let enemies = this.aliveUnits.filter(u => u.type != unit.type);
        return !enemies.some(e => surroundings(unit).some(pointEquality(e)));
    }

    findFirstStepTowards(destination, unit) {
        let board = this.distanceFromGivenPoint(destination)
            .filter(p => surroundings(unit).some(pointEquality(p)))
            .inReadingOrder()
            .sort((a,b) => a.d - b.d);
        return board[0];
    }
    
    findTargets(unitType) {
        return this.aliveUnits.filter(u => u.type != unitType);
    }

    getDestinations(targets) {
        return targets
            .flatMap(surroundings)
            .filter(v => !this.walls.some(u => u.x == v.x && u.y == v.y) )
            .filter(v => !this.aliveUnits.some(u => u.x == v.x && u.y == v.y) );
    }

    distanceFromGivenPoint(point, alreadyCovered = [], distance = 1) {
        let coveredNow = [];

        if (!Array.isArray(point)) {
            point = [{x: point.x, y: point.y, d: 0}];
            coveredNow.push(...point);
        }

        let nextSteps = point.flatMap(surroundings)
            .filter(p => !alreadyCovered.some(pointEquality(p)))
            .filter(p => !this.walls.some(pointEquality(p)))
            .filter(p => !this.aliveUnits.some(pointEquality(p)))
            .map( p => { return {x: p.x, y: p.y, d: distance}});

        let uniqueNextSteps = [];
        nextSteps.forEach(n => {
            if (!uniqueNextSteps.some(pointEquality(n))) uniqueNextSteps.push(n);
        });

        if (uniqueNextSteps.length > 0) {
            coveredNow.push(...uniqueNextSteps);
            let wider = this.distanceFromGivenPoint(uniqueNextSteps, alreadyCovered.concat(coveredNow), distance + 1);
            coveredNow.push(...wider);
        }

        return coveredNow;
    }
}

exports.parseInput = function(input) {
    let walls = [];
    let units = [];

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == '#') walls.push({x, y}); else
            if (input[y][x] == 'G') units.push({x, y, hp: 200, type: "G"}); else
            if (input[y][x] == 'E') units.push({x, y, hp: 200, type: "E"});
        }
    }

   return new Board(walls, units);
}

exports.Board = Board; 

exports.playTheGame = function(cave) {
    let rounds = 0;
    let gameRuns = true;
    let final = 0;
    // console.log(cave.show());
    do {
        rounds++;
        // console.log(rounds);
        final = cave.playRound();
        // console.log(cave.show());
        // console.log();
        gameRuns = (final == 0);
    } while (gameRuns);

    let outcome = cave.getTotalHitPoints() * (rounds - (final));
    return outcome;
}