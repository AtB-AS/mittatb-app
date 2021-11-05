import { getActivateTokenRequestBody } from '../../attest';
import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import type { ClientStateRetriever } from '../../..';

export default function attestHandler(
  _: AbtTokensService,
  getClientState: ClientStateRetriever
): StateHandler {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async (s) => {
    const { tokenId, nonce, attestationEncryptionPublicKey } = s.initiatedData;
    const { accountId } = getClientState();
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
