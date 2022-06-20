import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

import { ActivatedToken, PendingToken } from '@entur/token-core-javascript-lib'

const tokenContextId = 'primary'

export function createPendingToken(id: string, traceId?: string, contextId?: string) {
    return new PendingToken(
        id,
        '',
        '',
        toCertificateChain([0x4, 0x5], [0x6, 0x7]),
        toCertificateChain([11, 0x1], [0x1, 0x1]),
        traceId || uuid(),
        'attestation',
        'attestationType',
        contextId || tokenContextId,
        '',
    )
}

export function createActivatedToken(id: string, start?: number, end?: number, contextId?: string) {
    return new ActivatedToken(
        id,
        start || epocNow(),
        end || epocNow() + 1000,
        contextId || tokenContextId,
    )
}

export function epocNow() {
    return Math.floor(Date.now() / 1000)
}

export function toBase64(nums: number[]): string {
    return Buffer.from(new Int8Array(nums)).toString('base64')
}

function toCertificateChain(...arrays: number[][]): string[] {
    return arrays.map(toBase64)
}
