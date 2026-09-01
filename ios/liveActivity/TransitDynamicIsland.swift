import ActivityKit
import SwiftUI
import WidgetKit

// MARK: - Dynamic Island layout

/// Builds the expanded, compact and minimal Dynamic Island presentations.
func transitDynamicIsland(
  context: ActivityViewContext<TransitActivityAttributes>
) -> DynamicIsland {
  let state = context.state
  let accent = BrandColor.accent

  return DynamicIsland {
    DynamicIslandExpandedRegion(.leading) {
      VStack {
        LineBadge(mode: state.mode, number: state.lineNumber)
      }.frame(maxHeight: .infinity, alignment: .center).padding(.leading, 5)
    }
    DynamicIslandExpandedRegion(.trailing) {
      VStack {
        HStack(spacing: 4) {
          RealtimeIndicator()
          state.timeSuffix
            .font(BrandFont.primary(16))
            .lineLimit(1).minimumScaleFactor(0.85)
        }
      }.frame(maxHeight: .infinity, alignment: .center)
    }
    DynamicIslandExpandedRegion(.bottom) {
      HStack {
        Text("\(state.lineNumber) \(state.lineName)")
          .font(BrandFont.primary(16))
          .lineLimit(1).minimumScaleFactor(0.85)
        Text("–")
          .font(BrandFont.primary(16))
          .lineLimit(1).minimumScaleFactor(0.85)
        Text("\(state.title)")
          .font(BrandFont.primary(16))
          .lineLimit(1).minimumScaleFactor(0.85)
      }.safeAreaPadding(.horizontal)
    }
  } compactLeading: {
    ModeIcon(state.mode, size: 20)
      .padding(.leading, 4)
  } compactTrailing: {
    TimeText(state: state, size: 14)
  } minimal: {
    ModeIcon(state.mode, size: 20)
  }
  .keylineTint(accent)
}
