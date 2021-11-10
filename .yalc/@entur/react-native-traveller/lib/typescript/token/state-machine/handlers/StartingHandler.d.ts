import type { StateHandler } from '../HandlerFactory';
import type { ClientState } from '../../..';
export default function startingHandler(getClientState: () => Required<ClientState>, safetyNetApiKey: string, forceRestart: boolean): StateHandler;
