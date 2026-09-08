import Bugsnag from '@bugsnag/react-native';
import {getAnalytics, logScreenView} from '@react-native-firebase/analytics';
import {getPosthogClientGlobal} from '@atb/modules/analytics';

let previousRouteName: string | null = null;

export function trackNavigation(currentRouteName: string) {
  if (previousRouteName !== currentRouteName) {
    Bugsnag.leaveBreadcrumb('navigate', {route: currentRouteName});
    logScreenView(getAnalytics(), {screen_name: currentRouteName});

    // Send screen view to PostHog manually since we disabled autocapture
    const postHogClient = getPosthogClientGlobal();
    if (postHogClient) {
      postHogClient.screen(currentRouteName);
    }
  }

  previousRouteName = currentRouteName;
}
