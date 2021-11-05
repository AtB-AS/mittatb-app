import type { AbtTokensService } from '../../abt-tokens-service';
import { StateHandler } from '../HandlerFactory';
import type { ClientStateRetriever } from '../../..';
export default function activateRenewalHandler(abtTokensService: AbtTokensService, getClientState: ClientStateRetriever): StateHandler;
