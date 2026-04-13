import {isShortWaitTime, significantWaitTime} from '../utils';

describe('significantWaitTime', () => {
  it('should be false for 0 seconds', () => {
    expect(significantWaitTime(0)).toBe(false);
  });

  it('should be false for 30 seconds (boundary)', () => {
    expect(significantWaitTime(30)).toBe(false);
  });

  it('should be true for 31 seconds', () => {
    expect(significantWaitTime(31)).toBe(true);
  });
});

describe('isShortWaitTime', () => {
  it('should be false for 0 seconds (not significant)', () => {
    expect(isShortWaitTime(0)).toBe(false);
  });

  it('should be false for 30 seconds (boundary, not significant)', () => {
    expect(isShortWaitTime(30)).toBe(false);
  });

  it('should be true for 31 seconds (significant and short)', () => {
    expect(isShortWaitTime(31)).toBe(true);
  });

  it('should be true for 180 seconds (significant and at the 3-min boundary)', () => {
    expect(isShortWaitTime(180)).toBe(true);
  });

  it('should be false for 181 seconds (significant but not short)', () => {
    expect(isShortWaitTime(181)).toBe(false);
  });

  it('should be false for negative values', () => {
    expect(isShortWaitTime(-10)).toBe(false);
  });
});
