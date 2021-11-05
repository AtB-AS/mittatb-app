import type { ClientStateRetriever } from '../../..';
import type { AbtTokensService } from '../../abt-tokens-service';
import { StateHandler } from '../HandlerFactory';
export default function addTokenHandler(_: AbtTokensService, getClientState: ClientStateRetriever): StateHandler;
