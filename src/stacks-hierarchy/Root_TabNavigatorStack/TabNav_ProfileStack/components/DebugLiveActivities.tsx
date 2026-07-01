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

/**
 * Debug-menu interface for the iOS Live Activities PoC.
 *
 * Fires real Live Activities with mock preset data so the SwiftUI designs can be
 * seen on the lock screen / Dynamic Island. Hooking these up to real trip data
 * is a later step — this only exercises the native module + widget.
 */

type Phase = 'walking' | 'waiting' | 'onboard' | 'getOff';
type Mode = 'bus' | 'tram' | 'rail' | 'water' | 'walk';

type TransitAttributes = {
  toName: string;
  brandLabel: string;
  tripId: string;
};

type TransitContentState = {
  phase: Phase;
  mode: Mode;
  lineNumber: string;
  lineName: string;
  fromStopName: string;
  toStopName: string;
  headline: string;
  secondaryText: string;
  /** ISO-8601 timestamp. */
  eventTime: string;
  eventIsCountdown: boolean;
  alert: boolean;
  alertText: string;
};

const inMinutes = (m: number) =>
  new Date(Date.now() + m * 60_000).toISOString();

const ATTRIBUTES: TransitAttributes = {
  toName: 'Festplassen',
  brandLabel: 'AtB',
  tripId: 'poc-trip-1',
};

const SCENARIOS: Record<string, TransitContentState> = {
  walking: {
    phase: 'walking',
    mode: 'bus',
    lineNumber: '42',
    lineName: 'Sentrum',
    fromStopName: 'Prinsens gate',
    toStopName: 'Prinsens gate',
    headline: 'Gå til',
    secondaryText: 'Ta buss',
    eventTime: inMinutes(2),
    eventIsCountdown: true,
    alert: false,
    alertText: '',
  },
  departure: {
    phase: 'waiting',
    mode: 'bus',
    lineNumber: '459',
    lineName: 'Skogsskiftet',
    fromStopName: 'Hammarslandsdalen',
    toStopName: 'Hammarslandsdalen',
    headline: 'Ta buss',
    secondaryText: 'Avgang',
    eventTime: inMinutes(9),
    eventIsCountdown: false,
    alert: false,
    alertText: '',
  },
  onboard: {
    phase: 'onboard',
    mode: 'bus',
    lineNumber: '42',
    lineName: 'Sentrum',
    fromStopName: 'Prinsens gate',
    toStopName: 'Studentersamfundet',
    headline: 'Gå av på',
    secondaryText: 'Neste stopp',
    eventTime: inMinutes(4),
    eventIsCountdown: true,
    alert: false,
    alertText: '',
  },
  getOff: {
    phase: 'getOff',
    mode: 'bus',
    lineNumber: '42',
    lineName: 'Sentrum',
    fromStopName: 'Prinsens gate',
    toStopName: 'Fiskepiren',
    headline: 'Gå av på',
    secondaryText: 'Neste stopp',
    eventTime: inMinutes(1),
    eventIsCountdown: true,
    alert: true,
    alertText: 'STOPPER',
  },
};

export const DebugLiveActivities = () => {
  const styles = useStyles();
  const [activityId, setActivityId] = useState<string | null>(null);

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
            : 'iOS 16.2+ only — unavailable on this platform'}
        </ThemeText>
      </GenericSectionItem>

      {available && (
        <LinkSectionItem text="Check enabled" onPress={checkEnabled} />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Walk to stop"
          subtitle="Gå til Prinsens gate · ta buss 42"
          onPress={() => start('walking')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Departure (Entur-style)"
          subtitle="Reisen din til Festplassen · avgang"
          onPress={() => start('departure')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Start – Onboard (next stop)"
          subtitle="Gå av på Studentersamfundet"
          onPress={() => start('onboard')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Update → Get off now (STOPPER)"
          subtitle="Requires an active activity"
          onPress={() => update('getOff')}
        />
      )}
      {available && (
        <LinkSectionItem
          text="Update → Next stop"
          subtitle="Requires an active activity"
          onPress={() => update('onboard')}
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
