import {NavigationState} from '@react-navigation/native';
import Bugsnag from '@bugsnag/react-native';
import analytics from '@react-native-firebase/analytics';

const getActiveRouteName = (state: NavigationState): string => {
  try {
    const route = state.routes[state.index];

    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state as NavigationState);
    }

    return route.name;
  } catch (err) {
    return 'Unknown';
  }
};

let previousRouteName: string | null = null;

export function trackNavigation(state: NavigationState | undefined) {
  if (!state) return;
  const currentRouteName = getActiveRouteName(state);

  if (previousRouteName !== currentRouteName) {
    Bugsnag.leaveBreadcrumb('navigate', {route: currentRouteName});
    analytics().logScreenView({screen_name: currentRouteName});
  }

  previousRouteName = currentRouteName;
}
