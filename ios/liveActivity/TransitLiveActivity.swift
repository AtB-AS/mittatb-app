import ActivityKit
import SwiftUI
import WidgetKit

struct TransitLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TransitActivityAttributes.self) { context in
      // Lock screen / banner presentation.
      TransitLockScreenView(context: context)
    } dynamicIsland: { context in
      transitDynamicIsland(context: context)
    }
  }
}
