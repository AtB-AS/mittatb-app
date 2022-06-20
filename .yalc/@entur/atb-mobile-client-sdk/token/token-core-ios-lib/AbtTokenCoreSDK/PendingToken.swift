import Foundation

public class PendingToken: Token {
    private enum Key: String {
        case commandUuid, commandAttestation, commandAttestationType, commandTrace, signaturePublicKey, encryptionPublicKey, deviceCheckResult, attestationObject
    }

    private(set) var attestationObject: AttestionObject
    private(set) var commandTrace: String

    public init(tokenId: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, attestationEncryptionPublicKey: Data, tokenEncoder: TokenEncoder, strainNumber: Int32, attestationObject: AttestionObject, commandTrace: String, tokenContext: TokenContext) {
        self.attestationObject = attestationObject
        self.commandTrace = commandTrace

        super.init(tokenId: tokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, tokenEncoder: tokenEncoder, strainNumber: strainNumber, tokenContext: tokenContext)
    }

    override public func toMap() -> NSMutableDictionary {
        let data = super.toMap()

        data.setValue(commandTrace.base64Encoded, forKey: Key.commandTrace.rawValue)

        guard let attestionObjectData = attestationObject.toMap() as? [AnyHashable: Any] else {
            return data
        }

        data.addEntries(from: attestionObjectData)

        return data
    }
}
