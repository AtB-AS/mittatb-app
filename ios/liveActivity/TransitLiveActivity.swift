import ActivityKit
import SwiftUI
import WidgetKit

struct TransitLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TransitActivityAttributes.self) { context in
      TransitActivityContent(context: context)
    } dynamicIsland: { context in
      transitDynamicIsland(context: context)
    }
    // Opt in to the Apple Watch Smart Stack. Without this the watch renders a
    // system-generated fallback instead of `TransitSmartStackView`.
    .supplementalActivityFamilies([.small])
  }
}

/// Picks the presentation for the size the system asked for: `.medium` is the
/// iPhone lock screen / banner, `.small` is the Apple Watch Smart Stack.
struct TransitActivityContent: View {
  @Environment(\.activityFamily) private var activityFamily

  let context: ActivityViewContext<TransitActivityAttributes>

  var body: some View {
    switch activityFamily {
    case .small:
      TransitSmartStackView(context: context)
    case .medium:
      TransitLockScreenView(context: context)
    @unknown default:
      TransitLockScreenView(context: context)
    }
  }
}
