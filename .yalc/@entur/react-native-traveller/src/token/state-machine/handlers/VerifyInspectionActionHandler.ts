import { logger } from '../../../logger';
import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function verifyInspectionActionHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(
    ['VerifyInspectionAction'],
    async ({ accountId, tokenId }) => {
      logger.info('verify_inspection_action', undefined, {
        accountId,
        tokenId,
      });
      await abtTokensService.toggleToken(tokenId, {
        overrideExisting: false,
      });

      return {
        accountId,
        state: 'Valid',
        tokenId,
      };
    }
  );
}
