"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecureToken = exports.deleteToken = exports.getToken = exports.addToken = exports.attestLegacy = exports.attest = void 0;

var _reactNative = require("react-native");

const {
  attest,
  attestLegacy,
  addToken,
  getToken,
  deleteToken,
  getSecureToken
} = _reactNative.NativeModules.EnturTraveller;
exports.getSecureToken = getSecureToken;
exports.deleteToken = deleteToken;
exports.getToken = getToken;
exports.addToken = addToken;
exports.attestLegacy = attestLegacy;
exports.attest = attest;
//# sourceMappingURL=index.js.map