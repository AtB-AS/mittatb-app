import ActivityKit
import SwiftUI
import WidgetKit

/// Xcode previews for the Live Activity. Use the preview canvas' presentation
/// picker to switch between lock screen and the Dynamic Island variants.
extension TransitActivityAttributes {
  fileprivate static var preview: TransitActivityAttributes {
    TransitActivityAttributes(tripId: "preview-trip")
  }
}

extension TransitState {
  fileprivate static func preview(
    mode: TransportMode = .bus,
    title: String = "Fra Prinsens Gate P1",
    lineNumber: String = "3",
    lineName: String = "Lohove",
    minutesFromNow: Int = 5
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
  TransitState.preview(
    title: "Fra Hundremeterskogen Bussterminal øst",
    lineNumber: "311",
    lineName: "Sjetnemarka via Kroppanm. - Okstad",
    minutesFromNow: 12
  )
  TransitState.preview(mode: .rail, minutesFromNow: 0)
  TransitState.preview(mode: .walk, title: "Neste stopp")
  TransitState.preview(mode: .water)
}
