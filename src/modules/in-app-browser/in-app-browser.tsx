import {StatusBar} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

type InAppBrowserConfig = {
  dismissButtonStyle?: 'cancel' | 'close' | 'done';
  successUrl?: string;
  onSuccess?: (url: string) => void;
  onCancel?: () => void;
  onError?: () => void;
};

/**
 * Wrapper around `react-native-inappbrowser-reborn`. See docs at:
 * https://github.com/proyecto26/react-native-inappbrowser
 */
export async function openInAppBrowser(
  url: string,
  config?: InAppBrowserConfig,
) {
  const statusBarStyle = StatusBar.pushStackEntry({
    barStyle: config?.successUrl ? 'light-content' : 'dark-content',
    animated: true,
  });
  try {
    if (!config?.successUrl) {
      const result = await InAppBrowser.open(url, {
        animated: true,
        dismissButtonStyle: config?.dismissButtonStyle ?? 'cancel',
        // Android: Makes the InAppBrowser stay open after the app goes to
        // background. Needs to be true for Vipps login and BankID.
        showInRecents: true,
      });
      if (result.type === 'cancel') {
        config?.onCancel?.();
      }
    } else {
      const result = await InAppBrowser.openAuth(url, config.successUrl, {
        animated: true,
        dismissButtonStyle: config.dismissButtonStyle ?? 'cancel',
        // Android: Makes the InAppBrowser stay open after the app goes to
        // background. Needs to be true for Vipps login and BankID.
        showInRecents: true,
        // iOS: If false, InAppBrowser will re-use cookies from other sessions
        // and show a warning to the user about information sharing.
        ephemeralWebSession: true,
      });
      if (result.type === 'success') {
        config.onSuccess?.(result.url);
      }
      if (result.type === 'cancel' || result.type === 'dismiss') {
        config.onCancel?.();
      }
    }
  } catch (error: any) {
    notifyBugsnag(error);
    config?.onError?.();
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
