import Foundation

public class DefaultKeystoreSearch: KeyStoreSearch {
    private let keystoreAliasFactory: KeyStoreAliasFactory

    public init(keystoreAliasFactory factory: KeyStoreAliasFactory) {
        keystoreAliasFactory = factory
    }

    public func findAllAliases() -> [String] {
        findAllAliases(prefix: keystoreAliasFactory.getGlobalAliasPrefix())
    }

    public func findAliases(tokenContext: TokenContext) -> [String] {
        let prefix = keystoreAliasFactory.getContextAliasPrefix(tokenContext: tokenContext)
        return findAllAliases(prefix: prefix)
    }

    public func findAliases(tokenContext: TokenContext, tokenId: String) -> [String] {
        let prefix = keystoreAliasFactory.getTokenAliasPrefix(tokenContext: tokenContext, tokenId: tokenId)
        return findAllAliases(prefix: prefix)
    }

    // MARK: Private functions

    private func findAllAliases(prefix: String?) -> [String] {
        let tokensQuery = [
            kSecClass as String: kSecClassKey,
            kSecMatchLimit as String: kSecMatchLimitAll,
            kSecReturnAttributes as String: true,
            kSecReturnRef as String: true,
        ] as CFDictionary

        var result: AnyObject?
        let searchStatus = SecItemCopyMatching(tokensQuery, &result)

        guard searchStatus == errSecSuccess else {
            return []
        }

        guard let array = result as? [[String: Any]] else {
            return []
        }

        let aliases: [String] = array.compactMap { item in
            if let key = item[kSecAttrApplicationTag as String] as? String {
                return (prefix != nil) ? (key.contains(prefix!) ? key : nil) : key
            }

            return nil
        }

        return aliases
    }
}
