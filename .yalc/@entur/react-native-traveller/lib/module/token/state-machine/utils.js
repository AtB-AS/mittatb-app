export const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};
const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';
export const getStoreKey = accountId => `${STORAGE_KEY_PREFIX}#${accountId}`;
//# sourceMappingURL=utils.js.map