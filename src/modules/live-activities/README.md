# Live Activities Module - Proof of Concept

A Live Activities implementation for the AtB app that provides iOS Live Activities with Dynamic Island support.

## Overview

This module provides Live Activities functionality that:

- **iOS 16.2+ Live Activities** with Dynamic Island support
- **Simplified implementation** using existing widget extension
- **Generic design** - supports multiple activity types (departures, journeys, tickets, service updates)
- **Local storage** - activities persist using AsyncStorage
- **Real-time updates** - activities can be updated from React Native
- **Type-safe** - Full TypeScript support with ISO string date handling

## Features

### Core Functionality

- Create, update, and end Live Activities
- iOS 16.2+ support with proper availability checks
- Local storage with AsyncStorage
- Event-driven architecture with React hooks

### iOS Features

- Native ActivityKit integration using simplified approach
- Dynamic Island support with system default styling
- Lock screen Live Activity display
- Proper activity lifecycle management
- Integration with existing `departureWidget` extension

### Storage & Persistence

- Local storage with AsyncStorage
- Activity state persistence across app restarts
- Automatic cleanup of old/inactive activities

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │    │   Live Activity  │    │   iOS Native    │
│   Components    │◄──►│     Service      │◄──►│   ActivityKit   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ AsyncStorage     │
                       │ Local Storage    │
                       └──────────────────┘
```

## Basic Usage

```typescript
import {
  useLiveActivities,
  LiveActivityType,
} from './src/modules/live-activities';

const MyComponent = () => {
  const {createActivity, isSupported} = useLiveActivities();

  const handleCreateActivity = async () => {
    const activity = await createActivity({
      attributes: {
        id: 'departure_123',
        type: LiveActivityType.departure,
        title: 'Bus 3 to Lade',
        stopId: 'NSR:StopPlace:59977',
        stopName: 'Trondheim S',
        lineNumber: '3',
        destination: 'Lade',
        departureId: 'dep_123',
      },
      contentState: {
        scheduledTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // ISO string!
        realtimeStatus: 'on-time',
        updatedAt: new Date().toISOString(), // ISO string!
      },
    });
  };

  return (
    <Button
      title="Create Live Activity"
      onPress={handleCreateActivity}
      disabled={!isSupported}
    />
  );
};
```

## API Reference

### Hooks

#### `useLiveActivities()`

Main hook for Live Activities management.

```typescript
const {
  isSupported, // boolean - platform support
  capabilities, // LiveActivityCapabilities - device features
  activeActivities, // LiveActivity[] - current active activities
  createActivity, // Function to create new activity
  updateActivity, // Function to update existing activity
  endActivity, // Function to end activity
  requestPermissions, // Function to request permissions
} = useLiveActivities();
```

#### `useLiveActivity(activityId: string)`

Hook for managing a specific activity.

```typescript
const {
  activity, // LiveActivity | null - the activity
  isLoading, // boolean - loading state
  error, // LiveActivityError | null - error state
  update, // Function to update content
  end, // Function to end activity
  isActive, // boolean - activity is active
} = useLiveActivity('activity_id');
```

### Service Class

#### `getLiveActivityService()`

Function to get the singleton service instance for direct API access.

```typescript
import {getLiveActivityService} from '@atb/modules/live-activities';

const service = getLiveActivityService();

// Initialize service
await service.initialize();

// Create activity
const activity = await service.createActivity(request);

// Update activity
await service.updateActivity({id: 'activity_id', contentState: {...}});

// End activity
await service.endActivity({id: 'activity_id'});
```

### Types

#### Activity Types

- `LiveActivityType.departure` - Transit departure tracking
- `LiveActivityType.journey` - In-transit journey tracking
- `LiveActivityType.ticket` - Active ticket display
- `LiveActivityType.serviceUpdate` - Service disruption alerts

#### Activity Attributes

Static data that doesn't change during activity lifetime:

```typescript
interface DepartureLiveActivityAttributes {
  id: string;
  type: LiveActivityType.departure;
  title: string;
  stopId: string;
  stopName: string;
  lineNumber: string;
  destination: string;
  departureId: string;
}
```

#### Content State

Dynamic data that can be updated (all dates are ISO 8601 strings):

```typescript
interface DepartureLiveActivityContentState {
  updatedAt: string; // ISO 8601 string
  scheduledTime: string; // ISO 8601 string
  estimatedTime?: string; // ISO 8601 string
  realtimeStatus: 'on-time' | 'delayed' | 'cancelled' | 'no-data';
  delay?: number;
  platform?: string;
}
```

## Examples

### Departure Tracking

See [`examples/DepartureLiveActivityExample.tsx`](./examples/DepartureLiveActivityExample.tsx) for a complete departure tracking implementation.

### Custom Activity Type

```typescript
// 1. Define your types
interface CustomActivityAttributes extends BaseLiveActivityAttributes {
  type: LiveActivityType.custom;
  customField: string;
}

interface CustomContentState extends BaseLiveActivityContentState {
  progress: number;
  status: string;
}

// 2. Create the activity
const activity = await createActivity<
  CustomActivityAttributes,
  CustomContentState
>({
  attributes: {
    id: 'custom_123',
    type: LiveActivityType.custom,
    title: 'Custom Activity',
    customField: 'value',
  },
  contentState: {
    updatedAt: new Date().toISOString(), // ISO string!
    progress: 0.5,
    status: 'in-progress',
  },
});
```

## Testing

### Requirements

- iOS: Physical device with iOS 16.2+ (Simulator has limited support)
- Testing requires Xcode and a provisioned device

### Test Flow

1. Open the app and navigate to the Live Activities test screen
2. Tap "Create Live Activity"
3. Verify the activity appears in:
   - Lock screen
   - Dynamic Island (on supported devices)
   - Notification Center
4. Test updates by tapping "Update with Delay"
5. Test ending by tapping "End Activity"
6. Test persistence by closing and reopening the app

### Debugging

- Check React Native logs for service-level errors
- Check Xcode console for iOS native errors
- Use `getAllActiveActivities()` to debug activity state
- Monitor storage with `cleanupInactiveActivities()`

## Limitations & Known Issues

### iOS

- Live Activities have a system limit (8 active activities per app)
- Dynamic Island only available on iPhone 14 Pro/Pro Max and later
- Activities automatically end after 8 hours
- No support in iOS Simulator for Dynamic Island features
- Requires iOS 16.2+ for the simplified implementation approach

### General

- **Date handling**: All dates must be ISO 8601 strings (use `.toISOString()`)
- Push updates not implemented (local updates only)
- Uses system default UI styling (no custom SwiftUI views)
- Integrated with existing `departureWidget` extension
- Limited error recovery for corrupted storage

## Support

This is a proof of concept implementation. For production use, consider:

1. **Architecture**: Move to dedicated Live Activities extension (separate from departure widget)
2. **Testing**: Extensive testing on various devices and iOS versions
3. **Performance**: Monitor battery impact and memory usage
4. **Backend**: Server infrastructure for push updates
5. **Analytics**: Track usage and effectiveness
