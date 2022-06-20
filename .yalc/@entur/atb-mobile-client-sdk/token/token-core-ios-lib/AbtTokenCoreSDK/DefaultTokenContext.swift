import Foundation

public class DefaultTokenContext: TokenContext {
    private var contextId: String
    private var contextStrainNumber: Int32 = 0

    public var token: Token?
    public var tokenRenewer: TokenRenewer?

    public var id: String {
        contextId
    }

    public var strainNumber: Int32 {
        contextStrainNumber
    }

    public init(id: String, tokenRenewer: TokenRenewer? = nil) {
        contextId = id
        self.tokenRenewer = tokenRenewer
    }

    public func incrementStrainNumber() -> Int32 {
        OSAtomicIncrement32(&contextStrainNumber)
    }

    public func isLatestStrain(strainNumber number: Int32) -> Bool {
        number == strainNumber
    }
}
