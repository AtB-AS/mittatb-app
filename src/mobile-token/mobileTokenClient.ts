import {
  ActivatedToken,
  createClient,
  encodeAsSecureContainer,
  Token,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {localLogger, remoteLogger} from './abtClientLogger';
import {tokenService} from './tokenService';

const CONTEXT_ID = 'main';

const TWELVE_HOURS_MS = 1000 * 60 * 60 * 12;

const abtClient = createClient({
  tokenContextIds: [CONTEXT_ID],
  attestation: {
    attestationType: 'PlayIntegrityAPIAttestation',
  },
  remoteTokenService: tokenService,
  localLogger,
  remoteLogger,
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
    abtClient.shouldPreemptiveRenew(token, TWELVE_HOURS_MS, 10),
};
