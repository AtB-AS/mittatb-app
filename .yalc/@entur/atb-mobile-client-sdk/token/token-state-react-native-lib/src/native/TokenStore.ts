import type { ActivatedToken, PendingToken, Token } from '../../../token-core-javascript-lib/src'

import {
    getToken,
    clearByContextId,
    clearPendingRenewableToken,
    createPendingNewToken,
    createPendingRenewToken,
    convertPendingNewTokenToActiveToken,
    convertPendingRenewTokenToActiveToken,
    convertPendingTokenToActiveTokenWhichMustBeRenewed,
} from './TokenCoreBridge'

export interface TokenStore {
    getToken(contextId: string): Promise<Token | undefined>

    clearByContextId(contextId: string): Promise<void>

    clearPendingRenewableToken(contextId: string, activeTokenId: string): Promise<void>

    createPendingNewToken(
        contextId: string,
        tokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ): Promise<PendingToken>

    createPendingRenewToken(
        contextId: string,
        activeTokenId: string,
        pendingTokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ): Promise<PendingToken>

    convertPendingNewTokenToActiveToken(
        contextId: string,
        tokenId: string,
        certificate: string,
        validityStart: number,
        validityEnd: number,
    ): Promise<ActivatedToken>

    convertPendingRenewTokenToActiveToken(
        contextId: string,
        activeTokenId: string,
        pendingTokenId: string,
        certificate: string,
        validityStart: number,
        validityEnd: number,
    ): Promise<ActivatedToken>

    convertPendingTokenToActiveTokenWhichMustBeRenewed(
        contextId: string,
        activeTokenId: string,
        pendingTokenId: string,
    ): Promise<ActivatedToken>

    // TODO: Should these be removed?
    // export function encodeAsSecureContainer(
    //     contextId: string,
    //     tokenId: string,
    //     challenges: string[],
    //     tokenActions: TokenAction[],
    //     includeCertificate: boolean,
    // ): Promise<string> {
    //     return bridge
    //         .encodeAsSecureContainer(contextId, tokenId, challenges, tokenActions, includeCertificate)
    //         .catch(handleNativeError)
    // }

    // export function buildReattestation(
    //     contextId: string,
    //     tokenId: string,
    //     reattestationData: string,
    // ): Promise<string> {
    //     return bridge.buildReattestation(contextId, tokenId, reattestationData).catch(handleNativeError)
    // }

    // export async function getCurrentTime(): Promise<number> {
    //     return Math.floor(new Date().getTime() / 1000) // TODO Get actual time
    //     // return Math.floor(new Date().setFullYear(3000) / 1000)
    // }

    // export async function isEmulator() {
    //     return bridge.isEmulator().catch(handleNativeError)
    // }
}

export const tokenStore: TokenStore = {
    getToken,
    clearByContextId,
    clearPendingRenewableToken,
    createPendingNewToken,
    createPendingRenewToken,
    convertPendingNewTokenToActiveToken,
    convertPendingRenewTokenToActiveToken,
    convertPendingTokenToActiveTokenWhichMustBeRenewed,
}
