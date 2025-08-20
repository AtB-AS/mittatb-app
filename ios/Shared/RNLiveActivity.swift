import ActivityKit
import Foundation
import React
import WidgetKit

@objc(RNLiveActivity)
class RNLiveActivity: RCTEventEmitter {

    private var hasListeners = false
    private var activeActivities: [String: Any] = [:]

    override func supportedEvents() -> [String]! {
        return ["LiveActivityEvent"]
    }

    override func startObserving() {
        hasListeners = true
        if #available(iOS 16.2, *) {
            setupActivityObservers()
        }
    }

    override func stopObserving() {
        hasListeners = false
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    // MARK: - Activity Dictionary Helpers

    @available(iOS 16.2, *)
    private func getTypedActivities() -> [String: Activity<LiveActivityAttributes>] {
        return activeActivities.compactMapValues { $0 as? Activity<LiveActivityAttributes> }
    }

    @available(iOS 16.2, *)
    private func findActivity(by id: String) -> Activity<LiveActivityAttributes>? {
        // First check our local storage
        if let activity = getTypedActivities()[id] {
            #if DEBUG
                print("🔵 Found activity in local storage: \(id)")
            #endif
            return activity
        }

        // If not found locally, check system activities
        let systemActivity = Activity<LiveActivityAttributes>.activities.first { $0.id == id }

        #if DEBUG
            print("🔍 Searching for activity ID: \(id)")
            print("🔍 Local activities: \(getTypedActivities().keys)")
            print(
                "🔍 System activities: \(Activity<LiveActivityAttributes>.activities.map { $0.id })")
            if let systemActivity = systemActivity {
                print("🟡 Found activity in system: \(id)")
                // Re-store it locally
                storeActivity(systemActivity, forKey: id)
            } else {
                print("🔴 Activity not found anywhere: \(id)")
            }
        #endif

        return systemActivity
    }

    @available(iOS 16.2, *)
    private func storeActivity(_ activity: Activity<LiveActivityAttributes>, forKey key: String) {
        activeActivities[key] = activity
    }

    @available(iOS 16.2, *)
    private func removeActivity(forKey key: String) {
        activeActivities.removeValue(forKey: key)
    }

    // MARK: - Public Methods

    @objc
    func isSupported(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        #if canImport(ActivityKit)
            if #available(iOS 16.2, *) {
                let authInfo = ActivityAuthorizationInfo()
                let isEnabled = authInfo.areActivitiesEnabled

                #if DEBUG
                    print("🔴 Live Activities Debug:")
                    print("  - iOS version check: ✅ (16.2+)")
                    print("  - areActivitiesEnabled: \(isEnabled)")
                    print("  - ActivityAuthorizationInfo: \(authInfo)")
                #endif

                resolve(isEnabled)
            } else {
                #if DEBUG
                    print("🔴 Live Activities: iOS version too old (need 16.2+)")
                #endif
                resolve(false)
            }
        #else
            #if DEBUG
                print("🔴 Live Activities: ActivityKit not available")
            #endif
            resolve(false)
        #endif
    }

    @objc
    func getCapabilities(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        #if canImport(ActivityKit)
            if #available(iOS 16.2, *) {
                let capabilities: [String: Any] = [
                    "isSupported": ActivityAuthorizationInfo().areActivitiesEnabled,
                    "supportsDynamicIsland": UIDevice.current.userInterfaceIdiom == .phone,
                    "supportsLockScreen": true,
                    "supportsPushUpdates": true,
                    "maxActiveActivities": 8,  // iOS limit
                ]
                resolve(capabilities)
            } else {
                let capabilities: [String: Any] = [
                    "isSupported": false,
                    "supportsDynamicIsland": false,
                    "supportsLockScreen": false,
                    "supportsPushUpdates": false,
                    "maxActiveActivities": 0,
                ]
                resolve(capabilities)
            }
        #else
            let capabilities: [String: Any] = [
                "isSupported": false,
                "supportsDynamicIsland": false,
                "supportsLockScreen": false,
                "supportsPushUpdates": false,
                "maxActiveActivities": 0,
            ]
            resolve(capabilities)
        #endif
    }

    @objc
    func requestPermissions(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        #if canImport(ActivityKit)
            if #available(iOS 16.2, *) {
                // Live Activities don't require explicit permission request
                // Permission is handled automatically when creating the first activity
                resolve(ActivityAuthorizationInfo().areActivitiesEnabled)
            } else {
                resolve(false)
            }
        #else
            resolve(false)
        #endif
    }

    @objc
    func debugLiveActivities(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        var debugInfo: [String: Any] = [:]

        #if canImport(ActivityKit)
            if #available(iOS 16.2, *) {
                let authInfo = ActivityAuthorizationInfo()

                debugInfo = [
                    "iosVersionSupported": true,
                    "currentIOSVersion": UIDevice.current.systemVersion,
                    "areActivitiesEnabled": authInfo.areActivitiesEnabled,
                    "activityAuthorizationInfo": "\(authInfo)",
                    "deviceModel": UIDevice.current.model,
                    "deviceName": UIDevice.current.name,
                    "userInterfaceIdiom": UIDevice.current.userInterfaceIdiom.rawValue,
                    "isPhysicalDevice": TARGET_OS_SIMULATOR == 0,
                    "activityKitAvailable": true,
                ]
            } else {
                debugInfo = [
                    "iosVersionSupported": false,
                    "currentIOSVersion": UIDevice.current.systemVersion,
                    "minimumRequired": "16.2",
                    "activityKitAvailable": true,
                ]
            }
        #else
            debugInfo = [
                "iosVersionSupported": false,
                "currentIOSVersion": UIDevice.current.systemVersion,
                "minimumRequired": "16.2",
                "activityKitAvailable": false,
                "error": "ActivityKit framework not available",
            ]
        #endif

        resolve(debugInfo)
    }

    @objc
    func createActivity(
        _ attributes: [String: Any],
        contentState: [String: Any],
        config: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        guard #available(iOS 16.2, *) else {
            reject("NOT_SUPPORTED", "Live Activities require iOS 16.2 or later", nil)
            return
        }

        do {
            let activityAttributes = try parseAttributes(from: attributes)
            let initialContentState = try parseContentState(from: contentState)
            let activityConfig = parseConfig(from: config)

            let activityContent = ActivityContent(
                state: initialContentState,
                staleDate: activityConfig.staleDate
            )

            let activity = try Activity<LiveActivityAttributes>.request(
                attributes: activityAttributes,
                content: activityContent,
                pushType: activityConfig.enablePushUpdates ? .token : nil
            )

            // Store the activity reference
            storeActivity(activity, forKey: activity.id)

            #if DEBUG
                print("🟢 Created Live Activity: \(activity.id)")
                print("🟢 Activity state: \(activity.activityState)")
                print("🟢 Total stored activities: \(getTypedActivities().count)")
            #endif

            let result: [String: Any] = [
                "id": activity.id,
                "pushToken": activity.pushToken?.map { String(format: "%02x", $0) }.joined() ?? "",
            ]

            // Send creation event
            sendEvent(type: "created", activityId: activity.id, activity: activity)

            resolve(result)

        } catch {
            reject(
                "CREATE_FAILED", "Failed to create Live Activity: \(error.localizedDescription)",
                error)
        }
    }

    @objc
    func updateActivity(
        _ activityId: String,
        contentState: [String: Any],
        config: [String: Any]?,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        guard #available(iOS 16.2, *) else {
            reject("NOT_SUPPORTED", "Live Activities require iOS 16.2 or later", nil)
            return
        }

        guard let activity = findActivity(by: activityId) else {
            reject("ACTIVITY_NOT_FOUND", "Activity with ID \(activityId) not found", nil)
            return
        }

        do {
            let newContentState = try parseContentState(from: contentState)
            let activityConfig = parseConfig(from: config ?? [:])

            let activityContent = ActivityContent(
                state: newContentState,
                staleDate: activityConfig.staleDate
            )

            Task {
                await activity.update(activityContent)

                // Send update event
                DispatchQueue.main.async {
                    self.sendEvent(type: "updated", activityId: activityId, activity: activity)
                }
            }

            resolve(nil)

        } catch {
            reject(
                "UPDATE_FAILED", "Failed to update Live Activity: \(error.localizedDescription)",
                error)
        }
    }

    @objc
    func endActivity(
        _ activityId: String,
        dismissalPolicy: String?,
        finalContentState: [String: Any]?,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        guard #available(iOS 16.2, *) else {
            reject("NOT_SUPPORTED", "Live Activities require iOS 16.2 or later", nil)
            return
        }

        guard let activity = findActivity(by: activityId) else {
            reject("ACTIVITY_NOT_FOUND", "Activity with ID \(activityId) not found", nil)
            return
        }

        do {
            let policy = parseDismissalPolicy(from: dismissalPolicy)

            Task {
                if let finalState = finalContentState {
                    let finalContentStateObj = try self.parseContentState(from: finalState)
                    let finalContent = ActivityContent(state: finalContentStateObj, staleDate: nil)
                    await activity.end(finalContent, dismissalPolicy: policy)
                } else {
                    await activity.end(nil, dismissalPolicy: policy)
                }

                // Remove from active activities
                DispatchQueue.main.async {
                    self.removeActivity(forKey: activityId)
                    self.sendEvent(type: "ended", activityId: activityId, activity: activity)
                }
            }

            resolve(nil)

        } catch {
            reject(
                "END_FAILED", "Failed to end Live Activity: \(error.localizedDescription)", error)
        }
    }

    @objc
    func getAllActiveActivities(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        guard #available(iOS 16.2, *) else {
            resolve([])
            return
        }

        let activeActivitiesData = Activity<LiveActivityAttributes>.activities.map { activity in
            return [
                "id": activity.id,
                "status": activityStateToString(activity.activityState),
            ]
        }

        resolve(activeActivitiesData)
    }

    // MARK: - Private Helper Methods

    @available(iOS 16.2, *)
    private func setupActivityObservers() {
        guard #available(iOS 16.2, *) else { return }

        // Monitor all activities for state changes
        Task {
            for await activity in Activity<LiveActivityAttributes>.activityUpdates {
                handleActivityStateChange(activity)
            }
        }
    }

    @available(iOS 16.2, *)
    private func handleActivityStateChange(_ activity: Activity<LiveActivityAttributes>) {
        guard hasListeners else { return }

        switch activity.activityState {
        case .active:
            sendEvent(type: "updated", activityId: activity.id, activity: activity)
        case .ended:
            removeActivity(forKey: activity.id)
            sendEvent(type: "ended", activityId: activity.id, activity: activity)
        case .dismissed:
            removeActivity(forKey: activity.id)
            sendEvent(type: "dismissed", activityId: activity.id, activity: activity)
        case .stale:
            sendEvent(type: "updated", activityId: activity.id, activity: activity)
        @unknown default:
            break
        }
    }

    @available(iOS 16.2, *)
    private func sendEvent(
        type: String, activityId: String, activity: Activity<LiveActivityAttributes>? = nil
    ) {
        guard hasListeners else { return }

        var eventData: [String: Any] = [
            "type": type,
            "activityId": activityId,
            "timestamp": Date().timeIntervalSince1970 * 1000,
        ]

        if let activity = activity {
            eventData["activity"] = [
                "id": activity.id,
                "status": activityStateToString(activity.activityState),
                "pushToken": activity.pushToken?.map { String(format: "%02x", $0) }.joined() ?? "",
            ]
        }

        sendEvent(withName: "LiveActivityEvent", body: eventData)
    }

    @available(iOS 16.2, *)
    private func parseAttributes(from dict: [String: Any]) throws -> LiveActivityAttributes {
        #if DEBUG
            print("🔍 Parsing attributes from dict: \(dict)")
        #endif

        guard let typeString = dict["type"] as? String,
            let id = dict["id"] as? String,
            let title = dict["title"] as? String,
            let activityName = dict["activityName"] as? String
        else {
            #if DEBUG
                print("🔴 Missing required attributes")
                print("  - type: \(dict["type"] ?? "missing")")
                print("  - id: \(dict["id"] ?? "missing")")
                print("  - title: \(dict["title"] ?? "missing")")
                print("  - activityName: \(dict["activityName"] ?? "missing")")
            #endif
            throw NSError(
                domain: "RNLiveActivity", code: 1,
                userInfo: [NSLocalizedDescriptionKey: "Missing required attributes"])
        }

        // Convert string type to enum
        let activityType: ActivityType
        switch typeString.lowercased() {
        case "departure":
            activityType = .departure
        case "journey":
            activityType = .journey
        case "reminder":
            activityType = .reminder
        case "alert":
            activityType = .alert
        default:
            #if DEBUG
                print("🟡 Unknown activity type '\(typeString)', defaulting to departure")
            #endif
            activityType = .departure  // Default fallback
        }

        #if DEBUG
            print("🟢 Parsed attributes:")
            print("  - type: \(activityType)")
            print("  - id: \(id)")
            print("  - title: \(title)")
            print("  - description: \(dict["description"] as? String ?? "nil")")
        #endif

        return LiveActivityAttributes(
            title: title,
            description: dict["description"] as? String,
            type: activityType,
            id: id,
            activityName: activityName,
            deepLink: dict["deepLink"] as? String
        )
    }

    @available(iOS 16.2, *)
    private func parseContentState(from dict: [String: Any]) throws
        -> LiveActivityAttributes.ContentState
    {
        #if DEBUG
            print("🔍 Parsing content state from dict: \(dict)")
        #endif

        // Helper function to parse ISO 8601 dates with fractional seconds
        func parseISODate(from string: String) -> Date? {
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return formatter.date(from: string)
        }

        // Parse status
        let statusString = dict["status"] as? String ?? "active"
        let status: ActivityStatus
        switch statusString.lowercased() {
        case "delayed":
            status = .delayed
        case "cancelled":
            status = .cancelled
        case "completed":
            status = .completed
        default:
            status = .active
        }

        // Parse action button
        var actionButton: ActionButton?
        if let buttonDict = dict["actionButton"] as? [String: Any],
            let title = buttonDict["title"] as? String,
            let action = buttonDict["action"] as? String
        {
            actionButton = ActionButton(title: title, action: action)
        }

        // Parse times - expect ISO 8601 strings
        var scheduledTime: Date?
        if let dateString = dict["scheduledTime"] as? String, !dateString.isEmpty {
            scheduledTime = parseISODate(from: dateString)
            #if DEBUG
                if scheduledTime != nil {
                    print("🕒 Parsed scheduledTime: \(dateString) -> \(scheduledTime!)")
                } else {
                    print("🕒 Failed to parse scheduledTime: \(dateString)")
                }
            #endif
        } else {
            #if DEBUG
                if let rawTime = dict["scheduledTime"] {
                    print(
                        "🕒 Invalid scheduledTime format. Expected ISO string, got: \(rawTime) (type: \(type(of: rawTime)))"
                    )
                } else {
                    print("🕒 No scheduledTime provided")
                }
            #endif
        }

        var startTime: Date?
        if let dateString = dict["startTime"] as? String, !dateString.isEmpty {
            startTime = parseISODate(from: dateString)
        }

        var reminderTime: Date?
        if let dateString = dict["reminderTime"] as? String, !dateString.isEmpty {
            reminderTime = parseISODate(from: dateString)
        }

        // Parse delay
        let delay = dict["delay"] as? Int

        // Parse custom data (convert [String: Any] to [String: String])
        var customData: [String: String] = [:]
        if let customDict = dict["customData"] as? [String: Any] {
            for (key, value) in customDict {
                customData[key] = "\(value)"
            }
        }

        #if DEBUG
            print("🟢 Parsed content state:")
            print("  - status: \(status)")
            print("  - scheduledTime: \(scheduledTime?.description ?? "nil")")
            print("  - delay: \(delay?.description ?? "nil")")
            print("  - customData keys: \(customData.keys)")
        #endif

        return LiveActivityAttributes.ContentState(
            status: status,
            actionButton: actionButton,
            scheduledTime: scheduledTime,
            startTime: startTime,
            reminderTime: reminderTime,
            delay: delay,
            customData: customData
        )
    }

    private func parseConfig(from dict: [String: Any]) -> ActivityConfig {
        let enablePushUpdates = dict["enablePushUpdates"] as? Bool ?? false
        let relevanceScore = dict["relevanceScore"] as? Double ?? 0.5

        var staleDate: Date?
        if let staleDateTimestamp = dict["staleDate"] as? Double {
            staleDate = Date(timeIntervalSince1970: staleDateTimestamp / 1000)
        }

        return ActivityConfig(
            enablePushUpdates: enablePushUpdates,
            relevanceScore: relevanceScore,
            staleDate: staleDate
        )
    }

    @available(iOS 16.1, *)
    private func parseDismissalPolicy(from string: String?) -> ActivityUIDismissalPolicy {
        switch string {
        case "immediate":
            return .immediate
        case "after-date":
            return .default
        default:
            return .default
        }
    }

    @available(iOS 16.1, *)
    private func activityStateToString(_ state: ActivityState) -> String {
        switch state {
        case .active:
            return "active"
        case .ended:
            return "ended"
        case .dismissed:
            return "dismissed"
        case .stale:
            return "stale"
        @unknown default:
            return "unknown"
        }
    }
}

// MARK: - Supporting Structures

struct ActivityConfig {
    let enablePushUpdates: Bool
    let relevanceScore: Double
    let staleDate: Date?
}
