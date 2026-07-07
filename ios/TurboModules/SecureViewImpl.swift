import Foundation
import UIKit

/// UIKit implementation backing the `RCTSecureView` Fabric component.
///
/// React children are mounted into `contentView`, whose layer is re-parented
/// under a `isSecureTextEntry` UITextField's canvas layer. iOS omits that layer
/// subtree from screenshots and screen recordings, while the view hierarchy is
/// left intact so hit-testing/touch keep working.
@objc(SecureViewImpl)
final class SecureViewImpl: NSObject {
  private let contentView = UIView()
  private let secureTextField = UITextField()
  private weak var hostView: UIView?
  private var isSecured = false

  override init() {
    super.init()
    secureTextField.isSecureTextEntry = true
    // The field must not intercept touches meant for the content.
    secureTextField.isUserInteractionEnabled = false
  }

  @objc(attachToHostView:)
  func attach(toHostView host: UIView) {
    hostView = host
    host.addSubview(contentView)
    host.addSubview(secureTextField)
  }

  @objc(mountChild:atIndex:)
  func mountChild(_ child: UIView, atIndex index: Int) {
    contentView.insertSubview(child, at: index)
  }

  @objc(unmountChild:)
  func unmountChild(_ child: UIView) {
    child.removeFromSuperview()
  }

  @objc(layoutWithBounds:)
  func layout(withBounds bounds: CGRect) {
    contentView.frame = bounds
    secureTextField.frame = bounds
    applySecureIfPossible()
  }

  /// The secure canvas is the last sublayer of a `secureTextEntry` UITextField
  /// (backing its private `_UITextLayoutCanvasView`). It is created lazily by
  /// UIKit, so this bails and is retried on the next layout pass if it isn't
  /// available yet. Lifting the field's layer to the content view's superlayer
  /// and re-homing the content layer under the canvas redirects only the
  /// rendering — the view hierarchy stays intact.
  @objc func applySecureIfPossible() {
    guard !isSecured,
      contentView.window != nil,
      let superlayer = contentView.layer.superlayer,
      let secureCanvas = secureTextField.layer.sublayers?.last
    else { return }

    superlayer.addSublayer(secureTextField.layer)
    secureCanvas.addSublayer(contentView.layer)
    isSecured = true
  }
}
