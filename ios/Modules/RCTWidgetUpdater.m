#include "RCTWidgetUpdater.h"
#import <atb-Swift.h>


@implementation RCTWidgetUpdater

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(refreshWidgets)
{
  [WidgetUpdater requestUpdate];
};


@end
