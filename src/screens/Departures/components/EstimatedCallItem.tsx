import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {dictionary, useTranslation} from '@atb/translations';
import {
  formatToClockOrLongRelativeMinutes,
  formatToClockOrRelativeMinutes,
  formatToSimpleDate,
} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCall} from '@atb/api/types/departures';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import useFontScale from '@atb/utils/use-font-scale';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {StyleSheet, useTheme} from '@atb/theme';
import {isToday, parseISO} from 'date-fns';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
};

export default function EstimatedCallItem({
  departure,
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

  const getA11yLineLabel = () => {
    const parsedDepartureTime = parseISO(departure.expectedDepartureTime);
    const a11yClock = formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    );
    const a11yTimeWithRealtimePrefix = departure.realtime
      ? a11yClock
      : t(dictionary.a11yMissingRealTimePrefix) + a11yClock;
    const a11yDate = !isToday(parsedDepartureTime)
      ? formatToSimpleDate(parsedDepartureTime, language) + ','
      : '';

    const a11yLineInfo = `${t(DeparturesTexts.line)} ${line?.publicCode}, ${
      departure.destinationDisplay?.frontText
    }`;
    const a11yDateInfo = `${a11yDate} ${a11yTimeWithRealtimePrefix}`;

    return `${a11yLineInfo}. ${a11yDateInfo}`;
  };

  return (
    <View
      style={styles.estimatedCallItem}
      accessible={true}
      accessibilityLabel={getA11yLineLabel()}
    >
      {line && (
        <LineChip
          publicCode={line.publicCode}
          transportMode={line.transportMode}
          transportSubmode={line.transportSubmode}
        ></LineChip>
      )}
      <ThemeText style={styles.lineName}>
        {departure.destinationDisplay?.frontText}
      </ThemeText>
      <ThemeText type="body__primary--bold">{timeWithRealtimePrefix}</ThemeText>
    </View>
  );
}

type LineChipProps = {
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
};

function LineChip({
  publicCode,
  transportMode,
  transportSubmode,
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
    'color',
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
    color: theme.colors.primary_2.color,
    textAlign: 'center',
  },
}));
