import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TabNavigatorParams} from '../navigation/TabNavigator';
import {
  Preference_ScreenAlternatives,
  usePreferenceItems,
} from '../preferences';

// This is code from react-navigation, for regular tab bar
// (not compact). Should be a better way to set this or
// get it from React Navigation, but alas not.
const DEFAULT_TABBAR_HEIGHT = 44;

export const useBottomNavigationStyles = (
  maxScale: number = 2,
): {minHeight: number} => {
  const {fontScale} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();
  return {
    minHeight: DEFAULT_TABBAR_HEIGHT * Math.min(fontScale, maxScale) + bottom,
  };
};
export const useNavigateToStartScreen = () => {
  const navigation = useNavigation();
  const {startScreen} = usePreferenceItems();
  const startRoute = settingToRouteName(startScreen);

  return useCallback(() => {
    analytics().logEvent('click_logo');
    navigation.navigate(startRoute);
  }, [navigation]);
};
export function settingToRouteName(
  setting?: Preference_ScreenAlternatives,
): keyof TabNavigatorParams {
  switch (setting) {
    case 'assistant':
      return 'Assistant';
    case 'departures':
      return 'Nearest';
    case 'ticketing':
      return 'Ticketing';
    default:
      return 'Assistant';
  }
}
