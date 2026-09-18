#import "RCTLiveActivities.h"
#import "LiveActivitiesImplObjC.h"

@implementation RCTLiveActivities {
  LiveActivitiesImpl *liveActivities;
}

RCT_EXPORT_MODULE(NativeLiveActivities)

- (id)init {
  if (self = [super init]) {
    liveActivities = [LiveActivitiesImpl new];

    __weak RCTLiveActivities *weakSelf = self;
    liveActivities.onPushTokenUpdate = ^(NSDictionary *payload) {
      RCTLiveActivities *module = weakSelf;
      if ([module canEmit]) {
        [module emitOnPushTokenUpdate:payload];
      }
    };
    liveActivities.onActivityEnded = ^(NSDictionary *payload) {
      RCTLiveActivities *module = weakSelf;
      if ([module canEmit]) {
        [module emitOnActivityEnded:payload];
      }
    };

    [liveActivities startObservingActivities];
  }
  return self;
}

- (BOOL)canEmit {
  return _eventEmitterCallback ? YES : NO;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLiveActivitiesSpecJSI>(params);
}

- (void)getActiveActivities:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  [liveActivities getActiveActivities:^(id _Nullable result) { resolve(result); }
                               reject:^(NSString *code, NSString *message) { reject(code, message, nil); }];
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
