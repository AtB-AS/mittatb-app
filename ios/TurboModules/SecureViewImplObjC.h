#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface SecureViewImpl : NSObject

- (void)attachToHostView:(UIView *)hostView;
- (void)mountChild:(UIView *)child atIndex:(NSInteger)index;
- (void)unmountChild:(UIView *)child;
- (void)layoutWithBounds:(CGRect)bounds;
- (void)applySecureIfPossible;

@end

NS_ASSUME_NONNULL_END
