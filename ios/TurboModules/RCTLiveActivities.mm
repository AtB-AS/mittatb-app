#import "RCTLiveActivities.h"
#import "LiveActivitiesImplObjC.h"

@implementation RCTLiveActivities {
  LiveActivitiesImpl *liveActivities;
}

RCT_EXPORT_MODULE(NativeLiveActivities)

- (id)init {
  if (self = [super init]) {
    liveActivities = [LiveActivitiesImpl new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLiveActivitiesSpecJSI>(params);
}

- (NSNumber *)areActivitiesEnabled {
  return @([liveActivities areActivitiesEnabled]);
}

- (void)startActivity:(NSString *)attributesJson
     contentStateJson:(NSString *)contentStateJson
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  [liveActivities startActivity:attributesJson
               contentStateJson:contentStateJson
                        resolve:^(id _Nullable result) { resolve(result); }
                         reject:^(NSString *code, NSString *message) { reject(code, message, nil); }];
}

- (void)updateActivity:(NSString *)activityId
      contentStateJson:(NSString *)contentStateJson
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  [liveActivities updateActivity:activityId
                contentStateJson:contentStateJson
                         resolve:^(id _Nullable result) { resolve(result); }
                          reject:^(NSString *code, NSString *message) { reject(code, message, nil); }];
}

- (void)endActivity:(NSString *)activityId
 dismissImmediately:(BOOL)dismissImmediately
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject {
  [liveActivities endActivity:activityId
           dismissImmediately:dismissImmediately
                      resolve:^(id _Nullable result) { resolve(result); }
                       reject:^(NSString *code, NSString *message) { reject(code, message, nil); }];
}

- (void)endAllActivities:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  [liveActivities endAllActivities:^(id _Nullable result) { resolve(result); }
                            reject:^(NSString *code, NSString *message) { reject(code, message, nil); }];
}

@end
