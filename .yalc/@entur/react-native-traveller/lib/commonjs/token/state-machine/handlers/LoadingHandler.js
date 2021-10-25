"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadingHandler;

var _native = require("../../../native");

var _HandlerFactory = require("../HandlerFactory");

const secondsIn48Hours = 48 * 60 * 60;

function loadingHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['Loading'], async _ => {
    const token = await (0, _native.getToken)();

    if (!token) {
      return {
        state: 'InitiateNew'
      };
    } else {
      return tokenNeedsRenewal(token) ? {
        state: 'InitiateRenewal'
      } : {
        state: 'Validating',
        token
      };
    }
  });
}
/**
 * Whether the token needs renewal or not. The token needs renewal if the
 * remaining validity period is less than 48 hours and less than 20% of the
 * total validity time.
 */


const tokenNeedsRenewal = token => {
  const twentyPercentOfValidityPeriod = (token.tokenValidityEnd - token.tokenValidityStart) * 0.2;
  const timeLeftWhenRenewalNecessary = Math.min(secondsIn48Hours, twentyPercentOfValidityPeriod);
  const renewalCutoffTime = token.tokenValidityEnd - timeLeftWhenRenewalNecessary;
  const nowSeconds = Date.now() / 1000;
  return nowSeconds > renewalCutoffTime;
};
//# sourceMappingURL=LoadingHandler.js.map