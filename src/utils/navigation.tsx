import {TabNavigatorParams} from '@atb/navigation/types';
import useFontScale from '@atb/utils/use-font-scale';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Preference_ScreenAlternatives} from '../preferences';

// This is code from react-navigation, for regular tab bar
// (not compact). Should be a better way to set this or
// get it from React Navigation, but alas not.
const DEFAULT_TABBAR_HEIGHT = 44;

// extra padding for android native navigation
const ANDROID_BOTTOM_PADDING = 12;

export const useBottomNavigationStyles = () => {
  const fontScale = useFontScale();
  const {bottom} = useSafeAreaInsets();

  // Prevent fontScale from affecting tab bar height when it is less than 1
  const fontScaleFactor = fontScale < 1 ? 1 : fontScale;

  const adjustedBottom =
    Platform.OS == 'android' ? bottom + ANDROID_BOTTOM_PADDING : bottom;

  return {
    minHeight: DEFAULT_TABBAR_HEIGHT * fontScaleFactor + adjustedBottom,
    paddingBottom: adjustedBottom,
  };
};

export function settingToRouteName(
  setting?: Preference_ScreenAlternatives,
): keyof TabNavigatorParams {
  switch (setting) {
    case 'assistant':
      return 'Dashboard';
    case 'departures':
      return 'Nearest';
    case 'ticketing':
      return 'Ticketing';
    default:
      return 'Dashboard';
  }
}
