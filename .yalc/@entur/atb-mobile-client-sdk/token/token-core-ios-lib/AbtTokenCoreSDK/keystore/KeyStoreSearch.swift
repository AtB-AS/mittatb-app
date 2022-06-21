import Foundation

public protocol KeyStoreSearch {
    func findAllAliases() -> [String]

    func findAliases(tokenContext: TokenContext) -> [String]

    func findAliases(tokenContext: TokenContext, tokenId: String) -> [String]
}
