#import "KettleSDKExtension.h"

#ifdef KETTLE_API_KEY
#import <KettleKit/KettleKit.h>
#import <KettleKit/KettleKit-Swift.h>
static void InitializeKettle(NSDictionary *launchOptions) {
    KTLConfig* config = [KTLConfig KTLDefaultConfig];
    NSString *apiKey = [NSString stringWithFormat:@"%@", KETTLE_API_KEY];
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
#endif

@implementation KettleSDKExtension
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initializeKettleSDK)
{
#ifdef KETTLE_API_KEY
  InitializeKettle(nil);
#endif
}
@end
