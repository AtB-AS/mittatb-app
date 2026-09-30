import ActivityKit
import SwiftUI
import WidgetKit

/// Xcode previews for the Live Activity. Use the preview canvas' presentation
/// picker to switch between lock screen and the Dynamic Island variants.
extension TripLiveActivityAttributes {
  fileprivate static var preview: TripLiveActivityAttributes {
    TripLiveActivityAttributes(tripId: "preview-trip")
  }
}

extension TripState {
  fileprivate static func preview(
    mode: TransportMode = .bus,
    title: String = "Fra Prinsens Gate P1",
    lineNumber: String = "3",
    lineName: String = "Lohove",
    minutesFromNow: Int = 5
  ) -> TripState {
    TripState(
      mode: mode,
      lineNumber: lineNumber,
      lineName: lineName,
      title: title,
      eventTime: Int(Date().timeIntervalSince1970) + minutesFromNow * 60)
  }
}

#Preview("Trip", as: .content, using: TripLiveActivityAttributes.preview) {
  TripLiveActivity()
} contentStates: {
  TripState.preview()
  TripState.preview(
    title: "Fra Hundremeterskogen Bussterminal øst",
    lineNumber: "311",
    lineName: "Sjetnemarka via Kroppanm. - Okstad",
    minutesFromNow: 12
  )
  TripState.preview(mode: .rail, minutesFromNow: 0)
  TripState.preview(mode: .walk, title: "Neste stopp")
  TripState.preview(mode: .water)
}
