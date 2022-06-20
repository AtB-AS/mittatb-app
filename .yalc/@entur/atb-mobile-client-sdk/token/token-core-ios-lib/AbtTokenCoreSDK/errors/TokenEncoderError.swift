public enum TokenEncoderError: Error {
    case unableToGetClockTime
    case signatureException
    case errorNilSignatureKey
}
