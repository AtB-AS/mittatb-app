import { getActivateTokenRequestBody } from '../attest';
import { addToken, getSecureToken } from '../../native';
import type { AbtTokensService } from '../abt-tokens-service';
import { PayloadAction } from '../../native/types';
import { verifyCorrectTokenId } from './utils';
import type { TokenStatus } from '../types';

export default async function renewingHandler(
  abtTokensService: AbtTokensService
): Promise<TokenStatus> {
  try {
    const existingToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const {
      tokenId: initialTokenId,
      nonce,
      attestationEncryptionPublicKey,
    } = await abtTokensService.renewToken({ existingToken });
    const activateTokenRequestBody = await getActivateTokenRequestBody(
      initialTokenId,
      nonce,
      attestationEncryptionPublicKey
    );
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart,
    } = await abtTokensService.activateToken(initialTokenId, {
      ...activateTokenRequestBody,
      existingToken,
    });

    verifyCorrectTokenId(initialTokenId, tokenId);

    await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return { state: 'Valid' };
  } catch (err) {
    return {
      state: 'Renewing',
      error: {
        type: 'Unknown',
        message: 'Error renewing token',
        err,
      },
    };
  }
}
