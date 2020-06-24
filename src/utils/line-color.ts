import colors from '../theme/colors';
import {LegMode} from '../sdk';

export default function lineColor(mode?: LegMode, publicCode?: string) {
  switch (mode) {
    case 'bus':
      const code = Number(publicCode);

      if (code < 100) return colors.primary.green;

      return colors.secondary.blue;
    case 'rail':
      return colors.secondary.red;
    case 'tram':
      return colors.primary.green;
    case 'water':
      return colors.general.white;
    default:
      return colors.general.gray;
  }
}
