#import <Foundation/Foundation.h>
#import "RCTExperimentalFeature.h"
#import "ExperimentalFeatureImplObjC.h"

@implementation RCTExperimentalFeature {
  ExperimentalFeatureImpl *_impl;
}

- (instancetype)init {
  if (self = [super init]) {
    _impl = [ExperimentalFeatureImpl new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
  (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeExperimentalFeatureSpecJSI>(params);
}

- (NSNumber *)isNonProductionReleaseChannel
{
  return @([_impl isNonProductionReleaseChannel]);
}

+ (NSString *)moduleName
{
  return @"ExperimentalFeature";
}

@end
