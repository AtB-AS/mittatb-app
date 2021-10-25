"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyCorrectTokenId = void 0;

const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};

exports.verifyCorrectTokenId = verifyCorrectTokenId;
//# sourceMappingURL=utils.js.map