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
  it('should be false for 0 seconds (an interchange risk, not a short wait)', () => {
    expect(isShortWaitTime(0)).toBe(false);
  });

  it('should be true for 1 second', () => {
    expect(isShortWaitTime(1)).toBe(true);
  });

  it('should be true for 30 seconds (too short to display as a duration)', () => {
    expect(isShortWaitTime(30)).toBe(true);
  });

  it('should be true for 31 seconds', () => {
    expect(isShortWaitTime(31)).toBe(true);
  });

  it('should be true for 119 seconds (just under the 2-min boundary)', () => {
    expect(isShortWaitTime(119)).toBe(true);
  });

  it('should be false for 120 seconds (stated as an exact duration)', () => {
    expect(isShortWaitTime(120)).toBe(false);
  });

  it('should be false for negative values', () => {
    expect(isShortWaitTime(-10)).toBe(false);
  });
});
