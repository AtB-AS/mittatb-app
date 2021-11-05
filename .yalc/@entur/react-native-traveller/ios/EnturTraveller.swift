import AbtMobile
import DeviceCheck
@_implementationOnly import Kronos

@objc(EnturTraveller)
class EnturTraveller: NSObject {
    let secureTokenService: SecureTokenService = SecureTokenService(deviceDetails: DeviceDetails.getPrefilledDeviceDetails())

    @objc(generateAssertion:withKeyId:withNonce:withTokenId:withHash:withResolver:withRejecter:)
    func generateAssertion(accountId: String, keyId: String, nonce: String, tokenId: String, hash: Data, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14.0, *), DCAppAttestService.shared.isSupported {
            let attestor = Attestator(tokenId: tokenId, nonce: nonce, accountId: accountId)
            attestor.generateAssertion(keyId: keyId, hash: hash) { res in
                switch res {
                case .success(let data):
                    resolve(data)
                case .failure(let error):
                    reject("GENERATE_ASSERTION_ERROR", error.localizedDescription, error)
                }
            }
        } else {
            reject("GENERATE_ASSERTION_ERROR", "Assertion generation only works on real devices running iOS14+", nil)
        }
    }

    @objc(attest:withTokenId:withNonce:withResolver:withRejecter:)
    func attest(accountId: String, tokenId: String, nonce: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14.0, *), DCAppAttestService.shared.isSupported {
            let attestor = Attestator(tokenId: tokenId, nonce: nonce, accountId: accountId)

            attestor.attest(deviceDetails: DeviceDetails.getPrefilledDeviceDetails(), completionHandler: { res in
                switch res {
                    case .success(let attestationData):
                        let dict: NSDictionary = [
                            "attestationObject": attestationData.attestationObject,
                            "keyId": attestationData.keyId,
                            "deviceAttestationData": attestationData.deviceAttestationData,
                            "signaturePublicKey" : attestationData.signaturePublicKey,
                            "encryptionPublicKey": attestationData.encryptionPublicKey,
                        ]

                        resolve(dict)
                    case .failure(let err):
                        reject("ATTESTATION_ERROR", err.localizedDescription, err)
                }
            })
        } else {
            reject("ATTESTATION_ERROR", "This attestation is only supported by iOS14+, try attestLegacy for devices running iOS older than iOS14", nil)
        }
    }

    @objc(attestLegacy:withTokenId:withNonce:withServerPublicKey:withResolver:withRejecter:)
    func attestLegacy(accountId: String, tokenId: String, nonce: String, serverPublicKey: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 11.0, *), DCDevice.current.isSupported {
            let attestor = LegacyAttestator(accountId: accountId, tokenId: tokenId, nonce: nonce)

            attestor.attest(serverPublicKey: serverPublicKey, deviceDetails: DeviceDetails.getPrefilledDeviceDetails(), completionHandler: { res in
                switch res {
                    case .success(let attestation):
                        let dict: NSDictionary = [
                            "attestation": attestation.attestation,
                            "signaturePublicKey" : attestation.signaturePublicKey,
                            "encryptionPublicKey": attestation.encryptionPublicKey,
                            "attestationEncryptionKey": attestation.attestationEncryptionKey
                        ]

                        resolve(dict)
                    case .failure(let err):
                        reject("ATTESTATION_ERROR", err.localizedDescription, err)
                }
            })
        } else {
            reject("ATTESTATION_ERROR", "Attestation is only supported by iOS 11+", nil)
        }
    }

    @objc(getAttestationSupport:withRejecter:)
    func getAttestationSupport(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 11, *) {
            let currentDevice = DCDevice.current
            if (currentDevice.isSupported) {
                if #available(iOS 14, *) {
                    let shared = DCAppAttestService.shared
                    if shared.isSupported {
                        resolve([
                            "result": "SUCCESS",
                            "attestation_type": "DCAppAttestService",
                            "iOS_support": "14+"
                        ])
                    }
                }  else {
                    resolve([
                        "result": "SUCCESS",
                        "attestation_type": "DCDevice",
                        "iOS_support": "11+"
                    ])
                }
            }
            reject("ATTESTATION_ERROR", "Device cannot be attested", nil)
        }
    }
    
    @objc(addToken:withTokenId:withCertificate:withTokenValidityStart:withTokenValidityEnd:withResolver:withRejecter:)
    func addToken(accountId: String, tokenId: String, certificate: String, tokenValidityStart: NSNumber, tokenValidityEnd: NSNumber, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()

        let newToken = Token(accountId: accountId, tokenId: tokenId, validityStart: tokenValidityStart.doubleValue, validityEnd: tokenValidityEnd.doubleValue)

        let success = tokenStore.saveActiveToken(accountId, token: newToken)

        if success {
            newToken.storeCertificate(certificateBase64Encoded: certificate) { res in
                switch res {
                    case .success(_):
                        resolve(success)
                    case .failure(let err):
                        reject("ERROR", err.localizedDescription, err as NSError)
                }
            }
        } else {
            reject("ADD_TOKEN_ERROR", "Failed to save new token", nil)
        }
    }

    @objc(getToken:withResolver:withRejecter:)
    func getToken(accountId: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()

        if let token = tokenStore.loadActiveToken(accountId) {
            let dict: NSDictionary = [
                "tokenId": token.tokenId,
                "tokenValidityStart" : token.validityStart,
                "tokenValidityEnd": token.validityEnd,
            ]

            resolve(dict)
        } else {
            resolve(nil)
        }
    }

    @objc(deleteToken:withResolver:withRejecter:)
    func deleteToken(accountId: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()

        tokenStore.deleteActiveToken(accountId)

        resolve(nil)
    }

    @objc(getSecureToken:withActions:withResolver:withRejecter:)
    func getSecureToken(accountId: String, actions: NSArray, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {

        var payloadActions: [PayloadAction] = []

        do {
            payloadActions = try actions.toPayLoadActions()
        } catch (let error) {
            reject("SECURE_TOKEN_ERROR", error.localizedDescription, error)
            return
        }

        let secureToken = secureTokenService.getSecureToken(accountId, actions: payloadActions)

        switch (secureToken) {
        case .success(let token):
            resolve(token)

        case .failure(let error):
            switch (error) {
            case .couldNotSerializeToken:
                reject("SECURE_TOKEN_ERROR", "Failed to serialize token", error)
            case .noActiveToken:
                reject("SECURE_TOKEN_ERROR", "No active token", error)
            case .noUpdatedTimestamp:
                reject("SECURE_TOKEN_ERROR", "No updated timestamp", error)
            case .tokenEncodingError(let tokenError):
                reject("SECURE_TOKEN_ERROR", "Failed to encode token", tokenError)
            default:
                reject("SECURE_TOKEN_ERROR", "Unknown error", error)
            }
        }
    }
}

extension DeviceDetails {
    static func getPrefilledDeviceDetails() -> DeviceDetails {
        let applicationVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String? ?? "1.0.0"
        let applicationId = Bundle.main.bundleIdentifier ?? "unknown"
        let details = DeviceDetails(applicationVersion: applicationVersion, applicationId: applicationId)
        return details
    }
}

private extension NSArray {
    func toPayLoadActions() throws -> [PayloadAction] {
        var actions: [PayloadAction] = []
        for action in self {
            if let rawValue = action as? Int {
                if let payloadAction = PayloadAction(rawValue: rawValue) {
                    actions.append(payloadAction)
                } else {
                    throw "COULD NOT MAP \(rawValue) TO ANY ACTION"
                }
            } else {
                throw "COULD NOT CAST VALUE TO INT"
            }
        }
        return actions
    }
}

extension String: LocalizedError {
    public var errorDescription: String? { return self }
}
