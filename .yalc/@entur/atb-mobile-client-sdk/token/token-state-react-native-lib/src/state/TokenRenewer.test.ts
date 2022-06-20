import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

import type { PendingToken } from '@entur/token-core-javascript-lib'

import { createPendingToken, createActivatedToken, toBase64, epocNow } from '../utils/testHelper'
import type { TokenStore } from '../native/TokenStore'

import type { RemoteTokenService } from './remote/RemoteTokenService'
import { TokenContexts } from './TokenContexts'
import { TokenRenewer } from './TokenRenewer'
import { RemoteTokenStateError, TokenMustBeRenewedRemoteTokenStateError } from './remote/errors'
import {
    TokenMustBeReplacedRemoteTokenStateError,
    TokenNotFoundRemoteTokenStateError,
} from './remote/errors'

function createTokenRenewer(
    partialTokenStore?: Partial<TokenStore>,
    partialRemoteTokenService?: Partial<RemoteTokenService>,
) {
    const contexts = new TokenContexts(['primary'])

    const tokenStore = {
        getToken: async () => undefined,
        clearByContextId: async () => undefined,
        convertPendingRenewTokenToActiveToken: jest.fn(
            async (
                contextId,
                _activeTokenId,
                pendingTokenId,
                _certificate,
                validityStart,
                validityEnd,
            ) => createActivatedToken(pendingTokenId, validityStart, validityEnd, contextId),
        ),
        createPendingRenewToken: jest.fn(
            async (contextId, _activeTokenId, pendingTokenId, _nonce, traceId) =>
                createPendingToken(pendingTokenId, traceId, contextId),
        ),
        clearPendingRenewableToken: jest.fn(),
        ...partialTokenStore,
    } as TokenStore

    const remoteTokenService = {
        ...partialRemoteTokenService,
    } as RemoteTokenService

    return new TokenRenewer(tokenStore, remoteTokenService, contexts, 5000)
}

jest.mock('react-native', () => ({
    NativeModules: {
        TokenCore: { encodeAsSecureContainer: async () => 'Encoded secure container response' },
    },
    Platform: {
        select: ({ android }: { android: unknown }) => android,
    },
}))

describe('TokenRenewer', () => {
    it('should throw an exception on strain mismatch', async () => {
        // TODO: Requires implementation of `validateLatestStrain` in Token store
    })

    it('should return the already renewed token', async () => {
        const token = createActivatedToken('A')
        const alreadyRenewedToken = createActivatedToken('B')

        const tokenStore = {
            getToken: () => Promise.resolve(alreadyRenewedToken),
        }

        token.setRenewToken(alreadyRenewedToken)

        const tokenRenewer = createTokenRenewer(tokenStore)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(alreadyRenewedToken.getTokenId())
    })

    it('should renew and activate the token', async () => {
        const token = createActivatedToken('A')
        const pendingTokenId = 'B'

        const tokenStore = {
            getToken: () => Promise.resolve(token),
        }

        const remoteTokenService = {
            initiateMobileTokenRenewal: jest.fn(async () => ({
                tokenId: pendingTokenId,
                nonce: toBase64([0, 1, 2]),
                attestationEncryptionPublicKey: '',
                nonceValidityEnd: 0,
            })),
            completeMobileTokenRenewal: jest.fn(async () => ({
                tokenId: pendingTokenId,
                signatureCertificate: toBase64([0x00, 0x11]),
                validityStart: epocNow(),
                validityEnd: epocNow() + 1000,
            })),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(pendingTokenId)

        expect(remoteTokenService.initiateMobileTokenRenewal).toHaveBeenCalledTimes(1)
        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(1)
    })

    it('should activate the pending renew token', async () => {
        const token = createActivatedToken('A')
        const pendingToken = createPendingToken('B')

        token.setRenewToken(pendingToken)

        const tokenStore = {
            getToken: () => Promise.resolve(token),
        }

        const remoteTokenService = {
            completeMobileTokenRenewal: jest.fn(async () => ({
                tokenId: pendingToken.getTokenId(),
                signatureCertificate: toBase64([0x00, 0x11]),
                validityStart: epocNow(),
                validityEnd: epocNow() + 1000,
            })),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(pendingToken.getTokenId())

        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(1)
    })

    it('should activate the pending renew token on the second attempt at activate if the first activation fails', async () => {
        const token = createActivatedToken('A')
        const pendingTokenId = 'B'

        let shouldFailCompleteCall = true

        const tokenStore = {
            getToken: () => Promise.resolve(token),
        }

        const remoteTokenService = {
            initiateMobileTokenRenewal: jest.fn(async () => ({
                tokenId: pendingTokenId,
                nonce: toBase64([0, 1, 2]),
                attestationEncryptionPublicKey: '',
                nonceValidityEnd: 0,
            })),
            completeMobileTokenRenewal: jest.fn(async () => {
                if (shouldFailCompleteCall) {
                    shouldFailCompleteCall = false
                    throw new RemoteTokenStateError(
                        'Use case: Unknown failure, where it might help to try again',
                    )
                }
                return {
                    tokenId: pendingTokenId,
                    signatureCertificate: toBase64([0x00, 0x11]),
                    validityStart: epocNow(),
                    validityEnd: epocNow() + 1000,
                }
            }),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)

        await tokenRenewer.renew(token, uuid()).catch(() => undefined)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(pendingTokenId)

        expect(remoteTokenService.initiateMobileTokenRenewal).toHaveBeenCalledTimes(1)
        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(2)
    })

    it('should discard the pending renew token that is unknown to the server', async () => {
        const token = createActivatedToken('A')
        const pendingTokenThatIsUnknownToServer = createPendingToken('B')
        const newPendingToken = createPendingToken('C')

        token.setRenewToken(pendingTokenThatIsUnknownToServer)

        const tokenStore = {
            getToken: () => Promise.resolve(token),
        }

        const remoteTokenService = {
            initiateMobileTokenRenewal: jest.fn(async () => ({
                tokenId: newPendingToken.getTokenId(),
                nonce: toBase64([0, 1, 2]),
                attestationEncryptionPublicKey: '',
                nonceValidityEnd: 0,
            })),
            completeMobileTokenRenewal: jest.fn(async (pendingToken: PendingToken) => {
                if (pendingToken.getTokenId() === pendingTokenThatIsUnknownToServer.getTokenId()) {
                    throw new TokenNotFoundRemoteTokenStateError(
                        'Use case: Server does not know this token.',
                    )
                }
                return {
                    tokenId: newPendingToken.getTokenId(),
                    signatureCertificate: toBase64([0x00, 0x11]),
                    validityStart: epocNow(),
                    validityEnd: epocNow() + 1000,
                }
            }),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(newPendingToken.getTokenId())

        expect(remoteTokenService.initiateMobileTokenRenewal).toHaveBeenCalledTimes(1)
        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(2)
    })

    it('should activate the pending renew token that is already active on the server side', async () => {
        const token = createActivatedToken('A')
        const pendingTokenThatIsAlreadyActiveOnServer = createPendingToken('B')

        token.setRenewToken(pendingTokenThatIsAlreadyActiveOnServer)

        const tokenStore = {
            getToken: () => Promise.resolve(token),
        }

        const remoteTokenService = {
            completeMobileTokenRenewal: jest.fn(async () => {
                throw new TokenMustBeReplacedRemoteTokenStateError(
                    'Use case: Failed to complete because already active on server side.',
                )
            }),
            getMobileTokenDetails: jest.fn(async () => ({
                tokenId: pendingTokenThatIsAlreadyActiveOnServer.getTokenId(),
                signatureCertificate: toBase64([0x00, 0x11]),
                validityStart: epocNow(),
                validityEnd: epocNow() + 1000,
            })),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(
            pendingTokenThatIsAlreadyActiveOnServer.getTokenId(),
        )

        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(1)
        expect(remoteTokenService.getMobileTokenDetails).toHaveBeenCalledTimes(1)
    })

    it('should convert pending token to active token that requires renewal if failed to get already active token from the server', async () => {
        const token = createActivatedToken('A')
        const pendingTokenThatIsAlreadyActiveOnServer = createPendingToken('B')

        token.setRenewToken(pendingTokenThatIsAlreadyActiveOnServer)

        const tokenStore = {
            getToken: () => Promise.resolve(token),
            convertPendingTokenToActiveTokenWhichMustBeRenewed: jest.fn(async () =>
                createActivatedToken(pendingTokenThatIsAlreadyActiveOnServer.getTokenId()),
            ),
        }

        const remoteTokenService = {
            completeMobileTokenRenewal: jest.fn(async () => {
                throw new TokenMustBeReplacedRemoteTokenStateError(
                    'Use case: Failed to complete because already active on server side.',
                )
            }),
            getMobileTokenDetails: jest.fn(async () => {
                throw new TokenMustBeRenewedRemoteTokenStateError(
                    'Use case: Failed to get token details because token must be renewed.',
                )
            }),
        }

        const tokenRenewer = createTokenRenewer(tokenStore, remoteTokenService)
        const renewedToken = await tokenRenewer.renew(token, uuid())

        expect(renewedToken.getTokenId()).toEqual(
            pendingTokenThatIsAlreadyActiveOnServer.getTokenId(),
        )

        expect(remoteTokenService.completeMobileTokenRenewal).toHaveBeenCalledTimes(1)
        expect(remoteTokenService.getMobileTokenDetails).toHaveBeenCalledTimes(1)
        expect(tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed).toHaveBeenCalledTimes(
            1,
        )
        expect(tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed).toHaveBeenCalledWith(
            token.getContextId(),
            token.getTokenId(),
            token.getRenewToken()?.getTokenId(),
        )
    })

    it('should throw an exception if another thread blocks `renew` for too long', () => {
        // TODO: Waiting for locking support
    })
})
