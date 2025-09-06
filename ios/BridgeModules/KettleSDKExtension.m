#import "KettleSDKExtension.h"
#import "AtB-Swift.h"

#ifdef KETTLE_API_KEY
#import <KettleKit/KettleKit.h>
#import <KettleKit/KettleKit-Swift.h>
static void InitializeKettle(NSDictionary *launchOptions) {
  NSString *apiKey = [NSString stringWithFormat:@"%@", KETTLE_API_KEY];
  if ([apiKey length] > 0) {
    KTLConfig* config = [KTLConfig KTLDefaultConfig];

#if DEBUG
    config.developmentApiKey = apiKey;
#else
    config.productionApiKey = apiKey;
#endif

    config.developmentLogLevel = KTLLogLevelDebug;
    config.productionLogLevel = KTLLogLevelNone;

    // Initialize Kettle
    [KTLKettle prepare:config launchOptions:launchOptions];
  }
}
#endif

@implementation KettleSDKExtension
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initializeKettleSDK:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
#ifdef KETTLE_API_KEY
  NSString *apiKey = [NSString stringWithFormat:@"%@", KETTLE_API_KEY];
  if ([apiKey length] > 0) {
    dispatch_async(dispatch_get_main_queue(), ^{
      InitializeKettle([AppDelegate shared].launchOptions);
      resolve(@YES);
    });
  }
#endif
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
