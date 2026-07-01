import Foundation
import ActivityKit

/// Shared model for the transit Live Activity.
///
/// IMPORTANT: this file must be a member of BOTH the `app` target (so the native
/// module can call `Activity<TransitActivityAttributes>.request`) and the
/// `liveActivity` widget-extension target (so the SwiftUI views can render it).
/// If it is only in the extension, `Activity.request` succeeds but nothing shows.
///
/// Attributes = static data, fixed for the lifetime of the activity.
/// ContentState = dynamic data, updated as the trip progresses.
struct TransitActivityAttributes: ActivityAttributes {
  /// Where the whole journey ends, e.g. "Festplassen". Used for the header
  /// ("Reisen din til Festplassen").
  var toName: String
  /// Brand/operator label shown top-right, e.g. "AtB".
  var brandLabel: String
  /// Stable id for the underlying trip (not the ActivityKit activity id).
  var tripId: String

  struct ContentState: Codable, Hashable {
    /// Which step of the trip we are in. Drives which lock-screen layout is shown.
    enum Phase: String, Codable, Hashable {
      case walking // walk to the boarding stop
      case waiting // at the stop, waiting for departure
      case onboard // on the vehicle, heading to the alight stop
      case getOff  // alight now / next stop is yours
    }

    /// Transport mode. Drives icon + accent color.
    enum Mode: String, Codable, Hashable {
      case bus
      case tram
      case rail
      case water
      case walk
    }

    var phase: Phase
    var mode: Mode

    /// Public line number, e.g. "42" / "459". Empty for walk-only steps.
    var lineNumber: String
    /// Line headsign / destination, e.g. "Sandnes".
    var lineName: String

    /// The stop we depart from / board at, e.g. "Hammarslandsdalen".
    var fromStopName: String
    /// The stop the current instruction points at (walk-to / alight-at),
    /// e.g. "Koppholen" / "Fiskepiren" / "Prinsens gate".
    var toStopName: String

    /// Primary instruction, localized, e.g. "Gå av på" / "Gå til" / "Ta buss".
    var headline: String
    /// Secondary label, e.g. "Neste stopp" / "Avgang".
    var secondaryText: String

    /// The relevant time (departure or arrival) used for the clock/countdown.
    var eventTime: Date
    /// true → render `eventTime` as a live countdown; false → absolute clock time.
    var eventIsCountdown: Bool

    /// Emphasis / alert state, e.g. bus is stopping at your stop now.
    var alert: Bool
    /// Badge text shown when `alert` is true, e.g. "STOPPER".
    var alertText: String
  }
}
