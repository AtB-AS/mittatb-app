import {
  PendingTokenDetails,
  ActiveTokenDetails,
} from '@entur-private/abt-token-server-javascript-interface';

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

export type PendingToken = {
  tokenId: string;
  attestation: string;
  attestationType: string;
  encryptionCertificateChain?: string[];
  signatureCertificateChain?: string[];
};

export type InitRequest = {
  name: string;
  preferRequireAttestation?: boolean;
  deviceInfo?: string[];
  deviceInfoType?: string;
};

export type RemoveRequestParams = {
  tokenId: string;
};

export type RemoveTokenResponse = {
  removed: boolean;
};

export type RemoveTokensResponse = {
  allRemoved: boolean;
};

export type InitiateTokenResponse = {
  pendingTokenDetails: PendingTokenDetails;
};

export type CompleteTokenInitializationResponse = {
  activeTokenDetails: ActiveTokenDetails;
};

export type GetTokenDetailsResponse = {
  activeTokenDetails: ActiveTokenDetails;
};

export type CompleteTokenRenawalResponse = {
  activeTokenDetails: ActiveTokenDetails;
};

export type InitiateTokenRenewalResponse = {
  pendingTokenDetails: PendingTokenDetails;
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
