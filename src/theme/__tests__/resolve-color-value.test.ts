import {ContrastColor, resolveColorValue, Theme} from '../colors';

/**
 * Minimal theme subset sufficient for resolveColorValue and the type guards
 * it depends on (isStatusColor, isTextColor).
 */
const theme = {
  color: {
    status: {
      valid: {
        primary: {background: '#608000'},
        secondary: {background: '#e4f0c2'},
      },
      info: {
        primary: {background: '#0959aa'},
        secondary: {background: '#c2d9f0'},
      },
      warning: {
        primary: {background: '#e5b21a'},
        secondary: {background: '#f7e8ba'},
      },
      error: {
        primary: {background: '#a1122a'},
        secondary: {background: '#f2c0c8'},
      },
    },
    foreground: {
      dynamic: {
        primary: '#000000',
        secondary: '#415058',
        disabled: '#73848c',
      },
    },
  },
} as unknown as Theme;

const contrastColor: ContrastColor = {
  background: '#0959aa',
  foreground: {
    primary: '#ffffff',
    secondary: '#e1e8eb',
    disabled: '#a7b6be',
  },
};

describe('resolveColorValue', () => {
  describe('ContrastColor object', () => {
    it('should return foreground.primary by default', () => {
      expect(resolveColorValue(contrastColor, 'primary', theme)).toBe(
        '#ffffff',
      );
    });

    it('should return foreground.secondary when type is secondary', () => {
      expect(resolveColorValue(contrastColor, 'secondary', theme)).toBe(
        '#e1e8eb',
      );
    });

    it('should return foreground.disabled when type is disabled', () => {
      expect(resolveColorValue(contrastColor, 'disabled', theme)).toBe(
        '#a7b6be',
      );
    });
  });

  describe('Status string', () => {
    it('should resolve "info" to the info status hue', () => {
      expect(resolveColorValue('info', 'primary', theme)).toBe('#0959aa');
    });

    it('should resolve "error" to the error status hue', () => {
      expect(resolveColorValue('error', 'primary', theme)).toBe('#a1122a');
    });

    it('should resolve "valid" to the valid status hue', () => {
      expect(resolveColorValue('valid', 'primary', theme)).toBe('#608000');
    });

    it('should resolve "warning" to the warning status hue', () => {
      expect(resolveColorValue('warning', 'primary', theme)).toBe('#e5b21a');
    });

    it('should ignore the type parameter for status strings', () => {
      expect(resolveColorValue('info', 'secondary', theme)).toBe('#0959aa');
      expect(resolveColorValue('info', 'disabled', theme)).toBe('#0959aa');
    });
  });

  describe('TextColor string', () => {
    it('should resolve "primary" to foreground.dynamic.primary', () => {
      expect(resolveColorValue('primary', 'primary', theme)).toBe('#000000');
    });

    it('should resolve "secondary" to foreground.dynamic.secondary', () => {
      expect(resolveColorValue('secondary', 'primary', theme)).toBe('#415058');
    });

    it('should resolve "disabled" to foreground.dynamic.disabled', () => {
      expect(resolveColorValue('disabled', 'primary', theme)).toBe('#73848c');
    });
  });

  describe('undefined', () => {
    it('should fall back to foreground.dynamic.primary', () => {
      expect(resolveColorValue(undefined, 'primary', theme)).toBe('#000000');
    });
  });

  describe('raw ColorValue', () => {
    it('should pass through a hex color string', () => {
      expect(resolveColorValue('#ff00ff', 'primary', theme)).toBe('#ff00ff');
    });

    it('should pass through a named color', () => {
      expect(resolveColorValue('red', 'primary', theme)).toBe('red');
    });
  });
});
