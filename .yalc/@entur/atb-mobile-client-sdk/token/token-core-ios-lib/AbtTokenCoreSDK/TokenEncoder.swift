import CryptoKit
import DeviceCheck
import Foundation
import Kronos
import SwiftProtobuf

public class TokenEncoder {
    private enum K {
        static let tokenSignatureAlgorithm = "SHA256withECDSA"
        static let issuerName = "N"
    }

    private let deviceDetailsProvider: DeviceDetailsProvider

    public init() {
        deviceDetailsProvider = DefaultDeviceDetailsProvider()
        Clock.sync()
    }

    func encodeAsSecureContainer(tokenEncodingRequest request: TokenEncodingRequest, token: Token, onComplete callback: @escaping (Result<No_Entur_Abt_Core_V1_SecureContainer, Error>) -> Void) {
        let challengeNonces = request.challenges
        let tokenActions = request.tokenActions
        let includeCertificate = request.includeCertificate

        let deviceDetails = deviceDetailsProvider.deviceDetails
        guard let timestamp = Clock.now else {
            return callback(.failure(TokenEncoderError.unableToGetClockTime))
        }

        let googleTimestamp = Google_Protobuf_Timestamp(timeIntervalSince1970: timestamp.timeIntervalSince1970)

        let tokenPayload = No_Entur_Abt_Core_V1_MobileIDTokenPayload.with { payload in
            payload.tokenID = token.tokenId
            payload.deviceTimestamp = googleTimestamp
            payload.actions = tokenActions.map(\.action)
            payload.receivedNonces = challengeNonces
            payload.deviceDetails = deviceDetails
        }

        let signedPayloads = No_Entur_Abt_Core_V1_SignedPayloads.with { container in
            container.signedPayloads = [
                No_Entur_Abt_Core_V1_SignedPayload.with { signedPayload in
                    signedPayload.mobileIDTokenPayload = tokenPayload
                },
            ]
        }

        guard let payload = try? signedPayloads.serializedData() else {
            return callback(.failure(TokenEncoderError.signatureException))
        }

        if #available(iOS 14.0, *) {
            guard let signatureKeyId = token.signatureKeyId else {
                return callback(.failure(TokenEncoderError.signatureException))
            }

            let hash = payload.sha256()

            DCAppAttestService.shared.generateAssertion(signatureKeyId, clientDataHash: hash) { data, _ in
                guard let data = data else {
                    return callback(.failure(TokenEncoderError.signatureException))
                }

                let signatureType = No_Entur_Abt_Core_V1_SignatureType.iosAppAttestAssertion
                let secureContainer = self.generateSecureContainer(token: token, includeCertificate: includeCertificate, timestamp: googleTimestamp, signatureType: signatureType, signedData: data, payload: payload)

                return callback(.success(secureContainer))
            }
        } else {
            guard let signaturePrivateKey = token.signatureKeyPair?.privateKey else {
                return callback(.failure(TokenEncoderError.errorNilSignatureKey))
            }

            switch sign(payload, with: signaturePrivateKey) {
            case let .success(data):
                let signatureType = No_Entur_Abt_Core_V1_SignatureType.sha256WithEcdsa
                let secureContainer = generateSecureContainer(token: token, includeCertificate: includeCertificate, timestamp: googleTimestamp, signatureType: signatureType, signedData: data, payload: payload)
                return callback(.success(secureContainer))
            case let .failure(error):
                return callback(.failure(error))
            }
        }
    }

    private func sign(_ payload: Data, with privateKey: PrivateKey) -> Result<Data, Error> {
        if #available(iOS 15.0, *) {
            var error: Unmanaged<CFError>?
            guard let signedData = SecKeyCreateSignature(privateKey.reference, .ecdsaSignatureDigestX962SHA256, payload.sha256() as CFData, &error) as? Data else {
                debugPrint(TokenEncoderError.signatureException, String(describing: error))
                return .failure(TokenEncoderError.signatureException)
            }

            return .success(signedData)
        } else {
            var rawSignatureLength = 128
            let sha256DigestedBytes = payload.sha256().bytes
            let rawSignatureBytes = UnsafeMutablePointer<UInt8>.allocate(capacity: 128)

            let osStatus = SecKeyRawSign(privateKey.reference, .PKCS1, sha256DigestedBytes, sha256DigestedBytes.count, rawSignatureBytes, &rawSignatureLength)

            guard osStatus == errSecSuccess else {
                return .failure(TokenEncoderError.signatureException)
            }

            let signedData = Data(bytes: rawSignatureBytes, count: rawSignatureLength)
            return .success(signedData)
        }
    }

    private func generateSecureContainer(token: Token, includeCertificate: Bool, timestamp: Google_Protobuf_Timestamp, signatureType: No_Entur_Abt_Core_V1_SignatureType, signedData data: Data, payload: Data) -> No_Entur_Abt_Core_V1_SecureContainer {
        let signature = No_Entur_Abt_Core_V1_Signature.with { signature in
            signature.issuer = K.issuerName
            if let activatedToken = token as? ActivatedToken, includeCertificate, let certificate = activatedToken.signatureCertificate {
                let certificateData = SecCertificateCopyData(certificate) as Data
                signature.certificate = certificateData
            }
            signature.type = signatureType
            signature.signature = data
            signature.timestamp = timestamp
            signature.algorithm = K.tokenSignatureAlgorithm
        }

        let secureContainer = No_Entur_Abt_Core_V1_SecureContainer.with { tokenInfo in
            tokenInfo.signature = signature
            tokenInfo.signedPayloads = payload
        }

        return secureContainer
    }
}
