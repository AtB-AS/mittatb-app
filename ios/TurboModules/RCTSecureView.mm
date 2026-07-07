#import "RCTSecureView.h"

#import <react/renderer/components/AtBTurboModuleSpec/ComponentDescriptors.h>
#import <react/renderer/components/AtBTurboModuleSpec/Props.h>
#import <react/renderer/components/AtBTurboModuleSpec/RCTComponentViewHelpers.h>

#import "SecureViewImplObjC.h"

using namespace facebook::react;

@interface RCTSecureView () <RCTSecureViewViewProtocol>
@end

@implementation RCTSecureView {
  SecureViewImpl *_impl;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<SecureViewComponentDescriptor>();
}

// UIKit constructor
- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const SecureViewProps>();
    _props = defaultProps;
    _impl = [SecureViewImpl new];
    [_impl attachToHostView:self];
  }
  return self;
}

// UIKit calls this when the view is added or removed from a window
- (void)didMoveToWindow
{
  [super didMoveToWindow];
  [_impl applySecureIfPossible];
}

// UIKit calls this when bounds change
- (void)layoutSubviews
{
  [super layoutSubviews];
  [_impl layoutWithBounds:self.bounds];
}

// RCTComponentViewProtocol / React mount
- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index
{
  [_impl mountChild:childComponentView atIndex:index];
}

// RCTComponentViewProtocol / React unmount
- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index
{
  [_impl unmountChild:childComponentView];
}

+ (BOOL)shouldBeRecycled
{
  // Re-using the view causes crashes when it is re-mounted, so we opt out
  return NO;
}

@end

Class<RCTComponentViewProtocol> RCTSecureViewCls(void)
{
  return RCTSecureView.class;
}
