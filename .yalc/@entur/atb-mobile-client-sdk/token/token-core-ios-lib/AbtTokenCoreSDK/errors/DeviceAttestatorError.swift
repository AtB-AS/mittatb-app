public enum DeviceAttestatorError: Error {
    case errorSignatureKeyIdNotFound
    case errorTokenNotFound
    case errorSerializingDeviceAttestationData
    case errorAttestingKey(String)
    case errorGeneratingKey(String)
    case errorGeneratingAssertion(String)
    case errorGeneratingToken(String)
    case errorEncodingBase64AttestationData
    case errorSerializingIOSAppAttestAttestation
    case errorStoringAttestationKey
    case errorStoringAttestationToken
    case errorDeviceNotSupported
    case errorToGenerateAesKey
    case errorEncryptingAESKey
    case errorEncryptingEncryptedIOSDeviceCheckData
    case errorDecodingBase64AttestationData
    case errorSerializingAttestationData
    case errorGeneratingAesKey
    case errorMissingAttestationEncryptionPublicKey
    case errorSerializingEncryptedIOSDeviceCheckData
    case errorSerializingIOSDeviceCheckAttestation
    case errorGenerationAttestionData
    case errorEncodingPublicKey
    case errorNilSignatureKey
}
