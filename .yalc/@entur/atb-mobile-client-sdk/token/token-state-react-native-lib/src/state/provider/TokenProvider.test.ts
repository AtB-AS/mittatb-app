import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

import { createActivatedToken, epocNow } from '../../utils/testHelper'
import { NoTokenError } from '../../native/errors'

import type { TokenRenewer } from '../TokenRenewer'
import type TokenFactory from '../TokenFactory'

import TokenProvider from './TokenProvider'

const tokenContextId = 'primary'

function createTokenProvider(
    partialTokenFactory?: Partial<TokenFactory>,
    partialTokenRenewer?: Partial<TokenRenewer>,
) {
    const tokenFactory = {
        getToken: async () => undefined,
        ...partialTokenFactory,
    } as TokenFactory

    const tokenRenewer = {
        renew: jest.fn(async () => undefined),
        ...partialTokenRenewer,
    } as TokenRenewer

    return new TokenProvider(tokenFactory, 500, tokenRenewer)
}

jest.mock('react-native', () => ({
    NativeModules: {},
    Platform: {
        select: ({ android }: { android: unknown }) => android,
    },
}))

describe('TokenProvider', () => {
    it('should throw an error if no token was found for the context id', async () => {
        try {
            await createTokenProvider().getToken(tokenContextId, uuid())
            throw new Error('Should not have a token')
        } catch (e) {
            expect(e).toBeInstanceOf(NoTokenError)
        }
    })

    it('should retrieve the token for the context id', async () => {
        const token = createActivatedToken('A')
        const tokenFactory = {
            getToken: jest.fn(async () => token),
        }

        const newToken = await createTokenProvider(tokenFactory).getToken(tokenContextId, uuid())

        expect(newToken.getTokenId()).toEqual(token.getTokenId())
    })

    it('should retrieve the token and renew it if it is time to renew', async () => {
        const token = createActivatedToken('A', epocNow(), epocNow() + 10)
        const renewedToken = createActivatedToken('B')
        const traceId = uuid()

        const tokenFactory = {
            getToken: jest.fn(async () => token),
        }
        const tokenRenewer = {
            renew: jest.fn(async () => renewedToken),
        }

        const newToken = await createTokenProvider(tokenFactory, tokenRenewer).getToken(
            tokenContextId,
            traceId,
        )

        expect(newToken.getTokenId()).toEqual(renewedToken.getTokenId())
        expect(tokenRenewer.renew).toHaveBeenCalledTimes(1)
        expect(tokenRenewer.renew).toHaveBeenCalledWith(token, traceId)
    })

    it('should retrieve the token and renew it if it is renewable', async () => {
        const token = createActivatedToken('A')
        const renewedToken = createActivatedToken('B')
        const traceId = uuid()

        token.setRenewToken(renewedToken)

        const tokenFactory = {
            getToken: jest.fn(async () => token),
        }
        const tokenRenewer = {
            renew: jest.fn(async () => renewedToken),
        }

        const newToken = await createTokenProvider(tokenFactory, tokenRenewer).getToken(
            tokenContextId,
            traceId,
        )

        expect(newToken.getTokenId()).toEqual(renewedToken.getTokenId())
        expect(tokenRenewer.renew).toHaveBeenCalledTimes(1)
        expect(tokenRenewer.renew).toHaveBeenCalledWith(token, traceId)
    })
})
