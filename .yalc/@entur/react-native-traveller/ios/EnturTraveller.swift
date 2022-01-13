import AbtMobile
import DeviceCheck
import UIKit
@_implementationOnly import Kronos

public class EnturTravellerLogger {
    private let callback: (Error) -> Void
    
    public init(cb: @escaping (Error) -> Void) {
        self.callback = cb
    }
    
    func notify(err: Error) {
        callback(err)
    }
}

@objc(EnturTraveller)
public class EnturTraveller: NSObject {
    var secureTokenService: SecureTokenService? = nil;
    var started: Bool = false;
    public static var logger: EnturTravellerLogger?;
    
    @objc(start:withResolver:withRejecter:)
    func start(_: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if (!started) {
            secureTokenService = SecureTokenService(deviceDetails: DeviceDetails.getPrefilledDeviceDetails())
            started = true;
        }
        resolve(nil)
    }
    
    @objc(getDeviceName:withRejecter:)
    func getDeviceName(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let name = UIDevice.current.name
            guard name != nil || name != "" else {
                throw "Could not retrieve device name because it's nil or empty"
            }
            resolve(name)
        } catch let err {
            reject("Could not get devicename", err.localizedDescription, nil)
        }
    }

    @objc(generateAssertion:withKeyId:withNonce:withTokenId:withHash:withResolver:withRejecter:)
    func generateAssertion(accountId: String, keyId: String, nonce: String, tokenId: String, hash: Data, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14.0, *), DCAppAttestService.shared.isSupported {
            if (!started) {
                reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
                return
            }
            
            guard !accountId.isEmpty else {
                reject("GENERATE_ASSERTION_ERROR", "accoundId is empty", nil)
                return
            }
            
            guard !keyId.isEmpty else {
                reject("GENERATE_ASSERTION_ERROR", "keyId is empty", nil)
                return
            }
            
            guard !nonce.isEmpty else {
                reject("GENERATE_ASSERTION_ERROR", "nonce is empty", nil)
                return
            }
            
            guard !tokenId.isEmpty else {
                reject("GENERATE_ASSERTION_ERROR", "tokenId is empty", nil)
                return
            }
            
            guard !hash.isEmpty else {
                reject("GENERATE_ASSERTION_ERROR", "hash is empty", nil)
                return
            }
            
            let attestor = Attestator(tokenId: tokenId, nonce: nonce, accountId: accountId)
            attestor.generateAssertion(keyId: keyId, hash: hash) { res in
                switch res {
                case .success(let data):
                    resolve(data)
                case .failure(let error):
                    EnturTraveller.logger?.notify(err: error)
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
            if (!started) {
                reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
                return
            }
            
            guard !accountId.isEmpty else {
                reject("ATTEST", "accoundId is empty", nil)
                return
            }
            
            guard !nonce.isEmpty else {
                reject("ATTEST", "nonce is empty", nil)
                return
            }
            
            guard !tokenId.isEmpty else {
                reject("ATTEST", "tokenId is empty", nil)
                return
            }
            
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
                        EnturTraveller.logger?.notify(err: err)
                        reject("ATTESTATION_ERROR", err.localizedDescription, err)
                }
            })
        } else {
            reject("ATTESTATION_ERROR", "This attestation is only supported by iOS14+, try attestLegacy for devices running iOS older than iOS14", nil)
        }
    }

    @objc(attestLegacy:withTokenId:withNonce:withServerPublicKey:withResolver:withRejecter:)
    func attestLegacy(accountId: String, tokenId: String, nonce: String, serverPublicKey: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        guard !accountId.isEmpty else {
            reject("ATTEST_LEGACY", "accoundId is empty", nil)
            return
        }
        
        guard !nonce.isEmpty else {
            reject("ATTEST_LEGACY", "nonce is empty", nil)
            return
        }
        
        guard !tokenId.isEmpty else {
            reject("ATTEST_LEGACY", "tokenId is empty", nil)
            return
        }
        
        guard !serverPublicKey.isEmpty else {
            reject("ATTEST_LEGACY", "tokenId is empty", nil)
            return
        }
        
        if #available(iOS 11.0, *), DCDevice.current.isSupported {
            if (!started) {
                reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
                return
            }
            
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
                        EnturTraveller.logger?.notify(err: err)
                        reject("ATTESTATION_ERROR", err.localizedDescription, err)
                }
            })
        } else {
            reject("ATTESTATION_ERROR", "Attestation is only supported by iOS 11+", nil)
        }
    }

    @objc(getAttestationSupport:withRejecter:)
    func getAttestationSupport(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
#if targetEnvironment(simulator)
        resolve([
            "result": "NOT_SUPPORTED",
        ])
        
        return
#else
        if #available(iOS 11, *) {
            let currentDevice = DCDevice.current
            if (currentDevice.isSupported) {
                if #available(iOS 14, *) {
                    let shared = DCAppAttestService.shared
                    if shared.isSupported {
                        resolve([
                            "result": "SUPPORTED",
                            "attestationType": "iOS_Device_Attestation",
                        ])
                        
                        return
                    }
                }  else {
                    resolve([
                        "result": "SUPPORTED",
                        "attestationType": "iOS_Device_Check",
                    ])
                    
                    return
                }
            }
        }
        
        resolve([
            "result": "NOT_SUPPORTED",
        ])
#endif
    }
    
    @objc(addToken:withTokenId:withCertificate:withTokenValidityStart:withTokenValidityEnd:withResolver:withRejecter:)
    func addToken(accountId: String, tokenId: String, certificate: String, tokenValidityStart: NSNumber, tokenValidityEnd: NSNumber, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if (!started) {
            reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
            return
        }
        
        guard !accountId.isEmpty else {
            reject("ADD_TOKEN", "accoundId is empty", nil)
            return
        }
        
        guard !certificate.isEmpty else {
            reject("ADD_TOKEN", "nonce is empty", nil)
            return
        }
        
        guard !tokenId.isEmpty else {
            reject("ADD_TOKEN", "tokenId is empty", nil)
            return
        }
        
        guard Int(truncating: tokenValidityStart) > 0 else {
            reject("ADD_TOKEN", "nonce is empty", nil)
            return
        }
        
        guard Int(truncating: tokenValidityEnd) > 0 else {
            reject("ADD_TOKEN", "tokenId is empty", nil)
            return
        }
        
        let tokenStore = TokenStore()

        let newToken = Token(accountId: accountId, tokenId: tokenId, validityStart: tokenValidityStart.doubleValue, validityEnd: tokenValidityEnd.doubleValue)

        let success = tokenStore.saveActiveToken(accountId, token: newToken)

        if success {
            newToken.storeCertificate(certificateBase64Encoded: certificate) { res in
                switch res {
                    case .success(_):
                        let _ = tokenStore.deleteTokens(forAccountId: accountId)
                        resolve(success)
                    case .failure(let err):
                        EnturTraveller.logger?.notify(err: err)
                        reject("ERROR", err.localizedDescription, err as NSError)
                }
            }
        } else {
            reject("ADD_TOKEN_ERROR", "Failed to save new token", nil)
        }
    }

    @objc(getToken:withResolver:withRejecter:)
    func getToken(accountId: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if (!started) {
            reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
            return
        }
        
        guard !accountId.isEmpty else {
            reject("GET_TOKEN", "accoundId is empty", nil)
            return
        }
        
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
        if (!started) {
            reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
            return
        }
        
        guard !accountId.isEmpty else {
            reject("DELETE_TOKEN", "accoundId is empty", nil)
            return
        }
        
        let tokenStore = TokenStore()

        let _ = tokenStore.deleteTokens(forAccountId: accountId, evenActive: true)

        resolve(nil)
    }

    @objc(getSecureToken:withTokenId:withIncludeCertificate:withActions:withResolver:withRejecter:)
    func getSecureToken(accountId: String, tokenId: String, includeCertificate: Bool, actions: NSArray, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if (!started) {
            reject("NOT_STARTED", "The start-function must be called before any other native method", nil)
            return
        }
        
        guard !accountId.isEmpty else {
            reject("GET_SECURE_TOKEN", "accoundId is empty", nil)
            return
        }
        
        guard actions.count > 0 else {
            reject("GET_SECURE_TOKEN", "accoundId is empty", nil)
            return
        }
        
        guard let secureTokenService = secureTokenService else {
            reject("SECURE_TOKEN_ERROR", "SecureTokenService is not initatied, and cannot be nil", nil)
            return
        }
        
        var payloadActions: [PayloadAction] = []

        do {
            payloadActions = try actions.toPayLoadActions()
        } catch (let error) {
            reject("SECURE_TOKEN_ERROR", error.localizedDescription, error)
            return
        }
        let secureToken = secureTokenService.getSecureToken(accountId, tokenId: tokenId, actions: payloadActions, includeCertificate: includeCertificate)
        switch (secureToken) {
        case .success(let token):
            resolve(token)
        case .failure(let error):
            EnturTraveller.logger?.notify(err: error)

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
