import SwiftUI
import WidgetKit
import ActivityKit

typealias TransitState = TransitActivityAttributes.ContentState

// MARK: - Shared building blocks

/// A green line badge: a capsule with a mode icon + line number, e.g. "🚌 3".
struct LineBadge: View {
  let mode: TransitState.Mode
  let number: String

  var body: some View {
    HStack(spacing: 5) {
      Image(systemName: BrandColor.icon(mode))
        .font(.system(size: 14, weight: .bold))
      if !number.isEmpty {
        Text(number).font(BrandFont.bold(16))
      }
    }
    .foregroundStyle(BrandColor.onBadge)
    .padding(.horizontal, 12)
    .padding(.vertical, 7)
    .background(BrandColor.mode(mode), in: Capsule())
  }
}

/// Row-1 leading tile. Placeholder for the real "get off the bus" artwork —
/// drop a real image asset into the extension and swap this out.
struct IllustrationIcon: View {
  var body: some View {
    ZStack {
      RoundedRectangle(cornerRadius: 10, style: .continuous)
        .fill(BrandColor.illustrationBg)
      HStack(spacing: 1) {
        Image(systemName: "figure.walk").font(.system(size: 17, weight: .bold))
        Image(systemName: "bus.fill").font(.system(size: 16, weight: .bold))
      }
      .foregroundStyle(BrandColor.illustrationFg)
    }
    .frame(width: 52, height: 52)
  }
}

/// Renders `eventTime` as a live countdown or an absolute clock time.
struct TimeText: View {
  let state: TransitState
  var size: CGFloat = 15
  var color: Color = BrandColor.title

  var body: some View {
    Group {
      if state.eventIsCountdown {
        Text(timerInterval: Date()...max(state.eventTime, Date().addingTimeInterval(1)),
             countsDown: true)
      } else {
        Text(state.eventTime, style: .time)
      }
    }
    .font(BrandFont.bold(size))
    .monospacedDigit()
    .lineLimit(1)
    .minimumScaleFactor(0.7)
    .foregroundStyle(color)
  }
}

// MARK: - Lock-screen layout

/// Two-row light card: instruction + illustration, then line + arrival.
struct TransitLockScreenView: View {
  let context: ActivityViewContext<TransitActivityAttributes>

  private var state: TransitState { context.state }

  var body: some View {
    VStack(spacing: 12) {
      // Row 1 — illustration + status
      HStack(spacing: 12) {
        IllustrationIcon()
        VStack(alignment: .leading, spacing: 2) {
          Text(state.title)
            .font(BrandFont.heading(18)).foregroundStyle(BrandColor.title)
            .lineLimit(1).minimumScaleFactor(0.85)
          Text(state.subtitle)
            .font(BrandFont.body(15)).foregroundStyle(BrandColor.subtitle)
            .lineLimit(1).minimumScaleFactor(0.85)
        }
        Spacer(minLength: 0)
      }

      Rectangle().fill(BrandColor.divider).frame(height: 1)

      // Row 2 — line badge + arrival
      HStack(spacing: 12) {
        LineBadge(mode: state.mode, number: state.lineNumber)
        VStack(alignment: .leading, spacing: 2) {
          Text("\(state.lineNumber) \(state.lineName)")
            .font(BrandFont.heading(17)).foregroundStyle(BrandColor.title)
            .lineLimit(1).minimumScaleFactor(0.85)
          (Text("\(state.footnote) ") + timeSuffix)
            .font(BrandFont.body(15)).foregroundStyle(BrandColor.subtitle)
            .lineLimit(1).minimumScaleFactor(0.85)
        }
        Spacer(minLength: 0)
      }
    }
    .padding(16)
    .activityBackgroundTint(BrandColor.card)
    .activitySystemActionForegroundColor(BrandColor.title)
  }

  /// Absolute clock time appended to the footnote, e.g. "08:30".
  private var timeSuffix: Text {
    Text(state.eventTime, style: .time).monospacedDigit()
  }
}
