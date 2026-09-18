import React, {useState} from 'react';
import {Alert, Platform} from 'react-native';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {NativeLiveActivities} from '@atb/modules/native';
import {
  useLiveActivitiesContext,
  type TransitLiveActivityContentState,
  type TransitLiveActivityMode,
} from '@atb/modules/live-activities';

/**
 * Debug-menu interface for the iOS Live Activities PoC.
 *
 * Fires real Live Activities with mock preset data so the SwiftUI design can be
 * seen on the lock screen / Dynamic Island. Hooking these up to real trip data
 * is a later step — this only exercises the native module + widget.
 */

const inMinutes = (m: number) => Math.floor(Date.now() / 1000) + m * 60;

/**
 * The attributes require a trip id. These presets are not backed by a saved
 * trip, so the backend would not accept this one for registration — it only
 * keeps the activity startable from the debug menu.
 */
const ATTRIBUTES = {tripId: 'debug-preset'};

const BASE = {
  mode: 'bus' as TransitLiveActivityMode,
  lineNumber: '3',
  lineName: 'Lohove',
};

const SCENARIOS: Record<string, TransitLiveActivityContentState> = {
  getOff6: {
    ...BASE,
    title: '6 stopp igjen',
    eventTime: inMinutes(18),
  },
  getOff2: {
    ...BASE,
    title: '2 stopp igjen',
    eventTime: inMinutes(6),
  },
  getOffNow: {
    ...BASE,
    title: 'Neste stopp',
    eventTime: inMinutes(1),
  },
  walking: {
    ...BASE,
    mode: 'walk',
    title: 'Gå til holdeplass Prinsens gate',
    eventTime: inMinutes(4),
  },
  departure: {
    ...BASE,
    title: 'Neste avgang fra Prinsens gate',
    eventTime: inMinutes(9),
  },
};

export const DebugLiveActivities = () => {
  const styles = useStyles();
  const [activityId, setActivityId] = useState<string | null>(null);
  const {activities} = useLiveActivitiesContext();

  const available = Platform.OS === 'ios' && !!NativeLiveActivities;

  const start = async (key: keyof typeof SCENARIOS) => {
    if (!NativeLiveActivities) return;
    try {
      const id = await NativeLiveActivities.startActivity(
        JSON.stringify(ATTRIBUTES),
        JSON.stringify(SCENARIOS[key]),
      );
      setActivityId(id);
      Alert.alert('Live Activity started', `id: ${id}`);
    } catch (e: any) {
      Alert.alert('Start failed', e?.message ?? String(e));
    }
  };

  const update = async (key: keyof typeof SCENARIOS) => {
    if (!NativeLiveActivities) return;
    if (!activityId) {
      Alert.alert('No active activity', 'Start one first.');
      return;
    }
    try {
      await NativeLiveActivities.updateActivity(
        activityId,
        JSON.stringify(SCENARIOS[key]),
      );
    } catch (e: any) {
      Alert.alert('Update failed', e?.message ?? String(e));
    }
  };

  const end = async () => {
    if (!NativeLiveActivities) return;
    if (!activityId) {
      Alert.alert('No active activity', 'Nothing to end.');
      return;
    }
    try {
      await NativeLiveActivities.endActivity(activityId, false);
      setActivityId(null);
    } catch (e: any) {
      Alert.alert('End failed', e?.message ?? String(e));
    }
  };

  const endAll = async () => {
    if (!NativeLiveActivities) return;
    try {
      await NativeLiveActivities.endAllActivities();
      setActivityId(null);
    } catch (e: any) {
      Alert.alert('End all failed', e?.message ?? String(e));
    }
  };

  const checkEnabled = () => {
    if (!NativeLiveActivities) return;
    try {
      Alert.alert(
        'Live Activities enabled?',
        String(NativeLiveActivities.areActivitiesEnabled()),
      );
    } catch (e: any) {
      Alert.alert('Check failed', e?.message ?? String(e));
    }
  };

  return (
    <Section style={styles.section}>
      <GenericSectionItem>
        <ThemeText typography="body__m__strong">
          Live Activities (PoC)
        </ThemeText>
        <ThemeText typography="body__s" type="secondary">
          {available
            ? activityId
              ? `Active: ${activityId}`
              : 'No active activity'
            : 'iOS 18+ only — unavailable on this platform'}
        </ThemeText>
      </GenericSectionItem>

      {available && (
        <GenericSectionItem>
          <ThemeText typography="body__s__strong">
            Registered for push updates
          </ThemeText>
          <ThemeText typography="body__s" type="secondary">
            {activities.length
              ? activities
                  .map(
                    ({activityId, tripId, pushToken}) =>
                      `${activityId.slice(0, 8)} · trip ${tripId.slice(
                        0,
                        8,
                      )} · token ${pushToken.slice(0, 8)}…`,
                  )
                  .join('\n')
              : 'No push tokens yet — the simulator never issues one'}
          </ThemeText>
        </GenericSectionItem>
      )}

      {available && (
        <LinkSectionItem text="Check enabled" onPress={checkEnabled} />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Get off (6 stopp igjen)"
          subtitle="Bus · 3 Lohove"
          onPress={() => start('getOff6')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Walk to stop"
          subtitle="Gå til holdeplass Prinsens gate"
          onPress={() => start('walking')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Departure"
          subtitle="Neste avgang fra Prinsens gate"
          onPress={() => start('departure')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Update → 2 stopp igjen"
          subtitle="Requires an active activity"
          onPress={() => update('getOff2')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Update → Neste stopp (get off now)"
          subtitle="Requires an active activity"
          onPress={() => update('getOffNow')}
        />
      )}
      {available && <LinkSectionItem text="End activity" onPress={end} />}
      {available && (
        <LinkSectionItem text="End all activities" onPress={endAll} />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
}));
