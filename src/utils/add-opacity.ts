/**
 * Adds opacity to the input hex color. Should be used with colors from the
 * design system, as that is the hex format this function supports. It doesn't
 * work with 3 letter hex codes, or hex codes already containing the
 * opacity/alpha channel.
 *
 * If the input value isn't a supported hex format, the hex will be returned
 * without adding opacity.
 *
 * Example usage:
 * addOpacity(theme.color.background.neutral[0].background, 0.2)
 */
export const addOpacity = (hex: string, opacity: number) => {
  const isSupportedHexFormat = hex.startsWith('#') && hex.length === 7;
  if (!isSupportedHexFormat) return hex;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
