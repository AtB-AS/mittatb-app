"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStoreKey = exports.verifyCorrectTokenId = void 0;

const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};

exports.verifyCorrectTokenId = verifyCorrectTokenId;
const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';

const getStoreKey = accountId => `${STORAGE_KEY_PREFIX}#${accountId}`;

exports.getStoreKey = getStoreKey;
//# sourceMappingURL=utils.js.map