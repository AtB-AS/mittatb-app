import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {
  usePreferenceItems,
  Preference_ScreenAlternatives,
} from '../preferences';
import {TabNavigatorParams} from '../navigation/TabNavigator';
import {useWindowDimensions} from 'react-native';

export const useBottomNavigationStyles = (): {height: number} => {
  const {fontScale} = useWindowDimensions();
  return {
    height: 45 * fontScale,
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
