struct KeyStoreSearchFactory: Provider {
    typealias T = DefaultKeystoreSearch

    static var shared = KeyStoreSearchFactory()

    private let keyStoreSearch: DefaultKeystoreSearch

    var defaultValue: DefaultKeystoreSearch {
        keyStoreSearch
    }

    init() {
        keyStoreSearch = DefaultKeystoreSearch(keystoreAliasFactory: KeyStoreAliasFactoryProvider.shared.defaultValue)
    }
}
