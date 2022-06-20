#import "AppDelegate.h"
#import "AtBRootView.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>


#import <Bugsnag/Bugsnag.h>
#import <Firebase.h>
@import Intercom;

#import "RNBootSplash.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  NSString *intercomPath = [[NSBundle mainBundle] pathForResource:@"Intercom" ofType:@"plist"];
  NSDictionary *intercomDict = [[NSDictionary alloc] initWithContentsOfFile:intercomPath];
  NSString* intercomApiKey = [intercomDict objectForKey:@"IntercomApiKey"];
  NSString* intercomAppId = [intercomDict objectForKey:@"IntercomAppId"];
  
  if ([intercomApiKey length] != 0 && [intercomAppId length] != 0) {
    [Intercom setApiKey:intercomApiKey forAppId:intercomAppId];
  }

  NSString* bugsnagApiKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"BugsnagAPIKey"];
  if ([bugsnagApiKey length] != 0) {
    BugsnagConfiguration *config = [[BugsnagConfiguration alloc] initWithApiKey:bugsnagApiKey];
    NSString* bugsnagReleaseStage = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"BugsnagReleaseStage"];
    if ([bugsnagReleaseStage length] != 0)
      config.releaseStage = bugsnagReleaseStage;
    [Bugsnag startWithConfiguration:config];
  }

  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  AtBRootView *rootView = [[AtBRootView alloc] initWithBridge:bridge
                                                   moduleName:@"atb"
                                            initialProperties:nil];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [rootView setBackgroundByTrait];
  [self.window makeKeyAndVisible];
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
