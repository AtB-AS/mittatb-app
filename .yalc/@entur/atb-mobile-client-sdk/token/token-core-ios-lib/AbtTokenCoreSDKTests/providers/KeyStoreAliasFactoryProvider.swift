import Foundation

struct KeyStoreAliasFactoryProvider: Provider {
    private enum K {
        static let defaultGlobalPrefix = "iostest"
    }

    static let shared = KeyStoreAliasFactoryProvider()

    private let keyStoreAliasFactory: DefaultKeyStoreAliasFactory

    var defaultValue: DefaultKeyStoreAliasFactory {
        keyStoreAliasFactory
    }

    init() {
        keyStoreAliasFactory = DefaultKeyStoreAliasFactory(globalPrefixWithPrefix: K.defaultGlobalPrefix)
    }
}
