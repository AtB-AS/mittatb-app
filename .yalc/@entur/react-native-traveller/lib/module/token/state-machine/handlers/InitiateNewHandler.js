import { Platform } from 'react-native';
import { stateHandlerFactory } from '../HandlerFactory';
import { getDeviceName } from '../../../native';
import { logger } from '../../../logger';
const requireAttestation = Platform.select({
  default: true,
  ios: false
});
export default function initiateNewHandler(abtTokensService) {
  return stateHandlerFactory(['InitiateNew'], async s => {
    let deviceName = 'unknown';

    try {
      deviceName = await getDeviceName();
    } catch {}

    const {
      accountId,
      state
    } = s;
    logger.info('mobiletoken_status_change', undefined, {
      state,
      deviceName,
      accountId
    });
    const initTokenResponse = await abtTokensService.initToken({
      requireAttestation,
      deviceName
    });
    return {
      accountId: accountId,
      state: 'AttestNew',
      initiatedData: initTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateNewHandler.js.map