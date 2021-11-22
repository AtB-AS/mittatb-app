import { getActivateTokenRequestBody } from '../../attest';
import { stateHandlerFactory } from '../HandlerFactory';
export default function attestHandler() {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const activateTokenRequestBody = await getActivateTokenRequestBody(s.accountId, tokenId, nonce, attestationEncryptionPublicKey);
    return {
      accountId: s.accountId,
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map