import Foundation
import ActivityKit

/// Shared model for the transit Live Activity.
///
/// IMPORTANT: this file must be a member of BOTH the `app` target (so the native
/// module can call `Activity<TransitActivityAttributes>.request`) and the
/// `liveActivity` widget-extension target (so the SwiftUI views can render it).
/// If it is only in the extension, `Activity.request` succeeds but nothing shows.
///
/// The lock screen renders two rows:
///   row 1: illustration + `title` + `subtitle`   (e.g. "6 stopp igjen" / "Du skal av på Nidarosdomen")
///   row 2: line badge + "`lineNumber` `lineName`" + `footnote` + time  (e.g. "3 Lohove" / "Ankommer Nidarosdomen 08:30")
struct TransitActivityAttributes: ActivityAttributes {
  /// Where the whole journey ends (kept for future use / deep links).
  var toName: String
  /// Brand/operator label, e.g. "AtB".
  var brandLabel: String
  /// Stable id for the underlying trip (not the ActivityKit activity id).
  var tripId: String

  struct ContentState: Codable, Hashable {
    /// Transport mode. Drives the badge/icon.
    enum Mode: String, Codable, Hashable {
      case bus, tram, rail, water, walk
    }

    var mode: Mode

    /// Public line number shown in the badge + row-2 title, e.g. "3".
    var lineNumber: String
    /// Line headsign / destination, e.g. "Lohove".
    var lineName: String

    /// Row-1 bold line, e.g. "6 stopp igjen".
    var title: String
    /// Row-1 secondary line, e.g. "Du skal av på Nidarosdomen".
    var subtitle: String
    /// Row-2 secondary prefix, e.g. "Ankommer Nidarosdomen" (time is appended).
    var footnote: String

    /// The relevant time (arrival/departure) for the clock/countdown.
    var eventTime: Date
    /// true → render `eventTime` as a live countdown; false → absolute clock time.
    var eventIsCountdown: Bool
  }
}
