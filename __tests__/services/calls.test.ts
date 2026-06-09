// __tests__/services/calls.test.ts
// Unit tests for billing logic in calls.ts

// ─── Pure logic extracted for testing ─────────────────────────────────────────
// (mirrors the logic in src/services/calls.ts without Supabase dependency)

function calcBilledMinutes(durationSeconds: number, billingMultiplier: number): number {
  return Math.ceil((durationSeconds / 60) * billingMultiplier);
}

function calcNewBalance(currentBalance: number, billedMinutes: number): number {
  return Math.max(0, currentBalance - billedMinutes);
}

function calcCallCost(type: 'private' | 'group', estimatedMinutes: number): number {
  return type === 'private' ? estimatedMinutes * 2 : estimatedMinutes;
}

function hasEnoughBalance(balance: number, type: 'private' | 'group', estimatedMinutes: number): boolean {
  return balance >= calcCallCost(type, estimatedMinutes);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('calls.ts — billing logic', () => {

  describe('calcBilledMinutes()', () => {
    it('private call: 60s = 1 billed minute at 2x multiplier', () => {
      expect(calcBilledMinutes(60, 2.0)).toBe(2);
    });

    it('group call: 60s = 1 billed minute at 1x multiplier', () => {
      expect(calcBilledMinutes(60, 1.0)).toBe(1);
    });

    it('rounds UP partial minutes (61s group = 2 mins)', () => {
      expect(calcBilledMinutes(61, 1.0)).toBe(2);
    });

    it('rounds UP partial minutes private (31s = 2 mins billed)', () => {
      // 31s / 60 = 0.517 * 2 = 1.033 → ceil = 2
      expect(calcBilledMinutes(31, 2.0)).toBe(2);
    });

    it('0 second call = 0 billed minutes', () => {
      expect(calcBilledMinutes(0, 2.0)).toBe(0);
    });

    it('30 min session private = 60 billed minutes', () => {
      expect(calcBilledMinutes(1800, 2.0)).toBe(60);
    });

    it('30 min session group = 30 billed minutes', () => {
      expect(calcBilledMinutes(1800, 1.0)).toBe(30);
    });
  });

  describe('calcNewBalance()', () => {
    it('deducts billed minutes from balance', () => {
      expect(calcNewBalance(120, 30)).toBe(90);
    });

    it('NEVER goes below 0 (insufficient balance edge case)', () => {
      expect(calcNewBalance(5, 10)).toBe(0);
    });

    it('exact deduction: balance=10, billed=10 → 0', () => {
      expect(calcNewBalance(10, 10)).toBe(0);
    });

    it('zero balance stays zero', () => {
      expect(calcNewBalance(0, 5)).toBe(0);
    });
  });

  describe('hasEnoughBalance() — checkMinutesBalance logic', () => {
    it('private call costs 2x: balance=10, need 6min → false (costs 12)', () => {
      expect(hasEnoughBalance(10, 'private', 6)).toBe(false);
    });

    it('group call costs 1x: balance=10, need 6min → true (costs 6)', () => {
      expect(hasEnoughBalance(10, 'group', 6)).toBe(true);
    });

    it('exact balance for private: balance=12, need 6min private → true', () => {
      expect(hasEnoughBalance(12, 'private', 6)).toBe(true);
    });

    it('zero balance → always false', () => {
      expect(hasEnoughBalance(0, 'group', 1)).toBe(false);
    });

    it('1 minute private call requires 2 balance minutes', () => {
      expect(hasEnoughBalance(1, 'private', 1)).toBe(false);
      expect(hasEnoughBalance(2, 'private', 1)).toBe(true);
    });
  });
});
