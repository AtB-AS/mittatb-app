import {
  ActivatedToken,
  PendingToken,
} from '@entur-private/abt-mobile-client-sdk';
import {AttestationCreationErrorStrategy} from '@entur-private/abt-token-state-react-native-lib';

export const AttestationCreationErrorHandler: AttestationCreationErrorStrategy =
  {
    onPendingTokenAttestationCreationError(
      activatedToken: ActivatedToken | undefined,
      pendingToken: PendingToken,
      e: Error,
    ): void {
      pendingToken.setAttestationCreationError(e.name, e.message);
    },

    onActiveTokenAttestationCreationError(
      activatedToken: ActivatedToken,
      e: Error,
    ): void {
      activatedToken.setAttestationCreationError(e.name, e.message);
    },
  };
