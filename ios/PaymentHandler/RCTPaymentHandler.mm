#import "RCTPaymentHandler.h"
#import <CoreLocation/CoreLocation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <RCTAppDelegate.h>
#import "Atb-Swift.h"

@implementation RCTPaymentHandler {
  PaymentHandler *paymentHandler;
}

RCT_EXPORT_MODULE(NativePaymentHandler)

- (id) init {
  if (self = [super init]) {
    paymentHandler = [PaymentHandler new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativePaymentHandlerSpecJSI>(params);
}

- (void)startPayment:(double)price
          onComplete:(RCTResponseSenderBlock)onComplete {
  NSLog(@"OBJC: Start payment with price: %f", price);
  [paymentHandler startPaymentFor:price completionHandler:^(BOOL success) {
    onComplete(@[ @(success) ]);
  }];
}

@end
