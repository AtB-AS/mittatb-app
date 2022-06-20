import {RemoteToken} from '@atb/mobile-token/types';
import {TokenAction} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src';

export const findInspectable = (remoteTokens?: RemoteToken[]) =>
  remoteTokens?.find(isInspectable);

export const isInspectable = (remoteToken: RemoteToken) =>
  remoteToken.allowedActions.includes(
    TokenAction[TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
  );

export const isTravelCardToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'TOKEN_TYPE_TRAVELCARD';

export const isMobileToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'TOKEN_TYPE_MOBILE';

export const getDeviceName = (remoteToken?: RemoteToken) =>
  remoteToken?.keyValues?.find((kv) => kv.key === 'deviceName')?.value;

export const getTravelCardId = (remoteToken?: RemoteToken) =>
  remoteToken?.keyValues?.find((kv) => kv.key === 'travelCardId')?.value;
