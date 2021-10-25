import { getActivateTokenRequestBody } from '../../attest';
import { stateHandlerFactory } from '../HandlerFactory';
export default function attestHandler(_) {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const activateTokenRequestBody = await getActivateTokenRequestBody(tokenId, nonce, attestationEncryptionPublicKey);
    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map