import type { AbtTokensService } from '../../abt-tokens-service';
import { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../..';
export default function activateRenewalHandler(abtTokensService: AbtTokensService, getClientState: () => Required<ClientState>): StateHandler;
