import AbtMobile

@objc(EnturTraveller)
class EnturTraveller: NSObject {
    let qrCodeService: QRCodeService = QRCodeService(deviceDetails: DeviceDetails.getPrefilledDeviceDetails())
    
    @objc(attest:withNonce:withResolver:withRejecter:)
    func attest(tokenId: String, nonce: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14.0, *) {
            let attestor = Attestator(tokenId: tokenId, nonce: nonce)
            
            attestor.attest(deviceDetails: DeviceDetails.getPrefilledDeviceDetails(), completionHandler: { res in
                switch res {
                    case .success(let attestationData):
                        let dict: NSDictionary = [
                            "attestation": attestationData.attestation,
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
    
    @objc(attestLegacy:withNonce:withServerPublicKey:withResolver:withRejecter:)
    func attestLegacy(tokenId: String, nonce: String, serverPublicKey: String, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 11.0, *) {
            let attestor = LegacyAttestator(tokenId: tokenId, nonce: nonce)
            
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
    
    @objc(addToken:withCertificate:withTokenValidityStart:withTokenValidityEnd:withResolver:withRejecter:)
    func addToken(tokenId: String, certificate: String, tokenValidityStart: NSNumber, tokenValidityEnd: NSNumber, resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()
        
        let newToken = Token(tokenId: tokenId, validityStart: tokenValidityStart.doubleValue, validityEnd: tokenValidityEnd.doubleValue)
        
        let success = tokenStore.saveActiveToken(token: newToken)
        
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
    
    @objc(getToken:withRejecter:)
    func getToken(resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()
        
        if let token = tokenStore.loadActiveToken() {
            let dict: NSDictionary = [
                "tokenId": token.tokenId,
                "tokenValidityStart" : token.validityStart,
                "tokenValidityEnd": token.validityEnd,
            ]
            
            resolve(dict)
        } else {
            reject("GET_TOKEN_ERROR", "No token found", nil)
        }
    }
    
    @objc(deleteToken:withRejecter:)
    func deleteToken(resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let tokenStore = TokenStore()
        
        tokenStore.deleteActiveToken()
        
        resolve(nil)
    }
    
    @objc(generateQrCode:withRejecter:)
    func generateQrCode(resolve:@escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        let qrCodeResult = qrCodeService.getQrCode()
        
        switch (qrCodeResult) {
        case .success(let qrCode):
            resolve(qrCode)
            
        case .failure(let error):
            switch (error) {
            case .couldNotSerializeToken:
                reject("QR_ERROR", "Failed to serialize token", error)
            case .noActiveToken:
                reject("QR_ERROR", "No active token", error)
            case .noUpdatedTimestamp:
                reject("QR_ERROR", "No updated timestamp", error)
            case .tokenEncodingError(let tokenError):
                reject("QR_ERROR", "Failed to encode token", tokenError)
            default:
                reject("QR_ERROR", "Unknown error", error)
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
