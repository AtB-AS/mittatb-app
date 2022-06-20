import Foundation

public struct TokenEncodingRequest {
    let challenges: [Data]
    let tokenActions: [TokenPayloadAction]
    let includeCertificate: Bool

    public init(challenges: [Data], tokenActions: [TokenPayloadAction], includeCertificate: Bool) {
        self.challenges = challenges
        self.tokenActions = tokenActions
        self.includeCertificate = includeCertificate
    }
}
