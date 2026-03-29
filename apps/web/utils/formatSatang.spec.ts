import { describe, expect, it } from 'vitest';
import { formatSatang } from './formatSatang';

describe('formatSatang', () => {
  it('when 270000 satang, expect ฿2,700.00', () => {
    expect(formatSatang(270000)).toBe('฿2,700.00');
  });

  it('when 0 satang, expect ฿0.00', () => {
    expect(formatSatang(0)).toBe('฿0.00');
  });

  it('when 9900 satang, expect ฿99.00', () => {
    expect(formatSatang(9900)).toBe('฿99.00');
  });
});
