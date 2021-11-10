import type { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../../';
export default function loadingHandler(getClientState: () => Required<ClientState>): StateHandler;
