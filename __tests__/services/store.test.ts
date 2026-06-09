// __tests__/services/store.test.ts
// Unit tests for Store purchase logic

// ─── Mirror store.tsx purchase guard logic ────────────────────────────────────
function canPurchaseFreeze(xpBalance: number, freezeCount: number): 
  { allowed: boolean; reason?: string } {
  const cost = 200;
  if (xpBalance < cost) return { allowed: false, reason: 'not_enough_xp' };
  if (freezeCount >= 2) return { allowed: false, reason: 'limit_reached' };
  return { allowed: true };
}

function canPurchaseDoubleXP(xpBalance: number, isActive: boolean): 
  { allowed: boolean; reason?: string } {
  const cost = 100;
  if (xpBalance < cost) return { allowed: false, reason: 'not_enough_xp' };
  if (isActive) return { allowed: false, reason: 'already_active' };
  return { allowed: true };
}

function canPurchaseAmulet(xpBalance: number, isActive: boolean): 
  { allowed: boolean; reason?: string } {
  const cost = 150;
  if (xpBalance < cost) return { allowed: false, reason: 'not_enough_xp' };
  if (isActive) return { allowed: false, reason: 'already_active' };
  return { allowed: true };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Store — Streak Freeze purchase logic', () => {
  describe('canPurchaseFreeze()', () => {
    it('allows purchase with enough XP and under limit', () => {
      expect(canPurchaseFreeze(500, 0)).toEqual({ allowed: true });
    });

    it('denies when XP < 200', () => {
      expect(canPurchaseFreeze(199, 0)).toEqual({ allowed: false, reason: 'not_enough_xp' });
    });

    it('denies at exactly 0 XP', () => {
      expect(canPurchaseFreeze(0, 0)).toEqual({ allowed: false, reason: 'not_enough_xp' });
    });

    it('allows at exactly 200 XP (boundary)', () => {
      expect(canPurchaseFreeze(200, 0)).toEqual({ allowed: true });
    });

    it('denies when freeze count is 2 (cap)', () => {
      expect(canPurchaseFreeze(1000, 2)).toEqual({ allowed: false, reason: 'limit_reached' });
    });

    it('allows at freeze count 1 (second purchase)', () => {
      expect(canPurchaseFreeze(500, 1)).toEqual({ allowed: true });
    });

    it('denies both: low XP AND cap → XP check first', () => {
      expect(canPurchaseFreeze(100, 2)).toEqual({ allowed: false, reason: 'not_enough_xp' });
    });
  });
});

describe('Store — Double XP Boost purchase logic', () => {
  describe('canPurchaseDoubleXP()', () => {
    it('allows purchase with enough XP and not active', () => {
      expect(canPurchaseDoubleXP(200, false)).toEqual({ allowed: true });
    });

    it('denies when XP < 100', () => {
      expect(canPurchaseDoubleXP(99, false)).toEqual({ allowed: false, reason: 'not_enough_xp' });
    });

    it('denies when already active', () => {
      expect(canPurchaseDoubleXP(500, true)).toEqual({ allowed: false, reason: 'already_active' });
    });

    it('allows at exactly 100 XP (boundary)', () => {
      expect(canPurchaseDoubleXP(100, false)).toEqual({ allowed: true });
    });
  });
});

describe('Store — Weekend Amulet purchase logic', () => {
  describe('canPurchaseAmulet()', () => {
    it('allows purchase with enough XP and not active', () => {
      expect(canPurchaseAmulet(200, false)).toEqual({ allowed: true });
    });

    it('denies when XP < 150', () => {
      expect(canPurchaseAmulet(149, false)).toEqual({ allowed: false, reason: 'not_enough_xp' });
    });

    it('denies when already active', () => {
      expect(canPurchaseAmulet(500, true)).toEqual({ allowed: false, reason: 'already_active' });
    });
  });
});
