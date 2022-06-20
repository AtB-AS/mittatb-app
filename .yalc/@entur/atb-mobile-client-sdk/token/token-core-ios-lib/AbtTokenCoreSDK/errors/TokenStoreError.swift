public enum TokenStoreError: Error {
    case errorInvalidArgumentException
    case errorEncodingPublicKey
    case errorCreatingSignatureKey
    case errorCreatingSignatureKeyId
    case errorCreatingEncryptionKey
    case errorSerializingAttestationCommand
    case errorAttesting(String)
    case errorSavingToken(String)
}
