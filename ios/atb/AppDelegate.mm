#import "AppDelegate.h"
#import "AtBRootView.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

#import <Bugsnag/Bugsnag.h>
#import <Firebase.h>
#import <IntercomModule.h>

#import "RNBootSplash.h"

@implementation AppDelegate

@synthesize launchOptions;

+ (AppDelegate *)sharedInstance {
    return (AppDelegate *)[[UIApplication sharedApplication] delegate];
}

- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.launchOptions = launchOptions;

  NSString *intercomPath = [[NSBundle mainBundle] pathForResource:@"Intercom" ofType:@"plist"];
  NSDictionary *intercomDict = [[NSDictionary alloc] initWithContentsOfFile:intercomPath];
  NSString* intercomApiKey = [intercomDict objectForKey:@"IntercomApiKey"];
  NSString* intercomAppId = [intercomDict objectForKey:@"IntercomAppId"];

  if ([intercomApiKey length] != 0 && [intercomAppId length] != 0) {
    [IntercomModule initialize:intercomApiKey withAppId:intercomAppId];
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

  self.moduleName = @"no.mittatb";
  self.dependencyProvider = [[RCTAppDependencyProvider alloc] init];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  AtBRootView *rootView = [[AtBRootView alloc] initWithBridge:bridge
                                                   moduleName:@"atb"
                                            initialProperties:self.initialProps];

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
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
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

