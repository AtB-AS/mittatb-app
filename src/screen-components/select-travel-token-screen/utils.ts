import {TranslateFunction, TravelTokenTexts} from '@atb/translations';
import {Token} from '@atb/modules/mobile-token';

export const getDeviceNameWithUnitInfo = (
  t: TranslateFunction,
  token: Token | undefined,
) =>
  (token?.name || t(TravelTokenTexts.toggleToken.unnamedDevice)) +
  (token?.isThisDevice
    ? t(TravelTokenTexts.toggleToken.radioBox.phone.selection.thisDeviceSuffix)
    : '');
