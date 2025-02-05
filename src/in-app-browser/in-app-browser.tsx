import {StatusBar} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {notifyBugsnag} from '../utils/bugsnag-utils';

/**
 * Wrapper around `react-native-inappbrowser-reborn`. See docs at:
 * https://github.com/proyecto26/react-native-inappbrowser
 */
export async function openInAppBrowser(
  url: string,
  dismissButtonStyle: 'cancel' | 'close' | 'done',
  successUrl?: string,
  onSuccess?: (url: string) => void,
) {
  const statusBarStyle = StatusBar.pushStackEntry({
    barStyle: successUrl ? 'light-content' : 'dark-content',
    animated: true,
  });
  try {
    if (!successUrl) {
      await InAppBrowser.open(url, {
        animated: true,
        dismissButtonStyle,
        // Android: Makes the InAppBrowser stay open after the app goes to
        // background. Needs to be true for Vipps login and BankID.
        showInRecents: true,
      });
    } else {
      const result = await InAppBrowser.openAuth(url, successUrl, {
        animated: true,
        dismissButtonStyle,
        // Android: Makes the InAppBrowser stay open after the app goes to
        // background. Needs to be true for Vipps login and BankID.
        showInRecents: true,
        // iOS: If false, InAppBrowser will re-use cookies from other sessions
        // and show a warning to the user about information sharing.
        ephemeralWebSession: true,
      });
      if (result.type === 'success') {
        onSuccess?.(result.url);
      }
    }
  } catch (error: any) {
    notifyBugsnag(error);
  }
  StatusBar.popStackEntry(statusBarStyle);
}

/**
 * This function is only available for iOS.
 */
export function closeInAppBrowseriOS() {
  InAppBrowser.close();
  InAppBrowser.closeAuth();
}
