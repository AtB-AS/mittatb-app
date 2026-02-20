#import "RCTPaymentHandler.h"
#import "PaymentHandlerImplObjC.h"
#import <CoreLocation/CoreLocation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <RCTAppDelegate.h>

@implementation RCTPaymentHandler {
  PaymentHandlerImpl *paymentHandler;
}

RCT_EXPORT_MODULE(NativePaymentHandler)

- (id) init {
  if (self = [super init]) {
    paymentHandler = [PaymentHandlerImpl new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativePaymentHandlerSpecJSI>(params);
}

- (void)startPayment:(NSArray *)items
          onComplete:(RCTResponseSenderBlock)onComplete {
  [paymentHandler startPaymentWithItems:items completionHandler:^(NSString * _Nullable paymentData) {
    onComplete(@[ paymentData ?: [NSNull null] ]);
  }];
}

- (NSNumber *)canMakePayments {
  return @([paymentHandler canMakePayments]);
}

@end
