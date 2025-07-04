#import <Foundation/Foundation.h>
#import "AtB-Swift.h"
#import "ChangeNativeBridge.h"
#import <React/RCTLog.h>

@implementation ChangeNativeBridge

RCT_EXPORT_MODULE(ChangeNativeBridge);

RCT_EXPORT_METHOD(changeAppearance: (NSString *)mode)
{
  if (@available(iOS 13.0, *)) {
    dispatch_async(dispatch_get_main_queue(), ^{
      
      AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
      
      if ([mode isEqualToString:@"dark"]) {
        appDelegate.window.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
      } else if ([mode isEqualToString:@"light"]) {
        appDelegate.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
      } else {
        appDelegate.window.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
      }
    });
  }
}

@end
