import type { ClientState } from '../../..';
import { StateHandler } from '../HandlerFactory';
export default function addTokenHandler(getClientState: () => Required<ClientState>): StateHandler;
