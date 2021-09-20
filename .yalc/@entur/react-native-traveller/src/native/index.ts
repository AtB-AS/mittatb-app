import { NativeModules } from 'react-native';
import type { AttestationData, LegacyAttestationData, Token } from './types';

type EnturTravellerType = {
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
  generateQrCode(): Promise<string>;
};

export const {
  attest,
  attestLegacy,
  addToken,
  getToken,
  deleteToken,
  generateQrCode,
}: EnturTravellerType = NativeModules.EnturTraveller;
