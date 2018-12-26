var assert = require('assert');
const bb = require('./rules');

describe('Input', function() {
    describe('parsing', function() {
        it('creates map and units', function() {
      
            let input = [
                '#######',
                '#.G.E.#',
                '#E.G.E#',
                '#.G.E.#',
                '#######',
            ];
            let board = bb.parseInput(input);

            assert.strictEqual(board.units.length, 7);
            assert.strictEqual(board.walls.length, 20);
            assert.strictEqual(board.units.every(u => u.hp == 200), true);
            assert.strictEqual(board.units.filter(u => u.type == 'G').length, 3);
            assert.strictEqual(board.units.filter(u => u.type == 'E').length, 4);
        });
    });
});

describe('Board', function() {
    describe('distances', function() {
        it ('maps distances correctly on empty board', function() {
            let input = [
                '#######',
                '#.....#',
                '#.....#',
                '#.....#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let distances = board.distanceFromGivenPoint({x:1, y:1});

            assert.strictEqual(distances.length, 15);

            let p1 = distances.find(p => p.x == 1 && p.y == 1);
            assert.strictEqual(p1.d, 0);

            p1 = distances.find(p => p.x == 1 && p.y == 2);
            assert.strictEqual(p1.d, 1);

            p1 = distances.find(p => p.x == 5 && p.y == 3);
            assert.strictEqual(p1.d, 6);
        });

        it ('maps only self if no place to move', function() {
            let input = [
                '#######',
                '#.#...#',
                '###...#',
                '#.....#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let distances = board.distanceFromGivenPoint({x:1, y:1});

            assert.strictEqual(distances.length, 1);
            assert.notStrictEqual(distances[0], {x: 1, y: 1, d: 0});
        });
    });

    describe('movement', function() {
        
        it ('with other units', function() {
            let input = [
                '#######',
                '#EE...#',
                '#.E...#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let distances = board.distanceFromGivenPoint({x:1, y:1});

            assert.strictEqual(distances.length, 12);
            
            let p1 = distances.find(p => p.x == 5 && p.y == 3);
            assert.strictEqual(p1.d, 8);
        });

        it('unit moves to correct location', function() {

            let input = [
                '#######',
                '#.E...#',
                '#.....#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);

            board.moveUnit(board.units[0]);

            assert.deepEqual(board.units[0], {x:3, y:1, hp: 200, type: 'E'});
        });


        it('unit moves to correct reachable location', function() {

            let input = [
                '#######',
                '#E..G.#',
                '#...#.#',
                '#.G.#G#',
                '#######',
            ];

            let board = bb.parseInput(input);

            board.moveUnit(board.units[0]);
            assert.deepEqual(board.units[0], {x:2, y:1, hp: 200, type: 'E'});
        });

        it('unit does not move when next to an enemy', function() {
            let input = [
                '#######',
                '#.EG..#',
                '#.....#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);

            board.moveUnit(board.units[0]);

            assert.deepEqual(board.units[0], {x:2, y:1, hp: 200, type: 'E'});
        });

        it('unit moves when next to similar unit', function() {
            let input = [
                '#######',
                '#.EE..#',
                '#.....#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);

            board.moveUnit(board.units[0]);

            assert.deepEqual(board.units[0], {x:2, y:2, hp: 200, type: 'E'});
        });

        it('unit moves when next to dead enemy', function() {
            let input = [
                '#######',
                '#.EG..#',
                '#.....#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            board.units[1].hp = 0;
            board.moveUnit(board.units[0]);

            assert.deepEqual(board.units[0], {x:3, y:1, hp: 200, type: 'E'});
        });

        it('unit does not move if no enemies', function() {
            let input = [
                '#######',
                '#.E...#',
                '#.....#',
                '#...E.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            board.moveUnit(board.units[0]);

            assert.deepEqual(board.units[0], {x:2, y:1, hp: 200, type: 'E'});
        });

        it('sequence of moves', function() {
            let start = [
                '#########',
                '#G..G..G#',
                '#.......#',
                '#.......#',
                '#G..E..G#',
                '#.......#',
                '#.......#',
                '#G..G..G#',
                '#########',
            ];

            let board = bb.parseInput(start);

            board.playRound();

            assert.deepEqual(board.show().split("\n"),[
                '#########',
                '#.G...G.#',
                '#...G...#',
                '#...E..G#',
                '#.G.....#',
                '#.......#',
                '#G..G..G#',
                '#.......#',
                '#########',
            ]);

            board.playRound();

            assert.deepEqual(board.show().split("\n"),[
                '#########',
                '#..G.G..#',
                '#...G...#',
                '#.G.E.G.#',
                '#.......#',
                '#G..G..G#',
                '#.......#',
                '#.......#',
                '#########',
            ]);

            board.playRound();

            assert.deepEqual(board.show().split("\n"),[
                '#########',
                '#.......#',
                '#..GGG..#',
                '#..GEG..#',
                '#G..G...#',
                '#......G#',
                '#.......#',
                '#.......#',
                '#########',
            ]);
        });
    });

    describe('units', function() {
        it('get total units HP', function() {
            let cave = new bb.Board([],[{hp: 100}, {hp: 200}, {hp: 150}]);
            assert.strictEqual(cave.getTotalHitPoints(), 450);
        });

    });

    describe('combat', function() {
        it('elf attack', function() {
            let input = [
                '#######',
                '#G....#',
                '#..G..#',
                '#..EG.#',
                '#..G..#',
                '#...G.#',
                '#######',
            ];

            let board = bb.parseInput(input);

            let goblins = board.units.inReadingOrder().filter(u => u.type == "G");
            goblins[0].hp = 9;
            goblins[1].hp = 4;
            goblins[2].hp = 2;
            goblins[3].hp = 2;
            goblins[4].hp = 1;

            board.attack(board.units.filter(u => u.type == "E")[0]);

            assert.strictEqual(board.aliveUnits.length, 5);
            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(9)', 'G(4)', 'E(200)', 'G(2)', 'G(1)']
            );
            
        });

        it('simple combat sequence', function() {

            let input = [
                '#######',
                '#.G...#',
                '#...EG#',
                '#.#.#G#',
                '#..G#E#',
                '#.....#',
                '#######',
            ];

            let board = bb.parseInput(input);
            assert.strictEqual(board.units.every(u => u.hp == 200), true);

            board.playRound();

            assert.deepEqual(board.show().split("\n"),[
                '#######',
                '#..G..#',
                '#...EG#',
                '#.#G#G#',
                '#...#E#',
                '#.....#',
                '#######',
            ]);

            assert.notStrictEqual(
                board.units.slice().inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(200)', 'E(197)', 'G(197)', 'G(200)', 'G(197)', 'E(197)']
            );

            board.playRound();

            assert.deepEqual(board.show().split("\n"),[
                '#######',
                '#...G.#',
                '#..GEG#',
                '#.#.#G#',
                '#...#E#',
                '#.....#',
                '#######',
            ]);

            assert.deepEqual(
                board.units.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(200)', 'G(200)', 'E(188)', 'G(194)', 'G(194)', 'E(194)']
            );

        });

    });

    describe('full game', function() {
        it('corner case from Par', function() {
            let input = [
                '####',
                '##E#',
                '#GG#',
                '####',
            ];
            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.strictEqual(result, 13400);
        });

        it('sample combat 47', function() {

            let input = [
                '#######',
                '#.G...#',
                '#...EG#',
                '#.#.#G#',
                '#..G#E#',
                '#.....#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.strictEqual(result, 27730);
        });

        it('sample combat 37', function() {

            let input = [
                '#######',
                '#G..#E#',
                '#E#E.E#',
                '#G.##.#',
                '#...#E#',
                '#...E.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.deepEqual(board.show().split("\n"),[
                '#######',
                '#...#E#',
                '#E#...#',
                '#.E##.#',
                '#E..#E#',
                '#.....#',
                '#######',
            ]);

            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['E(200)', 'E(197)', 'E(185)', 'E(200)', 'E(200)']
            );

            assert.strictEqual(result, 36334);
        });

        it('sample combat 46', function() {

            let input = [
                '#######',
                '#E..EG#',
                '#.#G.E#',
                '#E.##E#',
                '#G..#.#',
                '#..E#.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['E(164)', 'E(197)', 'E(200)', 'E(98)', 'E(200)']
            );

            assert.strictEqual(result, 39514);
        });

        it('sample combat 35', function() {

            let input = [
                '#######',
                '#E.G#.#',
                '#.#G..#',
                '#G.#.G#',
                '#G..#.#',
                '#...E.#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(200)', 'G(98)', 'G(200)', 'G(95)', 'G(200)']
            );

            assert.strictEqual(result, 27755);
        });

        it('sample combat 54', function() {
            let input = [
                '#######',
                '#.E...#',
                '#.#..G#',
                '#.###.#',
                '#E#G#G#',
                '#...#G#',
                '#######',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(200)', 'G(98)', 'G(38)', 'G(200)']
            );

            assert.strictEqual(result, 28944);
        });


        it('sample combat 20', function() {
            let input = [
                '#########',
                '#G......#',
                '#.E.#...#',
                '#..##..G#',
                '#...##..#',
                '#...#...#',
                '#.G...G.#',
                '#.....G.#',
                '#########',
            ];

            let board = bb.parseInput(input);
            let result = bb.playTheGame(board);

            assert.deepEqual(
                board.aliveUnits.inReadingOrder().map(u => `${u.type}(${u.hp})`),
                ['G(137)', 'G(200)', 'G(200)', 'G(200)', 'G(200)']
            );
            
            assert.deepEqual(board.show().split("\n"),[
                '#########',
                '#.G.....#',
                '#G.G#...#',
                '#.G##...#',
                '#...##..#',
                '#.G.#...#',
                '#.......#',
                '#.......#',
                '#########',
            ]);

            assert.strictEqual(result, 18740);
        });

    });

    describe('modified HP games', function() {
        it('example one', function() {

            let input = [
                '#######',
                '#.G...#',
                '#...EG#',
                '#.#.#G#',
                '#..G#E#',
                '#.....#',
                '#######',
            ];

            let board = bb.parseInput(input, {E: 15, G: 3});
            let result = bb.playTheGame(board);

            assert.strictEqual(result, 4988);
        });
    });

});
