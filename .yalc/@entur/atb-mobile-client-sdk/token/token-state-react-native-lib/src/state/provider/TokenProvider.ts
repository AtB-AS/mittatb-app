import type { ActivatedToken } from '../../../../token-core-javascript-lib/src'

import type TokenFactory from '../TokenFactory'
import type { ITokenRenewer } from '../TokenRenewer'
import { NoTokenError } from '../../native/errors'
import { getCurrentTime } from '../../native/TokenCoreBridge'
import { abtClientLogger } from '../../logger'

export default class TokenProvider {
    private readonly tokenFactory: TokenFactory
    private readonly minimumTimeToLive: number
    private readonly tokenRenewer: ITokenRenewer

    constructor(
        tokenFactory: TokenFactory,
        minimumTimeToLive: number,
        tokenRenewer: ITokenRenewer,
    ) {
        this.tokenFactory = tokenFactory
        this.minimumTimeToLive = minimumTimeToLive
        this.tokenRenewer = tokenRenewer
    }

    close(): Promise<void> {
        /* noop */
        return Promise.resolve()
    }

    /**
     * @throws TokenStateError
     * @throws DeviceAttestationError
     * @throws DeviceAttestationRemoteError
     */
    async getToken(contextId: string, traceId: string): Promise<ActivatedToken> {
        abtClientLogger.info('Retrieving token for context id ' + contextId)
        const token = await this.tokenFactory.getToken(contextId, traceId)
        if (!token) {
            abtClientLogger.info('No token found for context id ' + contextId)
            throw new NoTokenError(`No token for context '${contextId}'`)
        }
        abtClientLogger.info('Token found ' + token.getTokenId())

        const now = await getCurrentTime()
        if (token.isEnded(now) || token.willEndInLessThan(now, this.minimumTimeToLive)) {
            token.markMustBeRenewed()
        }

        if (token.mustBeRenewed() || token.getRenewToken()) {
            abtClientLogger.info("Renew token for context '" + contextId + "'")
            return this.tokenRenewer.renew(token, traceId)
        }

        return token
    }
}
