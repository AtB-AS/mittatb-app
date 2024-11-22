import {ContrastColorFs, ThemeFs} from '@atb-as/theme';
import {ContrastColor, themes} from '@atb/theme/colors';
import {isDefined} from '@atb/utils/presence';

/**
 * Recursively adds a key prefix to a set of contrast colors, and returns the
 * flattened object.
 *
 * @example
 * let backgrounds = flattenColorsWithPrefix('background', {
 *   accent: {background: '#ff0', foreground: {...}},
 *   neutral: {
 *     0: {background: '#fff', foreground: {...}},
 *   },
 * });
 * // returns
 * {
 *   'background accent': { background: '#ff0', foreground: {...} }
 *   'background neutral 0': { background: '#fff', foreground: {...} }
 * }
 */
function flattenColorsWithPrefix(
  prefix: string,
  options: object,
): {[key: string]: ContrastColor} {
  const s = Object.entries(options)
    .map(([key, value]) => {
      const colorName = `${prefix} ${key}`;
      if (isContrastColor(value)) {
        return {[colorName]: value};
      }
      if (typeof value === 'object') {
        return flattenColorsWithPrefix(colorName, value);
      }
    })
    .filter(isDefined);
  return Object.assign({}, ...s);
}
function isContrastColor(value: any): value is ContrastColor {
  return (
    !!value &&
    typeof value === 'object' &&
    'background' in value &&
    'foreground' in value
  );
}

const commonColors = (theme: ThemeFs) => {
  return {
    ...flattenColorsWithPrefix('background', theme.color.background),
    ...flattenColorsWithPrefix('status', theme.color.status),
    ...flattenColorsWithPrefix('transport', theme.color.transport),
  };
};

const commonLightColors = commonColors(themes.light);
const commonDarkColors = commonColors(themes.dark);

export function getColorOptions(): string[] {
  return Object.keys(commonLightColors);
}
export function getColorByOption(
  themeName: 'light' | 'dark',
  option: string | undefined,
): ContrastColorFs {
  const colors = themeName === 'light' ? commonLightColors : commonDarkColors;
  return option ? colors[option] : colors[Object.keys(colors)[0]];
}
