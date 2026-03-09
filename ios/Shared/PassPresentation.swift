import Foundation
import PassKit
import Bugsnag

@objc public final class PassPresentation: NSObject {
  private static var suppressionRequestToken: PKSuppressionRequestToken?
  private static let errorDomain = "PassPresentationError"
  
  @objc static func suppressPassPresentation() {
    guard #available(iOS 9, *) else { return }
    guard PKPassLibrary.isPassLibraryAvailable() else { return }
    guard !PKPassLibrary.isSuppressingAutomaticPassPresentation() else { return }

    suppressionRequestToken = PKPassLibrary.requestAutomaticPassPresentationSuppression { result in
      guard result == .success else {
        let error = NSError(
          domain: errorDomain,
          code: Int(result.rawValue),
          userInfo: [
            NSLocalizedDescriptionKey: "Automatic pass presentation suppression failed: \(result)"
          ]
        )
        Bugsnag.notifyError(error)
        return
      }
    }
  }

  @objc static func enablePassPresentation() {
    guard #available(iOS 9, *) else { return }
    guard PKPassLibrary.isPassLibraryAvailable() else { return }
    guard PKPassLibrary.isSuppressingAutomaticPassPresentation() else { return }
    guard let token = suppressionRequestToken else { return }

    PKPassLibrary.endAutomaticPassPresentationSuppression(withRequestToken: token)
    suppressionRequestToken = nil
  }
}