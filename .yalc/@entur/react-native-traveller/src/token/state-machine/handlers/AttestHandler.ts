import { logger } from '../../../logger';
import { getActivateTokenRequestBody } from '../../attest';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function attestHandler(): StateHandler {
  return stateHandlerFactory(['AttestNew', 'AttestRenewal'], async (s) => {
    const {
      initiatedData: { tokenId, nonce, attestationEncryptionPublicKey },
      accountId,
      state,
    } = s;

    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state,
    });

    const activateTokenRequestBody = await getActivateTokenRequestBody(
      accountId,
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    );

    if (s.state !== 'AttestNew') {
      return {
        accountId: accountId,
        state: 'ActivateRenewal',
        oldTokenId: s.oldTokenId,
        tokenId: tokenId,
        attestationData: activateTokenRequestBody,
      };
    }

    return {
      accountId: accountId,
      state: 'ActivateNew',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody,
    };
  });
}
