#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BeaconsPermissions, NSObject)

RCT_EXTERN_METHOD(request:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
