# iOS Live Activities Configuration Guide

This guide documents the **simplified** Live Activities implementation that integrates with the existing widget extension.

## Implementation Overview

This implementation uses a **simplified approach** that:

- ✅ Uses the existing `departureWidget` extension (no separate Live Activities extension)
- ✅ Integrates Live Activities into the existing widget bundle
- ✅ Uses system default UI styling (no custom widget views complexity)
- ✅ Supports both regular widgets and Live Activities in one extension

## Prerequisites

- iOS 16.2+ deployment target (for Live Activities)
- Xcode 14.1+
- Developer account with appropriate provisioning profiles

## Required Capabilities

### 1. Add Push Notifications Capability

1. Open the iOS project in Xcode (`ios/atb.xcworkspace`)
2. Select the main app target (`atb`)
3. Go to **Signing & Capabilities** tab
4. Click **+ Capability** and add **Push Notifications**

> **Note**: Live Activities don't have a separate capability in Xcode. They use the Push Notifications capability for both local and remote Live Activities.

### 2. Update Main App Info.plist

Add the following to your main app's `Info.plist`:

```xml
<key>NSSupportsLiveActivities</key>
<true/>
```

### 3. Widget Extension Configuration

The existing `departureWidget` extension is updated to support Live Activities:

1. Select the `departureWidget` target
2. Go to **Signing & Capabilities**
3. Ensure **Push Notifications** capability is added (not a separate "Live Activities" capability)
4. Update the deployment target to iOS 16.2+

### 4. Update departureWidget.entitlements

The `departureWidget.entitlements` file includes:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.application-groups</key>
	<array>
		<string>$(APP_GROUP_NAME)</string>
	</array>
	<key>com.apple.developer.ActivityKit.pushtostart</key>
	<true/>
</dict>
</plist>
```

## Production Considerations

1. **Rate Limiting**: iOS limits the number of Live Activities per app (max 8 active)
2. **Battery Impact**: Live Activities consume battery, design accordingly
3. **User Privacy**: Respect user preferences for Live Activities
4. **Fallback**: Always provide fallback for unsupported devices
5. **Date Handling**: Always use ISO strings for consistent serialization
6. **System UI**: This implementation uses system default styling for simplicity

## Key Differences from Complex Implementations

This **simplified approach**:

- ✅ Uses existing widget extension (no additional extension needed)
- ✅ Uses system default UI styling (no custom SwiftUI complexity)
- ✅ Integrates seamlessly with existing widget architecture
- ✅ Focuses on functionality over custom appearance
- ✅ Much easier to maintain and debug

The system provides default styling for:

- Dynamic Island compact/minimal views
- Lock screen banner appearance
- Notification-style layout

## Architecture

### Files Structure

```
ios/
├── Shared/
│   ├── RNLiveActivity.swift              # React Native bridge implementation
│   └── LiveActivityDataStructures.swift  # Shared data types
├── BridgeModules/
│   └── RNLiveActivityBridge.m            # Objective-C bridge declarations
└── departureWidget/
    ├── DepartureWidget.swift             # Widget bundle with Live Activities
    └── Info.plist                        # Widget extension configuration
```

### Key Components

1. **RNLiveActivity.swift**: React Native bridge providing Live Activities functionality
2. **LiveActivityDataStructures.swift**: Swift types for Live Activities attributes and content
3. **DepartureWidget.swift**: Widget bundle that includes both regular widgets and Live Activities
4. **RNLiveActivityBridge.m**: Objective-C bridge for React Native integration

## React Native Integration

### 1. TypeScript Types

The TypeScript types use **ISO strings** for all dates:

```typescript
export interface DepartureLiveActivityContentState {
  updatedAt: string; // ISO 8601 string
  scheduledTime: string; // ISO 8601 string
  estimatedTime?: string; // ISO 8601 string
  realtimeStatus: 'on-time' | 'delayed' | 'cancelled' | 'no-data';
  delay?: number;
  platform?: string;
}
```

### 2. Creating Live Activities

```typescript
import {useLiveActivities} from '@atb/modules/live-activities';

const MyComponent = () => {
  const {createActivity, isSupported} = useLiveActivities();

  const handleCreateActivity = async () => {
    if (!isSupported) {
      Alert.alert('Not supported', 'Live Activities require iOS 16.2+');
      return;
    }

    // Create scheduled time 30 minutes from now
    const scheduledTime = new Date(Date.now() + 30 * 60 * 1000);

    const activity = await createActivity({
      attributes: {
        id: 'departure_123',
        type: LiveActivityType.departure,
        title: 'Bus 3 to Lade',
        description: 'Departure from Sentrum',
        activityName: 'Bus Departure',
      },
      contentState: {
        updatedAt: new Date().toISOString(), // ✅ ISO string
        scheduledTime: scheduledTime.toISOString(), // ✅ ISO string
        realtimeStatus: 'on-time',
        delay: 0,
        platform: 'A',
      },
      config: {
        enablePushUpdates: false,
        relevanceScore: 0.8,
      },
    });
  };
};
```

### 3. Key Date Handling Rule

**Always use `.toISOString()` when passing dates from React Native to Live Activities:**

```typescript
// ✅ Correct
scheduledTime: new Date().toISOString();

// ❌ Wrong - will cause parsing errors
scheduledTime: new Date();
scheduledTime: Date.now();
scheduledTime: 'some-string-format';
```

## Build Settings

### Main App Target

1. Set **iOS Deployment Target** to `16.2` or later
2. Add the following to **Build Settings**:
   - **Swift Compiler - Language**: Swift 5.7+
   - **User-Defined**: `SUPPORTS_LIVE_ACTIVITIES = YES`

### Widget Extension Target

1. Set **iOS Deployment Target** to `16.2` or later
2. Ensure **Bundle Identifier** follows pattern: `$(PRODUCT_BUNDLE_IDENTIFIER).departureWidget`

## Code Integration

### 1. Import the Live Activities Module

In the React Native code:

```typescript
import {
  useLiveActivities,
  DepartureLiveActivityExample,
  LiveActivityType,
} from '@atb/modules/live-activities';
```

### 2. Initialize in App Component

```typescript
// In the main App component or a provider
import {getLiveActivityService} from '@atb/modules/live-activities';

const App = () => {
  useEffect(() => {
    const initializeLiveActivities = async () => {
      const service = getLiveActivityService();
      await service.initialize();
    };

    initializeLiveActivities();
  }, []);

  // ... rest of the app
};
```

### 3. Use the Hook

```typescript
const MyDepartureScreen = () => {
  const {createActivity, isSupported} = useLiveActivities();

  const handleCreateLiveActivity = async () => {
    if (!isSupported) {
      Alert.alert('Not supported', 'Live Activities require iOS 16.2+');
      return;
    }

    // Create a Live Activity
    const activity = await createActivity({
      attributes: {
        id: 'departure_123',
        type: LiveActivityType.departure,
        title: 'Bus 3 to Lade',
        // ... other attributes
      },
      contentState: {
        scheduledTime: new Date().toISOString(),
        // ... other content
      },
    });
  };

  return (
    <View>
      <Button title="Create Live Activity" onPress={handleCreateLiveActivity} />
    </View>
  );
};
```

## Entitlements

### Main App (`atb.entitlements`):

```xml
<key>com.apple.developer.usernotifications.live-activities</key>
<true/>
```

### Widget Extension (`departureWidget.entitlements`):

```xml
<key>com.apple.developer.ActivityKit.pushtostart</key>
<true/>
```

## Widget Implementation

The `DepartureWidget.swift` file uses a **Widget Bundle** approach:

```swift
@main
struct DepartureWidgetBundle: WidgetBundle {
  var body: some Widget {
    DepartureWidget()                    // Regular widget
    if #available(iOS 16.2, *) {
      LiveActivityWidget()               // Live Activities widget
    }
  }
}

@available(iOS 16.2, *)
struct LiveActivityWidget: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: LiveActivityAttributes.self) { context in
      // Lock screen/banner view with system default styling
      LiveActivityLockScreenView(context: context)
    } dynamicIsland: { context in
      // Dynamic Island views
      DynamicIsland { /* ... */ }
    }
  }
}
```

## Testing Live Activities

### Example Usage

Use the provided example component:

```typescript
import {DepartureLiveActivityDemo} from '@atb/modules/live-activities/examples';

// In your app
<DepartureLiveActivityDemo />;
```

### Debug Logs

The Swift implementation includes extensive debug logging:

```
🔍 Parsing content state from dict: [...]
🕒 Parsed scheduledTime: 2025-08-19T15:04:18.224Z -> 2025-08-19 15:04:18 +0000
🟢 Created Live Activity: ABC123
```

## Troubleshooting

### Common Issues

1. **"🕒 Failed to parse scheduledTime"**

   - **Cause**: Passing Date object instead of ISO string
   - **Fix**: Use `.toISOString()` when creating activities

2. **"Cannot find type 'LiveActivityAttributes' in scope"**

   - **Cause**: Widget extension can't see shared types
   - **Fix**: Verify `LiveActivityDataStructures.swift` is added to widget target

3. **"Live Activities not supported"**

   - Check iOS version (16.2+ required for simplified approach)
   - Verify capability is added to both targets
   - Ensure deployment target is set correctly

4. **Activities appear but show "--:--" for time**

   - **Cause**: `scheduledTime` is not being passed correctly
   - **Fix**: Ensure you're passing ISO string format

5. **Dynamic Island not showing**
   - Only available on iPhone 14 Pro/Pro Max and later
   - Check device compatibility
   - Verify compact and minimal views are implemented

### Debugging Commands

```typescript
// Check device capabilities
const capabilities = await RNLiveActivity.getCapabilities();
console.log('Capabilities:', capabilities);

// Get debug information
const debugInfo = await RNLiveActivity.debugLiveActivities();
console.log('Debug Info:', debugInfo);

// List active activities
const activities = await RNLiveActivity.getAllActiveActivities();
console.log('Active Activities:', activities);
```

```xml
<key>com.apple.developer.usernotifications.live-activities</key>
<true/>
```

## Testing

### 1. Device Requirements

- Physical device with iOS 16.2+
- Live Activities don't work in Simulator for Dynamic Island features

### 2. Test Steps

1. Build and install the app
2. Use the `DepartureLiveActivityExample` component to test
3. Check that Live Activities appear in:
   - Lock Screen
   - Dynamic Island (on supported devices)
   - Notification Center

### 3. Debugging

- Check Xcode console for Live Activity logs
- Use `getAllActiveActivities()` to verify activity state
- Monitor Activity Monitor for widget extension crashes

## Push Updates

### 1. APNs Configuration

Live Activities support push updates. To enable:

1. Configure APNs certificates in Apple Developer portal
2. Update the notification service to send Live Activity push notifications
3. Use the push token returned from `createActivity()`

### 2. Push Payload Example

```json
{
  "aps": {
    "timestamp": 1234567890,
    "event": "update",
    "content-state": {
      "scheduledTime": 1234567890000,
      "estimatedTime": 1234567950000,
      "delay": 1,
      "realtimeStatus": "delayed"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Live Activities not supported"**

   - Check iOS version (16.2+ required)
   - Verify capability is added to both targets
   - Ensure deployment target is set correctly

2. **Widget extension crashes**

   - Check widget extension logs in Xcode
   - Verify all required frameworks are linked
   - Ensure ActivityKit is imported in Swift files

3. **Activities not appearing**

   - Check device settings: Settings > Face ID & Passcode > Live Activities
   - Verify entitlements are correctly configured
   - Check that the widget bundle is properly configured

4. **Dynamic Island not showing**
   - Only available on iPhone 14 Pro/Pro Max and later
   - Check device compatibility
   - Verify compact and minimal views are implemented

### Logs and Debugging

Enable additional logging by adding to the app:

```swift
// In AppDelegate or SceneDelegate
#if DEBUG
import os.log
let activityLogger = Logger(subsystem: "no.mittatb.app", category: "LiveActivity")
#endif
```
