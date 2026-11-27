import {RefObject} from 'react';
import {v4 as uuid} from 'uuid';
import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';
import {AbtMobileClient, CONTEXT_ID} from './mobileTokenClient';
import {tokenService} from './tokenService';
import {clearAttestationRequirement} from './attestation-requirement';

/**
 * How long a logout waits for the SDK's `logout` before it goes ahead. The SDK
 * runs `logout` after a running `start`/`login`, which could be stuck.
 */
export const MAX_LOGOUT_WAIT_SECONDS = 10;

type Args = {
  /** This device's token id when the logout began */
  tokenId: string | undefined;
  /** The latest token id, also after the SDK has cleared its token details */
  latestTokenId: RefObject<string | undefined>;
  /** Bugsnag description for a failed removal */
  description: string;
};

/**
 * Removes this device's token from the account and logs out of the SDK.
 */
export const removeTokenAndLogout = async ({
  tokenId,
  latestTokenId,
  description,
}: Args) => {
  // Set before any wait, so a token that a running `start`/`login` renews or
  // creates from now on is removed after the logout
  latestTokenId.current = tokenId;

  // Best effort: remove the token from the account, so it doesn't keep the
  // inspection right after logout
  const removeToken = async (id: string) => {
    try {
      await tokenService.removeToken(id, uuid());
    } catch (err: any) {
      notifyBugsnag(err, {
        errorGroupHash: 'token',
        metadata: {description},
      });
    }
  };
  if (tokenId) await removeToken(tokenId);
  clearAttestationRequirement();
  // The SDK runs the logout after a running `start`/`login`. Don't wait for it
  // for too long, so a stuck start can't block the logout.
  const logout = AbtMobileClient.logout(CONTEXT_ID);
  // A failure after the wait has ended is ignored
  logout.catch(() => {});
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      logout,
      new Promise((resolve) => {
        timeoutId = setTimeout(resolve, MAX_LOGOUT_WAIT_SECONDS * 1000);
      }),
    ]);
  } catch (err: any) {
    // Only a breadcrumb: the SDK logger already sends the error to Bugsnag.
    // Go on, so the token state is still cleaned up.
    logToBugsnag('Error logging out of the mobile token', errorToMetadata(err));
  } finally {
    clearTimeout(timeoutId);
  }
  const newTokenId = latestTokenId.current;
  if (newTokenId && newTokenId !== tokenId) await removeToken(newTokenId);
};
