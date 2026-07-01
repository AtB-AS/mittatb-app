import SwiftUI
import WidgetKit
import ActivityKit

typealias TransitState = TransitActivityAttributes.ContentState

// MARK: - Shared building blocks

/// A colored line-number badge, e.g. a green "42 Sandnes" pill.
struct LineBadge: View {
  let mode: TransitState.Mode
  let number: String
  let name: String?

  var body: some View {
    HStack(spacing: 6) {
      Image(systemName: BrandColor.icon(mode))
        .font(.system(size: 13, weight: .bold))
      if !number.isEmpty {
        Text(number).font(BrandFont.bold(15))
      }
      if let name, !name.isEmpty {
        Text(name).font(BrandFont.heading(15)).lineLimit(1)
      }
    }
    .foregroundStyle(BrandColor.onBadge)
    .padding(.horizontal, 10)
    .padding(.vertical, 5)
    .background(BrandColor.mode(mode), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
  }
}

/// The little blue bus-stop sign used next to stop names in the reference designs.
struct StopSignIcon: View {
  var body: some View {
    Image(systemName: "bus")
      .font(.system(size: 11, weight: .bold))
      .foregroundStyle(.white)
      .frame(width: 26, height: 20)
      .background(BrandColor.stopSign, in: RoundedRectangle(cornerRadius: 5, style: .continuous))
  }
}

/// Renders `eventTime` either as a live countdown or an absolute clock time.
struct TimeText: View {
  let state: TransitState
  var size: CGFloat = 15
  var color: Color = BrandColor.text

  var body: some View {
    Group {
      if state.eventIsCountdown {
        Text(timerInterval: Date()...max(state.eventTime, Date().addingTimeInterval(1)),
             countsDown: true)
          .multilineTextAlignment(.trailing)
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

/// The "walking person → bus" glyph shown centered in the alight designs.
struct WalkToBusGlyph: View {
  var body: some View {
    HStack(spacing: 4) {
      Image(systemName: "figure.walk")
        .font(.system(size: 20, weight: .semibold))
      Image(systemName: "arrow.up.forward")
        .font(.system(size: 12, weight: .bold))
        .offset(y: -6)
      Image(systemName: "bus.fill")
        .font(.system(size: 22, weight: .semibold))
    }
    .foregroundStyle(BrandColor.text)
  }
}

// MARK: - Lock-screen layouts

/// Router: picks a layout based on the trip phase.
struct TransitLockScreenView: View {
  let context: ActivityViewContext<TransitActivityAttributes>

  var body: some View {
    Group {
      switch context.state.phase {
      case .walking:
        WalkToStopView(state: context.state)
      case .waiting:
        DepartureView(attributes: context.attributes, state: context.state)
      case .onboard, .getOff:
        OnboardView(state: context.state)
      }
    }
    .padding(16)
    .activityBackgroundTint(BrandColor.background)
    .activitySystemActionForegroundColor(BrandColor.text)
  }
}

/// Apple-Maps-style two-row "walk to stop, then take line" layout.
private struct WalkToStopView: View {
  let state: TransitState

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack(alignment: .top) {
        VStack(alignment: .leading, spacing: 3) {
          Text(state.headline)
            .font(BrandFont.body(13)).foregroundStyle(BrandColor.textSecondary)
          HStack(spacing: 8) {
            StopSignIcon()
            Text(state.toStopName)
              .font(BrandFont.heading(17)).foregroundStyle(BrandColor.text)
              .lineLimit(1).minimumScaleFactor(0.85)
          }
        }
        Spacer()
        HStack(spacing: 4) {
          Image(systemName: "figure.walk").font(.system(size: 14, weight: .semibold))
          TimeText(state: state, size: 15)
        }
        .foregroundStyle(BrandColor.text)
      }

      Rectangle().fill(BrandColor.textSecondary.opacity(0.25)).frame(height: 1)

      HStack(alignment: .center) {
        VStack(alignment: .leading, spacing: 3) {
          Text(state.secondaryText)
            .font(BrandFont.body(13)).foregroundStyle(BrandColor.textSecondary)
          LineBadge(mode: state.mode, number: state.lineNumber, name: state.lineName)
        }
        Spacer()
      }
    }
  }
}

/// Entur-style departure card: "Reisen din til X", from-stop + line badge, big departure time.
private struct DepartureView: View {
  let attributes: TransitActivityAttributes
  let state: TransitState

  var body: some View {
    VStack(alignment: .leading, spacing: 10) {
      HStack {
        Text("Reisen din til \(attributes.toName)")
          .font(BrandFont.heading(16)).foregroundStyle(BrandColor.text).lineLimit(1)
        Spacer()
        Text(attributes.brandLabel)
          .font(BrandFont.bold(13)).foregroundStyle(BrandColor.textSecondary)
      }

      HStack(alignment: .center) {
        VStack(alignment: .leading, spacing: 6) {
          Text("Fra \(state.fromStopName)")
            .font(BrandFont.body(13)).foregroundStyle(BrandColor.textSecondary).lineLimit(1)
          LineBadge(mode: state.mode, number: state.lineNumber, name: state.lineName)
        }
        Spacer()
        VStack(alignment: .trailing, spacing: 6) {
          Text(state.secondaryText)
            .font(BrandFont.body(13)).foregroundStyle(BrandColor.textSecondary)
          // Departure time is emphasized (coral) to match the reference design.
          TimeText(state: state, size: 24, color: BrandColor.alert)
        }
      }
    }
  }
}

/// "Get off at next stop" layout (onboard / alight now).
private struct OnboardView: View {
  let state: TransitState

  var body: some View {
    VStack(spacing: 12) {
      WalkToBusGlyph()

      HStack(alignment: .bottom) {
        VStack(alignment: .leading, spacing: 3) {
          Text(state.headline)
            .font(BrandFont.body(13)).foregroundStyle(BrandColor.textSecondary)
          HStack(spacing: 8) {
            StopSignIcon()
            Text(state.toStopName)
              .font(BrandFont.heading(19)).foregroundStyle(BrandColor.text)
              .lineLimit(1).minimumScaleFactor(0.8)
          }
        }
        Spacer(minLength: 8)
        VStack(alignment: .trailing, spacing: 4) {
          Text(state.secondaryText)
            .font(BrandFont.heading(17)).foregroundStyle(BrandColor.text)
            .fixedSize(horizontal: true, vertical: false)
          if state.alert {
            Text(state.alertText.isEmpty ? "STOPPER" : state.alertText)
              .font(BrandFont.bold(12)).foregroundStyle(.white)
              .padding(.horizontal, 8).padding(.vertical, 3)
              .background(BrandColor.alert, in: RoundedRectangle(cornerRadius: 5, style: .continuous))
          }
        }
      }
    }
  }
}
