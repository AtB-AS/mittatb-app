import Foundation

public struct TokenPropertyStore {
    private let tokenContext: TokenContext

    // MARK: Getters

    // Token

    var tokenId: String? {
        TokenProperty.tokenId.get(tokenContext: tokenContext)
    }

    var tokenAttestationEncryptionPublicKey: Data? {
        TokenProperty.tokenAttestationEncryptionPublicKey.get(tokenContext: tokenContext)
    }

    var tokenValidityStart: Date? {
        TokenProperty.tokenValidityStart.get(tokenContext: tokenContext)
    }

    var tokenValidityEnd: Date? {
        TokenProperty.tokenValidityEnd.get(tokenContext: tokenContext)
    }

    // Pending new token

    var pendingNewTokenId: String? {
        TokenProperty.pendingNewTokenId.get(tokenContext: tokenContext)
    }

    var pendingNewAttestationEncryptionPublicKey: Data? {
        TokenProperty.pendingNewAttestationEncryptionPublicKey.get(tokenContext: tokenContext)
    }

    var pendingNewTokenCommandUuid: String? {
        TokenProperty.pendingNewTokenCommandUuid.get(tokenContext: tokenContext)
    }

    var pendingNewTokenCommandAttestation: Data? {
        TokenProperty.pendingNewTokenCommandAttestation.get(tokenContext: tokenContext)
    }

    var pendingNewTokenCommandAttestationType: String? {
        TokenProperty.pendingNewTokenCommandAttestationType.get(tokenContext: tokenContext)
    }

    var pendingNewTokenCommandTrace: String? {
        TokenProperty.pendingNewTokenCommandTrace.get(tokenContext: tokenContext)
    }

    // Pending renewal

    var pendingRenewalTokenId: String? {
        TokenProperty.pendingRenewalTokenId.get(tokenContext: tokenContext)
    }

    var pendingRenewalAttestationEncryptionPublicKey: Data? {
        TokenProperty.pendingRenewalAttestationEncryptionPublicKey.get(tokenContext: tokenContext)
    }

    var pendingRenewalTokenCommandUuid: String? {
        TokenProperty.pendingRenewalTokenCommandUuid.get(tokenContext: tokenContext)
    }

    var pendingRenewalTokenCommandAttestation: Data? {
        TokenProperty.pendingRenewalTokenCommandAttestation.get(tokenContext: tokenContext)
    }

    var pendingRenewalTokenCommandAttestationType: String? {
        TokenProperty.pendingRenewalTokenCommandAttestationType.get(tokenContext: tokenContext)
    }

    var pendingRenewalTokenCommandTrace: String? {
        TokenProperty.pendingRenewalTokenCommandTrace.get(tokenContext: tokenContext)
    }

    public init(tokenContext: TokenContext) {
        self.tokenContext = tokenContext
    }

    // MARK: Setters

    public func setToken(_ tokenId: String, attestationEncryptionPublicKey: Data, validityStart: Date, validityEnd: Date) {
        TokenProperty.tokenId.set(tokenId, tokenContext: tokenContext)
        TokenProperty.tokenAttestationEncryptionPublicKey.set(attestationEncryptionPublicKey, tokenContext: tokenContext)
        TokenProperty.tokenValidityStart.set(validityStart, tokenContext: tokenContext)
        TokenProperty.tokenValidityEnd.set(validityEnd, tokenContext: tokenContext)
    }

    public func setPendingNewToken(_ tokenId: String, trace: String, attestationEncryptionPublicKey: Data, attestationObject: AttestionObject) {
        TokenProperty.pendingNewTokenId.set(tokenId, tokenContext: tokenContext)
        TokenProperty.pendingNewAttestationEncryptionPublicKey.set(attestationEncryptionPublicKey, tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandUuid.set(attestationObject.uuid, tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandAttestation.set(attestationObject.attestionData, tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandAttestationType.set(attestationObject.objectType.rawValue, tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandTrace.set(trace, tokenContext: tokenContext)
    }

    public func setPendingRenewalToken(_ tokenId: String, trace: String, attestationEncryptionPublicKey: Data, attestationObject: AttestionObject) {
        TokenProperty.pendingRenewalTokenId.set(tokenId, tokenContext: tokenContext)
        TokenProperty.pendingRenewalAttestationEncryptionPublicKey.set(attestationEncryptionPublicKey, tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandUuid.set(attestationObject.uuid, tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandAttestation.set(attestationObject.attestionData, tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandAttestationType.set(attestationObject.objectType.rawValue, tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandTrace.set(trace, tokenContext: tokenContext)
    }

    // MARK: Removers

    public func removeToken() {
        TokenProperty.tokenId.remove(tokenContext: tokenContext)
        TokenProperty.tokenAttestationEncryptionPublicKey.remove(tokenContext: tokenContext)
        TokenProperty.tokenValidityStart.remove(tokenContext: tokenContext)
        TokenProperty.tokenValidityEnd.remove(tokenContext: tokenContext)
    }

    public func removePendingNewToken() {
        TokenProperty.pendingNewTokenId.remove(tokenContext: tokenContext)
        TokenProperty.pendingNewAttestationEncryptionPublicKey.remove(tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandUuid.remove(tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandAttestation.remove(tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandAttestationType.remove(tokenContext: tokenContext)
        TokenProperty.pendingNewTokenCommandTrace.remove(tokenContext: tokenContext)
    }

    public func removePendingRenewalToken() {
        TokenProperty.pendingRenewalTokenId.remove(tokenContext: tokenContext)
        TokenProperty.pendingRenewalAttestationEncryptionPublicKey.remove(tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandUuid.remove(tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandAttestation.remove(tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandAttestationType.remove(tokenContext: tokenContext)
        TokenProperty.pendingRenewalTokenCommandTrace.remove(tokenContext: tokenContext)
    }
}
