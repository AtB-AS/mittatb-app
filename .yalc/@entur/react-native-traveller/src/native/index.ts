import { NativeModules } from 'react-native';
import type {
  AttestationData,
  LegacyAttestationData,
  PayloadAction,
  Token,
} from './types';

export type EnturTravellerType = {
  attest(tokenId: string, nonce: string): Promise<AttestationData>;
  attestLegacy(
    tokenId: string,
    nonce: string,
    serverPublicKey: string
  ): Promise<LegacyAttestationData>;
  addToken(
    tokenId: string,
    certificate: string,
    tokenValidityStart: number,
    tokenValidityEnd: number
  ): Promise<void>;
  getToken(): Promise<Token | undefined>;
  deleteToken(): Promise<void>;
  getSecureToken(actions: PayloadAction[]): Promise<string>;
};

export const {
  attest,
  attestLegacy,
  addToken,
  getToken,
  deleteToken,
  getSecureToken,
}: EnturTravellerType = NativeModules.EnturTraveller;
