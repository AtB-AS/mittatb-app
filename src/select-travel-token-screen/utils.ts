import {TranslateFunction, TravelTokenTexts} from '@atb/translations';
import {Token} from '@atb/mobile-token';

export const getDeviceNameWithUnitInfo = (
  t: TranslateFunction,
  token: Token | undefined,
  includeSuffixForOtherDevice?: boolean,
) =>
  (token?.name || t(TravelTokenTexts.toggleToken.unnamedDevice)) +
  (token?.isThisDevice
    ? t(TravelTokenTexts.toggleToken.radioBox.phone.selection.thisDeviceSuffix)
    : includeSuffixForOtherDevice
    ? t(TravelTokenTexts.toggleToken.radioBox.phone.selection.otherDeviceSuffix)
    : '');