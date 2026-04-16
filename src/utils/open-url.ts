import {Linking} from 'react-native';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

/**
 * Open a URL with consistent error handling.
 * Always reports failures to Bugsnag with the provided message.
 *
 * @param url - The URL to open (http, https, tel, etc.)
 * @param bugsnagMessage - Descriptive message for Bugsnag metadata
 * @param onError - Optional callback invoked on failure (after Bugsnag report)
 */
export async function openUrl(
  url: string,
  bugsnagMessage: string,
  onError?: () => void,
): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch (error: any) {
    notifyBugsnag(error, {
      metadata: {url, bugsnagMessage},
      errorGroupHash: 'linkingOpenUrl',
    });
    onError?.();
  }
}
