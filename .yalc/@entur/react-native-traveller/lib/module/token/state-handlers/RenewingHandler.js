import { getActivateTokenRequestBody } from '../attest';
import { addToken, getSecureToken } from '../../native';
import { PayloadAction } from '../../native/types';
import { verifyCorrectTokenId } from './utils';
export default async function renewingHandler(abtTokensService) {
  try {
    const existingToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const {
      tokenId: initialTokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await abtTokensService.renewToken({
      existingToken
    });
    const activateTokenRequestBody = await getActivateTokenRequestBody(initialTokenId, nonce, attestationEncryptionPublicKey);
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = await abtTokensService.activateToken(initialTokenId, { ...activateTokenRequestBody,
      existingToken
    });
    verifyCorrectTokenId(initialTokenId, tokenId);
    await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  } catch (err) {
    return {
      state: 'Renewing',
      error: {
        type: 'Unknown',
        message: 'Error renewing token',
        err
      }
    };
  }
}
//# sourceMappingURL=RenewingHandler.js.map