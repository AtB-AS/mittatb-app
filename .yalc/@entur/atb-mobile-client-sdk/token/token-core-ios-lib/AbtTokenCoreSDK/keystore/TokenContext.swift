import Foundation

public protocol TokenContext: AnyObject {
    var id: String { get }
    var token: Token? { get set }
    var tokenRenewer: TokenRenewer? { get set }
    var strainNumber: Int32 { get }

    func incrementStrainNumber() -> Int32

    func isLatestStrain(strainNumber: Int32) -> Bool
}
