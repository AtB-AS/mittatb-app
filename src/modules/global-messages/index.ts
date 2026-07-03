import {AppGlobalMessageContextEnum} from '@atb-as/utils';

export const GlobalMessageContextEnum = AppGlobalMessageContextEnum;
export type GlobalMessageContextEnum = AppGlobalMessageContextEnum;

export {
  GlobalMessagesContextProvider,
  useGlobalMessagesContext,
} from './GlobalMessagesContext';
export {GlobalMessage} from './GlobalMessage';
