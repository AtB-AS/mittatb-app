@testable import AbtTokenCoreSDK
import Foundation
import XCTest

class TokenStoreKeyTests: XCTestCase {
    private let tokenId = "affc9564-4cd3-49aa-9fc7-c98bc9dbc9d7"
    private var keyStoreSearch = KeyStoreSearchFactory.shared.defaultValue
    private var tokenKeyStore: DefaultTokenKeyStore!
    private var tokenContext: TokenContext!

    override func setUp() {
        tokenContext = buildTokenContext()
        tokenKeyStore = buildDefaultTokenKeyStore()
    }

    override func tearDown() {
        tokenKeyStore.removeTokens(tokenContext: tokenContext)
    }

    func testCreateAndRemoveSignatureKey() {
        _ = tokenKeyStore.createSignatureKey(tokenContext: tokenContext, tokenId: tokenId)
        XCTAssertTrue(tokenKeyStore.hasTokens(tokenContext: tokenContext))
        tokenKeyStore.removeTokens(tokenContext: tokenContext)
        XCTAssertFalse(tokenKeyStore.hasTokens(tokenContext: tokenContext))
    }

    func testCreateAndRemoveEncryptionKey() {
        _ = tokenKeyStore.createEncryptionKey(tokenContext: tokenContext, tokenId: tokenId)
        XCTAssertTrue(tokenKeyStore.hasTokens(tokenContext: tokenContext))
        tokenKeyStore.removeTokens(tokenContext: tokenContext)
        XCTAssertFalse(tokenKeyStore.hasTokens(tokenContext: tokenContext))
    }

    func testCreateSignatureKey() {
        let result = tokenKeyStore.createSignatureKey(tokenContext: tokenContext, tokenId: tokenId)
        if case let .success(tokenTrustChain) = result {
            XCTAssertNotNil(tokenTrustChain.publicKey)

            let encodedPublicKey = tokenTrustChain.publicKey
            XCTAssertNotNil(encodedPublicKey)

            return
        }

        XCTFail("Error creating signature key")
    }

    func testCreateSignatureKeyAndCompareEncodedAndDecoded() {
        let result = tokenKeyStore.createSignatureKey(tokenContext: tokenContext, tokenId: tokenId)
        if case let .success(tokenTrustChain) = result {
            XCTAssertNotNil(tokenTrustChain.publicKey)

            let encodedPublicKey = tokenTrustChain.publicKey
            XCTAssertNotNil(encodedPublicKey)

            return
        }

        XCTFail("Error creating signature key")
    }

    func testCreateAndGetSignatureKey() {
        let result = tokenKeyStore.createSignatureKey(tokenContext: tokenContext, tokenId: tokenId)
        if case let .success(tokenTrustChain) = result {
            let signatureKey = tokenKeyStore.getSignaturePrivateKey(tokenContext: tokenContext, tokenId: tokenId)
            XCTAssertNotNil(signatureKey)
            XCTAssertTrue(tokenTrustChain.privateKey.publicKey?.encodedToPemString == signatureKey?.publicKey?.encodedToPemString)
            XCTAssertNotNil(signatureKey?.publicKey)
            XCTAssertTrue(tokenTrustChain.publicKey.encodedToPemString == signatureKey?.publicKey?.encodedToPemString)
            return
        }

        XCTFail("Error creating signature key")
    }

    func testCreateAndGetEncryptionKey() {
        let result = tokenKeyStore.createEncryptionKey(tokenContext: tokenContext, tokenId: tokenId)
        if case let .success(tokenTrustChain) = result {
            let signatureKey = tokenKeyStore.getEncryptionPrivateKey(tokenContext: tokenContext, tokenId: tokenId)
            XCTAssertNotNil(signatureKey)
            XCTAssertTrue(tokenTrustChain.privateKey.publicKey?.encodedToPemString == signatureKey?.publicKey?.encodedToPemString)
            XCTAssertNotNil(signatureKey?.publicKey)
            XCTAssertTrue(tokenTrustChain.publicKey.encodedToPemString == signatureKey?.publicKey?.encodedToPemString)
            return
        }

        XCTFail("Error creating signature key")
    }

    func testCreateEncryptionKey() {
        let result = tokenKeyStore.createEncryptionKey(tokenContext: tokenContext, tokenId: tokenId)
        if case let .success(tokenTrustChain) = result {
            XCTAssertNotNil(tokenTrustChain.publicKey)

            let encodedPublicKey = tokenTrustChain.publicKey.encodedToPemString
            XCTAssertNotNil(encodedPublicKey)

            return
        }

        XCTFail("Error creating encryption key")
    }

    private func buildKeyAliasFactory() -> KeyStoreAliasFactory {
        DefaultKeyStoreAliasFactory(globalPrefixWithPrefix: "test")
    }

    private func buildTokenContext() -> TokenContext {
        DefaultTokenContext(id: "test", tokenRenewer: MockedDefaultTokenRenewer())
    }

    private func buildDefaultTokenKeyStore() -> DefaultTokenKeyStore {
        DefaultTokenKeyStore(keyAliasFactory: KeyStoreAliasFactoryProvider.shared.defaultValue, keyStoreSearch: keyStoreSearch)
    }
}
