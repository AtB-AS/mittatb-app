import Foundation

public class ActivatedToken: Token {
    private enum Key: String {
        case validityStart, validityEnd, renewToken
    }

    public var renewToken: Token?

    private(set) var validityStart: Date
    private(set) var validityEnd: Date
    private(set) var signatureCertificate: SecCertificate?
    private(set) var encryptionCertificate: SecCertificate?

    private var invalidate = false

    public init(tokenId: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, validityStart: Date, validityEnd: Date, signatureCertificate: SecCertificate?, encryptionCertificate: SecCertificate?, tokenEncoder: TokenEncoder, strainNumber: Int32, tokenContext: TokenContext) {
        self.validityStart = validityStart
        self.validityEnd = validityEnd
        self.signatureCertificate = signatureCertificate
        self.encryptionCertificate = encryptionCertificate

        super.init(tokenId: tokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, tokenEncoder: tokenEncoder, strainNumber: strainNumber, tokenContext: tokenContext)
    }

    public func fordward() -> ActivatedToken? {
        var activatedToken = self
        // Fast forward if the token has been renewed since last time
        while activatedToken.renewToken != nil {
            if let token = activatedToken.renewToken as? ActivatedToken {
                activatedToken = token
            }
        }

        return activatedToken
    }

    public func markMustBeRenewed() {
        invalidate = true
    }

    override public func toMap() -> NSMutableDictionary {
        let data = super.toMap()
        data.setValue(validityStart.timeIntervalSince1970, forKey: Key.validityStart.rawValue)
        data.setValue(validityEnd.timeIntervalSince1970, forKey: Key.validityEnd.rawValue)
        if let renewToken = renewToken {
            data.setValue(renewToken.toMap(), forKey: Key.renewToken.rawValue)
        }

        return data
    }
}
