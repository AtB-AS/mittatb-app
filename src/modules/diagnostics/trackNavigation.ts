import Bugsnag from '@bugsnag/react-native';
import analytics from '@react-native-firebase/analytics';

let previousRouteName: string | null = null;

export function trackNavigation(currentRouteName: string) {
  if (previousRouteName !== currentRouteName) {
    Bugsnag.leaveBreadcrumb('navigate', {route: currentRouteName});
    analytics().logScreenView({screen_name: currentRouteName});
  }

  previousRouteName = currentRouteName;
}
