import CommonCrypto
import DeviceCheck
import Foundation

public class IOSDeviceAttestator: AbstractDeviceAttestor, DeviceAttestator {
    fileprivate enum K {
        static let defaultIVData: [UInt8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    private let deviceDetailsProvider = DefaultDeviceDetailsProvider()

    override public init() {}

    public func attest(serverGeneratedNonce: Data, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        generateToken { [weak self] result in
            switch result {
            case let .failure(error):
                return callback(.failure(error))
            case let .success(deviceCheckToken):
                // Needed for `No_Entur_Abt_Traveller_V1_DeviceAttestationData`

                self?.handleAttestation(deviceCheckToken: deviceCheckToken, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, serverGeneratedNonce: serverGeneratedNonce, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
            }
        }
    }

    public func reAttest(reattestationData: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        guard let decodedData = reattestationData.decodedBase64 else {
            return callback(.failure(.errorDecodingBase64AttestationData))
        }

        guard let attestationData = try? No_Entur_Abt_Common_V1_MobileTokenReattestationData(serializedData: decodedData) else {
            return callback(.failure(.errorSerializingAttestationData))
        }

        let nonce = attestationData.nonce

        // NOTE: The `attestationEncryptionPublicKey` must be used from the `ReattestationData` not what comes from the bridge, to ensure the keys do not repeat with the one used for activation!
        let attestationEncryptionPublicKey = attestationData.attestationEncryptionPublicKey

        if #available(iOS 14.0, *) {
            guard let signatureKeyId = signatureKeyId else {
                return callback(.failure(.errorSignatureKeyIdNotFound))
            }

            generateToken { [weak self] result in
                switch result {
                case let .failure(error):
                    return callback(.failure(error))
                case let .success(deviceCheckToken):
                    // Needed for `No_Entur_Abt_Traveller_V1_DeviceAttestationData`

                    guard let encodedEncryptionPublicKey = encryptionKeyPair.publicKey.encodedToPemData else {
                        return callback(.failure(.errorEncodingPublicKey))
                    }

                    self?.handleReAttestationWithSignatureKeyId(signatureKeyId, deviceCheckToken: deviceCheckToken, serverGeneratedNonce: nonce, encryptionPublicKey: encodedEncryptionPublicKey, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
                }
            }
        } else {
            attest(serverGeneratedNonce: nonce, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
        }
    }

    public func supportsAttestation() -> Bool {
        if #available(iOS 14.0, *) {
            return DCAppAttestService.shared.isSupported
        } else if #available(iOS 11.0, *) {
            return DCDevice.current.isSupported
        }

        return false
    }
}

// MARK: Attestation Helpers

extension IOSDeviceAttestator {
    /// It differentiates between different iOS versions and calls the required function for attestation for each one
    private func handleAttestation(deviceCheckToken: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, serverGeneratedNonce: Data, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        if #available(iOS 14.0, *) {
            guard let signatureKeyId = signatureKeyId else {
                return callback(.failure(.errorSignatureKeyIdNotFound))
            }

            return attestWithSignatureKeyId(signatureKeyId, deviceCheckToken: deviceCheckToken, serverGeneratedNonce: serverGeneratedNonce, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
        } else {
            guard let signatureKeyPair = signatureKeyPair else {
                return callback(.failure(.errorNilSignatureKey))
            }

            attestWithDeviceCheckToken(deviceCheckToken, serverGeneratedNonce: serverGeneratedNonce, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
        }
    }

    @available(iOS 14.0, *)
    private func attestWithSignatureKeyId(_ signatureKeyId: String, deviceCheckToken: String, serverGeneratedNonce: Data, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        guard let encodedEncryptionPublicKey = encryptionKeyPair.publicKey.encodedToPemData else {
            return callback(.failure(.errorEncodingPublicKey))
        }

        let iOSDeviceCheckAttestationResult = buildIOSDeviceCheckResultWithSignatureKeyId(signatureKeyId, deviceCheckToken: deviceCheckToken, encryptionPublicKey: encodedEncryptionPublicKey, attestationEncryptionPublicKey: attestationEncryptionPublicKey, serverGeneratedNonce: serverGeneratedNonce)
        switch iOSDeviceCheckAttestationResult {
        case let .failure(error):
            return callback(.failure(error))
        case let .success(iOSDeviceCheckResult):
            guard let serializedIOSDeviceCheckResult = try? iOSDeviceCheckResult.serializedData() else {
                return callback(.failure(.errorSerializingIOSDeviceCheckAttestation))
            }

            let hash = serializedIOSDeviceCheckResult.sha256()

            DCAppAttestService.shared.attestKey(signatureKeyId, clientDataHash: hash, completionHandler: { data, error in
                if let error = error {
                    debugPrint(error.localizedDescription)
                    return callback(.failure(.errorAttestingKey(error.localizedDescription)))
                }

                // Needed for `No_Entur_Abt_Traveller_V1_IOSAppAttestAttestation`

                guard let attestationObject = data?.base64EncodedString else {
                    return callback(.failure(.errorEncodingBase64AttestationData))
                }

                let IOSAppAttestAttestation = self.createIOSAppAttestAttestation(iOSDeviceCheckResult: serializedIOSDeviceCheckResult, attestationObject: attestationObject)

                guard let serializedIOSAppAttestAttestation = try? IOSAppAttestAttestation.serializedData() else {
                    return callback(.failure(.errorSerializingIOSAppAttestAttestation))
                }

                let attestObject = AttestionObject(type: .attestation, data: serializedIOSAppAttestAttestation)

                return callback(.success(attestObject))
            })
        }
    }

    private func attestWithDeviceCheckToken(_ deviceCheckToken: String, serverGeneratedNonce: Data, signatureKeyPair: KeyPair, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        guard let encodedSignaturePublicKey = signatureKeyPair.publicKey.encodedToPemData, let encodedEncryptionPublicKey = encryptionKeyPair.publicKey.encodedToPemData else {
            return callback(.failure(.errorEncodingPublicKey))
        }

        let iOSDeviceCheckAttestationResult = buildIOSDeviceCheckResultWithDeviceCheckToken(deviceCheckToken, serverGeneratedNonce: serverGeneratedNonce, signaturePublicKey: encodedSignaturePublicKey, encryptionPublicKey: encodedEncryptionPublicKey, attestationEncryptionPublicKey: attestationEncryptionPublicKey)
        switch iOSDeviceCheckAttestationResult {
        case let .failure(error):
            return callback(.failure(error))
        case let .success(iOSDeviceCheckResult):
            guard let serializedIOSDeviceCheckResult = try? iOSDeviceCheckResult.serializedData() else {
                return callback(.failure(.errorSerializingIOSDeviceCheckAttestation))
            }

            let attestObject = AttestionObject(type: .checkResult, data: serializedIOSDeviceCheckResult)

            return callback(.success(attestObject))
        }
    }
}

// MARK: ReAttestation Helpers

extension IOSDeviceAttestator {
    @available(iOS 14.0, *)
    private func handleReAttestationWithSignatureKeyId(_ signatureKeyId: String, deviceCheckToken: String, serverGeneratedNonce: Data, encryptionPublicKey: Data, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<AttestionObject, DeviceAttestatorError>) -> Void) {
        let iOSDeviceCheckAttestationResult = buildIOSDeviceCheckResultWithSignatureKeyId(signatureKeyId, deviceCheckToken: deviceCheckToken, encryptionPublicKey: encryptionPublicKey, attestationEncryptionPublicKey: attestationEncryptionPublicKey, serverGeneratedNonce: serverGeneratedNonce)

        switch iOSDeviceCheckAttestationResult {
        case let .failure(error):
            return callback(.failure(error))
        case let .success(iOSDeviceCheckResult):
            guard let serializedIOSDeviceCheckResult = try? iOSDeviceCheckResult.serializedData() else {
                return callback(.failure(.errorSerializingIOSDeviceCheckAttestation))
            }

            let hash = serializedIOSDeviceCheckResult.sha256()

            debugPrint("Using KeyId: \(signatureKeyId)")

            DCAppAttestService.shared.generateAssertion(signatureKeyId, clientDataHash: hash) { assertion, error in
                guard let assertion = assertion else {
                    return callback(.failure(.errorGeneratingAssertion(error.debugDescription)))
                }

                let iOSAppAttestAssertion = self.createIOSAppAttestAssertion(iOSDeviceCheckResult: serializedIOSDeviceCheckResult, assertionObject: assertion.base64EncodedString)

                guard let serializedIOSAppAttestAssertion = try? iOSAppAttestAssertion.serializedData() else {
                    return callback(.failure(.errorSerializingIOSDeviceCheckAttestation))
                }

                let attestObject = AttestionObject(type: .assertion, data: serializedIOSAppAttestAssertion)

                return callback(.success(attestObject))
            }
        }
    }
}

// MARK: DeviceAttestationData Helpers

extension IOSDeviceAttestator {
    @available(iOS 14.0, *)
    private func buildIOSDeviceCheckResultWithSignatureKeyId(_ signatureKeyId: String, deviceCheckToken: String, encryptionPublicKey: Data, attestationEncryptionPublicKey: Data, serverGeneratedNonce: Data) -> Result<No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult, DeviceAttestatorError> {
        let deviceAttestationData = createDeviceAttestationDataWithSignatureKeyId(signatureKeyId, encryptionPublicKey: encryptionPublicKey, nonce: serverGeneratedNonce)

        return buildIOSDeviceCheckResultWithDeviceAttestationData(deviceAttestationData, deviceCheckToken: deviceCheckToken, attestationEncryptionPublicKey: attestationEncryptionPublicKey)
    }

    private func buildIOSDeviceCheckResultWithDeviceCheckToken(_ deviceCheckToken: String, serverGeneratedNonce: Data, signaturePublicKey: Data, encryptionPublicKey: Data, attestationEncryptionPublicKey: Data) -> Result<No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult, DeviceAttestatorError> {
        let deviceAttestationData = createDeviceAttestationData(signaturePublicKey: signaturePublicKey, encryptionPublicKey: encryptionPublicKey, nonce: serverGeneratedNonce)

        return buildIOSDeviceCheckResultWithDeviceAttestationData(deviceAttestationData, deviceCheckToken: deviceCheckToken, attestationEncryptionPublicKey: attestationEncryptionPublicKey)
    }

    private func buildIOSDeviceCheckResultWithDeviceAttestationData(_ deviceAttestationData: No_Entur_Abt_Traveller_V1_DeviceAttestationData, deviceCheckToken: String, attestationEncryptionPublicKey: Data) -> Result<No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult, DeviceAttestatorError> {
        // Needed for `No_Entur_Abt_Traveller_V1_EncryptedIOSDeviceCheckData`

        let encryptedIOSDeviceCheckData = createEncryptedIOSDeviceCheckData(deviceCheckToken: deviceCheckToken, deviceAttestationData: deviceAttestationData)

        guard let serializedEncryptedIOSDeviceCheckData = try? encryptedIOSDeviceCheckData.serializedData() else {
            return .failure(.errorSerializingEncryptedIOSDeviceCheckData)
        }

        // Needed for `No_Entur_Abt_Traveller_V1_IOSDeviceCheckAttestation`

        guard let aesKey = generateAesKey() else {
            return .failure(.errorGeneratingAesKey)
        }

        guard let attestationEncryptionEncryptedKey = encryptEASKey(Array(aesKey), publicKey: attestationEncryptionPublicKey) else {
            return .failure(.errorEncryptingAESKey)
        }

        guard let encryptedEncryptedIOSDeviceCheckData = encrypt(Array(serializedEncryptedIOSDeviceCheckData), key: Array(aesKey)) else {
            return .failure(.errorEncryptingEncryptedIOSDeviceCheckData)
        }

        // No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult

        let iOSDeviceCheckResult = createIOSDeviceCheckResult(encryptedIosDeviceCheckData: encryptedEncryptedIOSDeviceCheckData, attestationEncryptionEncryptedKey: attestationEncryptionEncryptedKey)

        return .success(iOSDeviceCheckResult)
    }
}

// MARK: Token generator helper

extension IOSDeviceAttestator {
    private func generateToken(onComplete callback: @escaping (Result<String, DeviceAttestatorError>) -> Void) {
        guard DCDevice.current.isSupported else {
            return callback(.failure(.errorDeviceNotSupported))
        }

        DCDevice.current.generateToken(completionHandler: { data, error in
            guard error == nil else {
                return callback(.failure(.errorGeneratingToken(error.debugDescription)))
            }

            guard let deviceCheckToken = data?.base64EncodedString else {
                return callback(.failure(.errorTokenNotFound))
            }

            return callback(.success(deviceCheckToken))
        })
    }
}

// MARK: AES Helpers

extension IOSDeviceAttestator {
    private func generateAesKey(size: Int = kCCBlockSizeAES128) -> Data? {
        var keyData = Data(count: size)
        let result = keyData.withUnsafeMutableBytes {
            SecRandomCopyBytes(kSecRandomDefault, size, $0.baseAddress!)
        }

        guard result == errSecSuccess else {
            return nil
        }

        return keyData
    }

    private func encrypt(_ plainText: [UInt8], key: [UInt8], iv: [UInt8] = K.defaultIVData) -> Data? {
        var cyphertext = [UInt8](repeating: 0, count: plainText.count + kCCBlockSizeAES128)
        var cyphertextCount = 0

        let error = CCCrypt(
            CCOperation(kCCEncrypt),
            CCAlgorithm(kCCAlgorithmAES128),
            CCOptions(kCCOptionPKCS7Padding),
            key, key.count,
            iv,
            plainText, plainText.count,
            &cyphertext, cyphertext.count,
            &cyphertextCount
        )

        guard error == kCCSuccess else {
            return nil
        }

        return Data(bytes: cyphertext, count: cyphertextCount)
    }

    private func encryptEASKey(_ aesKeyBytes: [UInt8], publicKey keyData: Data) -> Data? {
        guard let publicKey = PublicKey(data: keyData)?.reference else {
            return nil
        }

        var cipherBufferSize = SecKeyGetBlockSize(publicKey)
        var cipherBuffer = [UInt8](repeating: 0, count: cipherBufferSize)

        let status = SecKeyEncrypt(publicKey, SecPadding.PKCS1, aesKeyBytes, aesKeyBytes.count, &cipherBuffer, &cipherBufferSize)

        if status != errSecSuccess {
            debugPrint(status.error.debugDescription)
            return nil
        }

        return Data(bytes: cipherBuffer, count: cipherBufferSize)
    }
}
