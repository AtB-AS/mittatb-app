import {
  ActivatedToken,
  AttestationSabotage,
  createClient,
  DefaultAttestationCreationErrorStrategy,
  DefaultAttestationVerificationErrorStrategy,
  encodeAsSecureContainer,
  Token,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {localLogger, remoteLogger} from './abtClientLogger';
import {tokenService} from './tokenService';
import {HALF_DAY_MS} from '@atb/utils/durations';
import {Platform} from 'react-native';
const CONTEXT_ID = 'main';

/**
 * Decides which error handling strategy should use the SDK-suggested solution)
 * Permanent errors (e.g: no Google Play)
 * Transient errors (e.g: network errors)
 * User interaction required errors (e.g: update Google Play Services)
 * Unknown errors
 */
const attestationCreationErrorStrategy =
  new DefaultAttestationCreationErrorStrategy(true, false, true, true);

/**
 * Decides which error handling strategy should use the SDK-suggested solution)
 * Permanent errors (e.g: no Google Play)
 * Transient errors (e.g: network errors)
 * Unknown errors
 */
const attestationVerificationErrorStrategy =
  new DefaultAttestationVerificationErrorStrategy(true, true, true);

export const abtClient = createClient({
  tokenContextIds: [CONTEXT_ID],
  attestation: {
    attestationType:
      Platform.OS === 'android' ? 'PlayIntegrityAPIAttestation' : undefined,
    attestationCreationErrorStrategy: attestationCreationErrorStrategy,
    attestationVerificationErrorStrategy: attestationVerificationErrorStrategy,
  },
  remoteTokenService: tokenService,
  localLogger,
  remoteLogger,
  time: {
    autoStart: true,
    maxDelayInMilliSeconds: 1000,
    parallelizationCount: 3,
    host: 'time.google.com',
  },
});

export const mobileTokenClient = {
  get: (traceId: string) => abtClient.getToken(CONTEXT_ID, traceId),
  create: (traceId: string) => abtClient.createToken(CONTEXT_ID, traceId),
  encode: (token: Token, tokenActions?: TokenAction[]) =>
    encodeAsSecureContainer(
      CONTEXT_ID,
      token.tokenId,
      [],
      tokenActions ?? [TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
      false,
    ),
  clear: () => abtClient.clearToken(CONTEXT_ID),
  renew: (token: ActivatedToken, traceId: string) =>
    abtClient.renewToken(token, traceId),
  /*
  Check if token should be renewed. Will return true if either:
   - Token is expired
   - It is less than 12 hours until token expires
   - Less than 10 % of the token validity time is left
   */
  shouldRenew: (token: ActivatedToken) =>
    abtClient.shouldPreemptiveRenew(token, HALF_DAY_MS, 10),
  currentTimeMillis: () => abtClient.getCurrentTimeMillis(),
  setDebugSabotage: (attestationSabotage: AttestationSabotage) =>
    abtClient.setAttestationSabotage(attestationSabotage),
  clearDebugSabotage: () => abtClient.clearAttestationSabotage(),
};
