import React from 'react';
import {Alert, View} from 'react-native';
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
  type TripLiveActivityContentState,
  type LiveActivityTransportMode,
} from '@atb/modules/live-activities';
import {ClickableCopy} from '@atb/components/clickable-copy';
import {Button} from '@atb/components/button';
import {random} from 'lodash';

/**
 * Debug-menu interface for Live Activities: starts and updates activities with
 * random mock data, and shows the tokens the backend needs for pushing.
 */

const inMinutes = (m: number) => Math.floor(Date.now() / 1000) + m * 60;

const randomContentState = (): TripLiveActivityContentState => ({
  eventTime: inMinutes(random(10)),
  lineName: ['Hakkebakkeskogen', 'Lohove'][random(0, 1)],
  lineNumber: random(1, 15).toString(),
  mode: ['bus', 'rail', 'walk'][random(0, 2)] as LiveActivityTransportMode,
  title: ['6 stopp igjen', '2 stopp igjen', 'Neste stopp'][random(0, 2)],
});

/**
 * The attributes require a trip id. These presets are not backed by a saved
 * trip, so the backend would not accept this one for registration — it only
 * keeps the activity startable from the debug menu.
 */
const ATTRIBUTES = {tripId: 'debug-preset'};

export const DebugLiveActivities = () => {
  const styles = useStyles();
  const {activities, pushToStartToken} = useLiveActivitiesContext();

  const liveActivities = NativeLiveActivities;
  if (!liveActivities) return null;

  const start = async () => {
    try {
      const id = await liveActivities.startActivity(
        JSON.stringify(ATTRIBUTES),
        JSON.stringify(randomContentState()),
      );
      Alert.alert('Live Activity started', `id: ${id}`);
    } catch (e: any) {
      Alert.alert('Start failed', e?.message ?? String(e));
    }
  };

  const update = async (activityId: string) => {
    try {
      await liveActivities.updateActivity(
        activityId,
        JSON.stringify(randomContentState()),
      );
    } catch (e: any) {
      Alert.alert('Update failed', e?.message ?? String(e));
    }
  };

  const end = async (id: string) => {
    try {
      await liveActivities.endActivity(id);
    } catch (e: any) {
      Alert.alert('End failed', e?.message ?? String(e));
    }
  };

  const checkEnabled = () => {
    try {
      Alert.alert(
        'Live Activities enabled?',
        String(liveActivities.areActivitiesEnabled()),
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
          <ClickableCopy
            copyContent={activity.activityId}
            successElement={<ThemeText>✅ Copied!</ThemeText>}
          >
            <ThemeText isMarkdown={true} typography="body__s">
              {`**Activity ID:** ${activity.activityId}`}
            </ThemeText>
          </ClickableCopy>
          <ClickableCopy
            copyContent={activity.tripId}
            successElement={<ThemeText>✅ Copied!</ThemeText>}
          >
            <ThemeText isMarkdown={true} type="secondary">
              {`**Trip ID:** ${activity.tripId}`}
            </ThemeText>
          </ClickableCopy>
          <ClickableCopy
            copyContent={activity.apnsToken}
            successElement={<ThemeText>✅ Copied!</ThemeText>}
          >
            <ThemeText isMarkdown={true} typography="body__s">
              {`**APNS Token:** ${activity.apnsToken}`}
            </ThemeText>
          </ClickableCopy>
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
