export const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};
//# sourceMappingURL=utils.js.map