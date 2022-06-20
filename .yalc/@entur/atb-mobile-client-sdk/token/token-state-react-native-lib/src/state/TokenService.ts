import type { ActivatedToken } from '../../../token-core-javascript-lib/src'

import type TokenFactory from './TokenFactory'
import type TokenProvider from './provider/TokenProvider'
import { buildReattestation } from '../native/TokenCoreBridge'
import { abtClientLogger } from '../logger'

export class TokenService {
    constructor(
        private readonly tokenFactory: TokenFactory,
        private readonly tokenProvider: TokenProvider,
    ) {}

    /**
     * @throws TokenError
     * @throws DeviceAttestationError
     * @throws DeviceAttestationRemoteError
     */
    getToken = (contextId: string, traceId: string): Promise<ActivatedToken> => {
        return this.tokenProvider.getToken(contextId, traceId)
    }

    createToken = (
        contextId: string,
        tokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ): Promise<ActivatedToken> => {
        return this.tokenFactory.createNewToken(
            contextId,
            tokenId,
            nonce,
            attestationEncryptionPublicKey,
            traceId,
        )
    }

    clearToken = (contextId: string) => {
        abtClientLogger.info('Clearing token locally for context ' + contextId)
        return this.tokenFactory.clearByContextId(contextId)
    }

    buildReattestation = (
        contextId: string,
        tokenId: string,
        reattestationData: string,
    ) => {
        return buildReattestation(
            contextId,
            tokenId,
            reattestationData,
        )
    }
}
