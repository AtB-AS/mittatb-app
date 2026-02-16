import Foundation

@objc(ExperimentalFeatureImpl)
final class ExperimentalFeatureImpl: NSObject {
  private var releaseStage: String?
  private var experimentalReleaseStages: Array<String> = ["dev", "staging"]
  
  override init() {
    if let configuredReleaseStage = Bundle.main.object(forInfoDictionaryKey: "ReleaseStage") as? String {
      releaseStage = configuredReleaseStage
    }
  }
  /// Enable the experimental feature only when we can positively identify this as
  /// NOT being an App Store install.
  ///
  /// Heuristics
  /// - Simulator => not App Store
  /// - embedded.mobileprovision present => not App Store (dev/ad-hoc/enterprise/testflight)
  /// - sandboxReceipt => not App Store (typically TestFlight)
  @objc func isNonProductionReleaseChannel() -> Bool {
    return isSimulator() || isExperimentalReleaseStage() || hasEmbeddedMobileProvision() || hasSandboxReceipt()
  }
  
  private func hasEmbeddedMobileProvision() -> Bool {
    // App Store installs do not include an embedded provisioning profile.
    // Non–App Store channels (dev/ad-hoc/enterprise/testflight) typically do.
    return Bundle.main.path(forResource: "embedded", ofType: "mobileprovision") != nil
  }

  // sandboxReceipt is another good heuristic for non-AppStore channels
  private func hasSandboxReceipt() -> Bool {
    if isSimulator() {
      return false
    }
    guard let appStoreReceiptURL = Bundle.main.appStoreReceiptURL else {
      return false
    }
    return appStoreReceiptURL.lastPathComponent == "sandboxReceipt"
  }
  
  private func isExperimentalReleaseStage() -> Bool {
    guard let stage = releaseStage else {
      return false
    }
    
    return experimentalReleaseStages.contains(stage)
  }

  private func isSimulator() -> Bool {
#if targetEnvironment(simulator)
    return true
#else
    return false
#endif
  }
}
