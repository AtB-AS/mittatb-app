import entur_react_native_traveller

@objc(RegisterLogger)
class RegisterLogger: NSObject {
  @objc
  func register(cb: @escaping (Error) -> Void) {
    EnturTraveller.logger = EnturTravellerLogger(cb: cb);
  }
}
