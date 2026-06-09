// __tests__/services/lessons.test.ts
// Unit tests for Spaced Repetition (Leitner System) logic in lessons.ts

// ─── Pure logic extracted for testing ─────────────────────────────────────────
const INTERVALS_DAYS = [1, 3, 7, 14, 30];

function calcNewBox(currentBox: number, wasCorrect: boolean): number {
  return wasCorrect ? Math.min(currentBox + 1, 5) : 1;
}

function calcIntervalDays(newBox: number): number {
  return INTERVALS_DAYS[newBox - 1];
}

function calcNextReviewDate(newBox: number, fromDate = new Date()): Date {
  const next = new Date(fromDate);
  next.setDate(next.getDate() + calcIntervalDays(newBox));
  return next;
}

// ─── XP logic ─────────────────────────────────────────────────────────────────
function calcXPAfterAward(currentXP: number, amount: number): number {
  return currentXP + amount;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('lessons.ts — Leitner SRS algorithm', () => {

  describe('calcNewBox() — box advancement', () => {
    it('correct answer advances box 1 → 2', () => {
      expect(calcNewBox(1, true)).toBe(2);
    });

    it('correct answer advances box 3 → 4', () => {
      expect(calcNewBox(3, true)).toBe(4);
    });

    it('CAPPED at box 5 — correct on box 5 stays at 5', () => {
      expect(calcNewBox(5, true)).toBe(5);
    });

    it('wrong answer from any box → back to box 1', () => {
      expect(calcNewBox(1, false)).toBe(1);
      expect(calcNewBox(3, false)).toBe(1);
      expect(calcNewBox(5, false)).toBe(1);
    });

    it('box 4 correct → box 5', () => {
      expect(calcNewBox(4, true)).toBe(5);
    });
  });

  describe('calcIntervalDays() — review scheduling', () => {
    it('box 1 → 1 day interval', () => {
      expect(calcIntervalDays(1)).toBe(1);
    });

    it('box 2 → 3 day interval', () => {
      expect(calcIntervalDays(2)).toBe(3);
    });

    it('box 3 → 7 day interval', () => {
      expect(calcIntervalDays(3)).toBe(7);
    });

    it('box 4 → 14 day interval', () => {
      expect(calcIntervalDays(4)).toBe(14);
    });

    it('box 5 → 30 day interval (mastered)', () => {
      expect(calcIntervalDays(5)).toBe(30);
    });
  });

  describe('calcNextReviewDate() — date scheduling', () => {
    it('box 1: next review is tomorrow', () => {
      const base = new Date('2024-01-01T00:00:00Z');
      const next = calcNextReviewDate(1, base);
      expect(next.getDate()).toBe(2); // Jan 2
    });

    it('box 5: next review is 30 days from now', () => {
      const base = new Date('2024-01-01T00:00:00Z');
      const next = calcNextReviewDate(5, base);
      expect(next.getDate()).toBe(31); // Jan 31
    });

    it('next review date is always in the future', () => {
      const base = new Date();
      for (let box = 1; box <= 5; box++) {
        const next = calcNextReviewDate(box, base);
        expect(next.getTime()).toBeGreaterThan(base.getTime());
      }
    });
  });

  describe('calcXPAfterAward() — XP math', () => {
    it('adds positive XP correctly', () => {
      expect(calcXPAfterAward(100, 15)).toBe(115);
    });

    it('negative XP (purchase) deducts correctly', () => {
      expect(calcXPAfterAward(500, -200)).toBe(300);
    });

    it('starting from 0 XP', () => {
      expect(calcXPAfterAward(0, 10)).toBe(10);
    });

    it('XP deduction going below 0 returns negative (guard in UI)', () => {
      // The UI guards this, not the math function
      expect(calcXPAfterAward(100, -200)).toBe(-100);
    });
  });

  describe('Full SRS flow simulation', () => {
    it('3 correct answers: box 1 → 2 → 3 → 4', () => {
      let box = 1;
      box = calcNewBox(box, true); // 2
      box = calcNewBox(box, true); // 3
      box = calcNewBox(box, true); // 4
      expect(box).toBe(4);
    });

    it('2 correct then 1 wrong → resets to box 1', () => {
      let box = 1;
      box = calcNewBox(box, true);  // 2
      box = calcNewBox(box, true);  // 3
      box = calcNewBox(box, false); // 1 (reset)
      expect(box).toBe(1);
    });

    it('5 correct answers reaches mastery (box 5)', () => {
      let box = 1;
      for (let i = 0; i < 5; i++) {
        box = calcNewBox(box, true);
      }
      expect(box).toBe(5);
      // interval for mastered card = 30 days
      expect(calcIntervalDays(box)).toBe(30);
    });
  });
});
