#import "PassPresentationBridge.h"
#import <PassKit/PassKit.h>
#import <atb-Swift.h>

@implementation PassPresentationBridge

RCT_EXPORT_MODULE(PassPresentationBridge)

RCT_EXPORT_METHOD(requestAutomaticPassPresentationSuppression) {  
  [PassPresentation suppressPassPresentation];
}

RCT_EXPORT_METHOD(endAutomaticPassPresentationSuppression) {  
  [PassPresentation enablePassPresentation];
}

@end
