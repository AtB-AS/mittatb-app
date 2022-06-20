import type { Reattestation } from '../../../token-server-node-lib/types'
import type { Token } from '../../../token-core-javascript-lib/src'

import { buildReattestation } from '../native/TokenCoreBridge'

import { GrpcError, GrpcErrorDetail } from './grpcError'

export async function reattestHandler<T>(
    func: (reattestation?: Reattestation) => Promise<T>,
    token: Token,
): Promise<T> {
    try {
        return await func()
    } catch (err) {
        const reattestationData = getReattestationData(err)
        if (reattestationData) {
            const reattestation = await buildReattestation(
                token.getContextId(),
                token.getTokenId(),
                reattestationData,
            )
            return func(reattestation)
        }
        throw err
    }
}

function getReattestationData(err: unknown): string | undefined {
    if (err instanceof GrpcError) {
        if (err.grpcError.grpcErrorDetails.some(isPreconditionFailure)) {
            return err.grpcError.grpcErrorDetails.find(isReattestationData)?.value
        }
    }

    return undefined
}

const isPreconditionFailure = ({ type }: GrpcErrorDetail): boolean => type === 'PreconditionFailure'

const isReattestationData = ({ type }: GrpcErrorDetail): boolean =>
    type === 'MobileTokenReattestationData'
