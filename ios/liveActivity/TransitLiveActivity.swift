import SwiftUI
import WidgetKit
import ActivityKit

struct TransitLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TransitActivityAttributes.self) { context in
      // Lock screen / banner presentation.
      TransitLockScreenView(context: context)
    } dynamicIsland: { context in
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
  }
}
