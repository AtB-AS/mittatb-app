// eslint-disable-next-line no-restricted-imports
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {useFontScale} from '@atb/utils/use-font-scale';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Preference_ScreenAlternatives} from '@atb/modules/preferences';
import {NavigationState} from '@react-navigation/native';

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
): keyof TabNavigatorStackParams {
  switch (setting) {
    case 'assistant':
      return 'TabNav_DashboardStack';
    case 'departures':
      return 'TabNav_DeparturesStack';
    case 'ticketing':
      return 'TabNav_TicketingStack';
    default:
      return 'TabNav_DashboardStack';
  }
}

export const getActiveRouteName = (state: NavigationState): string => {
  try {
    const route = state.routes[state.index];

    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state as NavigationState);
    }

    return route.name;
  } catch {
    return 'Unknown';
  }
};
