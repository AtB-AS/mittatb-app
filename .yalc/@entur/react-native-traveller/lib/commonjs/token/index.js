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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';

const getStoreKey = accountId => `${STORAGE_KEY_PREFIX}#${accountId}`;

const startTokenStateMachine = async (abtTokensService, setStatus, getClientState, forceRestart = false) => {
  const {
    accountId
  } = getClientState();
  const storeKey = getStoreKey(accountId);
  let currentState = await getInitialState(forceRestart, storeKey);

  try {
    const shouldContinue = s => s.state !== 'Valid' && !s.error;

    do {
      const handler = getStateHandler(abtTokensService, currentState, getClientState);
      currentState = await handler(currentState);
      await _asyncStorage.default.setItem(storeKey, JSON.stringify(currentState));
      setStatus(currentState);
    } while (shouldContinue(currentState));
  } catch (err) {
    console.warn('Unexpected error', err);
    setStatus({ ...currentState,
      error: {
        type: 'Unknown',
        message: 'Unexpected error',
        err
      }
    });
  }
};

exports.startTokenStateMachine = startTokenStateMachine;

const getInitialState = async (forceRestart, storeKey) => {
  if (forceRestart) {
    return {
      state: 'Loading'
    };
  }

  const savedStateString = await _asyncStorage.default.getItem(storeKey);
  return savedStateString ? JSON.parse(savedStateString) : {
    state: 'Loading'
  };
};

const getStateHandler = (abtTokensService, storedState, getClientState) => {
  switch (storedState.state) {
    case 'Valid':
    case 'Loading':
      return (0, _LoadingHandler.default)(getClientState);

    case 'Validating':
      return (0, _ValidatingHandler.default)(abtTokensService);

    case 'DeleteLocal':
      return (0, _DeleteLocalHandler.default)(getClientState);

    case 'InitiateNew':
      return (0, _InitiateNewHandler.default)(abtTokensService);

    case 'InitiateRenewal':
      return (0, _InitiateRenewalHandler.default)(abtTokensService, getClientState);

    case 'GettingTokenCertificate':
      return (0, _GetTokenCertificateHandler.default)(abtTokensService, getClientState);

    case 'AttestNew':
    case 'AttestRenewal':
      return (0, _AttestHandler.default)(abtTokensService, getClientState);

    case 'ActivateNew':
      return (0, _ActivateNewHandler.default)(abtTokensService);

    case 'ActivateRenewal':
      return (0, _ActivateRenewalHandler.default)(abtTokensService, getClientState);

    case 'AddToken':
      return (0, _AddTokenHandler.default)(abtTokensService, getClientState);
  }
};
//# sourceMappingURL=index.js.map