public protocol TokenRenewer {
    func renew(token: ActivatedToken, traceId: String) -> ActivatedToken?
    func clear(token: ActivatedToken)
}
