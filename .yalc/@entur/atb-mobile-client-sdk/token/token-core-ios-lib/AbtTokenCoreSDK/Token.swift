import Foundation

public class SecureContainerWrapper {
    private var secureContainer: No_Entur_Abt_Core_V1_SecureContainer

    init(container: No_Entur_Abt_Core_V1_SecureContainer) {
        secureContainer = container
    }

    public var base64EncodedString: String? {
        guard let encodedData = try? secureContainer.serializedData() else {
            return nil
        }

        return encodedData.base64EncodedString
    }
}

public class Token {
    private enum Key: String {
        case activated, tokenId, tokenContextId, deviceAttestationCounter, attestationEncryptionPublicKey
    }

    public private(set) var tokenId: String
    public private(set) var signatureKeyId: String?
    public private(set) var signatureKeyPair: KeyPair?
    public private(set) var encryptionKeyPair: KeyPair

    private(set) var tokenContext: TokenContext
    private(set) var strainNumber: Int32
    private(set) var tokenEncoder: TokenEncoder
    private(set) var deviceAttestationCounter: Int32 = 0
    private(set) var attestationEncryptionPublicKey: Data

    public var isLatestStrain: Bool {
        tokenContext.isLatestStrain(strainNumber: strainNumber)
    }

    public init(tokenId: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, tokenEncoder: TokenEncoder, strainNumber: Int32, tokenContext: TokenContext) {
        self.tokenId = tokenId
        self.signatureKeyId = signatureKeyId
        self.signatureKeyPair = signatureKeyPair
        self.encryptionKeyPair = encryptionKeyPair
        self.tokenEncoder = tokenEncoder
        self.strainNumber = strainNumber
        self.tokenContext = tokenContext
        self.attestationEncryptionPublicKey = attestationEncryptionPublicKey
    }

    public func incrementDeviceAttestationCounter() {
        OSAtomicIncrement32(&deviceAttestationCounter)
    }

    public func isDeviceAttestationIncrement(reference: Int) -> Bool {
        reference < deviceAttestationCounter
    }

    public func decryptVisualInspectionNonce(_ cipherText: Data) -> Data? {
        let privateKey = encryptionKeyPair.privateKey.reference
        let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM

        guard SecKeyIsAlgorithmSupported(privateKey, .decrypt, algorithm) else {
            debugPrint("Algorithm not supported")
            return nil
        }

        var error: Unmanaged<CFError>?
        guard let value = SecKeyCreateDecryptedData(privateKey, algorithm, cipherText as CFData, &error) as Data? else {
            debugPrint(error.debugDescription)
            return nil
        }

        return value
    }

    public func encodeAsSecureContainer(tokenEncodingRequest: TokenEncodingRequest, onComplete callback: @escaping (SecureContainerWrapper?) -> Void) {
        tokenEncoder.encodeAsSecureContainer(tokenEncodingRequest: tokenEncodingRequest, token: self) { secureContainerResult in
            switch secureContainerResult {
            case let .success(secureContainer):
                let container = SecureContainerWrapper(container: secureContainer)
                return callback(container)
            case let .failure(error):
                debugPrint(error)
                return callback(nil)
            }
        }
    }

    public func toMap() -> NSMutableDictionary {
        let data = NSMutableDictionary()
        data.setValue(self is ActivatedToken, forKey: Key.activated.rawValue)
        data.setValue(tokenId, forKey: Key.tokenId.rawValue)
        data.setValue(tokenContext.id, forKey: Key.tokenContextId.rawValue)
        data.setValue(attestationEncryptionPublicKey.base64EncodedString, forKey: Key.attestationEncryptionPublicKey.rawValue)
        data.setValue(deviceAttestationCounter, forKey: Key.deviceAttestationCounter.rawValue)

        return data
    }
}
