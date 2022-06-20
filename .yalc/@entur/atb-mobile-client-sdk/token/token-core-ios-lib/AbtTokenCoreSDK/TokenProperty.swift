import Foundation

public enum TokenProperty: String {
    fileprivate enum K {
        static let separator = ":"
        static let defaultKeyAliasPrefix = "entur-tokens"
    }

    // Token
    case tokenId
    case tokenAttestationEncryptionPublicKey
    case tokenValidityStart
    case tokenValidityEnd

    // Pending renewal
    case pendingRenewalTokenId
    case pendingRenewalAttestationEncryptionPublicKey
    case pendingRenewalTokenCommandUuid
    case pendingRenewalTokenCommandAttestation
    case pendingRenewalTokenCommandAttestationType
    case pendingRenewalTokenCommandTrace

    // Pending new token
    case pendingNewTokenId
    case pendingNewAttestationEncryptionPublicKey
    case pendingNewTokenCommandUuid
    case pendingNewTokenCommandAttestation
    case pendingNewTokenCommandAttestationType
    case pendingNewTokenCommandTrace

    public func get<T>(tokenContext context: TokenContext) -> T? {
        let keyPrefix = buildKeyPrefix(key: rawValue, tokenContext: context)
        guard let result = UserDefaults.standard.object(forKey: keyPrefix) as? T else {
            return nil
        }

        return result
    }

    public func set<T>(_ value: T?, tokenContext context: TokenContext) {
        UserDefaults.standard.set(value, forKey: buildKeyPrefix(key: rawValue, tokenContext: context))
        UserDefaults.standard.synchronize()
    }

    public func remove(tokenContext context: TokenContext) {
        UserDefaults.standard.removeObject(forKey: buildKeyPrefix(key: rawValue, tokenContext: context))
        UserDefaults.standard.synchronize()
    }

    // MARK: Private functions

    private func buildKeyPrefix(key keyId: String, tokenContext context: TokenContext) -> String {
        K.defaultKeyAliasPrefix + K.separator + context.id + K.separator + keyId
    }
}
