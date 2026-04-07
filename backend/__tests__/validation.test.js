/**
 * Tests for the isEmpty validation bug present in:
 *   AuthController.js, MemberController.js, GameController.js
 *
 * Bug: validResult.isEmpty (without parentheses) evaluates to the
 * function reference itself — always truthy — so !validResult.isEmpty
 * is always false and validation is never triggered.
 *
 * Fix: validResult.isEmpty()
 */

describe('express-validator isEmpty() call', () => {
    // Simulates what validationResult() returns
    function makeValidationResult(errors) {
        return {
            isEmpty: function () {
                return errors.length === 0;
            },
            array: function () {
                return errors;
            },
        };
    }

    test('isEmpty without () is always truthy — validation bypass (documents the bug)', () => {
        const resultWithErrors = makeValidationResult([{ msg: 'Email is required' }]);

        // Buggy check: references the function, not its return value
        const buggyCheck = !resultWithErrors.isEmpty;
        expect(buggyCheck).toBe(false); // always false — validation never runs
    });

    test('isEmpty() correctly detects validation errors', () => {
        const resultWithErrors = makeValidationResult([{ msg: 'Email is required' }]);
        expect(resultWithErrors.isEmpty()).toBe(false);
        expect(!resultWithErrors.isEmpty()).toBe(true); // fixed: validation triggers
    });

    test('isEmpty() correctly passes when there are no errors', () => {
        const cleanResult = makeValidationResult([]);
        expect(cleanResult.isEmpty()).toBe(true);
        expect(!cleanResult.isEmpty()).toBe(false); // no errors, no warning sent
    });

    test('error message is accessible after correct isEmpty() check', () => {
        const errors = [{ msg: 'Password too short' }];
        const result = makeValidationResult(errors);

        if (!result.isEmpty()) {
            expect(result.array()[0].msg).toBe('Password too short');
        }
    });
});
