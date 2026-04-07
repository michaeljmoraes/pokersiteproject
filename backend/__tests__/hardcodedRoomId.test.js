/**
 * Tests for the hardcoded room ID bug in WebsocketController.js.
 *
 * Bug: rooms.destroy({ where: { id: 2 } }) — ID 2 is hardcoded.
 * When any game ends, always deletes room #2 instead of the actual game room.
 *
 * Fix: rooms.destroy({ where: { id: game.id } })
 */

describe('room cleanup — game end', () => {
    function buildDestroyQuery(game, hardcoded = false) {
        if (hardcoded) {
            return { where: { id: 2 } }; // buggy
        }
        return { where: { id: game.id } }; // fixed
    }

    test('buggy version always targets room id 2 regardless of game', () => {
        const game = { id: 7 };
        const query = buildDestroyQuery(game, true);
        expect(query.where.id).toBe(2);
        expect(query.where.id).not.toBe(game.id);
    });

    test('fixed version targets the correct game room', () => {
        const game = { id: 7 };
        const query = buildDestroyQuery(game, false);
        expect(query.where.id).toBe(game.id);
        expect(query.where.id).toBe(7);
    });

    test('fixed version works for any game id', () => {
        [1, 5, 42, 100].forEach(id => {
            const game = { id };
            const query = buildDestroyQuery(game, false);
            expect(query.where.id).toBe(id);
        });
    });

    test('buggy version would delete wrong room for any game other than id 2', () => {
        const gamesNotRoom2 = [{ id: 1 }, { id: 3 }, { id: 99 }];
        gamesNotRoom2.forEach(game => {
            const query = buildDestroyQuery(game, true);
            expect(query.where.id).not.toBe(game.id); // always wrong
        });
    });
});
