/**
 * https://docs.mapbox.com/help/tutorials/create-a-custom-color-theme/?step=7
 * colorTheme has data created based on ./mapbox-color-theme.png,
 * which in turn is a customized version of ./mapbox-color-theme-standard-neutral.png, which is used by default by mapbox if no colorTheme is specified.
 *
 * Changes applied:
 * - slightly brighter
 * - slightly less saturation
 */
import data from './mapbox-color-theme.json';
export const colorTheme = data; // To avoid slow ts processing, the data is in its own json file.
