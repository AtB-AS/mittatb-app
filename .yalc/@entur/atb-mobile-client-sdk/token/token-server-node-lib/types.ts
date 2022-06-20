export interface AbtTokenServerConfig {
    abtHost: string
    abtTokenHost: string
    clientId: string
    clientSecret: string
    apiKey: string
    iosDeviceCheck: {
        issuer: string
        keyid: string
        privateKey: string
    }
}

export interface MetadataParams {
    correlationId: string
    includeAuthorization: boolean
    signedToken?: string
    reattestation?: Reattestation
}

export interface Reattestation {
    data: string
    type: string
}

export interface AuthTokenResponse {
    access_token: string
}

export interface ActiveTokenDetails {
    tokenId: string
    signatureCertificate: string
    validityStart: number
    validityEnd: number
}

export interface PendingTokenDetails {
    tokenId: string
    nonce: string
    attestationEncryptionPublicKey: string
    nonceValidityEnd: number
}

export interface InitRequest {
    keyValues?: KeyValue[]
}

export interface InitResponse {
    pendingTokenDetails: PendingTokenDetails
}

export interface ActivateRequest {
    attestation: string
    attestationType: string
    encryptionCertificateChain?: string[]
    signatureCertificateChain?: string[]
    tokenId: string
    commandUuid: string
}

export interface ActivateResponse {
    activeTokenDetails: ActiveTokenDetails
}

export type RenewResponse = InitResponse

export type CompleteRequest = ActivateRequest

export type CompleteResponse = ActivateResponse

export type DetailsResponse = ActivateResponse

export interface RemoveRequest {
    tokenId: string
}

export interface RemoveResponse {
    removed: boolean
}

export type KeyValue = {
    key: string
    value: string
}

export enum AttestationType {
    AndroidSafetyNetAttestation = 'AndroidSafetyNetAttestation',
    IOSAppAttestAttestation = 'IOSAppAttestAttestation',
    IOSAppAttestAssertion = 'IOSAppAttestAssertion',
    IOSDeviceCheckResult = 'IOSDeviceCheckResult',
    NonceOnlyAttestation = 'NonceOnlyAttestation',
}

export interface IOSAppAttestData {
    object: string
    deviceCheckResult: string
}
