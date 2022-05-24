import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClockOrRelativeMinutes} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCall} from '@atb/api/types/departures';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import useFontScale from '@atb/utils/use-font-scale';
import {StyleSheet, useTheme} from '@atb/theme';
import {Warning} from '../../../assets/svg/color/situations';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
  testID: string;
};

export default function EstimatedCallItem({
  departure,
  testID,
}: EstimatedCallItemProps): JSX.Element {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const line = departure.serviceJourney?.line;

  const time = formatToClockOrRelativeMinutes(
    departure.expectedDepartureTime,
    language,
    t(dictionary.date.units.now),
  );
  const timeWithRealtimePrefix = departure.realtime
    ? time
    : t(dictionary.missingRealTimePrefix) + time;

  const isTripCancelled = departure.cancellation;

  return (
    <View style={styles.estimatedCallItem}>
      {line && (
        <LineChip
          publicCode={line.publicCode}
          transportMode={line.transportMode}
          transportSubmode={line.transportSubmode}
          testID={testID}
        ></LineChip>
      )}
      <ThemeText style={styles.lineName} testID={testID + 'Name'}>
        {departure.destinationDisplay?.frontText}
      </ThemeText>
      {isTripCancelled && <Warning style={styles.warningIcon} />}
      <ThemeText
        type="body__primary--bold"
        testID={testID + 'Time'}
        style={isTripCancelled && styles.strikethrough}
      >
        {timeWithRealtimePrefix}
      </ThemeText>
    </View>
  );
}

type LineChipProps = {
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  testID?: string;
};

function LineChip({
  publicCode,
  transportMode,
  transportSubmode,
  testID,
}: LineChipProps): JSX.Element {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme} = useTheme();
  const svg = getTransportModeSvg(transportMode as Mode_v2 | undefined);
  const transportColor = useTransportationColor(
    transportMode as Mode_v2 | undefined,
    transportSubmode,
  );
  const transportTextColor = useTransportationColor(
    transportMode as Mode_v2 | undefined,
    transportSubmode,
    'text',
  );
  return (
    <View style={[styles.lineChip, {backgroundColor: transportColor}]}>
      {svg && (
        <ThemeIcon
          fill={transportTextColor}
          style={{marginRight: publicCode ? theme.spacings.small : 0}}
          svg={svg}
        ></ThemeIcon>
      )}
      {publicCode && (
        <ThemeText
          style={[
            styles.lineChipText,
            {color: transportTextColor, minWidth: fontScale * 20},
          ]}
          testID={testID + 'PublicCode'}
          type="body__primary--bold"
        >
          {publicCode}
        </ThemeText>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  estimatedCallItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.medium,
  },
  lineChip: {
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
    flexDirection: 'row',
  },
  lineChipText: {
    color: theme.static.background.background_accent_3.text,
    textAlign: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  warningIcon: {
    marginRight: theme.spacings.small,
  },
}));
