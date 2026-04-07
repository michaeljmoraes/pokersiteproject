/**
 * Tests for API path correctness in src/utils/axios.js.
 *
 * Bug: withdraw, deposit, getWithdraw, getDeposit were using './api/...'
 * instead of '/api/...'. With axios baseURL configured, the dot causes
 * the path to resolve relatively — all wallet requests fail silently.
 *
 * Fix: remove the leading dot from all four paths.
 *
 * NOTE: these tests FAIL on the original buggy code (paths start with './')
 * and PASS after the fix in PR #1 is applied. That's intentional — they act
 * as regression guards.
 */

import { API_ACCOUNT, API_AUTH, API_GAME } from '../utils/axios';

describe('API_ACCOUNT paths', () => {
    test('withdraw path starts with /api/ not ./api/', () => {
        expect(API_ACCOUNT.withdraw).toBe('/api/account/withdraw');
        expect(API_ACCOUNT.withdraw.startsWith('./')).toBe(false);
    });

    test('deposit path starts with /api/ not ./api/', () => {
        expect(API_ACCOUNT.deposit).toBe('/api/account/deposit');
        expect(API_ACCOUNT.deposit.startsWith('./')).toBe(false);
    });

    test('getWithdraw path starts with /api/ not ./api/', () => {
        expect(API_ACCOUNT.getWithdraw).toBe('/api/account/getWithdraw');
        expect(API_ACCOUNT.getWithdraw.startsWith('./')).toBe(false);
    });

    test('getDeposit path starts with /api/ not ./api/', () => {
        expect(API_ACCOUNT.getDeposit).toBe('/api/account/getDeposit');
        expect(API_ACCOUNT.getDeposit.startsWith('./')).toBe(false);
    });

    test('all API_ACCOUNT paths are absolute (start with /)', () => {
        Object.values(API_ACCOUNT).forEach(path => {
            expect(path.startsWith('/')).toBe(true);
        });
    });
});

describe('API_AUTH paths — sanity check', () => {
    test('all API_AUTH paths are absolute', () => {
        Object.values(API_AUTH).forEach(path => {
            expect(path.startsWith('/')).toBe(true);
        });
    });
});

describe('API_GAME paths — sanity check', () => {
    test('all API_GAME paths are absolute', () => {
        Object.values(API_GAME).forEach(path => {
            expect(path.startsWith('/')).toBe(true);
        });
    });
});
