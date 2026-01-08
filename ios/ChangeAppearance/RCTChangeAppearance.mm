//
//  RCTChangeAppearance.m
//  app
//
//  Created by Johannes Røsvik on 08/01/2026.
//

#import "RCTChangeAppearance.h"
#import "AtB-Swift.h"

@interface RCTChangeAppearance()
@end

@implementation RCTChangeAppearance

- (id) init {
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeChangeAppearanceSpecJSI>(params);
}

- (void)changeAppearance:(NSString *)mode {
  // Your native implementation here
  // e.g. converting "mode" string to UIUserInterfaceStyle
  NSLog(@"Changing appearance to: %@", mode);

  UIUserInterfaceStyle style = UIUserInterfaceStyleLight;
  if ([mode isEqualToString:@"dark"]) {
    style = UIUserInterfaceStyleDark;
  } else if ([mode isEqualToString:@"light"]) {
    style = UIUserInterfaceStyleLight;
  } else {
    style = UIUserInterfaceStyleUnspecified;
  }

  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  appDelegate.window.overrideUserInterfaceStyle = style;
}

+ (NSString *)moduleName
{
  return @"ChangeAppearance";
}

@end
