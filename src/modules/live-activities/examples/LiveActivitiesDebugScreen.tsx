import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import {Button} from '@atb/components/button';
import {Section} from '@atb/components/sections';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading} from '@atb/components/heading';
import {useLiveActivities, getLiveActivityService} from '../index';

/**
 * Debug screen for Live Activities
 * Shows detailed debugging information and allows testing
 */
export function LiveActivitiesDebugScreen() {
  const {isSupported, capabilities, error} = useLiveActivities();
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebugCheck = async () => {
    setIsLoading(true);
    try {
      const service = getLiveActivityService();
      const info = await service.debugLiveActivities();
      setDebugInfo(info);

      // eslint-disable-next-line no-console
      console.log('🔍 Live Activities Debug Info:', info);
    } catch (error) {
      console.error('Debug check failed:', error);
      Alert.alert(
        'Debug Failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const testBasicSupport = async () => {
    try {
      const service = getLiveActivityService();
      const supported = await service.isSupported();
      const caps = await service.getCapabilities();

      Alert.alert(
        'Support Check',
        `Supported: ${supported}\n` +
          `Dynamic Island: ${caps.supportsDynamicIsland}\n` +
          `Lock Screen: ${caps.supportsLockScreen}\n` +
          `Push Updates: ${caps.supportsPushUpdates}`,
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  };

  useEffect(() => {
    // Run debug check on mount
    runDebugCheck();
  }, []);

  return (
    <FullScreenView
      headerProps={{
        title: 'Live Activities Debug',
        leftButton: {type: 'back'},
      }}
    >
      <ScrollView style={styles.container}>
        <Section>
          <View style={styles.statusContainer}>
            <Text style={styles.platformText}>Platform: {Platform.OS}</Text>
            <Text style={styles.versionText}>
              iOS Version: {Platform.OS === 'ios' ? Platform.Version : 'N/A'}
            </Text>
          </View>
        </Section>

        <Section>
          <ContentHeading text="Support Status" />
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>
              Supported: {isSupported ? '✅ Yes' : '❌ No'}
            </Text>
          </View>

          {capabilities && (
            <>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>
                  Dynamic Island:{' '}
                  {capabilities.supportsDynamicIsland ? '✅' : '❌'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>
                  Lock Screen: {capabilities.supportsLockScreen ? '✅' : '❌'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>
                  Push Updates: {capabilities.supportsPushUpdates ? '✅' : '❌'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>
                  Max Activities: {capabilities.maxActiveActivities}
                </Text>
              </View>
            </>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
          )}
        </Section>

        {debugInfo && (
          <Section>
            <ContentHeading text="Debug Information" />
            {Object.entries(debugInfo).map(([key, value]) => (
              <View key={key} style={styles.debugItem}>
                <Text style={styles.debugKey}>{key}:</Text>
                <Text style={styles.debugValue}>
                  {typeof value === 'boolean'
                    ? value
                      ? 'true'
                      : 'false'
                    : String(value)}
                </Text>
              </View>
            ))}
          </Section>
        )}

        <Section>
          <ContentHeading text="Manual Tests" />

          <Button
            text="Run Debug Check"
            onPress={runDebugCheck}
            expanded={true}
            style={styles.button}
            loading={isLoading}
          />

          <Button
            text="Test Basic Support"
            onPress={testBasicSupport}
            expanded={true}
            style={styles.button}
          />
        </Section>

        <Section>
          <ContentHeading text="Troubleshooting" />
          <View style={styles.troubleshootingContainer}>
            <Text style={styles.troubleshootingText}>
              If Live Activities show as "not supported":
            </Text>
            <Text style={styles.troubleshootingItem}>
              • Check iOS version (requires 16.1+)
            </Text>
            <Text style={styles.troubleshootingItem}>
              • Verify Info.plist has NSSupportsLiveActivities = true
            </Text>
            <Text style={styles.troubleshootingItem}>
              • Check device settings: Settings → Face ID & Passcode → Live
              Activities
            </Text>
            <Text style={styles.troubleshootingItem}>
              • Ensure app target has Live Activities capability in Xcode
            </Text>
          </View>
        </Section>
      </ScrollView>
    </FullScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    marginBottom: 16,
  },
  platformText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusItem: {
    marginVertical: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  debugItem: {
    flexDirection: 'row',
    marginVertical: 2,
    flexWrap: 'wrap',
  },
  debugKey: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  debugValue: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginVertical: 4,
  },
  troubleshootingContainer: {
    marginTop: 8,
  },
  troubleshootingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  troubleshootingItem: {
    marginLeft: 16,
    marginVertical: 2,
    fontSize: 14,
    color: '#666',
  },
});
