import type { Reattestation } from '@entur/token-server-node-lib/types'

import { GrpcError, GrpcErrorType } from './grpcError'
import { createActivatedToken } from './testHelper'
import { reattestHandler } from './reattestation'

const mockedReattestation: Reattestation = {
    data: 'Mocked reattestation response',
    type: 'IOSDeviceCheckAttestation',
}

class CustomReattestationTestError extends Error {
    constructor() {
        super('')
    }
}

function createGrpcError(type = '', hasReattestationData = false): GrpcErrorType {
    return {
        status: 500,
        message: '',
        grpcErrorDetails: [
            { type, value: undefined },
            ...(hasReattestationData
                ? [{ type: 'MobileTokenReattestationData', value: 'data' }]
                : []),
        ],
    }
}

jest.mock('react-native', () => ({
    NativeModules: {
        TokenCore: { buildReattestation: async () => mockedReattestation },
    },
}))

describe('reattestHandler', () => {
    it("should return the given function's result if no error is thrown", async () => {
        const expectedResult = 'OK'
        const token = createActivatedToken('A')

        const func = () => Promise.resolve(expectedResult)

        const result = await reattestHandler(func, token)

        expect(result).toEqual(expectedResult)
    })

    it('should call the function again with reattestation data if grpc error is a reattestation error', async () => {
        const expectedResult = 'OK'
        const token = createActivatedToken('A')

        const func = async (reattestation?: Reattestation) => {
            if (reattestation) return expectedResult
            throw new GrpcError('GRPC ERROR', createGrpcError('PreconditionFailure', true))
        }

        const result = await reattestHandler(func, token)

        expect(result).toEqual(expectedResult)
    })

    it('should re-throw error if grpc error is not a precondition failure', async () => {
        const token = createActivatedToken('A')

        const func = async () => {
            throw new GrpcError('GRPC ERROR', createGrpcError())
        }

        try {
            await reattestHandler(func, token)
            throw new Error('Should not have returned')
        } catch (e) {
            expect(e).toBeInstanceOf(GrpcError)
        }
    })

    it('should re-throw error if grpc error is not a reattestation error', async () => {
        const token = createActivatedToken('A')

        const func = async () => {
            throw new GrpcError('GRPC ERROR', createGrpcError('PreconditionFailure'))
        }

        try {
            await reattestHandler(func, token)
            throw new Error('Should not have returned')
        } catch (e) {
            expect(e).toBeInstanceOf(GrpcError)
        }
    })

    it('should re-throw all other errors', async () => {
        const token = createActivatedToken('A')

        const func = async () => {
            throw new CustomReattestationTestError()
        }

        try {
            await reattestHandler(func, token)
            throw new Error('Should not have returned')
        } catch (e) {
            expect(e).toBeInstanceOf(CustomReattestationTestError)
        }
    })
})
