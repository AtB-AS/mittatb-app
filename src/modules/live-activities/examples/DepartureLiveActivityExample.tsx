import React, {useCallback, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import {useLiveActivities, useLiveActivity} from '../use-live-activities';
import {
  LiveActivityType,
  DepartureLiveActivityAttributes,
  DepartureLiveActivityContentState,
} from '../types';

interface DepartureInfo {
  stopId: string;
  stopName: string;
  lineNumber: string;
  destination: string;
  departureId: string;
  scheduledTime: Date;
  estimatedTime?: Date;
  delay?: number;
  platform?: string;
  realtimeStatus: 'on-time' | 'delayed' | 'cancelled' | 'no-data';
}

interface DepartureLiveActivityExampleProps {
  departure: DepartureInfo;
}

/**
 * Example component demonstrating Live Activities with departure tracking
 */
export function DepartureLiveActivityExample({
  departure,
}: DepartureLiveActivityExampleProps) {
  const {createActivity, isSupported, capabilities, error} =
    useLiveActivities();
  const [activityId, setActivityId] = useState<string | null>(null);

  const activity = useLiveActivity<
    DepartureLiveActivityAttributes,
    DepartureLiveActivityContentState
  >(activityId || '');

  const handleCreateActivity = useCallback(async () => {
    if (!isSupported) {
      Alert.alert(
        'Not Supported',
        'Live Activities are not supported on this device',
      );
      return;
    }

    const id = `departure_${departure.departureId}_${Date.now()}`;

    const attributes: DepartureLiveActivityAttributes = {
      id,
      type: LiveActivityType.departure,
      title: `${departure.lineNumber} ${departure.destination}`,
      description: `Departure from ${departure.stopName}`,
      deepLink: `atb://departure/${departure.departureId}`,
      activityName: 'Departure tracking activity',
      stopId: departure.stopId,
      stopName: departure.stopName,
      lineNumber: departure.lineNumber,
      destination: departure.destination,
      departureId: departure.departureId,
    };

    const contentState: DepartureLiveActivityContentState = {
      updatedAt: new Date().toISOString(),
      relevantUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      staleDate: new Date(
        departure.scheduledTime.getTime() + 30 * 60 * 1000,
      ).toISOString(), // 30 min after scheduled time
      scheduledTime: departure.scheduledTime.toISOString(),
      estimatedTime: departure.estimatedTime?.toISOString(),
      realtimeStatus: departure.realtimeStatus,
      delay: departure.delay,
      platform: departure.platform,
    };

    const newActivity = await createActivity({
      attributes,
      contentState,
      config: {
        enablePushUpdates: true,
        priority: 'high',
        relevanceScore: 0.8,
        dismissalPolicy: 'default',
      },
    });

    if (newActivity) {
      setActivityId(newActivity.id);
      Alert.alert('Success', 'Live Activity created successfully!');
    } else {
      Alert.alert('Error', error?.message || 'Failed to create Live Activity');
    }
  }, [departure, createActivity, isSupported, error]);

  const handleUpdateActivity = useCallback(async () => {
    if (!activity.activity) return;

    // Simulate real-time update with delay
    const newDelay = Math.floor(Math.random() * 10) + 1; // 1-10 minutes delay
    const newEstimatedTime = new Date(
      departure.scheduledTime.getTime() + newDelay * 60 * 1000,
    );

    const success = await activity.update({
      estimatedTime: newEstimatedTime.toISOString(),
      delay: newDelay,
      realtimeStatus: newDelay > 5 ? 'delayed' : 'on-time',
      updatedAt: new Date().toISOString(),
    });

    if (success) {
      Alert.alert('Updated', `Departure delayed by ${newDelay} minutes`);
    } else {
      Alert.alert('Error', 'Failed to update Live Activity');
    }
  }, [activity, departure.scheduledTime]);

  const handleEndActivity = useCallback(async () => {
    if (!activity.activity) return;

    const success = await activity.end('default', {
      realtimeStatus: 'on-time',
      updatedAt: new Date().toISOString(),
    });

    if (success) {
      setActivityId(null);
      Alert.alert('Ended', 'Live Activity ended successfully');
    } else {
      Alert.alert('Error', 'Failed to end Live Activity');
    }
  }, [activity]);

  if (!isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Live Activities Not Supported</Text>
        <Text style={styles.subtitle}>
          Live Activities require iOS 16.1+ or Android with notification support
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Departure Live Activity Example</Text>

      <View style={styles.departureInfo}>
        <Text style={styles.lineNumber}>{departure.lineNumber}</Text>
        <Text style={styles.destination}>{departure.destination}</Text>
        <Text style={styles.stopName}>From: {departure.stopName}</Text>
        <Text style={styles.time}>
          Scheduled:{' '}
          {departure.scheduledTime.toLocaleTimeString('nb-NO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {departure.estimatedTime && (
          <Text style={styles.estimatedTime}>
            Estimated:{' '}
            {departure.estimatedTime.toLocaleTimeString('nb-NO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
        {!!(departure.delay && departure.delay > 0) && (
          <Text style={styles.delay}>Delay: +{departure.delay} min</Text>
        )}
        {departure.platform && (
          <Text style={styles.platform}>Platform: {departure.platform}</Text>
        )}
      </View>

      {capabilities && (
        <View style={styles.capabilities}>
          <Text style={styles.capabilitiesTitle}>Device Capabilities:</Text>
          <Text>
            • Dynamic Island: {capabilities.supportsDynamicIsland ? '✅' : '❌'}
          </Text>
          <Text>
            • Lock Screen: {capabilities.supportsLockScreen ? '✅' : '❌'}
          </Text>
          <Text>
            • Push Updates: {capabilities.supportsPushUpdates ? '✅' : '❌'}
          </Text>
          <Text>• Max Activities: {capabilities.maxActiveActivities}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!activity.activity && (
          <Button
            title="Create Live Activity"
            onPress={handleCreateActivity}
            color="#0066CC"
          />
        )}

        {activity.isActive && (
          <>
            <Button
              title="Update with Delay"
              onPress={handleUpdateActivity}
              color="#FF6B35"
            />
            <Button
              title="End Activity"
              onPress={handleEndActivity}
              color="#DC143C"
            />
          </>
        )}
      </View>

      {activity.activity && (
        <View style={styles.activityStatus}>
          <Text style={styles.statusTitle}>Activity Status:</Text>
          <Text>ID: {activity.activity.id}</Text>
          <Text>Status: {activity.activity.status}</Text>
          <Text>
            Created:{' '}
            {new Date(activity.activity.createdAt).toLocaleString('nb-NO')}
          </Text>
          <Text>
            Updated:{' '}
            {new Date(activity.activity.updatedAt).toLocaleString('nb-NO')}
          </Text>
          {activity.activity.nativeActivityId && (
            <Text>Native ID: {activity.activity.nativeActivityId}</Text>
          )}
        </View>
      )}

      {activity.isLoading && (
        <Text style={styles.loading}>Loading activity...</Text>
      )}

      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Demo component with sample departure data
 */
export function DepartureLiveActivityDemo() {
  const sampleDeparture: DepartureInfo = {
    stopId: 'NSR:StopPlace:548',
    stopName: 'Trondheim Sentralstasjon',
    lineNumber: '3',
    destination: 'Lade',
    departureId: 'departure_123456',
    scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    estimatedTime: new Date(Date.now() + 17 * 60 * 1000), // 17 minutes from now (2 min delay)
    delay: 2,
    platform: 'A',
    realtimeStatus: 'delayed',
  };

  return <DepartureLiveActivityExample departure={sampleDeparture} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  departureInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lineNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  destination: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  stopName: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  estimatedTime: {
    fontSize: 16,
    color: '#FF6B35',
    marginTop: 2,
  },
  delay: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: 'bold',
    marginTop: 2,
  },
  platform: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  capabilities: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  capabilitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066CC',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  activityStatus: {
    backgroundColor: '#f0f8e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  error: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
});
