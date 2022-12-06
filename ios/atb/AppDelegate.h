#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <atb-Swift.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) LocationChangeManager *locationManager;

@end
