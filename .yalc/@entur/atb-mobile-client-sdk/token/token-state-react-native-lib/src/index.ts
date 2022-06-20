import type { ActivatedToken } from '../../token-core-javascript-lib'
import type {
    PendingTokenDetails,
    ActiveTokenDetails,
    Reattestation,
} from '../../token-server-node-lib/types'

import type { RemoteTokenService } from './state/remote/RemoteTokenService'
import TokenFactory from './state/TokenFactory'
import TokenProvider from './state/provider/TokenProvider'
import { getNativeModule, start } from './native/TokenCoreBridge'
import { tokenStore } from './native/TokenStore'
import { TokenContexts } from './state/TokenContexts'
import { TokenService } from './state/TokenService'
import { TokenRenewer } from './state/TokenRenewer'
import { reattestHandler } from './utils/reattestation'
import { handleRemoteError } from './state/remote/utils'
import { isEmulator } from './native/utils'
import { abtClientLogger, setupAbtClientLogger } from './logger'
import { NativeEventEmitter } from 'react-native'
import type { AbtClientLogger } from './logger'

export { encodeAsSecureContainer, TokenAction, isEmulator } from './native/utils'
export { TokenMustBeReplacedRemoteTokenStateError } from './state/remote/errors'
export type { RemoteTokenService } from './state/remote/RemoteTokenService'
export { ResponseError, GrpcError } from './utils/grpcError'
export { reattestHandler } from './utils/reattestation'

export type AbtTokenClientConfig = {
    tokenContextIds?: string[]
    googleSafetyNetApiKey: string
    remoteTokenService: RemoteTokenService
    logger?: AbtClientLogger
}

export type AbtTokenClient = {
    start: () => Promise<void>
    close: () => void
    getToken: (contextId: string, traceId: string) => Promise<ActivatedToken>
    createToken: (contextId: string, traceId: string) => Promise<ActivatedToken>
    clearToken: (contextId: string) => Promise<void>
    buildReattestation: (contextId: string, tokenId: string, data: string) => Promise<Reattestation> // TODO: Is this needed?
    renewToken: (token: ActivatedToken, traceId: string) => Promise<ActivatedToken>
}

const LOG_EVENT_TYPE = 'abtClientNativeLog'
const abtClientLogListener = new NativeEventEmitter(getNativeModule())

export default function createClient({
    tokenContextIds = ['primary'],
    googleSafetyNetApiKey,
    remoteTokenService,
    logger,
}: AbtTokenClientConfig): AbtTokenClient {
    setupAbtClientLogger(logger)

    const wrappedRemoteTokenService: RemoteTokenService = {
        initiateNewMobileToken: (...props) =>
            remoteTokenService.initiateNewMobileToken(...props).catch(handleRemoteError),
        activateNewMobileToken: (...props) =>
            remoteTokenService.activateNewMobileToken(...props).catch(handleRemoteError),
        getMobileTokenDetails: (token, secureContainer, traceId) =>
            reattestHandler<ActiveTokenDetails>(
                (reattestation: Reattestation | undefined) =>
                    remoteTokenService.getMobileTokenDetails(
                        token,
                        secureContainer,
                        traceId,
                        reattestation,
                    ),
                token,
            ).catch(handleRemoteError),
        initiateMobileTokenRenewal: (token, secureContainer, traceId) =>
            reattestHandler<PendingTokenDetails>(
                (reattestation: Reattestation | undefined) =>
                    remoteTokenService.initiateMobileTokenRenewal(
                        token,
                        secureContainer,
                        traceId,
                        reattestation,
                    ),
                token,
            ).catch(handleRemoteError),
        completeMobileTokenRenewal: (token, secureContainer, activatedToken, traceId) =>
            reattestHandler<ActiveTokenDetails>(
                (reattestation: Reattestation | undefined) =>
                    remoteTokenService.completeMobileTokenRenewal(
                        token,
                        secureContainer,
                        activatedToken,
                        traceId,
                        reattestation,
                    ),
                activatedToken,
            ).catch(handleRemoteError),
    }

    const contexts = new TokenContexts(tokenContextIds)
    const factory = new TokenFactory(tokenStore, wrappedRemoteTokenService, contexts, 2500)
    const renewer = new TokenRenewer(tokenStore, wrappedRemoteTokenService, contexts, 2500)
    const provider = new TokenProvider(factory, 15000, renewer)
    const service = new TokenService(factory, provider)

    return {
        ...service,
        createToken: async (contextId: string, traceId: string) => {
            abtClientLogger.info('Creating new token for context id ' + contextId)
            const emulator = await isEmulator()
            const { attestationEncryptionPublicKey, tokenId, nonce } =
                await wrappedRemoteTokenService.initiateNewMobileToken(traceId, emulator)
            abtClientLogger.info('Initialized new token ' + tokenId)
            return service.createToken(
                contextId,
                tokenId,
                nonce,
                attestationEncryptionPublicKey,
                traceId,
            )
        },
        start: () => {
            abtClientLogListener.addListener(LOG_EVENT_TYPE, event =>
                abtClientLogger.info(event.message),
            )
            return start(googleSafetyNetApiKey, contexts.getTokenContextIds())
        },
        renewToken: async (token: ActivatedToken, traceId: string) => {
            token.markMustBeRenewed()
            return renewer.renew(token, traceId)
        },
        close: () => {
            abtClientLogListener.removeAllListeners(LOG_EVENT_TYPE)
        },
    }
}
