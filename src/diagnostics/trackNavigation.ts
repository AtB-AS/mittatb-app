import {NavigationState} from '@react-navigation/native';
import bugsnag from './bugsnag';
import analytics from '@react-native-firebase/analytics';

const getActiveRouteName = (state: NavigationState, parents: string[] = []): string => {
  try {
    const route = state.routes[state.index];
    parents = [...parents, route.name]
    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state as NavigationState, parents);
    }
    return parents.join(".")
  } catch (err) {
    return 'Unknown';
  }
};

let previousRouteName: string | null = null;

export default function trackNavigation(state: NavigationState | undefined) {
  if (!state) return;
  const currentRouteName = getActiveRouteName(state);

  if (previousRouteName !== currentRouteName) {
    bugsnag.leaveBreadcrumb('navigate', {route: currentRouteName});
    analytics().setCurrentScreen(currentRouteName, currentRouteName);
  }

  previousRouteName = currentRouteName;
}
