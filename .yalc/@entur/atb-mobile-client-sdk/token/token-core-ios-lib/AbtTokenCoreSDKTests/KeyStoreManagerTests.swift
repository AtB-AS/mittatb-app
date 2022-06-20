@testable import AbtTokenCoreSDK
import Foundation
import XCTest

class KeyStoreManagerTests: XCTestCase {
    func testCreateGetAndDeleteKey() {
        let keyId = "123"
        let keyValue = "321"

        let resultCreate = KeyStoreManager.attribute(keyId).save(keyValue)
        XCTAssertTrue(resultCreate)

        let resultGet = KeyStoreManager.attribute(keyId).value
        XCTAssert(keyValue == resultGet)

        let resultRemove = KeyStoreManager.attribute(keyId).remove()
        XCTAssertTrue(resultRemove)

        XCTAssertNil(KeyStoreManager.attribute(keyId).value)
    }
}
