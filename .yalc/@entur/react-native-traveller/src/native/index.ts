import { NativeModules } from 'react-native';
import type {
  AttestationData,
  AttestationSupport,
  LegacyAttestationData,
  PayloadAction,
  Token,
} from './types';

export type EnturTravellerType = {
  start(safetyNetApiKey?: string): Promise<AttestationData>;
  getAttestationSupport(): Promise<AttestationSupport>;
  attest(
    accountId: string,
    tokenId: string,
    nonce: string
  ): Promise<AttestationData>;
  attestLegacy(
    accountId: string,
    tokenId: string,
    nonce: string,
    serverPublicKey: string
  ): Promise<LegacyAttestationData>;
  addToken(
    accountId: string,
    tokenId: string,
    certificate: string,
    tokenValidityStart: number,
    tokenValidityEnd: number,
    nonce?: string
  ): Promise<void>;
  getToken(accountId: string): Promise<Token | undefined>;
  deleteToken(accountId: string): Promise<void>;
  getSecureToken(accountId: string, actions: PayloadAction[]): Promise<string>;
};

export const {
  start,
  attest,
  attestLegacy,
  addToken,
  getToken,
  deleteToken,
  getSecureToken,
  getAttestationSupport,
}: EnturTravellerType = NativeModules.EnturTraveller;
