//
//  RCTChangeAppearance.m
//  app
//
//  Created by Johannes Røsvik on 08/01/2026.
//

#import "RCTChangeAppearance.h"

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
}

+ (NSString *)moduleName
{
  return @"ChangeAppearanceSpec";
}

@end
