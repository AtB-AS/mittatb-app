#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ExperimentalFeatureImpl : NSObject
- (BOOL)isNonProductionReleaseChannel;
@end

NS_ASSUME_NONNULL_END
