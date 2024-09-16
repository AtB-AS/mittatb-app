import {StatusBar} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {notifyBugsnag} from '../utils/bugsnag-utils';

export async function openInAppBrowser(
  url: string,
  dismissButtonStyle: 'cancel' | 'close' | 'done',
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
    });
  } catch (error: any) {
    notifyBugsnag(error);
  }
  StatusBar.popStackEntry(previousStatusBarStyle);
}

export function closeInAppBrowser() {
  InAppBrowser.isAvailable().then((available) => {
    if (available) {
      InAppBrowser.close();
    }
  });
}
