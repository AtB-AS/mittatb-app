import CommonCrypto
import CryptoKit
import Foundation

public extension Data {
    var bytes: [UInt8] {
        Array(self)
    }

    var utf8: String? {
        String(data: self, encoding: .utf8)
    }

    var base64EncodedString: String {
        base64EncodedString(options: Data.Base64EncodingOptions(rawValue: 0))
    }

    func sha256() -> Data {
        if #available(iOS 13.0, *) {
            return Data(SHA256.hash(data: self))
        } else {
            var hash = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
            withUnsafeBytes {
                _ = CC_SHA256($0.baseAddress, CC_LONG(count), &hash)
            }

            return Data(hash)
        }
    }
}

public extension String {
    var pemTagRemoved: String {
        var str: String = self
        str = str.replacingOccurrences(of: "-----BEGIN PUBLIC KEY-----", with: "")
        str = str.replacingOccurrences(of: "-----END PUBLIC KEY-----", with: "")
        str = str.trimmingCharacters(in: .whitespacesAndNewlines)
        return str
    }

    var base64Encoded: String? {
        data(using: .utf8)?.base64EncodedString
    }

    var base64EncodedData: Data? {
        data(using: .utf8)?.base64EncodedData()
    }

    var decodedBase64: Data? {
        Data(base64Encoded: self, options: .ignoreUnknownCharacters)
    }
}
