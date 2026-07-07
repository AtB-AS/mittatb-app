#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Fabric host view backing the JS `SecureView` component. React children are
 * mounted inside a `secureTextEntry` UITextField's canvas, whose layer iOS
 * excludes from screenshots and screen recordings while still rendering it on
 * screen.
 */
@interface RCTSecureView : RCTViewComponentView

@end

NS_ASSUME_NONNULL_END
