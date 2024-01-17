/**
 * Adds opacity to the input hex color. Should be used with colors from the
 * design system, as that is the hex format this function supports. It doesn't
 * work with 3 letter hex codes, or hex codes already containing the
 * opacity/alpha channel.
 *
 * Example usage:
 * addOpacity(theme.static.background.background_0.background, 0.2)
 */
export const addOpacity = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
