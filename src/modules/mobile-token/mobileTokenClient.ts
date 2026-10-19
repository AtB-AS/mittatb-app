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
export const CONTEXT_ID = 'main';

/**
 * Decides which error handling strategy should use the SDK-suggested solution)
 * Permanent errors (e.g: no Google Play)
 * Transient errors (e.g: network errors)
 * User interaction required errors (e.g: update Google Play Services)
 * Unknown errors
 */
const attestationCreationErrorStrategy =
  new DefaultAttestationCreationErrorStrategy(
    true,
    false,
    true,
    true,
    localLogger,
  );

/**
 * Decides which error handling strategy should use the SDK-suggested solution)
 * Permanent errors (e.g: no Google Play)
 * Transient errors (e.g: network errors)
 * Unknown errors
 */
const attestationVerificationErrorStrategy =
  new DefaultAttestationVerificationErrorStrategy(
    true,
    true,
    true,
    localLogger,
  );

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
  create: (traceId: string) =>
    abtClient.createToken(CONTEXT_ID, false, traceId),
  encode: (token: Token, tokenActions?: TokenAction[]) =>
    encodeAsSecureContainer(
      CONTEXT_ID,
      token.tokenId,
      [],
      tokenActions ?? [
        TokenAction.TOKEN_ACTION_TICKET_INSPECTION,
        TokenAction.TOKEN_ACTION_IDENTIFICATION,
      ],
      false,
    ),
  clear: () => abtClient.clearToken(CONTEXT_ID),
  renew: (token: ActivatedToken, traceId: string) =>
    abtClient.renewToken(token, traceId),
  /*
  Check if token should be renewed. Will return true if either:
   - Token is expired
   - It is less than 12 hours until token expires
   - It has lived longer than 90% percent of its total time to live

  Note: the percent argument is the size of the renew window counted back
  from expiry (10 = the last 10% of the time to live), not the elapsed
  lifetime. The SDK's doc comment says the opposite, but its implementation
  (isWithinPreemptiveRenewWindow) behaves as described here.

  see node_modules/@entur-private/abt-token-state-react-native-lib/lib/utils/preemtiveRenewCalculator.js
   */
  shouldRenew: (token: ActivatedToken) =>
    abtClient.shouldPreemptiveRenew(token, HALF_DAY_MS, 10),
  currentTimeMillis: () => abtClient.getCurrentTimeMillis(),
  setDebugSabotage: (attestationSabotage: AttestationSabotage) =>
    abtClient.setAttestationSabotage(attestationSabotage),
  clearDebugSabotage: () => abtClient.clearAttestationSabotage(),
};
