import Foundation

public protocol KeyRepresentable {}

public protocol Key: KeyRepresentable {
    var reference: SecKey { get }
    var encoded: Data? { get }
}

public extension Key {
    var encoded: Data? {
        var error: Unmanaged<CFError>?
        guard let data = SecKeyCopyExternalRepresentation(reference, &error) as? Data else {
            return nil
        }

        return data
    }
}
