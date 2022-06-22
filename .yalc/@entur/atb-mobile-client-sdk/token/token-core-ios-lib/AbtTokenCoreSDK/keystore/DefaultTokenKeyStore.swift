import DeviceCheck
import Foundation

public class DefaultTokenKeyStore: TokenKeyStore {
    private let keyAliasFactory: KeyStoreAliasFactory
    private let keyStoreSearch: KeyStoreSearch
    private let secureAccess: SecAccessControl?

    public init(keyAliasFactory: KeyStoreAliasFactory, keyStoreSearch: KeyStoreSearch) {
        self.keyAliasFactory = keyAliasFactory
        self.keyStoreSearch = keyStoreSearch

        secureAccess = SecAccessControlCreateWithFlags(kCFAllocatorDefault, kSecAttrAccessibleWhenUnlockedThisDeviceOnly, .privateKeyUsage, nil)
    }

    // MARK: Encryption

    public func createEncryptionKey(tokenContext context: TokenContext, tokenId: String) -> Result<KeyPair, TokenKeyStoreError> {
        let alias = keyAliasFactory.getEncryptionKeyAlias(tokenContext: context, tokenId: tokenId)
        return createANewECKeyPair(keyAlias: alias)
    }

    public func getEncryptionPrivateKey(tokenContext context: TokenContext, tokenId: String) -> PrivateKey? {
        let alias = keyAliasFactory.getEncryptionKeyAlias(tokenContext: context, tokenId: tokenId)
        return getECPrivateKey(keyAlias: alias)
    }

    public func getEncryptionKeyPair(tokenContext context: TokenContext, tokenId: String) -> KeyPair? {
        guard let privateKey = getEncryptionPrivateKey(tokenContext: context, tokenId: tokenId) else {
            return nil
        }

        guard let publicKey = privateKey.publicKey else {
            return nil
        }

        return KeyPair(privateKey: privateKey, publicKey: publicKey)
    }

    // TODO: Remove if is not being used by iOS!
    public func getEncryptionCertificate(tokenContext context: TokenContext, tokenId: String) -> SecCertificate? {
        getCertificate(alias: keyAliasFactory.getEncryptionKeyAlias(tokenContext: context, tokenId: tokenId))
    }

    // MARK: Signature

    @available(iOS 14.0, *)
    public func createSignatureKey(tokenContext context: TokenContext, tokenId: String, onComplete callback: @escaping (Result<String, TokenKeyStoreError>) -> Void) {
        DCAppAttestService.shared.generateKey { newSignatureKeyId, error in
            guard error == nil else {
                return callback(.failure(.errorCreatingECKeyPair))
            }

            guard let newSignatureKeyId = newSignatureKeyId else {
                return callback(.failure(.errorSignatureKeyIdNotFound))
            }

            debugPrint("KeyId: \(newSignatureKeyId), TokenId: \(tokenId)")

            let alias = self.keyAliasFactory.getSignatureKeyAlias(tokenContext: context, tokenId: tokenId)
            guard KeyStoreManager.attribute(alias).save(newSignatureKeyId) else {
                return callback(.failure(.errorStoringKeyIdInKeyChain))
            }

            return callback(.success(newSignatureKeyId))
        }
    }

    @available(iOS 14.0, *)
    public func getSignatureKey(tokenContext context: TokenContext, tokenId: String) -> String? {
        let alias = keyAliasFactory.getSignatureKeyAlias(tokenContext: context, tokenId: tokenId)
        return KeyStoreManager.attribute(alias).value
    }

    public func createSignatureKey(tokenContext context: TokenContext, tokenId: String) -> Result<KeyPair, TokenKeyStoreError> {
        let alias = keyAliasFactory.getSignatureKeyAlias(tokenContext: context, tokenId: tokenId)
        return createANewECKeyPair(keyAlias: alias)
    }

    public func getSignaturePrivateKey(tokenContext context: TokenContext, tokenId: String) -> PrivateKey? {
        let alias = keyAliasFactory.getSignatureKeyAlias(tokenContext: context, tokenId: tokenId)
        return getECPrivateKey(keyAlias: alias)
    }

    public func getSignatureKeyPair(tokenContext context: TokenContext, tokenId: String) -> KeyPair? {
        guard let privateKey = getSignaturePrivateKey(tokenContext: context, tokenId: tokenId) else {
            return nil
        }

        guard let publicKey = privateKey.publicKey else {
            return nil
        }

        return KeyPair(privateKey: privateKey, publicKey: publicKey)
    }

    // MARK: Signature certificate

    public func getSignatureCertificate(tokenContext context: TokenContext, tokenId: String) -> SecCertificate? {
        getCertificate(alias: keyAliasFactory.getSignatureCertificateKeyAlias(tokenContext: context, tokenId: tokenId))
    }

    public func setSignatureCertificate(tokenContext context: TokenContext, tokenId: String, certificate: Data) -> SecCertificate? {
        let keyAlias = keyAliasFactory.getSignatureCertificateKeyAlias(tokenContext: context, tokenId: tokenId)

        guard storeCertificate(alias: keyAlias, certificateData: certificate) == true else {
            return nil
        }

        return getCertificate(alias: keyAlias)
    }

    // MARK: Tokens

    public func removeTokens(tokenContext context: TokenContext) {
        let keyAliases = keyStoreSearch.findAliases(tokenContext: context)
        removeTokenKeys(aliases: keyAliases)
    }

    public func hasTokens() -> Bool {
        !keyStoreSearch.findAllAliases().isEmpty
    }

    public func hasTokens(tokenContext: TokenContext) -> Bool {
        !keyStoreSearch.findAliases(tokenContext: tokenContext).isEmpty
    }

    public func removeToken(tokenContext context: TokenContext, tokenId: String) {
        let keyAliases = keyStoreSearch.findAliases(tokenContext: context, tokenId: tokenId)
        removeTokenKeys(aliases: keyAliases)
    }

    // MARK: Private functions

    private func createANewECKeyPair(keyAlias tag: String) -> Result<KeyPair, TokenKeyStoreError> {
        guard let secureAccess = secureAccess else {
            return .failure(.errorWhileUsingANilKeyChainAccessControl)
        }

        // New encryption EC keypair in the Secure Enclave
        let keyAttributes = [
            kSecAttrKeyType as String: kSecAttrKeyTypeEC,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: tag,
                kSecAttrAccessControl as String: secureAccess,
            ],
            kSecPublicKeyAttrs as String: [
                kSecAttrApplicationTag as String: tag,
            ],
        ] as CFDictionary

        var error: Unmanaged<CFError>?
        guard let privateKeySecKey = SecKeyCreateRandomKey(keyAttributes, &error) else {
            debugPrint(String(describing: error))
            return .failure(.errorCreatingECKeyPair)
        }

        let privateKey = PrivateKey(keyId: tag, reference: privateKeySecKey)

        guard let publicKey = privateKey.publicKey else {
            return .failure(.errorCreatingECKeyPair)
        }

        let keyPair = KeyPair(privateKey: privateKey, publicKey: publicKey)

        return .success(keyPair)
    }

    private func getECPrivateKey(keyAlias tag: String) -> PrivateKey? {
        let quertAttributes = [
            kSecClass as String: kSecClassKey,
            kSecAttrKeyType as String: kSecAttrKeyTypeEC,
            kSecAttrApplicationTag as String: tag,
            kSecReturnRef as String: true,
        ] as CFDictionary

        var item: CFTypeRef?
        let status = SecItemCopyMatching(quertAttributes, &item)

        guard status == errSecSuccess, let item = item else {
            debugPrint(String(describing: status.error?.localizedDescription))
            return nil
        }

        // swiftlint:disable:next force_cast
        return PrivateKey(keyId: tag, reference: item as! SecKey)
    }

    private func removeTokenKeys(aliases keyAliases: [String]) {
        for keyAlias in keyAliases {
            debugPrint("Removing: \(keyAlias)")

            // Remove keyPairs in the key chain
            let tokensQuery = [
                kSecClass as String: kSecClassKey,
                kSecAttrApplicationTag as String: keyAlias,
            ] as CFDictionary

            _ = SecItemDelete(tokensQuery)
        }
    }

    // MARK: Certificate helpers

    private func storeCertificate(alias: String, certificateData: Data) -> Bool {
        guard let certificate = SecCertificateCreateWithData(nil, certificateData as CFData) else {
            debugPrint("could not create certificate")
            return false
        }

        let addQuery = [
            kSecClass as String: kSecClassCertificate,
            kSecValueRef as String: certificate,
            kSecAttrLabel as String: alias,
        ] as CFDictionary

        // Avoid creating duplications, because `SecItemAdd` does not override!
        removeCertificate(alias: alias)
        let status = SecItemAdd(addQuery, nil)
        guard status == errSecSuccess else {
            debugPrint(status.error!.localizedDescription)
            return false
        }

        return true
    }

    private func removeCertificate(alias: String) {
        let removeQuery = [
            kSecClass as String: kSecClassCertificate,
            kSecAttrLabel as String: alias,
        ] as CFDictionary
        _ = SecItemDelete(removeQuery)
    }

    private func getCertificate(alias: String) -> SecCertificate? {
        let certificateQuery = [
            kSecClass as String: kSecClassCertificate,
            kSecAttrLabel as String: alias,
            kSecReturnRef as String: true,
        ] as CFDictionary

        var certificate: CFTypeRef?
        let status = SecItemCopyMatching(certificateQuery, &certificate)

        guard status == errSecSuccess, let certificate = certificate else {
            debugPrint(status.error!.localizedDescription)
            return nil
        }

        // swiftlint:disable:next force_cast
        return (certificate as! SecCertificate)
    }
}
