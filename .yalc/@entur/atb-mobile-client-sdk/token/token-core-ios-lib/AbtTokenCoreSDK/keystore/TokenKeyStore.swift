import Foundation

public protocol TokenKeyStore {
    // MARK: Encryption

    func createEncryptionKey(tokenContext: TokenContext, tokenId: String) -> Result<KeyPair, TokenKeyStoreError>

    func getEncryptionPrivateKey(tokenContext: TokenContext, tokenId: String) -> PrivateKey?

    func getEncryptionKeyPair(tokenContext context: TokenContext, tokenId: String) -> KeyPair?

    func getEncryptionCertificate(tokenContext: TokenContext, tokenId: String) -> SecCertificate?

    // MARK: Signature

    func createSignatureKey(tokenContext: TokenContext, tokenId: String) -> Result<KeyPair, TokenKeyStoreError>

    @available(iOS 14.0, *)
    func createSignatureKey(tokenContext context: TokenContext, tokenId: String, onComplete callback: @escaping (Result<String, TokenKeyStoreError>) -> Void)

    @available(iOS 14.0, *)
    func getSignatureKey(tokenContext context: TokenContext, tokenId: String) -> String?

    func getSignaturePrivateKey(tokenContext: TokenContext, tokenId: String) -> PrivateKey?

    func getSignatureKeyPair(tokenContext context: TokenContext, tokenId: String) -> KeyPair?

    func getSignatureCertificate(tokenContext: TokenContext, tokenId: String) -> SecCertificate?

    func setSignatureCertificate(tokenContext: TokenContext, tokenId: String, certificate: Data) -> SecCertificate?

    // MARK: Tokens

    func removeTokens(tokenContext: TokenContext)

    func hasTokens() -> Bool

    func hasTokens(tokenContext: TokenContext) -> Bool

    func removeToken(tokenContext: TokenContext, tokenId: String)
}
