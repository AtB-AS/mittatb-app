import Foundation

public protocol DeviceAttestator {
    /// Create attestation of device with serverGeneratedNonce from server.
    ///
    /// `serverGeneratedNonce` A short lived secret from the server
    /// `signatureKeyPair` The public signature key to attest
    /// `encryptionKeyPair` The public encryption key to attest
    /// `attestationEncryptionPublicKey`
    /// `onComplete` A callback to return `AttestionObject` object
    func attest(serverGeneratedNonce: Data, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void)

    /// `reattestationData` A base64 encoded string with `AttestationData` object
    func reAttest(reattestationData: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void)

    func supportsAttestation() -> Bool
}
