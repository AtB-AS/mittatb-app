"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteLocalHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

function deleteLocalHandler(getClientState) {
  return (0, _HandlerFactory.stateHandlerFactory)(['DeleteLocal'], async _ => {
    const {
      accountId
    } = getClientState();
    (0, _native.deleteToken)(accountId);
    return {
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map