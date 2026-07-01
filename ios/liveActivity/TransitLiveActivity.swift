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
      let accent = BrandColor.mode(state.mode)

      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          LineBadge(mode: state.mode, number: state.lineNumber, name: nil)
            .padding(.leading, 4)
        }
        DynamicIslandExpandedRegion(.trailing) {
          TimeText(state: state, size: 17,
                   color: state.alert ? BrandColor.alert : BrandColor.text)
            .padding(.trailing, 4)
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack(spacing: 8) {
            StopSignIcon()
            VStack(alignment: .leading, spacing: 1) {
              Text(state.headline)
                .font(BrandFont.body(12)).foregroundStyle(BrandColor.textSecondary)
              Text(state.toStopName)
                .font(BrandFont.heading(16)).foregroundStyle(BrandColor.text).lineLimit(1)
            }
            Spacer()
            if state.alert {
              Text(state.alertText.isEmpty ? "STOPPER" : state.alertText)
                .font(BrandFont.bold(11)).foregroundStyle(.white)
                .padding(.horizontal, 7).padding(.vertical, 3)
                .background(BrandColor.alert, in: RoundedRectangle(cornerRadius: 5, style: .continuous))
            }
          }
          .padding(.top, 4)
        }
      } compactLeading: {
        Image(systemName: BrandColor.icon(state.mode))
          .font(.system(size: 15, weight: .semibold))
          .foregroundStyle(accent)
      } compactTrailing: {
        TimeText(state: state, size: 14,
                 color: state.alert ? BrandColor.alert : accent)
      } minimal: {
        Image(systemName: BrandColor.icon(state.mode))
          .font(.system(size: 15, weight: .semibold))
          .foregroundStyle(accent)
      }
      .keylineTint(accent)
    }
  }
}
