"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteLocalHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

function deleteLocalHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['DeleteLocal'], async _ => {
    (0, _native.deleteToken)();
    return {
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map