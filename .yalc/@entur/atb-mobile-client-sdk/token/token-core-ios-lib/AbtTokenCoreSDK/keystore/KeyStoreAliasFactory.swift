import Foundation

public protocol KeyStoreAliasFactory {
    func getAlias(tokenContext: TokenContext, tokenId: String, alias: String) -> String

    func getTokenAliasPrefix(tokenContext: TokenContext, tokenId: String) -> String

    func getContextAliasPrefix(tokenContext: TokenContext) -> String

    func getGlobalAliasPrefix() -> String

    func getEncryptionKeyAlias(tokenContext: TokenContext, tokenId: String) -> String

    func getSignatureKeyAlias(tokenContext: TokenContext, tokenId: String) -> String

    func getSignatureCertificateKeyAlias(tokenContext: TokenContext, tokenId: String) -> String
}
