import Foundation

public class DefaultKeyStoreAliasFactory: KeyStoreAliasFactory {
    private enum K {
        static let separator = ":" // do not use '-' as it is in the token
        static let encryptationKey = "encryption"
        static let signatureKey = "token"
        static let defaultKeyAliasPrefix = "entur-tokens"
        static let certificateKey = "certificate"
    }

    private let globalPrefixWithPrefix: String

    public init() {
        globalPrefixWithPrefix = K.defaultKeyAliasPrefix + K.separator
    }

    public init(globalPrefixWithPrefix prefix: String) {
        globalPrefixWithPrefix = prefix + K.separator
    }

    public func getAlias(tokenContext: TokenContext, tokenId: String, alias: String) -> String {
        getTokenAliasPrefix(tokenContext: tokenContext, tokenId: tokenId) + alias
    }

    public func getTokenAliasPrefix(tokenContext: TokenContext, tokenId: String) -> String {
        getContextAliasPrefix(tokenContext: tokenContext) + tokenId + K.separator
    }

    public func getContextAliasPrefix(tokenContext: TokenContext) -> String {
        globalPrefixWithPrefix + tokenContext.id + K.separator
    }

    public func getGlobalAliasPrefix() -> String {
        globalPrefixWithPrefix
    }

    public func getEncryptionKeyAlias(tokenContext: TokenContext, tokenId: String) -> String {
        getAlias(tokenContext: tokenContext, tokenId: tokenId, alias: K.encryptationKey)
    }

    public func getSignatureKeyAlias(tokenContext: TokenContext, tokenId: String) -> String {
        getAlias(tokenContext: tokenContext, tokenId: tokenId, alias: K.signatureKey)
    }

    public func getSignatureCertificateKeyAlias(tokenContext: TokenContext, tokenId: String) -> String {
        getAlias(tokenContext: tokenContext, tokenId: tokenId, alias: K.signatureKey + K.separator + K.certificateKey)
    }
}
