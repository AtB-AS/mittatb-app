"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initiateNewHandler;

var _reactNative = require("react-native");

var _HandlerFactory = require("../HandlerFactory");

const requireAttestation = _reactNative.Platform.select({
  default: true,
  ios: false
});

function initiateNewHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['InitiateNew'], async _ => {
    const initTokenResponse = await abtTokensService.initToken({
      requireAttestation,
      deviceName: 'tempDeviceName' // todo: How to get?

    });
    return {
      state: 'AttestNew',
      initiatedData: initTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateNewHandler.js.map