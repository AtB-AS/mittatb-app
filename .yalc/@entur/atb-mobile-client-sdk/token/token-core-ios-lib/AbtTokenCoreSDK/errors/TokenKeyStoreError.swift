public enum TokenKeyStoreError: Error {
    case errorCreatingECKeyPair
    case errorWhileUsingANilKeyChainAccessControl
    case errorSignatureKeyIdNotFound
    case errorStoringKeyIdInKeyChain
}
