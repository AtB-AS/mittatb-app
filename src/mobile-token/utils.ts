import {RemoteToken} from './types';
import {TokenAction} from '@entur-private/abt-mobile-client-sdk';

export const isInspectable = (remoteToken: RemoteToken) =>
  remoteToken.allowedActions.includes(
    TokenAction[TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
  );

export const isTravelCardToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'ENT:TypeOfTravelDocument:DesfireTravelCard';

export const isMobileToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'ENT:TypeOfTravelDocument:MobileApplication';

export const hasNoTokenType = (remoteToken?: RemoteToken) =>
  isTravelCardToken(remoteToken) && isMobileToken(remoteToken);

export const getTravelCardId = (remoteToken?: RemoteToken) =>
  remoteToken?.keyValues?.find((kv) => kv.key === 'travelCardId')?.value;
