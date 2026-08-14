import Foundation
import UIKit

/// UIKit implementation of the RCTSecureView component.
///
/// React children are placed under a UITextField canvas layer with
/// `isSecureTextEntry` enabled. iOS omits that layer subtree from screenshots
/// and screen recordings.
@objc(SecureViewImpl)
final class SecureViewImpl: NSObject {
  private let contentView = UIView()
  private let secureTextField = UITextField()
  private weak var hostView: UIView?
  private var isSecured = false

  override init() {
    super.init()
    secureTextField.isSecureTextEntry = true
    // Don't intercept touches meant for the content.
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

  /// Moves the content view's rendering (layers) under the text field's secure
  /// canvas.
  ///
  /// Layer tree before (created in `attachToHostView`):
  /// ```
  /// hostView
  /// ├── contentView                  ← React children mounted here (in `mountChild`)
  /// └── secureTextField              ← UITextField with isSecureTextEntry
  ///     ├── [UITextField layers...]
  ///     └── secureCanvas             ← last sublayer, which iOS excludes from captures
  /// ```
  ///
  /// Layer tree after:
  /// ```
  /// hostView
  /// └── secureTextField
  ///     ├── [UITextField layers...]
  ///     └── secureCanvas
  ///         └── contentView          ← React children render here, omitted from captures
  /// ```
  ///
  /// This rewires the *layer* tree only; the *view* tree is untouched
  /// (`contentView` stays a subview of `hostView`), which is why hit-testing
  /// and touches keep working.
  @objc func applySecureIfPossible() {
    guard !isSecured,
      contentView.window != nil,
      let hostViewLayer = contentView.layer.superlayer, // Resolves to hostView.layer when mounted
      let secureCanvas = secureTextField.layer.sublayers?.last
    else { return }

    hostViewLayer.addSublayer(secureTextField.layer)
    secureCanvas.addSublayer(contentView.layer)
    isSecured = true
  }
}
