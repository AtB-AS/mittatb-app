import Foundation
import ActivityKit

/// Swift implementation of the Live Activities native module.
///
/// ActivityKit is Swift-only, so all logic lives here; `RCTLiveActivities.mm`
/// is a thin TurboModule bridge on top (mirrors the ApplePayHandler pattern).
///
/// The JS side passes the ActivityKit attributes and content-state as JSON
/// strings, which we decode into `TransitActivityAttributes` here. That keeps the
/// TurboModule spec trivial (only strings/bools cross the bridge) and lets the
/// real implementation evolve the payload shape without codegen churn.
@objc(LiveActivitiesImpl)
class LiveActivitiesImpl: NSObject {
  private static let errorDomain = "LiveActivitiesError"

  // MARK: Public API

  @objc func areActivitiesEnabled() -> Bool {
    if #available(iOS 16.2, *) {
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }
    return false
  }

  @objc func startActivity(_ attributesJson: String,
                           contentStateJson: String,
                           resolve: @escaping (Any?) -> Void,
                           reject: @escaping (String, String) -> Void) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard ActivityAuthorizationInfo().areActivitiesEnabled else {
      reject("E_LA_DISABLED",
             "Live Activities are disabled. Enable them for this app in Settings.")
      return
    }
    do {
      let attributes = try decode(TransitActivityAttributes.self, from: attributesJson)
      let state = try decode(TransitActivityAttributes.ContentState.self, from: contentStateJson)
      let content = ActivityContent(state: state, staleDate: nil)
      let activity = try Activity.request(attributes: attributes, content: content, pushType: nil)
      resolve(activity.id)
    } catch {
      reject("E_LA_START", error.localizedDescription)
    }
  }

  @objc func updateActivity(_ activityId: String,
                            contentStateJson: String,
                            resolve: @escaping (Any?) -> Void,
                            reject: @escaping (String, String) -> Void) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard let activity = Activity<TransitActivityAttributes>.activities
      .first(where: { $0.id == activityId }) else {
      reject("E_LA_NOT_FOUND", "No active Live Activity with id \(activityId).")
      return
    }
    do {
      let state = try decode(TransitActivityAttributes.ContentState.self, from: contentStateJson)
      Task {
        await activity.update(ActivityContent(state: state, staleDate: nil))
        resolve(nil)
      }
    } catch {
      reject("E_LA_UPDATE", error.localizedDescription)
    }
  }

  @objc func endActivity(_ activityId: String,
                         dismissImmediately: Bool,
                         resolve: @escaping (Any?) -> Void,
                         reject: @escaping (String, String) -> Void) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard let activity = Activity<TransitActivityAttributes>.activities
      .first(where: { $0.id == activityId }) else {
      reject("E_LA_NOT_FOUND", "No active Live Activity with id \(activityId).")
      return
    }
    Task {
      let policy: ActivityUIDismissalPolicy = dismissImmediately ? .immediate : .default
      await activity.end(ActivityContent(state: activity.content.state, staleDate: nil),
                         dismissalPolicy: policy)
      resolve(nil)
    }
  }

  @objc func endAllActivities(_ resolve: @escaping (Any?) -> Void,
                              reject: @escaping (String, String) -> Void) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    Task {
      for activity in Activity<TransitActivityAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
      resolve(nil)
    }
  }

  // MARK: JSON decoding

  private lazy var decoder: JSONDecoder = {
    let d = JSONDecoder()
    // JS sends `new Date().toISOString()` which includes fractional seconds;
    // the default `.iso8601` strategy rejects those, so decode leniently.
    d.dateDecodingStrategy = .custom { decoder in
      let container = try decoder.singleValueContainer()
      let raw = try container.decode(String.self)
      if let date = LiveActivitiesImpl.iso8601WithFractional.date(from: raw)
        ?? LiveActivitiesImpl.iso8601Plain.date(from: raw) {
        return date
      }
      throw DecodingError.dataCorruptedError(in: container,
        debugDescription: "Invalid ISO8601 date: \(raw)")
    }
    return d
  }()

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

  private func decode<T: Decodable>(_ type: T.Type, from json: String) throws -> T {
    guard let data = json.data(using: .utf8) else {
      throw NSError(domain: LiveActivitiesImpl.errorDomain, code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "Invalid JSON string."])
    }
    return try decoder.decode(type, from: data)
  }
}
