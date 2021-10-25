import { Platform } from 'react-native';
import { stateHandlerFactory } from '../HandlerFactory';
const requireAttestation = Platform.select({
  default: true,
  ios: false
});
export default function initiateNewHandler(abtTokensService) {
  return stateHandlerFactory(['InitiateNew'], async _ => {
    const initTokenResponse = await abtTokensService.initToken({
      requireAttestation,
      deviceName: 'tempDeviceName' // todo: How to get?

    });
    return {
      state: 'AttestNew',
      initiatedData: initTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateNewHandler.js.map