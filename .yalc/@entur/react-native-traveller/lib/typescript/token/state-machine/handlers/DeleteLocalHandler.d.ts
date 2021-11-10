import type { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../..';
export default function deleteLocalHandler(getClientState: () => Required<ClientState>): StateHandler;
