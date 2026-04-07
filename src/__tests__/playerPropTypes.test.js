/**
 * Tests for the propTypes typo in src/components/games/Player.js.
 *
 * Bug: Player.protTypes instead of Player.propTypes.
 * React reads propTypes (lowercase p) for validation — with the typo,
 * all prop type checking for Player is silently disabled.
 *
 * Fix: Player.protTypes → Player.propTypes
 *
 * NOTE: these tests FAIL on the original buggy code (Player.propTypes === undefined)
 * and PASS after the fix in PR #1 is applied. That's intentional — they act as
 * regression guards.
 */

import React from 'react';
import Player from '../components/games/Player';

describe('Player component — propTypes registration', () => {
    test('Player.propTypes is defined', () => {
        expect(Player.propTypes).toBeDefined();
    });

    test('Player.propTypes includes user', () => {
        expect(Player.propTypes).toHaveProperty('user');
    });

    test('Player.propTypes includes isCurrent', () => {
        expect(Player.propTypes).toHaveProperty('isCurrent');
    });

    test('Player.protTypes (typo) is not defined', () => {
        // If this passes, the typo is fixed and propTypes is set correctly
        expect(Player.protTypes).toBeUndefined();
    });
});
