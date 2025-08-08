#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <atb-Swift.h>

@interface AppDelegate : RCTAppDelegate
@property (strong, nonatomic) NSDictionary *launchOptions;

+ (AppDelegate *)sharedInstance;
@end
