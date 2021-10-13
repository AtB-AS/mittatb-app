import { getToken } from '../../native';
export default async function validatingHandler(abtTokensService) {
  try {
    const token = await getToken();

    if (!token) {
      return {
        state: 'Initiating'
      };
    }

    const tokens = await abtTokensService.listTokens();
    const tokenFound = tokens.some(t => t.id === token.tokenId);
    return {
      state: tokenFound ? 'Valid' : 'Initiating'
    };
  } catch (err) {
    return {
      state: 'Validating',
      error: {
        type: 'Unknown',
        message: 'Error validating token backend status',
        err
      }
    };
  }
}
//# sourceMappingURL=ValidatingHandler.js.map