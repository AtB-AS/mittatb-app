import Foundation

public struct PrivateKey: Key {
    public let keyId: String
    public let reference: SecKey

    /// Generate the associated public key of the private key
    var publicKey: PublicKey? {
        guard let publicKey = SecKeyCopyPublicKey(reference) else {
            return nil
        }

        return PublicKey(reference: publicKey)
    }
}
