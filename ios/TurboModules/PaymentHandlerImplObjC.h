#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PaymentHandlerImpl : NSObject

- (void)startPaymentWithItems:(NSArray *)items
            completionHandler:(void (^)(NSString * _Nullable))completionHandler;

- (BOOL)canMakePayments;

@end

NS_ASSUME_NONNULL_END
