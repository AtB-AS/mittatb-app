import Foundation

#if canImport(ActivityKit)
  import ActivityKit

  // MARK: - Live Activity Data Structures for Main App
  // Simple data structures for Live Activities without widget extension complexity

  @available(iOS 16.2, *)
  struct LiveActivityAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
      let status: ActivityStatus
      let actionButton: ActionButton?
      let scheduledTime: Date?
      let startTime: Date?
      let reminderTime: Date?
      let delay: Int?
      let customData: [String: String]

      init(
        status: ActivityStatus = .active,
        actionButton: ActionButton? = nil,
        scheduledTime: Date? = nil,
        startTime: Date? = nil,
        reminderTime: Date? = nil,
        delay: Int? = nil,
        customData: [String: String] = [:]
      ) {
        self.status = status
        self.actionButton = actionButton
        self.scheduledTime = scheduledTime
        self.startTime = startTime
        self.reminderTime = reminderTime
        self.delay = delay
        self.customData = customData
      }
    }

    let title: String
    let description: String?
    let type: ActivityType
    let id: String
    let activityName: String
    let deepLink: String?

    init(
      title: String,
      description: String? = nil,
      type: ActivityType,
      id: String,
      activityName: String,
      deepLink: String? = nil
    ) {
      self.title = title
      self.description = description
      self.type = type
      self.id = id
      self.activityName = activityName
      self.deepLink = deepLink
    }
  }

  @available(iOS 16.2, *)
  enum ActivityType: String, Codable, CaseIterable {
    case departure = "departure"
    case journey = "journey"
    case reminder = "reminder"
    case alert = "alert"
  }

  @available(iOS 16.2, *)
  enum ActivityStatus: String, Codable, CaseIterable {
    case active = "active"
    case delayed = "delayed"
    case cancelled = "cancelled"
    case completed = "completed"
  }

  @available(iOS 16.2, *)
  struct ActionButton: Codable, Hashable {
    let title: String
    let action: String

    init(title: String, action: String) {
      self.title = title
      self.action = action
    }
  }

#endif
