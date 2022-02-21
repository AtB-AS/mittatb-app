import NetInfo from '@react-native-community/netinfo';
export const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};
const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';
export const getStoreKey = accountId => `${STORAGE_KEY_PREFIX}#${accountId}`;
export const missingNetConnection = () => NetInfo.fetch().then(state => {
  var _state$isConnected;

  return (_state$isConnected = !state.isConnected) !== null && _state$isConnected !== void 0 ? _state$isConnected : true;
});
export const isTokenInspectable = (tokens, tokenId) => {
  var _tokens$find;

  return ((_tokens$find = tokens.find(t => t.id === tokenId)) === null || _tokens$find === void 0 ? void 0 : _tokens$find.allowedActions.includes('TOKEN_ACTION_TICKET_INSPECTION')) || false;
};
//# sourceMappingURL=utils.js.map