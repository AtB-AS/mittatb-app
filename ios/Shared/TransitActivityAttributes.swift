import ActivityKit
import Foundation

struct TransitActivityAttributes: ActivityAttributes {

  var tripId: String

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
  }
}
