import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

import { createActivatedToken, toBase64, epocNow } from '../utils/testHelper'

import type TokenProvider from './provider/TokenProvider'
import type TokenFactory from './TokenFactory'
import { TokenService } from './TokenService'

const tokenContextId = 'primary'
const mockedReattestation = 'Mocked reattestation response'

function createTokenService(
    partialTokenProvider?: Partial<TokenProvider>,
    partialTokenFactory?: Partial<TokenFactory>,
) {
    const tokenFactory = {
        ...partialTokenFactory,
    } as TokenFactory

    const tokenProvider: TokenProvider = {
        ...partialTokenProvider,
    } as TokenProvider

    return new TokenService(tokenFactory, tokenProvider)
}

jest.mock('react-native', () => ({
    NativeModules: {
        TokenCore: { buildReattestation: async () => mockedReattestation },
    },
    Platform: {
        select: ({ android }: { android: unknown }) => android,
    },
}))

describe('TokenService', () => {
    it('should get the token for the contextId', async () => {
        const traceId = uuid()
        const tokenProvider = {
            getToken: jest.fn(async (contextId: string) =>
                createActivatedToken('A', undefined, undefined, contextId),
            ),
        }

        const activatedToken = await createTokenService(tokenProvider).getToken(
            tokenContextId,
            traceId,
        )

        expect(activatedToken?.getContextId()).toEqual(tokenContextId)

        expect(tokenProvider.getToken).toHaveBeenCalledTimes(1)
        expect(tokenProvider.getToken).toHaveBeenCalledWith(tokenContextId, traceId)
    })

    it('should create a new token', async () => {
        const tokenId = 'Token-id'
        const traceId = uuid()
        const nonce = toBase64([0, 1, 2])

        const tokenFactory = {
            createNewToken: jest.fn(async (contextId: string, id: string) =>
                createActivatedToken(id, epocNow(), epocNow() + 1000, contextId),
            ),
        }

        const activatedToken = await createTokenService({}, tokenFactory).createToken(
            tokenContextId,
            tokenId,
            nonce,
            '',
            traceId,
        )

        expect(activatedToken?.getTokenId()).toEqual(tokenId)

        expect(tokenFactory.createNewToken).toHaveBeenCalledTimes(1)
        expect(tokenFactory.createNewToken).toHaveBeenCalledWith(
            tokenContextId,
            tokenId,
            nonce,
            '',
            traceId,
        )
    })

    it('should clear a token by context id', async () => {
        const tokenFactory = {
            clearByContextId: jest.fn(async () => Promise.resolve()),
        }

        await createTokenService({}, tokenFactory).clearToken(tokenContextId)

        expect(tokenFactory.clearByContextId).toHaveBeenCalledTimes(1)
        expect(tokenFactory.clearByContextId).toHaveBeenCalledWith(tokenContextId)
    })

    it('should build a reattestation string', async () => {
        const reattestation = await createTokenService().buildReattestation(
            tokenContextId,
            'Token-id',
            'Reattestation data...',
        )

        expect(reattestation).toEqual(mockedReattestation)
    })
})
