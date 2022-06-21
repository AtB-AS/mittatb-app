import Foundation

public struct PublicKey: Key {
    private static let cryptoExportImportManager = CryptoExportImportManager()

    public let reference: SecKey

    init(reference: SecKey) {
        self.reference = reference
    }

    init?(data: Data) {
        var error: Unmanaged<CFError>?
        guard let key = SecKeyCreateWithData(
            data as NSData,
            [
                kSecAttrKeyType: kSecAttrKeyTypeRSA,
                kSecAttrKeyClass: kSecAttrKeyClassPublic,
            ] as NSDictionary,
            &error
        ) else {
            return nil
        }

        self.init(reference: key)
    }

    // NOTE: This one is encoded base64!
    public var encodedToPemString: String? {
        guard let attributes = SecKeyCopyAttributes(reference) as? [CFString: Any],
              let keySize = attributes[kSecAttrKeySizeInBits] as? Int,
              let keyType = attributes[kSecAttrKeyType] as? String
        else {
            return nil
        }

        guard let encoded = encoded, let pem = Self.cryptoExportImportManager.exportPublicKeyToPEM(encoded, keyType: keyType, keySize: keySize) else {
            return nil
        }

        return pem.pemTagRemoved
    }

    public var encodedToPemData: Data? {
        encodedToPemString?.decodedBase64
    }
}
