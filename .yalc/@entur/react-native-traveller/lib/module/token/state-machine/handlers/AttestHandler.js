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

    if (s.state !== 'AttestNew') {
      return {
        accountId: s.accountId,
        state: 'ActivateRenewal',
        oldTokenId: s.oldTokenId,
        tokenId: tokenId,
        attestationData: activateTokenRequestBody
      };
    }

    return {
      accountId: s.accountId,
      state: 'ActivateNew',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map