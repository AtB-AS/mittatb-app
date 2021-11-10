import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../..';
export default function getTokenCertificateHandler(abtTokensService: AbtTokensService, getClientState: () => Required<ClientState>): StateHandler;
