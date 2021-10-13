export const verifyCorrectTokenId = (
  initialTokenId: string,
  tokenId: string
) => {
  if (tokenId !== initialTokenId) {
    throw Error(
      `Activated token ${tokenId} does not match initial token id ${initialTokenId}`
    );
  }
};
