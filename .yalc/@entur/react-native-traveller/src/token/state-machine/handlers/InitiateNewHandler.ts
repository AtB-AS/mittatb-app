import type { AbtTokensService } from '../../abt-tokens-service';
import { Platform } from 'react-native';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { getDeviceName } from '../../../native';

const requireAttestation = Platform.select({
  default: true,
  ios: false,
});

export default function initiateNewHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['InitiateNew'], async (s) => {
    let deviceName = 'unknown';
    try {
      deviceName = await getDeviceName();
    } catch {}

    const initTokenResponse = await abtTokensService.initToken({
      requireAttestation,
      deviceName,
    });

    return {
      accountId: s.accountId,
      state: 'AttestNew',
      initiatedData: initTokenResponse,
    };
  });
}
