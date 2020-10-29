#import "AtBRootView.h"
#import <React/RCTRootView.h>

@implementation AtBRootView

- (void) traitCollectionDidChange: (UITraitCollection *) previousTraitCollection
{
  [super traitCollectionDidChange: previousTraitCollection];
  
  if (@available(iOS 13.0, *)) {
    if (self.traitCollection.userInterfaceStyle != previousTraitCollection.userInterfaceStyle) {
      [self setBackgroundByTrait];
    }
  }
}

- (void)setBackgroundByTrait
{
  if (@available(iOS 13.0, *)) {
    if ([UITraitCollection currentTraitCollection].userInterfaceStyle == UIUserInterfaceStyleDark)
    {
      self.window.rootViewController.view.backgroundColor = [[UIColor alloc] initWithRed:0.0f green:0.0f blue:0.0f alpha:1];
    } else {
      self.window.rootViewController.view.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    }
  } else {
    self.window.rootViewController.view.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  }
}

@end
