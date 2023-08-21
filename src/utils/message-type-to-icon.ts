import {Check, Error, Info, Warning} from '../assets/svg/mono-icons/status';
import {
  Check as ColorCheck,
  Error as ColorError,
  Info as ColorInfo,
  Warning as ColorWarning,
} from '../assets/svg/color/icons/status';
import {Statuses} from '@atb/theme';

export const messageTypeToIcon = (messageType: Statuses, colored: boolean) => {
  if (colored) {
    switch (messageType) {
      case 'warning':
        return ColorWarning;
      case 'error':
        return ColorError;
      case 'valid':
        return ColorCheck;
      default:
        return ColorInfo;
    }
  }
  switch (messageType) {
    case 'warning':
      return Warning;
    case 'error':
      return Error;
    case 'valid':
      return Check;
    default:
      return Info;
  }
};
