import {logToBugsnag} from '@atb/utils/bugsnag-utils';
import {tokenService} from '@atb/mobile-token/tokenService';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';

export const wipeToken = async (tokensIds: string[], traceId: string) => {
  for (const id of tokensIds) {
    logToBugsnag('Wiping token with id ' + id);
    await tokenService.removeToken(id, traceId);
  }
  await mobileTokenClient.clear();
};
