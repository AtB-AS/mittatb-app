import type { ActivatedToken, PendingToken } from '../../../token-core-javascript-lib/src'
import type { ActiveTokenDetails } from '../../../token-server-node-lib/types'

import { encodeAsSecureContainer, TokenAction } from '../native/utils'
import type { TokenStore } from '../native/TokenStore'
import {
    UnableToSaveTokenError,
    TokenKeystoreError,
    CertificateError,
    KeyStoreError,
} from '../native/errors'

import type { RemoteTokenService } from './remote/RemoteTokenService'
import type { TokenContexts } from './TokenContexts'

export default abstract class AbstractTokenFactory {
    protected constructor(
        protected tokenStore: TokenStore,
        protected remoteTokenService: RemoteTokenService,
        protected tokenContexts: TokenContexts,
        protected timeout: number,
    ) {}

    clearByToken = (token: ActivatedToken) => {
        const contextId = token.getContextId()
        const context = this.tokenContexts.get(contextId)
        const lock = context.getLock(this.timeout * 2)
        return lock(() => this.tokenStore.clearByContextId(contextId))
    }

    getTokenDetailsForPendingToken = async (
        activatedToken: ActivatedToken,
        traceId: string,
    ): Promise<ActivatedToken> => {
        const pendingToken = activatedToken.getRenewToken() as PendingToken
        const details: ActiveTokenDetails = await this.getMobileTokenDetails(pendingToken, traceId)
        try {
            return this.tokenStore.convertPendingRenewTokenToActiveToken(
                activatedToken.contextId,
                activatedToken.tokenId,
                pendingToken.tokenId,
                details.signatureCertificate,
                details.validityStart,
                details.validityEnd,
            )
        } catch (err) {
            if (
                err instanceof CertificateError ||
                err instanceof TokenKeystoreError ||
                err instanceof KeyStoreError
            ) {
                throw new UnableToSaveTokenError(err.message)
            }
            throw err
        }
    }

    getMobileTokenDetails = async (pendingToken: PendingToken, traceId: string) => {
        const secureContainerToken = await encodeAsSecureContainer(
            pendingToken,
            [],
            [TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN],
            false,
        )
        return this.remoteTokenService.getMobileTokenDetails(
            pendingToken,
            secureContainerToken,
            traceId,
        )
    }
}
