import Foundation

struct MockedDefaultTokenRenewer: TokenRenewer {
    func renew(token _: ActivatedToken, traceId _: String) -> ActivatedToken? {
        nil
    }

    func clear(token _: ActivatedToken) {}
}
