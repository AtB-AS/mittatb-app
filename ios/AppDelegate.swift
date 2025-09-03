//
//  AppDelegate.swift
//  atb
//
//  Created by Christian Brevik on 03/09/2025.
//


import UIKit
import React
import Bugsnag
import Firebase
import Intercom
import RNBootSplash
import SwiftBridging
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  @objc var launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  
  @objc static var shared: AppDelegate? {
    return UIApplication.shared.delegate as? AppDelegate
  }
  
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

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
    
    factory.startReactNative(
         withModuleName: "atb",
         in: window,
         launchOptions: launchOptions
       )

    return true
  }
  
  /*override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }*/
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
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
  
  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView) // ⬅️ initialize the splash screen
  }
}
