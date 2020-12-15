import colors from '../theme/colors';
import {LegMode} from '../sdk';
import {dictionary, TranslatedString} from '../translations';

type TransportationColors = {
  color: string;
  contrast: string;
};

export const defaultFill = colors.primary.gray_300;

export default function transportationColor(
  mode?: LegMode,
  publicCode?: string,
): TransportationColors {
  switch (mode) {
    case 'bus':
      const code = Number(publicCode);
      if (code < 100)
        return {
          color: colors.primary.green_500,
          contrast: colors.text.black,
        };

      return {
        color: colors.secondary.blue_500,
        contrast: colors.text.white,
      };
    case 'rail':
      return {
        color: colors.secondary.red_500,
        contrast: colors.text.white,
      };
    case 'tram':
      return {
        color: colors.primary.green_500,
        contrast: colors.text.black,
      };
    case 'water':
      return {
        color: colors.text.white,
        contrast: colors.text.black,
      };
    case 'air':
      return {
        color: colors.secondary.orange,
        contrast: colors.text.white,
      };
    default:
      return {
        color: defaultFill,
        contrast: colors.text.white,
      };
  }
}
export function transportationMapLineColor(
  mode?: LegMode,
  publicCode?: string,
): string {
  switch (mode) {
    case 'bus':
      const code = Number(publicCode);
      if (code < 100) {
        return colors.primary.green_500;
      }
      return colors.secondary.blue_500;
    case 'rail':
      return colors.secondary.red_500;
    case 'tram':
      return colors.primary.green_500;
    case 'water':
      return colors.text.white;
    case 'air':
      return colors.secondary.orange;
    default:
      return defaultFill;
  }
}
