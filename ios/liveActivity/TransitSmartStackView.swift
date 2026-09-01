import ActivityKit
import SwiftUI
import WidgetKit

// MARK: - Smart Stack layout

/// Apple Watch Smart Stack presentation (`ActivityFamily.small`).
///
/// Rendered on the paired watch from this same iOS extension — there is no
/// watchOS target. Much tighter than the lock screen: a single row with the line
/// badge, the headsign + instruction, and the arrival time.
struct TransitSmartStackView: View {
  let context: ActivityViewContext<TransitActivityAttributes>

  private var state: TransitState { context.state }

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(state.title)
        .font(BrandFont.secondary(12)).opacity(0.8)
        .lineLimit(1).minimumScaleFactor(0.8)
        .frame(maxWidth: .infinity, alignment: .leading)
      Spacer(minLength: 0)
      VStack(alignment: .leading) {
        HStack(alignment: .center, spacing: 4) {
          LineBadge(mode: state.mode, number: state.lineNumber, size: 16)
          Spacer(minLength: 0)
          HStack(spacing: 2) {
            RealtimeIndicator(size: 10)
            TimeText(state: state, size: 14)
          }
        }
        VStack(alignment: .leading, spacing: 1) {
        }
      }
    }.padding(16)
  }
}
