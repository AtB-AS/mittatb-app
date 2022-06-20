import Foundation

public enum AttestionObjectType: String {
    case checkResult = "IOSDeviceCheckResult"
    case attestation = "IOSAppAttestAttestation"
    case assertion = "IOSAppAttestAssertion"
}

public struct AttestionObject {
    private enum Key: String {
        // For Attestion (Activation)
        case commandUuid, commandAttestation, commandAttestationType, deviceCheckResult, attestationObject = "object"

        // For Re-attestation (Assertion)
        case type, data
    }

    public let uuid: String
    public let objectType: AttestionObjectType
    public let attestionData: Data

    init(type: AttestionObjectType, data: Data) {
        uuid = UUID().uuidString
        objectType = type
        attestionData = data
    }

    init(uuid: String, type: AttestionObjectType, data: Data) {
        self.uuid = uuid
        objectType = type
        attestionData = data
    }

    public func toMap() -> NSMutableDictionary {
        var data = NSMutableDictionary()

        // NOTE: IOSAppAttestAttestation needs also appleJwtToken that is only added from the server!,
        // so there is no need to send the entire serialized `IOSAppAttestAttestation`, there is an extra process there to deserialize add the missing values and serializer again!
        // TODO: `deviceCheckResult` and `attestationObject` can be attached to the token instead, which will avoids deserializing the `IOSAppAttestAttestation`
        switch objectType {
        case .attestation:
            data.setValue(uuid, forKey: Key.commandUuid.rawValue)
            data.setValue(objectType.rawValue, forKey: Key.commandAttestationType.rawValue)

            guard let iOSAppAttestAttestation = try? No_Entur_Abt_Traveller_V1_IOSAppAttestAttestation(serializedData: attestionData) else {
                break
            }

            addCommandAttestionForAttestation(to: &data, deviceCheckResult: iOSAppAttestAttestation.deviceCheckResult, attestationObject: iOSAppAttestAttestation.attestationObject)
        case .assertion:
            data.setValue(objectType.rawValue, forKey: Key.type.rawValue)

            guard let iOSAppAttestAssertion = try? No_Entur_Abt_Traveller_V1_IOSAppAttestAssertion(serializedData: attestionData) else {
                break
            }

            addCommandAttestionForReAttestation(to: &data, deviceCheckResult: iOSAppAttestAssertion.deviceCheckResult, attestationObject: iOSAppAttestAssertion.assertionObject)
        default:
            data.setValue(attestionData.base64EncodedString, forKey: Key.commandAttestation.rawValue)
        }

        return data
    }

    private func addCommandAttestionForAttestation(to data: inout NSMutableDictionary, deviceCheckResult: Data, attestationObject: String) {
        let appAttestation = NSMutableDictionary()
        appAttestation.setValue(deviceCheckResult.base64EncodedString, forKey: Key.deviceCheckResult.rawValue)
        appAttestation.setValue(attestationObject, forKey: Key.attestationObject.rawValue)

        if let jsonData = try? JSONSerialization.data(withJSONObject: appAttestation) {
            data.setValue(jsonData.base64EncodedString, forKey: Key.commandAttestation.rawValue)
        }
    }

    private func addCommandAttestionForReAttestation(to data: inout NSMutableDictionary, deviceCheckResult: Data, attestationObject: String) {
        let appAttestation = NSMutableDictionary()
        appAttestation.setValue(deviceCheckResult.base64EncodedString, forKey: Key.deviceCheckResult.rawValue)
        appAttestation.setValue(attestationObject, forKey: Key.attestationObject.rawValue)

        if let jsonData = try? JSONSerialization.data(withJSONObject: appAttestation) {
            data.setValue(jsonData.base64EncodedString, forKey: Key.data.rawValue)
        }
    }
}
