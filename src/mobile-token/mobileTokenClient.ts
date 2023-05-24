import {
  ActivatedToken,
  createClient,
  encodeAsSecureContainer,
  Token,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {logger} from '@atb/mobile-token/abtClientLogger';
import {tokenService} from '@atb/mobile-token/tokenService';

const CONTEXT_ID = 'main';

const abtClient = createClient({
  tokenContextIds: [CONTEXT_ID],
  attestation: {
    attestationType: 'PlayIntegrityAPIAttestation',
  },
  remoteTokenService: tokenService,
  logger,
});

export const mobileTokenClient = {
  get: (traceId: string) => abtClient.getToken(CONTEXT_ID, traceId),
  create: (traceId: string) => abtClient.createToken(CONTEXT_ID, traceId),
  encode: (token: Token, tokenActions?: TokenAction[]) =>
    encodeAsSecureContainer(
      token,
      [],
      tokenActions ?? [TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
      false,
    ),
  clear: () => abtClient.clearToken(CONTEXT_ID),
  renew: (token: ActivatedToken, traceId: string) =>
    abtClient.renewToken(token, traceId),
};
