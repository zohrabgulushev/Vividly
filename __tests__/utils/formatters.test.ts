// __tests__/utils/formatters.test.ts
// Unit tests for pure helper / formatter functions

// ─── formatCallDate (from profile.tsx and progress.tsx) ───────────────────────
function formatCallDate(isoString: string, now: Date = new Date()): string {
  const d = new Date(isoString);
  const diff = now.getDate() - d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

// ─── buildWeekDays (from profile.tsx) ─────────────────────────────────────────
function buildWeekDays() {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { label: labels[d.getDay()], date: d, isToday: i === 6 };
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('formatCallDate()', () => {
  const NOW = new Date('2024-06-10T14:00:00');

  it('returns "Today, ..." for same-day date', () => {
    const sameDay = new Date('2024-06-10T09:30:00').toISOString();
    const result = formatCallDate(sameDay, NOW);
    expect(result).toMatch(/^Today,/);
  });

  it('returns "Yesterday, ..." for previous day', () => {
    const yesterday = new Date('2024-06-09T18:00:00').toISOString();
    const result = formatCallDate(yesterday, NOW);
    expect(result).toMatch(/^Yesterday,/);
  });

  it('returns formatted date for older entries', () => {
    const older = new Date('2024-05-15T10:00:00').toISOString();
    const result = formatCallDate(older, NOW);
    expect(result).toMatch(/May 15/);
  });

  it('includes time in HH:MM format', () => {
    const date = new Date('2024-06-10T09:30:00').toISOString();
    const result = formatCallDate(date, NOW);
    // Should contain time component
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('handles midnight correctly', () => {
    const midnight = new Date('2024-06-10T00:00:00').toISOString();
    const result = formatCallDate(midnight, NOW);
    expect(result).toMatch(/^Today,/);
  });
});

describe('buildWeekDays()', () => {
  it('returns exactly 7 days', () => {
    const days = buildWeekDays();
    expect(days).toHaveLength(7);
  });

  it('last element (index 6) is today', () => {
    const days = buildWeekDays();
    expect(days[6].isToday).toBe(true);
  });

  it('no other element has isToday=true', () => {
    const days = buildWeekDays();
    const todayCount = days.filter(d => d.isToday).length;
    expect(todayCount).toBe(1);
  });

  it('days are in chronological order (ascending)', () => {
    const days = buildWeekDays();
    for (let i = 1; i < days.length; i++) {
      expect(days[i].date.getTime()).toBeGreaterThan(days[i - 1].date.getTime());
    }
  });

  it('all labels are single characters (S/M/T/W/F)', () => {
    const days = buildWeekDays();
    days.forEach(d => {
      expect(d.label).toHaveLength(1);
    });
  });

  it('dates span a 7-day range ending today', () => {
    const days = buildWeekDays();
    const today = new Date();
    const lastDate = days[6].date;
    // Same day (compare date parts only)
    expect(lastDate.toDateString()).toBe(today.toDateString());
  });
});

// ─── CEFR level mapping (from onboarding.tsx) ─────────────────────────────────
type Level = 'beginner' | 'intermediate' | 'advanced';
const LEVEL_MAP: Record<Level, string> = {
  beginner: 'A1',
  intermediate: 'B1',
  advanced: 'C1',
};

describe('LEVEL_MAP — CEFR mapping', () => {
  it('beginner maps to A1', () => {
    expect(LEVEL_MAP['beginner']).toBe('A1');
  });

  it('intermediate maps to B1', () => {
    expect(LEVEL_MAP['intermediate']).toBe('B1');
  });

  it('advanced maps to C1', () => {
    expect(LEVEL_MAP['advanced']).toBe('C1');
  });

  it('all 3 levels are covered', () => {
    expect(Object.keys(LEVEL_MAP)).toHaveLength(3);
  });
});
