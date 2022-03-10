"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initiateNewHandler;

var _reactNative = require("react-native");

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

var _logger = require("../../../logger");

const requireAttestation = _reactNative.Platform.select({
  default: true,
  ios: false
});

function initiateNewHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['InitiateNew'], async s => {
    let deviceName = 'unknown';

    try {
      deviceName = await (0, _native.getDeviceName)();
    } catch {}

    const {
      accountId
    } = s;

    _logger.logger.info('initiate_new', undefined, {
      deviceName,
      accountId
    });

    const initTokenResponse = await abtTokensService.initToken({
      requireAttestation,
      deviceName
    });
    return {
      accountId: accountId,
      state: 'AttestNew',
      initiatedData: initTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateNewHandler.js.map