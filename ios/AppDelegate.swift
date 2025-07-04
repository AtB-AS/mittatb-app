import UIKit
import React
import Bugsnag
import Firebase
import Intercom
import RNBootSplash
import SwiftBridging
import React_RCTAppDelegate

@main
class AppDelegate: RCTAppDelegate {
  @objc var launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  
  @objc static var shared: AppDelegate? {
    return UIApplication.shared.delegate as? AppDelegate
  }
  
  override func customize(_ rootView: RCTRootView) {
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "atb"
    self.launchOptions = launchOptions
    
    // Initialize Intercom
    if let intercomPath = Bundle.main.path(forResource: "Intercom", ofType: "plist"),
       let intercomDict = NSDictionary(contentsOfFile: intercomPath) as? [String: Any] {
      let intercomApiKey = intercomDict["IntercomApiKey"] as? String ?? ""
      let intercomAppId = intercomDict["IntercomAppId"] as? String ?? ""
      
      if !intercomApiKey.isEmpty && !intercomAppId.isEmpty {
        Intercom.setApiKey(intercomApiKey, forAppId: intercomAppId)
      }
    }
    
    // Initialize Bugsnag
    if let bugsnagApiKey = Bundle.main.object(forInfoDictionaryKey: "BugsnagAPIKey") as? String, !bugsnagApiKey.isEmpty {
      let config = BugsnagConfiguration.init(bugsnagApiKey)
      
      if let bugsnagReleaseStage = Bundle.main.object(forInfoDictionaryKey: "BugsnagReleaseStage") as? String, !bugsnagReleaseStage.isEmpty {
        config.releaseStage = bugsnagReleaseStage
      }
      
      Bugsnag.start(with: config)
    }
    
    // Initialize Firebase
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
    
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    guard let bridge = RCTBridge(delegate: self, launchOptions: launchOptions) else { return false }
    
    let rootView = AtBRootView(
      bridge: bridge,
      moduleName: "atb",
      initialProperties: initialProps
    )
    
    window = UIWindow(frame: UIScreen.main.bounds)
    
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    
    window.rootViewController = rootViewController
    rootView.setBackgroundByTrait()
    window.makeKeyAndVisible()
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }
}
