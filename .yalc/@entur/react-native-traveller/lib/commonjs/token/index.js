"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTokenStateMachine = void 0;

var _LoadingHandler = _interopRequireDefault(require("./state-machine/handlers/LoadingHandler"));

var _ValidatingHandler = _interopRequireDefault(require("./state-machine/handlers/ValidatingHandler"));

var _InitiateNewHandler = _interopRequireDefault(require("./state-machine/handlers/InitiateNewHandler"));

var _InitiateRenewalHandler = _interopRequireDefault(require("./state-machine/handlers/InitiateRenewalHandler"));

var _GetTokenCertificateHandler = _interopRequireDefault(require("./state-machine/handlers/GetTokenCertificateHandler"));

var _AttestHandler = _interopRequireDefault(require("./state-machine/handlers/AttestHandler"));

var _ActivateRenewalHandler = _interopRequireDefault(require("./state-machine/handlers/ActivateRenewalHandler"));

var _AddTokenHandler = _interopRequireDefault(require("./state-machine/handlers/AddTokenHandler"));

var _ActivateNewHandler = _interopRequireDefault(require("./state-machine/handlers/ActivateNewHandler"));

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _DeleteLocalHandler = _interopRequireDefault(require("./state-machine/handlers/DeleteLocalHandler"));

var _StartingHandler = _interopRequireDefault(require("./state-machine/handlers/StartingHandler"));

var _NotSupportedHandler = _interopRequireDefault(require("./state-machine/handlers/NotSupportedHandler"));

var _utils = require("./state-machine/utils");

var _VerifyInspectionActionHandler = _interopRequireDefault(require("./state-machine/handlers/VerifyInspectionActionHandler"));

var _logger = require("../logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const startTokenStateMachine = async (abtTokensService, setStatus, safetyNetApiKey, forceRestart = false, accountId) => {
  if (!accountId) {
    setStatus(undefined);
  } else {
    const storeKey = (0, _utils.getStoreKey)(accountId);
    let currentState = {
      accountId,
      state: 'Starting'
    };
    setStatus(currentState);

    try {
      while (shouldContinue(currentState)) {
        const handler = getStateHandler(abtTokensService, currentState, safetyNetApiKey, forceRestart);
        currentState = await handler(currentState);
        await _asyncStorage.default.setItem(storeKey, JSON.stringify(currentState));
        setStatus(currentState);
      }
    } catch (err) {
      _logger.logger.error(undefined, err, undefined);

      console.warn('Unexpected error', err);
      setStatus({ ...currentState,
        error: {
          missingNetConnection: false,
          message: 'Unexpected error',
          err
        }
      });
    }
  }
};

exports.startTokenStateMachine = startTokenStateMachine;

const shouldContinue = s => s.state !== 'Valid' && s.state !== 'NotSupported' && !s.error;

const getStateHandler = (abtTokensService, storedState, safetyNetApiKey, forceRestart) => {
  switch (storedState.state) {
    case 'Starting':
      return (0, _StartingHandler.default)(safetyNetApiKey, forceRestart);

    case 'Valid':
    case 'Loading':
      return (0, _LoadingHandler.default)();

    case 'Validating':
      return (0, _ValidatingHandler.default)(abtTokensService);

    case 'DeleteLocal':
      return (0, _DeleteLocalHandler.default)();

    case 'InitiateNew':
      return (0, _InitiateNewHandler.default)(abtTokensService);

    case 'InitiateRenewal':
      return (0, _InitiateRenewalHandler.default)(abtTokensService);

    case 'GettingTokenCertificate':
      return (0, _GetTokenCertificateHandler.default)(abtTokensService);

    case 'AttestNew':
    case 'AttestRenewal':
      return (0, _AttestHandler.default)();

    case 'ActivateNew':
      return (0, _ActivateNewHandler.default)(abtTokensService);

    case 'ActivateRenewal':
      return (0, _ActivateRenewalHandler.default)(abtTokensService);

    case 'AddToken':
      return (0, _AddTokenHandler.default)();

    case 'VerifyInspectionAction':
      return (0, _VerifyInspectionActionHandler.default)(abtTokensService);

    case 'NotSupported':
      return (0, _NotSupportedHandler.default)();
  }
};
//# sourceMappingURL=index.js.map