import Foundation

public extension OSStatus {
    var error: NSError? {
        guard self != errSecSuccess else { return nil }

        let message: String
        if #available(iOS 11.3, *) {
            message = SecCopyErrorMessageString(self, nil) as String? ?? "Unknown error"
        } else {
            message = "Unknown error"
        }

        return NSError(domain: NSOSStatusErrorDomain, code: Int(self), userInfo: [
            NSLocalizedDescriptionKey: message,
        ])
    }
}
