import storage from '@atb/storage';
import client from '@atb/api/client';
import {VippsSignInErrorCode} from '@atb/auth/AuthContext';
import {generateNonce, generateState} from '@atb/api/vipps-login/utils';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const authorizeUser = async (setIsLoading: any) => {
  const state = await generateState();
  const nonce = await generateNonce();
  return client
    .get('/bff/login/vipps/authorization-url')
    .then(async (response) => {
      const authorisationUrl = response.data;
      setIsLoading(false);
      await InAppBrowser.open(
        `${authorisationUrl}&state=${state}&nonce=${nonce}`,
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
  return client.post('/bff/login/vipps/user-custom-token', {
    state: state,
    nonce: nonce,
    authorizationCode: authorizationCode,
  });
};
