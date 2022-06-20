import { encodeAsSecureContainer, TokenAction } from '../native/utils'
import type { TokenStore } from '../native/TokenStore'
import { abtClientLogger } from '../logger'
import {
    CertificateError,
    KeyStoreError,
    TokenError,
    TokenKeystoreError,
    UnableToRenewTokenError,
    UnableToSaveTokenError,
} from '../native/errors'

import type { RemoteTokenService } from './remote/RemoteTokenService'
import type { TokenContexts } from './TokenContexts'
import AbstractTokenFactory from './AbstractTokenFactory'
import {
    RemoteTokenStateError,
    TokenMustBeRenewedRemoteTokenStateError,
    TokenMustBeReplacedRemoteTokenStateError,
    TokenNotFoundRemoteTokenStateError,
} from './remote/errors'
import type { ActivatedToken, PendingToken } from '../../../token-core-javascript-lib/src'

export interface ITokenRenewer {
    renew: (token: ActivatedToken, traceId: string) => Promise<ActivatedToken>
    clear: (token: ActivatedToken) => Promise<void>
}

export class TokenRenewer extends AbstractTokenFactory {
    constructor(
        tokenStore: TokenStore,
        remoteTokenService: RemoteTokenService,
        tokenContexts: TokenContexts,
        timeout: number,
    ) {
        super(tokenStore, remoteTokenService, tokenContexts, timeout)
    }

    renew = async (token: ActivatedToken, traceId: string) => {
        // strain is checked by TokenStore
        const context = this.tokenContexts.get(token.getContextId())
        const lock = context.getLock(this.timeout)
        return lock(() => this.renewImpl(token, traceId))
    }

    // TODO: Missing implementation ?
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clear = async (_token: ActivatedToken) => Promise.resolve()

    private renewImpl = async (token: ActivatedToken, traceId: string) => {
        let latestActivatedToken = (await this.tokenStore.getToken(
            token.getContextId(),
        )) as ActivatedToken

        if (
            latestActivatedToken.getTokenId() !== token.getTokenId() &&
            !latestActivatedToken.hasRenewToken() &&
            !latestActivatedToken.mustBeRenewed()
        ) {
            abtClientLogger.info(
                'Completed renewal of ' +
                    token.getTokenId() +
                    ' by forwarding to previously renewed active token ' +
                    latestActivatedToken.getTokenId(),
            )
            return latestActivatedToken
        }

        if (latestActivatedToken.hasRenewToken()) {
            const completed = await this.completeRenewal(latestActivatedToken, traceId)
            if (completed) {
                if (!completed.mustBeRenewed()) {
                    return completed
                }
                latestActivatedToken = completed
            }
        }

        // renew from scratch
        const pendingTokenDetails = await this.initializeRenewal(latestActivatedToken, traceId) // TODO capture risk level exceptions
        const pendingToken = await this.tokenStore.createPendingRenewToken(
            latestActivatedToken.contextId,
            latestActivatedToken.tokenId,
            pendingTokenDetails.tokenId,
            pendingTokenDetails.nonce,
            pendingTokenDetails.attestationEncryptionPublicKey,
            traceId,
        )
        latestActivatedToken.setRenewToken(pendingToken)
        return this.activatePendingTokenImpl(latestActivatedToken, traceId)
    }

    // throws UnableToSaveTokenException, DeviceAttestationException, UnableToPerformCryptoOperationTokenException, RemoteTokenStateException,
    // 			UnableToRenewTokenException, DeviceAttestationRemoteException, TokenCommandException
    completeRenewal = async (
        latestActivatedToken: ActivatedToken,
        traceId: string,
    ): Promise<ActivatedToken | undefined> => {
        abtClientLogger.info(
            'Found outstanding renewal on token ' +
                latestActivatedToken.getTokenId() +
                ' with renewal token ' +
                latestActivatedToken.getRenewToken()?.getTokenId(),
        )

        try {
            return await this.activatePendingTokenImpl(latestActivatedToken, traceId)
        } catch (err) {
            if (err instanceof TokenNotFoundRemoteTokenStateError) {
                abtClientLogger.info(
                    'Got token not found when trying to activate previously pending renewal token because not found, discarding.',
                )
                await this.tokenStore.clearPendingRenewableToken(
                    latestActivatedToken.contextId,
                    latestActivatedToken.tokenId,
                )
                return undefined
            } else if (err instanceof TokenMustBeReplacedRemoteTokenStateError) {
                abtClientLogger.info(
                    'Pending renewal token might be already been activated, attempt getting details',
                )
                try {
                    const activatedToken = await this.getTokenDetailsForPendingToken(
                        latestActivatedToken,
                        traceId,
                    )
                    abtClientLogger.info('Completed renewal by getting got token details')
                    return activatedToken
                } catch (err) {
                    if (err instanceof TokenMustBeRenewedRemoteTokenStateError) {
                        abtClientLogger.info(
                            'Unable to get token details, token must be renewed (before we were able to get the certificate and start/stop dates',
                        )
                        // corner case: do not have certificate or timings of current token
                        // convert token to activated token with null certificate and dummy start/stop
                        const renewToken = latestActivatedToken.getRenewToken()

                        if (!renewToken) {
                            throw new TokenError(
                                `Failed to get renew token from latest activated token: ${latestActivatedToken.tokenId}`,
                            )
                        }

                        return this.tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed(
                            latestActivatedToken.contextId,
                            latestActivatedToken.tokenId,
                            renewToken.tokenId,
                        )
                    }
                    throw err
                }
            } else if (err instanceof RemoteTokenStateError) {
                // encoded timestamp could be expired

                // unknown cause
                // might give up already here, but fall through to trying again
                abtClientLogger.info(
                    'Unable to activate previously pending renewal token, discarding pending token.',
                )
                throw new UnableToRenewTokenError(err.message)
            }
            throw err
        }
    }

    initializeRenewal = async (token: ActivatedToken, traceId: string) => {
        abtClientLogger.info('Initialize renewal of token ' + token.getTokenId())
        const secureContainerToken = await encodeAsSecureContainer(
            token,
            [],
            [TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN],
            false,
        )
        const pendingTokenDetails = await this.remoteTokenService.initiateMobileTokenRenewal(
            token,
            secureContainerToken,
            traceId,
        )
        abtClientLogger.info(
            'Initialized renewal of token ' +
                token.getTokenId() +
                ', next token is ' +
                pendingTokenDetails.tokenId,
        )
        return pendingTokenDetails
    }

    activatePendingTokenImpl = async (activatedToken: ActivatedToken, traceId: string): Promise<ActivatedToken> => {
        const pendingToken = activatedToken.getRenewToken() as PendingToken // TODO: Make argument pending token? Or instance of check
        abtClientLogger.info('Activate pending token renewal ' + pendingToken.getTokenId())
        const secureContainerToken = await encodeAsSecureContainer(
            activatedToken,
            [],
            [TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN],
            false,
        )

        const details = await this.remoteTokenService.completeMobileTokenRenewal(
            pendingToken,
            secureContainerToken,
            activatedToken,
            traceId,
        )

        try {
            abtClientLogger.info('Activated pending token renewal ' + pendingToken.getTokenId())
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
}
