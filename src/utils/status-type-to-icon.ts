import {Mode} from '@atb-as/theme';
import {
  Check as CheckDark,
  Error as ErrorDark,
  Info as InfoDark,
  Warning as WarningDark,
} from '@atb/assets/svg/color/icons/status/dark';
import {
  Check as CheckLight,
  Error as ErrorLight,
  Info as InfoLight,
  Warning as WarningLight,
} from '@atb/assets/svg/color/icons/status/light';
import {Check, Error, Info, Warning} from '@atb/assets/svg/mono-icons/status';
import {Statuses} from '@atb/theme';

export const statusTypeToIcon = (
  statusType: Statuses,
  colored: boolean,
  themeName: Mode,
) => {
  if (colored) {
    switch (statusType) {
      case 'warning':
        return themeName === 'dark' ? WarningDark : WarningLight;
      case 'error':
        return themeName === 'dark' ? ErrorDark : ErrorLight;
      case 'valid':
        return themeName === 'dark' ? CheckDark : CheckLight;
      case 'info':
        return themeName === 'dark' ? InfoDark : InfoLight;
    }
  }
  switch (statusType) {
    case 'warning':
      return Warning;
    case 'error':
      return Error;
    case 'valid':
      return Check;
    case 'info':
      return Info;
  }
};
