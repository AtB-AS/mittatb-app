import type { ActivatedToken, PendingToken, Token } from '../../../../token-core-javascript-lib'
import type {
    PendingTokenDetails,
    ActiveTokenDetails,
    Reattestation,
} from '../../../../token-server-node-lib/types'

export interface RemoteTokenService {
    initiateNewMobileToken: (
        correlationId: string,
        isEmulator: boolean,
    ) => Promise<PendingTokenDetails>

    activateNewMobileToken: (
        pendingToken: PendingToken,
        correlationId: string,
    ) => Promise<ActiveTokenDetails>

    initiateMobileTokenRenewal: (
        token: Token,
        secureContainer: string,
        correlationId: string,
        reattestation?: Reattestation,
    ) => Promise<PendingTokenDetails>

    completeMobileTokenRenewal: (
        pendingToken: PendingToken,
        secureContainer: string,
        activatedToken: ActivatedToken,
        correlationId: string,
        reattestation?: Reattestation,
    ) => Promise<ActiveTokenDetails>

    getMobileTokenDetails: (
        token: Token,
        secureContainer: string,
        correlationId: string,
        reattestation?: Reattestation,
    ) => Promise<ActiveTokenDetails>
}
