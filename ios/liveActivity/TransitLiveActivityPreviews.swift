import ActivityKit
import SwiftUI
import WidgetKit

/// Xcode previews for the Live Activity. Use the preview canvas' presentation
/// picker to switch between lock screen and the Dynamic Island variants.
extension TransitActivityAttributes {
  fileprivate static var preview: TransitActivityAttributes {
    TransitActivityAttributes()
  }
}

extension TransitState {
  fileprivate static func preview(
    mode: TransportMode = .bus,
    title: String = "Fra Prinsens Gate",
    lineNumber: String = "3",
    lineName: String = "Lohove",
    minutesFromNow: Int = 12
  ) -> TransitState {
    TransitState(
      mode: mode,
      lineNumber: lineNumber,
      lineName: lineName,
      title: title,
      eventTime: Int(Date().timeIntervalSince1970) + minutesFromNow * 60)
  }
}

@available(iOS 17.0, *)
#Preview("Transit", as: .content, using: TransitActivityAttributes.preview) {
  TransitLiveActivity()
} contentStates: {
  TransitState.preview()
  TransitState.preview(lineNumber: "311", lineName: "Sjetnemarka via Kroppanm. - Okstad")
  TransitState.preview(mode: .walk, title: "Neste stopp")
  TransitState.preview(mode: .water)
  TransitState.preview(mode: .rail, minutesFromNow: 1)
}
