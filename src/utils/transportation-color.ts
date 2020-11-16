import colors from '../theme/colors';
import {LegMode} from '../sdk';

type TransportationColors = {
  fill: string;
  icon: string;
};

export default function transportionColor(
  mode?: LegMode,
  publicCode?: string,
): TransportationColors {
  switch (mode) {
    case 'bus':
      const code = Number(publicCode);
      if (code < 100)
        return {
          fill: colors.primary.green,
          icon: colors.general.black,
        };

      return {
        fill: colors.secondary.blue,
        icon: colors.general.white,
      };
    case 'rail':
      return {
        fill: colors.secondary.red_500,
        icon: colors.general.white,
      };
    case 'tram':
      return {
        fill: colors.primary.green,
        icon: colors.general.black,
      };
    case 'water':
      return {
        fill: colors.general.white,
        icon: colors.general.black,
      };
    case 'air':
      return {
        fill: colors.secondary.orange,
        icon: colors.general.white,
      };
    default:
      return {
        fill: colors.general.gray,
        icon: colors.general.white,
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
        return colors.primary.green;
      }
      return colors.secondary.blue;
    case 'rail':
      return colors.secondary.red_500;
    case 'tram':
      return colors.primary.green;
    case 'water':
      return colors.general.white;
    case 'air':
      return colors.secondary.orange;
    default:
      return colors.general.gray400;
  }
}
