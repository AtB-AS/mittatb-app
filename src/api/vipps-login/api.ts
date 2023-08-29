import {storage} from '@atb/storage';
import {client} from '@atb/api/client';
import {VippsSignInErrorCode} from '@atb/auth';
import {generateNonce, generateState} from '@atb/api/vipps-login/utils';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {APP_SCHEME} from '@env';

export const VIPPS_CALLBACK_URL = `${APP_SCHEME}://auth/vipps`;

export const authorizeUser = async (setIsLoading: any) => {
  const state = await generateState();
  const nonce = await generateNonce();
  return client
    .get(`/bff/login/vipps/authorization-url?callbackUrl=${VIPPS_CALLBACK_URL}`)
    .then(async (response) => {
      const authorisationUrl = response.data;
      setIsLoading(false);
      await InAppBrowser.open(
        `${authorisationUrl}&state=${state}&nonce=${nonce}`,
        // Param showInRecents is needed so the InAppBrowser doesn't get closed when the app goes to background
        // hence user is again navigated back to browser after giving consent in Vipps App,
        // and then can complete the authentication process successfully
        {showInRecents: true},
      );
    });
};

export const getOrCreateVippsUserCustomToken = async (
  authorizationCode: string,
): Promise<{data?: string; error?: VippsSignInErrorCode}> => {
  const state = await storage.get('vipps_state');
  const nonce = await storage.get('vipps_nonce');
  if (!state || !nonce) {
    throw new Error('unknown_error');
  }
  return client.post(
    `/bff/login/vipps/user-custom-token?callbackUrl=${VIPPS_CALLBACK_URL}`,
    {
      state: state,
      nonce: nonce,
      authorizationCode: authorizationCode,
    },
  );
};
