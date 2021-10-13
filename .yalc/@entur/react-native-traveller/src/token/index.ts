import type { AbtTokensService } from './abt-tokens-service';
import type { TokenStatus } from './types';
import loadingHandler from './state-handlers/LoadingHandler';
import validatingHandler from './state-handlers/ValidatingHandler';
import initiatingHandler from './state-handlers/InitiatingHandler';
import renewingHandler from './state-handlers/RenewingHandler';

export const startTokenStateMachine = async (
  abtTokensService: AbtTokensService,
  setStatus: (s: TokenStatus) => void,
  lastStatus?: TokenStatus
) => {
  const shouldContinue = (s: TokenStatus) => s.state !== 'Valid' && !s.error;
  let currentStatus = lastStatus;
  do {
    currentStatus = await processStatus(abtTokensService, currentStatus);
    setStatus(currentStatus);
  } while (shouldContinue(currentStatus));
};

const processStatus = async (
  abtTokensService: AbtTokensService,
  status?: TokenStatus
): Promise<TokenStatus> => {
  switch (status?.state) {
    case undefined:
      return { state: 'Loading' };
    case 'Valid':
    case 'Loading':
      return loadingHandler();
    case 'Validating':
      return validatingHandler(abtTokensService);
    case 'Initiating':
      return initiatingHandler(abtTokensService);
    case 'Renewing':
      return renewingHandler(abtTokensService);
  }
};
