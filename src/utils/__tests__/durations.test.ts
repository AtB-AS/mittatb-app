import {parseDuration} from '../durations';

describe('parseDuration', () => {
  describe('valid durations', () => {
    test('rounds seconds with fractional part', () => {
      expect(parseDuration('PT20.345S')).toBe(20);
      expect(parseDuration('PT20.645S')).toBe(21);
      expect(parseDuration('PT20.5S')).toBe(21);
    });

    test('parses minutes only', () => {
      expect(parseDuration('PT15M')).toBe(15 * 60);
    });

    test('parses hours only', () => {
      expect(parseDuration('PT10H')).toBe(10 * 3600);
    });

    test('parses multiple days represented as hours', () => {
      expect(parseDuration('PT48H')).toBe(48 * 3600);
    });

    test('parses hours, minutes and fractional seconds', () => {
      const result = parseDuration('PT8H6M12.345S');
      const expected = 8 * 3600 + 6 * 60 + 12;
      expect(result).toBe(expected);
    });

    test('parses with explicit positive sign', () => {
      expect(parseDuration('+PT15M')).toBe(15 * 60);
    });

    test('parses negative durations', () => {
      expect(parseDuration('-PT15M')).toBe(-15 * 60);
    });

    test('parses zero seconds', () => {
      expect(parseDuration('PT0S')).toBe(0);
    });
  });

  describe('invalid durations', () => {
    test('returns undefined for empty string', () => {
      expect(parseDuration('')).toBeUndefined();
    });

    test('returns undefined for missing components', () => {
      expect(parseDuration('PT')).toBeUndefined();
      expect(parseDuration('P')).toBeUndefined();
    });

    test('returns undefined for missing prefix', () => {
      expect(parseDuration('20S')).toBeUndefined();
      expect(parseDuration('10H')).toBeUndefined();
    });

    test('returns undefined for malformed format', () => {
      expect(parseDuration('  PT48H ')).toBeUndefined();
      expect(parseDuration('PT1H2X')).toBeUndefined();
      expect(parseDuration('PT1H2M-3S')).toBeUndefined();
      expect(parseDuration('XYZ')).toBeUndefined();
    });
  });
});
