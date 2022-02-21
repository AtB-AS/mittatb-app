"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTokenInspectable = exports.missingNetConnection = exports.getStoreKey = exports.verifyCorrectTokenId = void 0;

var _netinfo = _interopRequireDefault(require("@react-native-community/netinfo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verifyCorrectTokenId = (initialTokenId, tokenId) => {
  if (tokenId !== initialTokenId) {
    throw Error(`Activated token ${tokenId} does not match initial token id ${initialTokenId}`);
  }
};

exports.verifyCorrectTokenId = verifyCorrectTokenId;
const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';

const getStoreKey = accountId => `${STORAGE_KEY_PREFIX}#${accountId}`;

exports.getStoreKey = getStoreKey;

const missingNetConnection = () => _netinfo.default.fetch().then(state => {
  var _state$isConnected;

  return (_state$isConnected = !state.isConnected) !== null && _state$isConnected !== void 0 ? _state$isConnected : true;
});

exports.missingNetConnection = missingNetConnection;

const isTokenInspectable = (tokens, tokenId) => {
  var _tokens$find;

  return ((_tokens$find = tokens.find(t => t.id === tokenId)) === null || _tokens$find === void 0 ? void 0 : _tokens$find.allowedActions.includes('TOKEN_ACTION_TICKET_INSPECTION')) || false;
};

exports.isTokenInspectable = isTokenInspectable;
//# sourceMappingURL=utils.js.map