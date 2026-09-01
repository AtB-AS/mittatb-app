import ActivityKit
import Foundation
import SwiftUI

/// Shared model for the transit Live Activity.
///
/// IMPORTANT: this file — and `TransportMode.swift`, which the state references —
/// must be a member of BOTH the `app` target (so the native module can call
/// `Activity<TransitActivityAttributes>.request`) and the `liveActivity`
/// widget-extension target (so the SwiftUI views can render it). If they are only
/// in the extension, `Activity.request` succeeds but nothing shows.
///
/// Every field is rendered by at least one of the three presentations
/// (`TransitLockScreenView`, `TransitSmartStackView`, `TransitDynamicIsland`).
/// There is no static per-trip data yet, so the attributes themselves are empty.
struct TransitActivityAttributes: ActivityAttributes {

  struct ContentState: Codable, Hashable {

    var mode: TransportMode

    /// Public line number shown in the badge, e.g. "3".
    var lineNumber: String
    /// Line headsign / destination, e.g. "Lohove".
    var lineName: String

    /// The instruction line, e.g. "6 stopp igjen".
    var title: String

    /// The relevant time (arrival/departure) shown on the clock, as unix seconds.
    var eventTime: Int

    var eventDate: Date { Date(timeIntervalSince1970: TimeInterval(eventTime)) }

    /// Absolute clock time, e.g. "08:30".
    var timeSuffix: Text {
      Text(eventDate, style: .time).monospacedDigit()
    }
  }
}

extension TransitActivityAttributes.ContentState {
  /// PoC debug aid: JSON dump for `NSLog`. Logs the *decoded* state — the raw APNs
  /// payload is never handed to the app, so a payload ActivityKit fails to decode
  /// shows up only in the system log (`liveactivitiesd`), never here.
  var debugJson: String {
    guard let data = try? JSONEncoder().encode(self),
      let json = String(data: data, encoding: .utf8)
    else { return "<unencodable>" }
    return json
  }
}
