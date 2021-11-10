import type { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../..';
export default function attestHandler(getClientState: () => Required<ClientState>): StateHandler;
