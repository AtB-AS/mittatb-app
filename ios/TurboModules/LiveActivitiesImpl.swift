import ActivityKit
import Foundation

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

  @objc func startActivity(
    _ attributesJson: String,
    contentStateJson: String,
    resolve: @escaping (Any?) -> Void,
    reject: @escaping (String, String) -> Void
  ) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard ActivityAuthorizationInfo().areActivitiesEnabled else {
      reject(
        "E_LA_DISABLED",
        "Live Activities are disabled. Enable them for this app in Settings.")
      return
    }
    do {
      let attributes = try decode(TransitActivityAttributes.self, from: attributesJson)
      let state = try decode(TransitActivityAttributes.ContentState.self, from: contentStateJson)
      let content = ActivityContent(state: state, staleDate: nil)
      let activity = try Activity.request(
        attributes: attributes, content: content, pushType: .token)
      observe(activity)
      resolve(activity.id)
    } catch {
      reject("E_LA_START", error.localizedDescription)
    }
  }

  @objc func updateActivity(
    _ activityId: String,
    contentStateJson: String,
    resolve: @escaping (Any?) -> Void,
    reject: @escaping (String, String) -> Void
  ) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard
      let activity = Activity<TransitActivityAttributes>.activities
        .first(where: { $0.id == activityId })
    else {
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

  @objc func endActivity(
    _ activityId: String,
    dismissImmediately: Bool,
    resolve: @escaping (Any?) -> Void,
    reject: @escaping (String, String) -> Void
  ) {
    guard #available(iOS 16.2, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 16.2 or newer.")
      return
    }
    guard
      let activity = Activity<TransitActivityAttributes>.activities
        .first(where: { $0.id == activityId })
    else {
      reject("E_LA_NOT_FOUND", "No active Live Activity with id \(activityId).")
      return
    }
    Task {
      let policy: ActivityUIDismissalPolicy = dismissImmediately ? .immediate : .default
      await activity.end(
        ActivityContent(state: activity.content.state, staleDate: nil),
        dismissalPolicy: policy)
      resolve(nil)
    }
  }

  @objc func endAllActivities(
    _ resolve: @escaping (Any?) -> Void,
    reject: @escaping (String, String) -> Void
  ) {
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

  // MARK: Debug observation

  /// PoC: log everything ActivityKit reports about this activity — push token (to
  /// send test pushes by hand), each content-state it applies, and lifecycle
  /// transitions. Only runs while the app process is alive; the widget extension
  /// logs on every render, which is what covers pushes to a suspended app.
  ///
  /// The real implementation must send the token — and every rotation — to a backend.
  @available(iOS 16.2, *)
  private func observe(_ activity: Activity<TransitActivityAttributes>) {
    NSLog(
      "[LiveActivity] started id=%@ state=%@", activity.id, activity.content.state.debugJson)
    Task {
      // Print if there is no token
      if activity.pushToken == nil {
        NSLog("[LiveActivity] nil push token")
      }
      for await tokenData in activity.pushTokenUpdates {
        let hex = tokenData.map { String(format: "%02x", $0) }.joined()
        NSLog("[LiveActivity] push token: %@", hex)
      }
    }
    Task {
      for await content in activity.contentUpdates {
        NSLog("[LiveActivity] content update: %@", content.state.debugJson)
      }
    }
    Task {
      for await state in activity.activityStateUpdates {
        NSLog("[LiveActivity] activity state: %@", String(describing: state))
      }
    }
  }

  // MARK: JSON decoding

  // `ContentState` has no `Date` fields (`eventTime` is unix seconds), so no
  // `dateDecodingStrategy` is needed here.
  private let decoder = JSONDecoder()

  private func decode<T: Decodable>(_ type: T.Type, from json: String) throws -> T {
    guard let data = json.data(using: .utf8) else {
      throw NSError(
        domain: LiveActivitiesImpl.errorDomain, code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Invalid JSON string."])
    }
    return try decoder.decode(type, from: data)
  }
}
