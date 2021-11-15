import { getActivateTokenRequestBody } from '../../attest';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function attestHandler(accountId: string): StateHandler {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async (s) => {
    const { tokenId, nonce, attestationEncryptionPublicKey } = s.initiatedData;
    const activateTokenRequestBody = await getActivateTokenRequestBody(
      accountId,
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    );

    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody,
    };
  });
}
