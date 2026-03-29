import { describe, expect, it } from 'vitest';
import { validateThaiNationalId } from './thaiNationalId';

describe('validateThaiNationalId', () => {
  it('when valid ID, expect true', () => {
    // '1234567890121' — checksum digit is 1 (verified: sum=352, 352%11=0, (11-0)%10=1)
    expect(validateThaiNationalId('1234567890121')).toBe(true);
  });

  it('when wrong length, expect false', () => {
    expect(validateThaiNationalId('123456789012')).toBe(false);
  });

  it('when non-numeric, expect false', () => {
    expect(validateThaiNationalId('123456789012a')).toBe(false);
  });

  it('when bad checksum, expect false', () => {
    expect(validateThaiNationalId('1234567890120')).toBe(false);
  });

  it('when correct checksum, expect true', () => {
    // Build a valid ID programmatically
    const base = '123456789012';
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += Number(base[i]) * (13 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 10;
    expect(validateThaiNationalId(`${base}${checkDigit}`)).toBe(true);
  });
});
