import ActivityKit
import SwiftUI
import WidgetKit

struct TripLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TripLiveActivityAttributes.self) { context in
      TripLiveActivityContent(context: context)
    } dynamicIsland: { context in
      tripDynamicIsland(context: context)
    }
    // Opt in to the Apple Watch Smart Stack. Without this the watch renders a
    // system-generated fallback instead of `TripSmartStackView`.
    .supplementalActivityFamilies([.small])
  }
}

/// Picks the presentation for the size the system asked for: `.medium` is the
/// iPhone lock screen / banner, `.small` is the Apple Watch Smart Stack.
struct TripLiveActivityContent: View {
  @Environment(\.activityFamily) private var activityFamily

  let context: ActivityViewContext<TripLiveActivityAttributes>

  var body: some View {
    switch activityFamily {
    case .small:
      TripSmartStackView(context: context)
    case .medium:
      TripLockScreenView(context: context)
    @unknown default:
      TripLockScreenView(context: context)
    }
  }
}
