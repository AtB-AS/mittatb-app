import {AppPlatform} from '@atb/modules/global-messages';
import {Platform} from 'react-native';
import {APP_VERSION} from '@env';
import {compareVersion} from '@atb/utils/compare-version';

export const appliesToAppPlaform = (platforms?: AppPlatform[]) => {
  if (!platforms) return true;
  return !!platforms.find(
    (platform) => platform.toLowerCase() === Platform.OS.toLowerCase(),
  );
};

export const appliesToAppVersion = (
  appVersionMin?: string,
  appVersionMax?: string,
  appVersion: string = APP_VERSION,
) => {
  if (appVersionMin && compareVersion(appVersionMin, appVersion) > 0)
    return false;
  if (appVersionMax && compareVersion(appVersionMax, appVersion) < 0)
    return false;
  return true;
};
