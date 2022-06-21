import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

import { createPendingToken, createActivatedToken, toBase64, epocNow } from '../utils/testHelper'
import type { TokenStore } from '../native/TokenStore'

import type { RemoteTokenService } from './remote/RemoteTokenService'
import TokenFactory from './TokenFactory'
import { TokenContexts } from './TokenContexts'

const tokenContextId = 'primary'

function createTokenFactory(
    partialTokenStore?: Partial<TokenStore>,
    partialRemoteTokenService?: Partial<RemoteTokenService>,
) {
    const contexts = new TokenContexts(['primary'])

    const tokenStore = {
        getToken: async () => undefined,
        clearByContextId: async () => undefined,
        createPendingNewToken: jest.fn(
            async (contextId: string, tokenId: string, _nonce: string, traceId: string) =>
                createPendingToken(tokenId, traceId, contextId),
        ),
        convertPendingNewTokenToActiveToken: jest.fn(
            async (
                contextId: string,
                tokenId: string,
                _certificate: string,
                validityStart: number,
                validityEnd: number,
            ) => createActivatedToken(tokenId, validityStart, validityEnd, contextId),
        ),
        ...partialTokenStore,
    } as TokenStore

    const remoteTokenService = {
        ...partialRemoteTokenService,
    } as RemoteTokenService

    return new TokenFactory(tokenStore, remoteTokenService, contexts, 5000)
}

jest.mock('react-native', () => ({
    NativeModules: {},
    Platform: {
        select: ({ android }: { android: unknown }) => android,
    },
}))

describe('TokenFactory', () => {
    it('should return undefined if no token exists', async () => {
        const newToken = await createTokenFactory().getToken(tokenContextId, uuid())

        expect(newToken).toBeUndefined()
    })

    it('should get the activated token', async () => {
        const tokenStore = {
            getToken: jest.fn(async () => createActivatedToken('A')),
        }

        const newToken = await createTokenFactory(tokenStore).getToken(tokenContextId, uuid())

        expect(newToken).not.toBeUndefined()
        expect(newToken?.getContextId()).toEqual(tokenContextId)

        expect(tokenStore.getToken).toHaveBeenCalledTimes(1)
        expect(tokenStore.getToken).toHaveBeenCalledWith(tokenContextId)
    })

    it('should create a pending new token and activate it', async () => {
        const tokenId = 'Token-id'
        const nonce = toBase64([0, 1, 2])
        const traceId = uuid()
        const validityStart = epocNow()
        const validityEnd = validityStart + 3600
        const signatureCertificate = toBase64([3, 4, 5, 6])

        const remoteTokenService = {
            activateNewMobileToken: jest.fn(async () => ({
                tokenId,
                validityStart,
                validityEnd,
                signatureCertificate,
            })),
        }

        const newToken = await createTokenFactory({}, remoteTokenService).createNewToken(
            tokenContextId,
            tokenId,
            nonce,
            '',
            traceId,
        )

        expect(newToken?.getTokenId()).toEqual(tokenId)

        expect(remoteTokenService.activateNewMobileToken).toHaveBeenCalledTimes(1)
    })

    it('should activate the previously saved pending new token', async () => {
        const tokenId = 'Token-id'
        const validityStart = epocNow()
        const validityEnd = validityStart + 3600
        const signatureCertificate = toBase64([3, 4, 5, 6])

        const tokenStore = {
            createPendingNewToken: async (
                contextId: string,
                id: string,
                _nonce: string,
                traceId: string,
            ) => {
                return createPendingToken(id, traceId, contextId)
            },
            convertPendingNewTokenToActiveToken: async (
                contextId: string,
                id: string,
                _certificate: string,
                start: number,
                end: number,
            ) => createActivatedToken(id, start, end, contextId),
            getToken: jest.fn(async (contextId: string) => createPendingToken(tokenId, contextId)),
        }

        const remoteTokenService = {
            activateNewMobileToken: jest.fn(async () => ({
                tokenId,
                validityStart,
                validityEnd,
                signatureCertificate,
            })),
        }

        const createdToken = await createTokenFactory(tokenStore, remoteTokenService).getToken(
            tokenContextId,
            uuid(),
        )

        expect(createdToken?.getTokenId()).toEqual(tokenId)

        expect(tokenStore.getToken).toHaveBeenCalledTimes(1)
        expect(tokenStore.getToken).toHaveBeenCalledWith(tokenContextId)
    })

    it('should throw an exception if another thread blocks `get` for too long', () => {
        // TODO: Waiting for locking support
    })

    it('should clear a token by context id', async () => {
        const tokenStore = {
            clearByContextId: jest.fn(async () => Promise.resolve()),
        }

        await createTokenFactory(tokenStore).clearByContextId(tokenContextId)

        expect(tokenStore.clearByContextId).toHaveBeenCalledTimes(1)
        expect(tokenStore.clearByContextId).toHaveBeenCalledWith(tokenContextId)
    })
})
