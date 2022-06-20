import type { ActivatedToken } from '../../../token-core-javascript-lib/src'
import { PendingToken } from '../../../token-core-javascript-lib/src'

import type { TokenStore } from '../native/TokenStore'
import { TokenError, TokenKeystoreError, UnableToCreateTokenError } from '../native/errors'

import type { RemoteTokenService } from './remote/RemoteTokenService'
import AbstractTokenFactory from './AbstractTokenFactory'
import type { TokenContexts } from './TokenContexts'
import { abtClientLogger } from '../logger'

export default class TokenFactory extends AbstractTokenFactory {
    constructor(
        tokenStore: TokenStore,
        remoteTokenService: RemoteTokenService,
        tokenContexts: TokenContexts,
        timeout: number,
    ) {
        super(tokenStore, remoteTokenService, tokenContexts, timeout)
    }

    /**
     * @throws TokenTemporarilyUnavailableException
     * @throws DeviceAttestationRemoteError
     * @throws TokenPropertyStoreException
     */
    getToken = async (contextId: string, traceId: string): Promise<ActivatedToken | undefined> => {
        const context = this.tokenContexts.get(contextId)
        const lock = context.getLock(this.timeout)

        return lock(async () => {
            const token = await this.tokenStore.getToken(contextId)
            if (!token) return undefined // TODO: Logging?
            if (token instanceof PendingToken) {
                return this.completePendingNewToken(token, traceId)
            }
            return token as ActivatedToken

            // TODO: Error handling and renewal forward
        })
    }

    completePendingNewToken = async (
        pendingToken: PendingToken,
        traceId: string,
    ): Promise<ActivatedToken> => {
        return this.activatePendingNewTokenImpl(pendingToken, traceId)
    }

    private activatePendingNewTokenImpl = async (
        pendingToken: PendingToken,
        traceId: string,
    ): Promise<ActivatedToken> => {
        abtClientLogger.info('Activate new token ' + pendingToken.tokenId)
        const tokenDetails = await this.remoteTokenService.activateNewMobileToken(
            pendingToken,
            traceId,
        )
        abtClientLogger.info('Activated new token ' + pendingToken.tokenId)

        return this.tokenStore.convertPendingNewTokenToActiveToken(
            pendingToken.contextId,
            pendingToken.tokenId,
            tokenDetails.signatureCertificate,
            tokenDetails.validityStart,
            tokenDetails.validityEnd,
        )
    }

    createNewToken = async (
        contextId: string,
        tokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ): Promise<ActivatedToken> => {
        const context = this.tokenContexts.get(contextId)
        const lock = context.getLock(this.timeout)

        return lock(async () => {
            await this.tokenStore.clearByContextId(contextId)

            try {
                const pendingToken = await this.tokenStore.createPendingNewToken(
                    contextId,
                    tokenId,
                    nonce,
                    attestationEncryptionPublicKey,
                    traceId,
                )
                return this.activatePendingNewTokenImpl(pendingToken, traceId)
            } catch (err) {
                if (err instanceof TokenError || err instanceof TokenKeystoreError) {
                    throw new UnableToCreateTokenError(err.message)
                }
                throw err
            }
        })
    }

    hasToken = (contextId: string): Promise<boolean> => {
        const context = this.tokenContexts.get(contextId)
        const lock = context.getLock(this.timeout * 2)

        return lock(() => {
            // TODO: Missing implementation. Is this needed?
            return false
        })
    }

    clearByContextId = (contextId: string): Promise<void> => {
        const context = this.tokenContexts.get(contextId)
        const lock = context.getLock(this.timeout * 2)
        return lock(() => this.tokenStore.clearByContextId(contextId))
    }
}
