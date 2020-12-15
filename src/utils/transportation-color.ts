import colors from '../theme/colors';
import {LegMode, TransportMode} from '@entur/sdk';

type TransportationColors = {
  fill: string;
  icon: string;
};

export const defaultFill = colors.primary.gray_300;

export default function transportionColor(
  mode?: TransportMode | LegMode,
  publicCode?: string,
): TransportationColors {
  switch (mode) {
    case 'bus':
      const code = Number(publicCode);
      if (code < 100)
        return {
          fill: colors.primary.green_500,
          icon: colors.text.black,
        };

      return {
        fill: colors.secondary.blue_500,
        icon: colors.text.white,
      };
    case 'rail':
      return {
        fill: colors.secondary.red_500,
        icon: colors.text.white,
      };
    case 'tram':
      return {
        fill: colors.primary.green_500,
        icon: colors.text.black,
      };
    case 'water':
      return {
        fill: colors.text.white,
        icon: colors.text.black,
      };
    case 'air':
      return {
        fill: colors.secondary.orange,
        icon: colors.text.white,
      };
    default:
      return {
        fill: defaultFill,
        icon: colors.text.white,
      };
  }
}
export function transportationMapLineColor(
  mode?: LegMode | TransportMode,
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
