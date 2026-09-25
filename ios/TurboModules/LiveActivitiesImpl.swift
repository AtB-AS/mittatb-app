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
///
/// Gated on **iOS 18**, not ActivityKit's own 16.2: the `liveActivity` extension
/// that renders the activity deploys to 18.0 (it uses `activityFamily` /
/// `supplementalActivityFamilies` for the watch Smart Stack). Below 18 the app
/// still runs, it just has no Live Activity — starting one there would succeed
/// and then render nothing.
@objc(LiveActivitiesImpl)
class LiveActivitiesImpl: NSObject {
  private static let errorDomain = "LiveActivitiesError"

  // MARK: Event callbacks

  @objc var onPushTokenUpdate: ((NSDictionary) -> Void)?

  @objc var onActivityEnded: ((NSDictionary) -> Void)?

  // MARK: Public API

  @objc func startObservingActivities() {
    guard #available(iOS 18.0, *) else { return }

    for activity in Activity<TransitActivityAttributes>.activities {
      observe(activity)
    }
    Task {
      for await activity in Activity<TransitActivityAttributes>.activityUpdates {
        observe(activity)
      }
    }
  }

  @objc func getActiveActivities(
    _ resolve: @escaping (Any?) -> Void,
    reject: @escaping (String, String) -> Void
  ) {
    guard #available(iOS 18.0, *) else {
      resolve([])
      return
    }
    resolve(
      Activity<TransitActivityAttributes>.activities.map { activity in
        payload(for: activity, apnsToken: activity.pushToken.map(hex))
      })
  }

  @objc func areActivitiesEnabled() -> Bool {
    if #available(iOS 18.0, *) {
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
    guard #available(iOS 18.0, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 18 or newer.")
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
    guard #available(iOS 18.0, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 18 or newer.")
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
    guard #available(iOS 18.0, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 18 or newer.")
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
    guard #available(iOS 18.0, *) else {
      reject("E_LA_UNSUPPORTED", "Live Activities require iOS 18 or newer.")
      return
    }
    Task {
      for activity in Activity<TransitActivityAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
      resolve(nil)
    }
  }

  // MARK: Observation

  @available(iOS 18.0, *)
  private func observe(_ activity: Activity<TransitActivityAttributes>) {
    guard beginObserving(activity.id) else { return }

    NSLog(
      "[LiveActivity] observing id=%@ state=%@", activity.id, activity.content.state.debugJson)
    Task {
      for await tokenData in activity.pushTokenUpdates {
        let token = hex(tokenData)
        rememberToken(token, for: activity.id)
        NSLog("[LiveActivity] push token: %@", token)
        onPushTokenUpdate?(payload(for: activity, apnsToken: token))
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
        switch state {
        case .ended, .dismissed:
          // `ended` is usually followed by `dismissed`. This makes sure only
          // the first of them emits.
          let finished = finishObserving(activity.id)
          if finished.wasObserved {
            onActivityEnded?(payload(for: activity, apnsToken: finished.apnsToken))
          }
        default:
          break
        }
      }
    }
  }

  private let observationLock = NSLock()
  private var observedActivityIds: Set<String> = []
  private var apnsTokens: [String: String] = [:]

  private func beginObserving(_ activityId: String) -> Bool {
    observationLock.lock()
    defer { observationLock.unlock() }
    return observedActivityIds.insert(activityId).inserted
  }

  private func rememberToken(_ apnsToken: String, for activityId: String) {
    observationLock.lock()
    defer { observationLock.unlock() }
    apnsTokens[activityId] = apnsToken
  }

  private func finishObserving(_ activityId: String) -> (wasObserved: Bool, apnsToken: String?) {
    observationLock.lock()
    defer { observationLock.unlock() }
    return (
      observedActivityIds.remove(activityId) != nil,
      apnsTokens.removeValue(forKey: activityId)
    )
  }

  @available(iOS 18.0, *)
  private func payload(
    for activity: Activity<TransitActivityAttributes>,
    apnsToken: String?
  ) -> NSDictionary {
    let payload = NSMutableDictionary()
    payload["activityId"] = activity.id
    payload["tripId"] = activity.attributes.tripId
    if let apnsToken {
      payload["apnsToken"] = apnsToken
    }
    return payload
  }

  private func hex(_ data: Data) -> String {
    data.map { String(format: "%02x", $0) }.joined()
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
