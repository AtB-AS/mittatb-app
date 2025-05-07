import {storage} from '@atb/storage';
import {client} from '@atb/api/client';
import {VippsSignInErrorCode} from '@atb/modules/auth';
import {generateNonce, generateState} from '@atb/api/vipps-login/utils';
import {APP_SCHEME} from '@env';
import {openInAppBrowser} from '@atb/in-app-browser';

export const VIPPS_CALLBACK_URL = `${APP_SCHEME}://auth/vipps`;

export const authorizeUser = async (setIsLoading: any) => {
  const state = await generateState();
  const nonce = await generateNonce();
  return client
    .get(
      `/identity/v1/vipps/authorization-url?callbackUrl=${VIPPS_CALLBACK_URL}`,
    )
    .then(async (response) => {
      const authorisationUrl = response.data;
      setIsLoading(false);
      openInAppBrowser(
        `${authorisationUrl}&state=${state}&nonce=${nonce}`,
        'cancel',
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
    `/identity/v1/vipps/user-custom-token?callbackUrl=${VIPPS_CALLBACK_URL}`,
    {
      state: state,
      nonce: nonce,
      authorizationCode: authorizationCode,
    },
  );
};
