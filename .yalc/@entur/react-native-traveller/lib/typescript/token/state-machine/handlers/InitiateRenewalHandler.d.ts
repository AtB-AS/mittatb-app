import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import type { ClientStateRetriever } from '../../..';
export default function initiateRenewalHandler(abtTokensService: AbtTokensService, getClientState: ClientStateRetriever): StateHandler;
