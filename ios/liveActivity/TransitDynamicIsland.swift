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
    DynamicIslandExpandedRegion(.leading) {}
    DynamicIslandExpandedRegion(.trailing) {}
    DynamicIslandExpandedRegion(.bottom) {
      VStack {
        Text(state.title)
          .font(BrandFont.secondary(14))
          .lineLimit(1)
          .frame(maxWidth: .infinity, alignment: .leading)
          .opacity(0.8)
        HStack {
          LineBadge(mode: state.mode, number: state.lineNumber)
          VStack {
            Text(state.lineName)
              .font(BrandFont.primary(16))
              .lineLimit(1)
              .frame(maxWidth: .infinity, alignment: .leading)
          }
          HStack(spacing: 4) {
            RealtimeIndicator()
            state.timeSuffix
              .font(BrandFont.primary(16))
              .lineLimit(1).minimumScaleFactor(0.85)
          }
        }
      }.padding(.horizontal, 8)
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
