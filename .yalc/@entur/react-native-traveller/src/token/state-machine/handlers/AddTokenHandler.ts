import { addToken } from '../../../native';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function addTokenHandler(): StateHandler {
  return stateHandlerFactory(['AddToken'], async (s) => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart,
    } = s.activatedData;

    await addToken(
      s.accountId,
      tokenId,
      certificate,
      tokenValidityStart,
      tokenValidityEnd
    );
    return {
      accountId: s.accountId,
      state: 'VerifyInspectionAction',
      tokenId,
    };
  });
}
