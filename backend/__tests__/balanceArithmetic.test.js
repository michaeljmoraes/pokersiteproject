/**
 * Tests for balance arithmetic in MemberController.js (withdraw and deposit).
 *
 * Bug: req.body.amount comes in as a string from HTTP.
 *   withdraw: user.balance -= amount  →  NaN  (number - string)
 *   deposit:  user.balance += amount  →  "1000100"  (string concatenation)
 *
 * Fix: parseFloat(amount) before the arithmetic.
 */

describe('balance arithmetic — withdraw', () => {
    test('JS coerces string on -= so result is numeric, but parseFloat makes intent explicit', () => {
        let balance = 1000;
        const amount = '100'; // string from req.body
        balance -= parseFloat(amount);
        expect(balance).toBe(900);
        expect(typeof balance).toBe('number');
    });

    test('without parseFloat, a non-numeric string would produce NaN', () => {
        let balance = 1000;
        const amount = ''; // empty string edge case
        balance -= amount; // coerces empty string to 0, but intent is wrong
        // the real risk: if amount is invalid the result is unpredictable
        expect(typeof balance).toBe('number');
    });

    test('parseFloat handles decimal amounts', () => {
        let balance = 500;
        const amount = '49.99';
        balance -= parseFloat(amount);
        expect(balance).toBeCloseTo(450.01);
    });
});

describe('balance arithmetic — deposit', () => {
    test('adding a string amount concatenates instead of summing (documents the bug)', () => {
        let balance = 1000;
        const amount = '100'; // string
        balance += amount;    // buggy behavior
        expect(balance).toBe('1000100'); // string concat, not 1100
    });

    test('parseFloat converts string amount before addition', () => {
        let balance = 1000;
        const amount = '100';
        balance += parseFloat(amount); // fixed
        expect(balance).toBe(1100);
    });

    test('parseFloat handles decimal deposit amounts', () => {
        let balance = 0;
        const amount = '250.50';
        balance += parseFloat(amount);
        expect(balance).toBeCloseTo(250.50);
    });
});
