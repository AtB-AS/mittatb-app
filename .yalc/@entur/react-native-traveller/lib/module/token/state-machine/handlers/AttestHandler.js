import { getActivateTokenRequestBody } from '../../attest';
import { stateHandlerFactory } from '../HandlerFactory';
export default function attestHandler(accountId) {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const activateTokenRequestBody = await getActivateTokenRequestBody(accountId, tokenId, nonce, attestationEncryptionPublicKey);
    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map