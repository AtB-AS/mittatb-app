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
      LineBadge(mode: state.mode, number: state.lineNumber)
        .padding(.leading, 4)
    }
    DynamicIslandExpandedRegion(.trailing) {
      TimeText(state: state, size: 17, color: BrandColor.diText)
        .padding(.trailing, 4)
    }
    DynamicIslandExpandedRegion(.bottom) {
      VStack(alignment: .leading, spacing: 2) {
        Text(state.title)
          .font(BrandFont.heading(16)).foregroundStyle(BrandColor.diText)
          .lineLimit(1)
        Text(state.subtitle)
          .font(BrandFont.body(13)).foregroundStyle(BrandColor.diSubtitle)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding(.top, 4)
    }
  } compactLeading: {
    Image(systemName: BrandColor.icon(state.mode))
      .font(.system(size: 15, weight: .semibold))
      .foregroundStyle(accent)
  } compactTrailing: {
    TimeText(state: state, size: 14, color: accent)
  } minimal: {
    Image(systemName: BrandColor.icon(state.mode))
      .font(.system(size: 15, weight: .semibold))
      .foregroundStyle(accent)
  }
  .keylineTint(accent)
}
