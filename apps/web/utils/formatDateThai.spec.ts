import { describe, expect, it } from 'vitest';
import { formatDateThai } from './formatDateThai';

describe('formatDateThai', () => {
  it('when ISO string, expect DD/MM/YYYY HH:MM:SS format', () => {
    // Use a fixed UTC timestamp
    const result = formatDateThai('2026-03-27T00:00:00.000Z');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  });
});
