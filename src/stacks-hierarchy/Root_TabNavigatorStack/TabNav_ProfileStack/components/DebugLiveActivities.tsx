import React from 'react';
import {Alert, Platform, View} from 'react-native';
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
import {ClickableCopy} from '@atb/components/clickable-copy';
import {Button} from '@atb/components/button';
import {random} from 'lodash';

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

export const DebugLiveActivities = () => {
  const styles = useStyles();
  const {activities, pushToStartToken} = useLiveActivitiesContext();

  if (Platform.OS !== 'ios' || !NativeLiveActivities) return null;

  const start = async () => {
    const scenario: TransitLiveActivityContentState = {
      eventTime: inMinutes(random(10)),
      lineName: ['Hakkebakkeskogen', 'Lohove'][random(0, 1)],
      lineNumber: random(1, 15).toString(),
      mode: ['bus', 'rail', 'walk'][random(0, 2)] as TransitLiveActivityMode,
      title: ['6 stopp igjen', '2 stopp igjen', 'Neste stopp'][random(0, 2)],
    };
    try {
      const id = await NativeLiveActivities!.startActivity(
        JSON.stringify(ATTRIBUTES),
        JSON.stringify(scenario),
      );
      Alert.alert('Live Activity started', `id: ${id}`);
    } catch (e: any) {
      Alert.alert('Start failed', e?.message ?? String(e));
    }
  };

  const update = async (activityId: string) => {
    if (!activityId) {
      Alert.alert('No active activity', 'Start one first.');
      return;
    }
    try {
      await NativeLiveActivities!.updateActivity(
        activityId,
        JSON.stringify({
          mode: 'bus' as TransitLiveActivityMode,
          lineNumber: '3',
          lineName: 'Lohove',
          title: '6 stopp igjen',
          eventTime: inMinutes(18),
        }),
      );
    } catch (e: any) {
      Alert.alert('Update failed', e?.message ?? String(e));
    }
  };

  const end = async (id: string) => {
    try {
      await NativeLiveActivities!.endActivity(id, false);
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
        <ThemeText typography="body__m__strong">Live Activities</ThemeText>
      </GenericSectionItem>
      {pushToStartToken && (
        <GenericSectionItem>
          <ThemeText typography="body__s__strong">
            Push to start token
          </ThemeText>
          <ClickableCopy
            copyContent={pushToStartToken}
            successElement={<ThemeText>✅ Copied!</ThemeText>}
          >
            <ThemeText typography="body__s" type="secondary">
              {pushToStartToken}
            </ThemeText>
          </ClickableCopy>
        </GenericSectionItem>
      )}
      <LinkSectionItem text="Check enabled" onPress={checkEnabled} />
      <LinkSectionItem text="Start" onPress={start} />
      {activities.map((activity) => (
        <GenericSectionItem key={activity.activityId} style={styles.column}>
          <ThemeText typography="body__s" type="secondary">
            {activity.activityId.slice(0, 8)} · trip{' '}
            {activity.tripId.slice(0, 8)} · token{' '}
            {activity.pushToken.slice(0, 8)}…
          </ThemeText>
          <View style={styles.row}>
            <Button
              text="Update"
              expanded={false}
              mode="secondary"
              type="small"
              onPress={() => update(activity.activityId)}
            />
            <Button
              text="End"
              expanded={false}
              mode="secondary"
              type="small"
              onPress={() => end(activity.activityId)}
            />
          </View>
        </GenericSectionItem>
      ))}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  column: {
    flexDirection: 'column',
    gap: theme.spacing.small,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
}));
