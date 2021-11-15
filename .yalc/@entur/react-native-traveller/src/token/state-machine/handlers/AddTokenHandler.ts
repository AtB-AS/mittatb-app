import { addToken } from '../../../native';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function addTokenHandler(accountId: string): StateHandler {
  return stateHandlerFactory(['AddToken'], async (s) => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart,
    } = s.activatedData;

    await addToken(
      accountId,
      tokenId,
      certificate,
      tokenValidityStart,
      tokenValidityEnd
    );
    return { state: 'Valid' };
  });
}
