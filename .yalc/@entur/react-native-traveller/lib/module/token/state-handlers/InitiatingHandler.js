import { getActivateTokenRequestBody } from '../attest';
import { addToken } from '../../native';
import { verifyCorrectTokenId } from './utils';
import { Platform } from 'react-native';
const requireAttestation = Platform.select({
  default: true,
  ios: false
});
export default async function initiatingHandler(abtTokensService) {
  try {
    const {
      tokenId: initialTokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await abtTokensService.initToken({
      requireAttestation
    });
    const activateTokenRequestBody = await getActivateTokenRequestBody(initialTokenId, nonce, attestationEncryptionPublicKey);
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = await abtTokensService.activateToken(initialTokenId, activateTokenRequestBody);
    verifyCorrectTokenId(initialTokenId, tokenId);
    await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  } catch (err) {
    return {
      state: 'Initiating',
      error: {
        type: 'Unknown',
        message: 'Error initiating new token',
        err
      }
    };
  }
}
//# sourceMappingURL=InitiatingHandler.js.map