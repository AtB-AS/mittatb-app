import ActivityKit
import Foundation

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

    /// PoC: free-text line shown on the lock screen when present, used to verify
    /// APNs push updates end-to-end. Optional, so payloads may omit it.
    var pushMessage: String?

    /// The relevant time (arrival/departure) for the clock/countdown.
    ///
    /// ISO-8601 string on the wire — see `init(from:)`.
    var eventTime: Date
    /// true → render `eventTime` as a live countdown; false → absolute clock time.
    var eventIsCountdown: Bool

    enum CodingKeys: String, CodingKey {
      case mode, lineNumber, lineName, title, subtitle, footnote, pushMessage
      case eventTime, eventIsCountdown
    }

    /// `eventTime` is an ISO-8601 string on the wire
    ///
    /// This must stay hand-written, and paired with `encode(to:)`. `Date` is
    /// otherwise coded via the *coder's* `dateDecodingStrategy`, which we don't
    /// control for either of the two coders that touch this type: ActivityKit's
    /// internal one, and the one decoding pushed `content-state`. Both default to
    /// numeric seconds since 2001-01-01. Reading and writing the string ourselves
    /// makes the format ours and keeps the round-trip lossless.
    init(from decoder: Decoder) throws {
      let container = try decoder.container(keyedBy: CodingKeys.self)
      mode = try container.decode(Mode.self, forKey: .mode)
      lineNumber = try container.decode(String.self, forKey: .lineNumber)
      lineName = try container.decode(String.self, forKey: .lineName)
      title = try container.decode(String.self, forKey: .title)
      subtitle = try container.decode(String.self, forKey: .subtitle)
      footnote = try container.decode(String.self, forKey: .footnote)
      pushMessage = try container.decodeIfPresent(String.self, forKey: .pushMessage)
      eventIsCountdown = try container.decode(Bool.self, forKey: .eventIsCountdown)

      let raw = try container.decode(String.self, forKey: .eventTime)
      guard let date = TransitActivityAttributes.parseISO8601(raw) else {
        throw DecodingError.dataCorruptedError(
          forKey: .eventTime, in: container,
          debugDescription: "eventTime must be an ISO-8601 date string: \(raw)")
      }
      eventTime = date
    }

    func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      try container.encode(mode, forKey: .mode)
      try container.encode(lineNumber, forKey: .lineNumber)
      try container.encode(lineName, forKey: .lineName)
      try container.encode(title, forKey: .title)
      try container.encode(subtitle, forKey: .subtitle)
      try container.encode(footnote, forKey: .footnote)
      try container.encodeIfPresent(pushMessage, forKey: .pushMessage)
      try container.encode(eventIsCountdown, forKey: .eventIsCountdown)
      try container.encode(
        TransitActivityAttributes.iso8601String(eventTime), forKey: .eventTime)
    }
  }

  /// `.iso8601` rejects fractional seconds, which `Date.toISOString()` includes,
  /// so try both forms.
  static func parseISO8601(_ raw: String) -> Date? {
    iso8601WithFractional.date(from: raw) ?? iso8601Plain.date(from: raw)
  }

  /// Written with fractional seconds so an encode→decode round trip keeps
  /// millisecond precision.
  static func iso8601String(_ date: Date) -> String {
    iso8601WithFractional.string(from: date)
  }

  private static let iso8601WithFractional: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return f
  }()

  private static let iso8601Plain: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime]
    return f
  }()
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
