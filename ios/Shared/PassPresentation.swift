import Foundation
import PassKit

@objc public class PassPresentation:NSObject {
  private static var suppressionRequestToken:PKSuppressionRequestToken!;
  
  @objc static func suppressPassPresentation() {
    if #available(iOS 9, *) {
      if( PKPassLibrary.isPassLibraryAvailable() && !PKPassLibrary.isSuppressingAutomaticPassPresentation()) {
        suppressionRequestToken = PKPassLibrary.requestAutomaticPassPresentationSuppression(responseHandler: { _ in })
      }
    }
  }
  
  @objc static func enablePassPresentation() {
    if #available(iOS 9, *) {
      if( PKPassLibrary.isPassLibraryAvailable() && PKPassLibrary.isSuppressingAutomaticPassPresentation()) {
        PKPassLibrary.endAutomaticPassPresentationSuppression(withRequestToken: suppressionRequestToken)
      }
    }
  }
}
