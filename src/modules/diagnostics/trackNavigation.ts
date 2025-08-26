import Bugsnag from '@bugsnag/react-native';
import analytics from '@react-native-firebase/analytics';
import {getPosthogClientGlobal} from '@atb/modules/analytics';

let previousRouteName: string | null = null;

export function trackNavigation(currentRouteName: string) {
  if (previousRouteName !== currentRouteName) {
    Bugsnag.leaveBreadcrumb('navigate', {route: currentRouteName});
    analytics().logScreenView({screen_name: currentRouteName});
    
    // Send screen view to PostHog manually since we disabled autocapture
    const postHogClient = getPosthogClientGlobal();
    if (postHogClient) {
      postHogClient.screen(currentRouteName)
    }
  }

  previousRouteName = currentRouteName;
}
