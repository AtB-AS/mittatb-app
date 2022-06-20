import {KeyValue} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-server-node-lib/types';

export type RemoteToken = {
  id: string;
  validityStart?: number;
  validityEnd?: number;
  type: string;
  state: string;
  allowedActions: string[];
  keyValues?: KeyValue[];
};

export type ListResponse = {
  tokens: RemoteToken[];
};

export type ToggleRequest = {
  tokenId: string;
};

export type ToggleResponse = ListResponse;

export type RemoveRequest = {
  tokenId: string;
};

export type RemoveResponse = {
  removed: boolean;
};
