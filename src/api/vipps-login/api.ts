import {storage} from '@atb/modules/storage';
import {client} from '@atb/api/client';
import {VippsSignInErrorCode} from '@atb/modules/auth';
import {generateNonce, generateState} from '@atb/api/vipps-login/utils';
import {APP_SCHEME} from '@env';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {AxiosRequestConfig} from 'axios';
import qs from 'query-string';
import {stringifyUrl} from '../utils';
import {AgeVerificationEnum} from '@atb/modules/mobility';

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

export const getAgeVerification = (
  legalAge: number,
  opts?: AxiosRequestConfig,
): Promise<AgeVerificationEnum> => {
  const url = '/identity/v1/vipps/age-verification';
  const query = qs.stringify({legalAge});

  return client
    .get<AgeVerificationEnum>(stringifyUrl(url, query), {
      ...opts,
      authWithIdToken: true,
    })
    .then((res) => res.data);
};

export const authorizeAgeUser = async (): Promise<void> => {
  const state = await generateState();
  const nonce = await generateNonce();
  return client
    .get(
      `/identity/v1/vipps/age-verification/init?callbackUrl=${VIPPS_CALLBACK_URL}`,
    )
    .then(async (response) => {
      const authorisationUrl = response.data;
      openInAppBrowser(
        `${authorisationUrl}&state=${state}&nonce=${nonce}`,
        'cancel',
      );
    });
};

export const completeAgeVerification = async (
  authorizationCode: string,
  opts?: AxiosRequestConfig,
) => {
  return client.post(
    `/identity/v1/vipps/age-verification/complete?callbackUrl=${VIPPS_CALLBACK_URL}`,
    {
      authorizationCode,
    },
    {
      authWithIdToken: true,
      ...opts,
    },
  );
};
