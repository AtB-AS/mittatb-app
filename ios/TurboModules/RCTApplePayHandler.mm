#import "RCTApplePayHandler.h"
#import "ApplePayHandlerImplObjC.h"
#import <CoreLocation/CoreLocation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <RCTAppDelegate.h>

@implementation RCTApplePayHandler {
  ApplePayHandlerImpl *applePayHandler;
}

RCT_EXPORT_MODULE(NativeApplePayHandler)

- (id) init {
  if (self = [super init]) {
    applePayHandler = [ApplePayHandlerImpl new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeApplePayHandlerSpecJSI>(params);
}

- (void)startPayment:(NSArray *)items
          onComplete:(RCTResponseSenderBlock)onComplete {
  [applePayHandler startPaymentWithItems:items completionHandler:^(NSString * _Nullable paymentData) {
    onComplete(@[ paymentData ?: [NSNull null] ]);
  }];
}

- (NSNumber *)canMakePayments {
  return @([applePayHandler canMakePayments]);
}

@end
