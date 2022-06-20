import CryptoKit
import DeviceCheck
import Foundation

public class AbstractDeviceAttestor {
    private let deviceDetailsProvider = DefaultDeviceDetailsProvider()

    // This is the data that should be attested with the key IOSDeviceCheckAttestation
    func createIOSDeviceCheckResult(encryptedIosDeviceCheckData: Data, attestationEncryptionEncryptedKey: Data) -> No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult {
        No_Entur_Abt_Traveller_V1_IOSDeviceCheckResult.with { object in
            // Should be created calling `createEncryptedIOSDeviceCheckData`
            object.encryptedIosDeviceCheckData = encryptedIosDeviceCheckData
            object.attestationEncryptionEncryptedKey = attestationEncryptionEncryptedKey
        }
    }

    func createEncryptedIOSDeviceCheckData(deviceCheckToken token: String, deviceAttestationData: No_Entur_Abt_Traveller_V1_DeviceAttestationData) -> No_Entur_Abt_Traveller_V1_EncryptedIOSDeviceCheckData {
        No_Entur_Abt_Traveller_V1_EncryptedIOSDeviceCheckData.with { iosData in
            iosData.deviceCheckToken = token
            // Should be created with `createDeviceAttestationData`
            iosData.deviceAttestationData = deviceAttestationData
        }
    }

    func createDeviceAttestationData(signaturePublicKey: Data, encryptionPublicKey: Data, nonce: Data) -> No_Entur_Abt_Traveller_V1_DeviceAttestationData {
        No_Entur_Abt_Traveller_V1_DeviceAttestationData.with { attestationData in
            attestationData.nonce = nonce
            attestationData.signaturePublicKey = signaturePublicKey
            attestationData.encryptionPublicKey = encryptionPublicKey
            attestationData.deviceInfo = deviceDetailsProvider.deviceInfo
        }
    }

    @available(iOS 14.0, *)
    func createDeviceAttestationDataWithSignatureKeyId(_ signatureKeyId: String, encryptionPublicKey: Data, nonce: Data) -> No_Entur_Abt_Traveller_V1_DeviceAttestationData {
        No_Entur_Abt_Traveller_V1_DeviceAttestationData.with { attestationData in
            attestationData.nonce = nonce
            attestationData.signatureKeyID = signatureKeyId
            attestationData.encryptionPublicKey = encryptionPublicKey
            attestationData.deviceInfo = deviceDetailsProvider.deviceInfo
        }
    }

    @available(iOS 14.0, *)
    func createIOSAppAttestAssertion(iOSDeviceCheckResult: Data, assertionObject: String) ->
        No_Entur_Abt_Traveller_V1_IOSAppAttestAssertion {
        No_Entur_Abt_Traveller_V1_IOSAppAttestAssertion.with { attestation in
            // Should be created calling `createIOSDeviceCheckResult`
            attestation.deviceCheckResult = iOSDeviceCheckResult
            attestation.assertionObject = assertionObject
        }
    }

    @available(iOS 14.0, *)
    func createIOSAppAttestAttestation(iOSDeviceCheckResult: Data, attestationObject: String) ->
        No_Entur_Abt_Traveller_V1_IOSAppAttestAttestation {
        No_Entur_Abt_Traveller_V1_IOSAppAttestAttestation.with { attestation in
            // Should be created calling `createIOSDeviceCheckResult`
            attestation.deviceCheckResult = iOSDeviceCheckResult
            attestation.attestationObject = attestationObject
        }
    }
}
