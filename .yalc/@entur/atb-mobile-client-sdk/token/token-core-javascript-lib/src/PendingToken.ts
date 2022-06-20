import Token from './Token'

export default class PendingToken extends Token {
    private readonly commandUuid: string
    private readonly attestation: string
    private readonly attestationType: string
    readonly signatureKey?: string
    readonly encryptionKey?: string
    readonly signatureCertificateChain?: string[]
    readonly encryptionCertificateChain?: string[]
    readonly attestationEncryptionPublicKey?: string

    constructor(
        tokenId: string,
        signatureKey: string | undefined,
        encryptionKey: string | undefined,
        signatureCertificateChain: string[] | undefined,
        encryptionCertificateChain: string[] | undefined,
        commandUuid: string,
        attestation: string,
        attestationType: string,
        contextId: string,
        attestationEncryptionPublicKey: string,
    ) {
        super(tokenId, contextId)
        this.commandUuid = commandUuid
        this.attestation = attestation
        this.attestationType = attestationType
        this.signatureKey = signatureKey
        this.signatureCertificateChain = signatureCertificateChain
        this.encryptionKey = encryptionKey
        this.encryptionCertificateChain = encryptionCertificateChain
        this.attestationEncryptionPublicKey = attestationEncryptionPublicKey
    }

    getCommandUuid = () => this.commandUuid
    getAttestation = () => this.getAttestation
    getAttestationType = () => this.getAttestationType
    getAttestationEncryptionPublicKey = () => this.attestationEncryptionPublicKey

    toJSON = () => ({
        tokenId: this.tokenId,
        attestation: this.attestation,
        attestationType: this.attestationType,
        signatureCertificateChain: this.signatureCertificateChain,
        encryptionCertificateChain: this.encryptionCertificateChain,
        commandUuid: this.commandUuid,
    })
}
