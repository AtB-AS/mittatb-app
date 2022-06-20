export class TokenError extends Error {}
export class UnableToDecryptError extends TokenError {}
export class TokenStateError extends TokenError {}
export class TokenUnavailableError extends TokenStateError {}
export class TokenTemporarilyUnavailableError extends TokenUnavailableError {}
export class TokenLocalTimeoutError extends TokenTemporarilyUnavailableError {}
export class UnableToCreateTokenError extends TokenTemporarilyUnavailableError {}
export class UnableToIncludeCertificateError extends TokenTemporarilyUnavailableError {}
export class UnableToPerformCryptoOperationTokenError extends TokenTemporarilyUnavailableError {}
export class TokenPermanentlyUnavailableError extends TokenUnavailableError {}
export class NoTokenError extends TokenPermanentlyUnavailableError {}
export class TokenExpiredError extends TokenPermanentlyUnavailableError {}
export class TokenCommandError extends TokenStateError {}
export class UnableToRenewTokenError extends TokenTemporarilyUnavailableError {}
export class TokenRenewerNotReadyError extends UnableToRenewTokenError {}
export class UnableToSaveTokenError extends TokenStateError {}

export class TokenPropertyStoreError extends UnableToSaveTokenError {}

export class TokenKeystoreError extends Error {}

export class DeviceAttestationError extends Error {}
export class DeviceAttestationRemoteError extends Error {}

export class CertificateError extends Error {}
export class KeyStoreError extends Error {}
