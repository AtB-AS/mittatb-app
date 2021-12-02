"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttestationSupport = exports.getSecureToken = exports.deleteToken = exports.getToken = exports.addToken = exports.attestLegacy = exports.attest = exports.start = void 0;

var _reactNative = require("react-native");

const {
  start,
  attest,
  attestLegacy,
  addToken,
  getToken,
  deleteToken,
  getSecureToken,
  getAttestationSupport
} = _reactNative.NativeModules.EnturTraveller;
exports.getAttestationSupport = getAttestationSupport;
exports.getSecureToken = getSecureToken;
exports.deleteToken = deleteToken;
exports.getToken = getToken;
exports.addToken = addToken;
exports.attestLegacy = attestLegacy;
exports.attest = attest;
exports.start = start;
//# sourceMappingURL=index.js.map