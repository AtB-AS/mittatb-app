import { getActivateTokenRequestBody } from '../../attest';
import { stateHandlerFactory } from '../HandlerFactory';
export default function attestHandler(_, getClientState) {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const {
      accountId
    } = getClientState();
    const activateTokenRequestBody = await getActivateTokenRequestBody(accountId, tokenId, nonce, attestationEncryptionPublicKey);
    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map