"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteLocalHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

function deleteLocalHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['DeleteLocal'], async s => {
    (0, _native.deleteToken)(s.accountId);
    return {
      accountId: s.accountId,
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map