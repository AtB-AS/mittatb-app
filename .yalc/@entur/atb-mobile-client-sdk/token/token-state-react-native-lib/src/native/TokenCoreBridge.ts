import { NativeModule, NativeModules } from 'react-native'

import { ActivatedToken, PendingToken, Token } from '../../../token-core-javascript-lib/src'
import type { Reattestation } from '../../../token-server-node-lib/types'

import { handleNativeError, TokenAction } from './utils'

type BaseBridgeToken = {
    activated: boolean
    tokenId: string
    tokenContextId: string
    attestationEncryptionPublicKey: string
    deviceAttestationCounter: number
}

type BridgeActiveToken = BaseBridgeToken & {
    renewToken?: BridgeToken
    validityStart: number
    validityEnd: number
}

type BridgePendingToken = BaseBridgeToken & {
    commandUuid: string
    commandAttestation: string
    commandAttestationType: string
    commandTrace: string
    encryptionPublicKey?: string
    encryptionCertificateChain?: string[]
    signaturePublicKey?: string
    signatureCertificateChain?: string[]
}

type BridgeReattestation = {
    commandAttestation: string
    commandAttestationType: string
}

type BridgeToken = BridgePendingToken | BridgeActiveToken

interface NativeBridge {
    start: (googleSafetyNetApiKey: string, contextIds: string[]) => Promise<void>
    getToken: (contextId: string) => Promise<BridgeToken | undefined>
    clearByContextId: (contextId: string) => Promise<void>
    clearPendingRenewableToken: (contextId: string, activateTokenId: string) => Promise<void>
    createPendingNewToken: (
        contextId: string,
        tokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ) => Promise<BridgePendingToken>
    createPendingRenewToken: (
        contextId: string,
        activateTokenId: string,
        pendingTokenId: string,
        nonce: string,
        attestationEncryptionPublicKey: string,
        traceId: string,
    ) => Promise<BridgePendingToken>
    convertPendingNewTokenToActiveToken: (
        contextId: string,
        tokenId: string,
        certificate: string,
        validityStart: number,
        validityEnd: number,
    ) => Promise<BridgeActiveToken>
    encodeAsSecureContainer: (
        contextId: string,
        tokenId: string,
        challenges: string[],
        tokenActions: TokenAction[],
        includeCertificate: boolean,
    ) => Promise<string>
    convertPendingRenewTokenToActiveToken: (
        contextId: string,
        activeTokenId: string,
        pendingTokenId: string,
        certificate: string,
        validityStart: number,
        validityEnd: number,
    ) => Promise<BridgeActiveToken>
    convertPendingTokenToActiveTokenWhichMustBeRenewed: (
        contextId: string,
        activeTokenId: string,
        pendingTokenId: string,
    ) => Promise<BridgeActiveToken>
    buildReattestation: (
        contextId: string,
        tokenId: string,
        reattestationData: string,
    ) => Promise<BridgeReattestation>
    getCurrentTime: () => Promise<number>
    isEmulator: () => Promise<boolean>,
    decryptVisualInspectionNonce: (
        contextId: string,
        tokenId: string,
        encryptedVisualInspectionNonce: string,
    ) => Promise<string>,
}

const bridge: NativeBridge = NativeModules.TokenCore

export const getNativeModule = () => bridge as unknown as NativeModule

export function start(googleSafetyNetApiKey: string, contextIds: string[]): Promise<void> {
    return bridge.start(googleSafetyNetApiKey, contextIds).catch(handleNativeError)
}

export function getToken(contextId: string): Promise<Token | undefined> {
    return bridge.getToken(contextId).then(mapToken).catch(handleNativeError)
}

export function clearByContextId(contextId: string): Promise<void> {
    return bridge.clearByContextId(contextId).catch(handleNativeError)
}

export function clearPendingRenewableToken(
    contextId: string,
    activeTokenId: string,
): Promise<void> {
    return bridge.clearPendingRenewableToken(contextId, activeTokenId).catch(handleNativeError)
}

export function createPendingNewToken(
    contextId: string,
    tokenId: string,
    nonce: string,
    attestationEncryptionPublicKey: string,
    traceId: string,
): Promise<PendingToken> {
    return bridge
        .createPendingNewToken(contextId, tokenId, nonce, attestationEncryptionPublicKey, traceId)
        .then(mapPendingToken)
        .catch(handleNativeError)
}

export function createPendingRenewToken(
    contextId: string,
    activeTokenId: string,
    pendingTokenId: string,
    nonce: string,
    attestationEncryptionPublicKey: string,
    traceId: string,
): Promise<PendingToken> {
    return bridge
        .createPendingRenewToken(
            contextId,
            activeTokenId,
            pendingTokenId,
            nonce,
            attestationEncryptionPublicKey,
            traceId,
        )
        .then(mapPendingToken)
        .catch(handleNativeError)
}

export function convertPendingNewTokenToActiveToken(
    contextId: string,
    tokenId: string,
    certificate: string,
    validityStart: number,
    validityEnd: number,
): Promise<ActivatedToken> {
    return bridge
        .convertPendingNewTokenToActiveToken(
            contextId,
            tokenId,
            certificate,
            validityStart,
            validityEnd,
        )
        .then(mapActivatedToken)
        .catch(handleNativeError)
}

export function convertPendingRenewTokenToActiveToken(
    contextId: string,
    activeTokenId: string,
    pendingTokenId: string,
    certificate: string,
    validityStart: number,
    validityEnd: number,
): Promise<ActivatedToken> {
    return bridge
        .convertPendingRenewTokenToActiveToken(
            contextId,
            activeTokenId,
            pendingTokenId,
            certificate,
            validityStart,
            validityEnd,
        )
        .then(mapActivatedToken)
        .catch(handleNativeError)
}

export function convertPendingTokenToActiveTokenWhichMustBeRenewed(
    contextId: string,
    activeTokenId: string,
    pendingTokenId: string,
): Promise<ActivatedToken> {
    return bridge
        .convertPendingTokenToActiveTokenWhichMustBeRenewed(
            contextId,
            activeTokenId,
            pendingTokenId,
        )
        .then(mapActivatedToken)
        .catch(handleNativeError)
}

export function encodeAsSecureContainer(
    contextId: string,
    tokenId: string,
    challenges: string[],
    tokenActions: TokenAction[],
    includeCertificate: boolean,
): Promise<string> {
    return bridge
        .encodeAsSecureContainer(contextId, tokenId, challenges, tokenActions, includeCertificate)
        .catch(handleNativeError)
}

export function buildReattestation(
    contextId: string,
    tokenId: string,
    reattestationData: string,
): Promise<Reattestation> {
    return bridge
        .buildReattestation(contextId, tokenId, reattestationData)
        .then(mapReattestation)
        .catch(handleNativeError)
}

export async function getCurrentTime(): Promise<number> {
    return Math.floor(new Date().getTime() / 1000) // TODO Get actual time
    // return Math.floor(new Date().setFullYear(3000) / 1000)
}

export async function isEmulator() {
    return bridge.isEmulator().catch(handleNativeError)
}

function mapActivatedToken(bridgeResponse: BridgeActiveToken): ActivatedToken {
    return new ActivatedToken(
        bridgeResponse.tokenId,
        bridgeResponse.validityStart,
        bridgeResponse.validityEnd,
        bridgeResponse.tokenContextId,
        mapToken(bridgeResponse.renewToken),
    )
}

function mapPendingToken(bridgeResponse: BridgePendingToken): PendingToken {
    return new PendingToken(
        bridgeResponse.tokenId,
        bridgeResponse.signaturePublicKey,
        bridgeResponse.encryptionPublicKey,
        bridgeResponse.signatureCertificateChain,
        bridgeResponse.encryptionCertificateChain,
        bridgeResponse.commandUuid,
        bridgeResponse.commandAttestation,
        bridgeResponse.commandAttestationType,
        bridgeResponse.tokenContextId,
        bridgeResponse.attestationEncryptionPublicKey,
    )
}
function mapReattestation(bridgeResponse: BridgeReattestation): Reattestation {
    return {
        data: bridgeResponse.commandAttestation,
        type: bridgeResponse.commandAttestationType,
    }
}

function mapToken(bridgeResponse?: BridgeToken) {
    // TODO: What to do if not found? This ok?
    if (!bridgeResponse) return undefined
    if ('validityStart' in bridgeResponse) {
        return mapActivatedToken(bridgeResponse)
    } else {
        return mapPendingToken(bridgeResponse)
    }
}

export function decryptVisualInspectionNonce(
    contextId: string,
    tokenId: string,
    encryptedVisualInspectionNonce: string,
): Promise<string> {
    return bridge
        .decryptVisualInspectionNonce(contextId, tokenId, encryptedVisualInspectionNonce)
        .catch(handleNativeError)
}
