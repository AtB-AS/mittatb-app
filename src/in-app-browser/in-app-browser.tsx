import {StatusBar} from 'react-native';
import InAppBrowser, {
  InAppBrowserOptions,
} from 'react-native-inappbrowser-reborn';
import {notifyBugsnag} from '../utils/bugsnag-utils';

export async function openInAppBrowser(
  url: string,
  dismissButtonStyle: 'cancel' | 'close' | 'done',
  options?: InAppBrowserOptions,
) {
  const previousStatusBarStyle = StatusBar.pushStackEntry({
    barStyle: 'dark-content',
    animated: true,
  });
  try {
    await InAppBrowser.open(url, {
      animated: true,
      dismissButtonStyle,
      // Android: Makes the InAppBrowser stay open after the app goes to
      // background. Needs to be true for Vipps login and BankID.
      showInRecents: true,
      ...options,
    });
  } catch (error: any) {
    notifyBugsnag(error);
  }
  StatusBar.popStackEntry(previousStatusBarStyle);
}

/**
 * @returns true if the InAppBrowser was available, false otherwise
 */
export async function closeInAppBrowser() {
  if (await InAppBrowser.isAvailable()) {
    InAppBrowser.close();
    return true;
  }
  return false;
}
