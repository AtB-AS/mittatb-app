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

const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';
export const getStoreKey = (accountId: string) =>
  `${STORAGE_KEY_PREFIX}#${accountId}`;
