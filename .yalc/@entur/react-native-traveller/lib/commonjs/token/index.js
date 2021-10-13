"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTokenStateMachine = void 0;

var _LoadingHandler = _interopRequireDefault(require("./state-handlers/LoadingHandler"));

var _ValidatingHandler = _interopRequireDefault(require("./state-handlers/ValidatingHandler"));

var _InitiatingHandler = _interopRequireDefault(require("./state-handlers/InitiatingHandler"));

var _RenewingHandler = _interopRequireDefault(require("./state-handlers/RenewingHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const startTokenStateMachine = async (abtTokensService, setStatus, lastStatus) => {
  const shouldContinue = s => s.state !== 'Valid' && !s.error;

  let currentStatus = lastStatus;

  do {
    currentStatus = await processStatus(abtTokensService, currentStatus);
    setStatus(currentStatus);
  } while (shouldContinue(currentStatus));
};

exports.startTokenStateMachine = startTokenStateMachine;

const processStatus = async (abtTokensService, status) => {
  switch (status === null || status === void 0 ? void 0 : status.state) {
    case undefined:
      return {
        state: 'Loading'
      };

    case 'Valid':
    case 'Loading':
      return (0, _LoadingHandler.default)();

    case 'Validating':
      return (0, _ValidatingHandler.default)(abtTokensService);

    case 'Initiating':
      return (0, _InitiatingHandler.default)(abtTokensService);

    case 'Renewing':
      return (0, _RenewingHandler.default)(abtTokensService);
  }
};
//# sourceMappingURL=index.js.map