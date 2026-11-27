export type KeyValue = {
  key: string;
  value: string;
};

export type RemoteToken = {
  id: string;
  name?: string;
  validityStart?: number;
  validityEnd?: number;
  type: string;
  state: string;
  allowedActions: string[];
  deviceId?: string;
  libraryVersion?: string;
  appVersion?: string;
  appVersionCode?: string;
  osVersion?: string;
  osApiLevel?: string;
  keyValues?: KeyValue[];
};

export type ListResponse = {
  tokens: RemoteToken[];
};

export type TokenLimitResponse = {
  toggleMaxLimit?: number;
  toggledCount: number;
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

export type InitRequest = {
  name: string;
  preferRequireAttestation?: boolean;
  deviceInfo?: string[];
  deviceInfoType?: string;
  discardableTokenIds?: string[];
};

export type RemoveTokenResponse = {
  removed: boolean;
};

export type InitiateTokenResponse = {
  pendingTokenDetails: {
    tokenId: string;
    initializationData: string;
  };
};

export type RenewTokenResponse = InitiateTokenResponse;

export type ActiveTokenResponse = {
  activeTokenDetails: {
    tokenId: string;
    tokenDetails: string;
  };
};

export type ActivateTokenRequest = {
  tokenId: string;
  attestationType: string;
  attestation: string;
};

export type Token = RemoteToken & {
  isThisDevice: boolean;
  isInspectable: boolean;
  type: 'travel-card' | 'mobile';
  travelCardId?: string;
};

export type MobileTokenStatus =
  | 'loading'
  | 'success-and-inspectable'
  | 'success-not-inspectable'
  | 'staticQr'
  | 'error'
  | 'fallback';

export type IntercomTokenStatus = 'attested' | 'non-attested' | 'error';
