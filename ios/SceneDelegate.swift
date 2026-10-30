import UIKit
import React
import React_RCTAppDelegate

// Required when building with the iOS 27 SDK, see
// https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle
// When upgrading to React Native 0.88+, replace the launch options conversion and
// URL forwarding with `startReactNative(withModuleName:in:connectionOptions:)` and
// `RCTLinkingManager.scene(_:openURLContexts:)`.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = AppDelegate.shared else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    appDelegate.window = window

    // Pass a URL or universal link the app was cold-started with on to
    // Linking.getInitialURL()
    var launchOptions = appDelegate.launchOptions ?? [:]
    let universalLink = connectionOptions.userActivities.first {
      $0.activityType == NSUserActivityTypeBrowsingWeb
    }?.webpageURL
    if let url = connectionOptions.urlContexts.first?.url ?? universalLink {
      launchOptions[.url] = url
    }

    appDelegate.reactNativeFactory?.startReactNative(
      withModuleName: "atb",
      in: window,
      launchOptions: launchOptions
    )
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
      return
    }
    RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}
