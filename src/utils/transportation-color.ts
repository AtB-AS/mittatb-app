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
        fill: colors.secondary.red,
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
    default:
      return {
        fill: colors.general.gray,
        icon: colors.general.white,
      };
  }
}
