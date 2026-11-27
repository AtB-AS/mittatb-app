import Bugsnag from '@bugsnag/react-native';
import {storage} from '@atb/modules/storage';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import {AbtMobileClient, CONTEXT_ID} from './mobileTokenClient';

export type StartTokenResult = 'started' | 'logged-in' | 'failed';

/**
 * `start` loads the stored token (and renews or creates it if needed) when it
 * belongs to this user, otherwise `login` creates a fresh token.
 *
 * The user is not saved after `login`, as a failed login doesn't reject. See
 * `useSaveLastTokenUser`.
 */
export const startToken = async (userId: string): Promise<StartTokenResult> => {
  try {
    const lastUserId = await storage.get('@ATB_last_mobile_token_user');
    if (lastUserId === userId) {
      Bugsnag.leaveBreadcrumb(`Starting mobile token for user ${userId}`);
      await AbtMobileClient.start(CONTEXT_ID);
      return 'started';
    }
    Bugsnag.leaveBreadcrumb(`Logging in mobile token for user ${userId}`);
    await AbtMobileClient.login(CONTEXT_ID);
    return 'logged-in';
  } catch (err: any) {
    // Only a breadcrumb: the SDK logger and the storage module already send
    // the error to Bugsnag
    logToBugsnag('Error starting mobile token', errorToMetadata(err));
    return 'failed';
  }
};
