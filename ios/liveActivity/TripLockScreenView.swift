import ActivityKit
import Foundation
import SwiftUI
import WidgetKit

typealias TripState = TripLiveActivityAttributes.ContentState

// MARK: - Shared building blocks

/// Renders `eventDate` as an absolute clock time.
struct TimeText: View {
  let state: TripState
  var size: CGFloat = 15

  var body: some View {
    Text(state.eventDate, style: .time)
      .font(BrandFont.primary(size))
      .monospacedDigit()
      .lineLimit(1)
      .minimumScaleFactor(0.7)
  }
}

// MARK: - Lock-screen layout

/// Two-row light card: instruction + illustration, then line + arrival.
struct TripLockScreenView: View {
  let context: ActivityViewContext<TripLiveActivityAttributes>

  private var state: TripState { context.state }

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(state.title)
        .font(BrandFont.secondary(14)).opacity(0.8)
        .lineLimit(1).minimumScaleFactor(0.85)
      HStack(spacing: 12) {
        LineBadge(mode: state.mode, number: state.lineNumber)
        Text(state.lineName)
          .font(BrandFont.primary(16))
          .lineLimit(1).minimumScaleFactor(0.85)
        Spacer(minLength: 0)
        HStack(spacing: 4) {
          RealtimeIndicator()
          TimeText(state: state, size: 16)
        }
      }
    }
    .padding(16)
  }
}
