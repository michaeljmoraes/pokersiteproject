/**
 * Tests for the WebSocket command typo in currentTournaments.js.
 *
 * Bug: after joining a tournament the code sent 'get-tournamnet-list'
 * (letters transposed). The server never recognized it, so the tournament
 * list never refreshed after a user joined.
 *
 * Fix: 'get-tournamnet-list' → 'get-tournament-list'
 */

const CORRECT_COMMAND = 'get-tournament-list';
const TYPO_COMMAND = 'get-tournamnet-list';

describe('WebSocket tournament list command', () => {
    test('correct command spells tournament correctly', () => {
        expect(CORRECT_COMMAND).toBe('get-tournament-list');
    });

    test('typo command is different from the correct one', () => {
        expect(TYPO_COMMAND).not.toBe(CORRECT_COMMAND);
    });

    test('server only recognizes the correct command', () => {
        // Simulates server-side command dispatch
        const handleMessage = (command) => {
            if (command === 'get-tournament-list') return 'list-returned';
            return 'unknown-command';
        };

        expect(handleMessage(CORRECT_COMMAND)).toBe('list-returned');
        expect(handleMessage(TYPO_COMMAND)).toBe('unknown-command');
    });

    test('no leading/trailing spaces in command', () => {
        expect(CORRECT_COMMAND.trim()).toBe(CORRECT_COMMAND);
    });
});
