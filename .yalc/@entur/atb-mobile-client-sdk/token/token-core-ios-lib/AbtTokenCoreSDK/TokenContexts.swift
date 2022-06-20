import Foundation

public struct TokenContexts {
    private var contexts: [String: TokenContext]

    public init() {
        contexts = [:]
    }

    public var size: Int {
        contexts.count
    }

    public var contextIds: [String] {
        contexts.map(\.key)
    }

    public mutating func add(id: String) {
        contexts[id] = DefaultTokenContext(id: id)
    }

    public func getContext(key: String) -> TokenContext? {
        contexts[key]
    }

    public func clearAllTokens() {
        for (_, context) in contexts {
            context.token = nil
        }
    }
}
