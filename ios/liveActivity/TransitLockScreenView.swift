import ActivityKit
import Foundation
import SwiftUI
import WidgetKit

typealias TransitState = TransitActivityAttributes.ContentState

// MARK: - Shared building blocks

/// Renders `eventDate` as an absolute clock time.
struct TimeText: View {
  let state: TransitState
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
struct TransitLockScreenView: View {
  let context: ActivityViewContext<TransitActivityAttributes>

  private var state: TransitState { context.state }

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
