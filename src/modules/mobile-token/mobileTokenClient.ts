import {
  createAbtMobileClientAndProvider,
  HybridLifetimePercentage,
} from '@entur-private/react-native-abt';
import {localLogger} from './abtClientLogger';
import {tokenService} from './tokenService';
export const CONTEXT_ID = 'main';

/**
 * All of the SDK's remote calls go to our token-service over REST, which
 * applies AtB's token rules and calls Entur ABT. The app has no Entur API key.
 * Visual inspection is not used, so `getVisualInspectionNonces` rejects. It
 * can't be left out, since Android then falls back to its native gRPC client.
 */
export const {AbtMobileClientProvider, AbtMobileClient} =
  createAbtMobileClientAndProvider({
    tokenContextIds: [CONTEXT_ID],
    remoteTokenService: {
      initiateNewMobileToken: tokenService.initiateNewMobileToken,
      activateNewMobileToken: tokenService.activateNewMobileToken,
      initiateMobileTokenRenewal: tokenService.initiateMobileTokenRenewal,
      completeMobileTokenRenewal: tokenService.completeMobileTokenRenewal,
      getMobileTokenDetails: tokenService.getMobileTokenDetails,
      reattestMobileToken: tokenService.reattestMobileToken,
      getVisualInspectionNonces: () =>
        // method must be implemented for Android
        Promise.reject(new Error('Visual inspection is not supported')),
    },
    /*
    Renew when the token is expired, has less than 12 hours left, or is in the
    last 10 % of its lifetime. Same rules as with the v3 SDK.
     */
    renewGuardInterval: {
      tokenExpirationLimitSeconds: 0,
      preemptiveLifetimePercentage: HybridLifetimePercentage.TEN_PERCENT,
      preemptiveMinimumTimeLimitHours: 12,
    },
    remoteLogger: localLogger,
  });
