#include "WidgetUpdaterBridge.h"
#import <atb-Swift.h>

@implementation WidgetUpdaterBridge

RCT_EXPORT_MODULE(WidgetUpdaterBridge);

RCT_EXPORT_METHOD(refreshWidgets)
{
  [WidgetUpdater requestUpdate];
};

@end
