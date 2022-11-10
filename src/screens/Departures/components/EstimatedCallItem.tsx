import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {
  CancelledDepartureTexts,
  dictionary,
  FavoriteDeparturesTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  formatToClockOrLongRelativeMinutes,
  formatToClockOrRelativeMinutes,
  formatToSimpleDate,
} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCall, Place, Quay} from '@atb/api/types/departures';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import useFontScale from '@atb/utils/use-font-scale';
import {StyleSheet, useTheme} from '@atb/theme';
import {Warning} from '../../../assets/svg/color/situations';
import ToggleFavouriteDeparture from '@atb/screens/Departures/components/ToggleFavouriteDeparture';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {isToday, parseISO} from 'date-fns';
import {useOnMarkFavouriteDepartures} from '@atb/screens/Departures/components/use-on-mark-favourite-departures';
import {StopPlacesMode} from '@atb/screens/Departures/types';
import {TouchableOpacityOrView} from '@atb/components/touchable-opacity-or-view';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
  testID: string;
  quay: Quay;
  stopPlace: Place;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  allowFavouriteSelection: boolean;
  mode: StopPlacesMode;
};

export default function EstimatedCallItem({
  departure,
  testID,
  quay,
  stopPlace,
  navigateToDetails,
  allowFavouriteSelection,
  mode,
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
  const lineName = departure.destinationDisplay?.frontText;
  const lineNumber = line?.publicCode;
  const {onMarkFavourite, existingFavorite, toggleFavouriteAccessibilityLabel} =
    useOnMarkFavouriteDepartures(
      {...line, lineNumber: lineNumber, lineName: lineName},
      quay,
      stopPlace,
    );
  return (
    <TouchableOpacityOrView
      onClick={mode === 'Favourite' ? onMarkFavourite : undefined}
      style={styles.container}
      accessibilityLabel={
        mode === 'Favourite' ? getLineA11yLabel(departure, t) : undefined
      }
      accessibilityHint={
        mode === 'Favourite'
          ? t(FavoriteDeparturesTexts.a11yMarkFavouriteHint)
          : undefined
      }
    >
      <TouchableOpacity
        style={styles.actionableItem}
        disabled={!navigateToDetails}
        onPress={() => {
          if (navigateToDetails && departure?.serviceJourney) {
            navigateToDetails(
              departure.serviceJourney?.id,
              departure.date,
              departure.expectedDepartureTime,
              departure.quay?.id,
              departure.cancellation,
            );
          }
        }}
        accessible={!!navigateToDetails}
        importantForAccessibility={!!navigateToDetails ? 'yes' : 'no'}
        accessibilityHint={
          navigateToDetails
            ? t(DeparturesTexts.a11yViewDepartureDetailsHint)
            : undefined
        }
        accessibilityLabel={
          navigateToDetails
            ? getA11yDeparturesLabel(departure, t, language)
            : undefined
        }
      >
        <View style={styles.estimatedCallItem} testID={testID}>
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
          {mode === 'Departure' ? (
            <DepartureTimeAndWarning
              isTripCancelled={isTripCancelled}
              timeWithRealtimePrefix={timeWithRealtimePrefix}
              testID={testID}
            ></DepartureTimeAndWarning>
          ) : null}
        </View>
      </TouchableOpacity>
      {allowFavouriteSelection && (
        <ToggleFavouriteDeparture
          existingFavorite={existingFavorite}
          onMarkFavourite={mode === 'Departure' ? onMarkFavourite : undefined}
          toggleFavouriteAccessibilityLabel={
            mode === 'Departure' ? toggleFavouriteAccessibilityLabel : undefined
          }
        />
      )}
    </TouchableOpacityOrView>
  );
}

const DepartureTimeAndWarning = ({
  isTripCancelled,
  timeWithRealtimePrefix,
  testID,
}: {
  isTripCancelled: boolean;
  timeWithRealtimePrefix: string;
  testID: string;
}) => {
  const styles = useStyles();
  return (
    <>
      {isTripCancelled && <Warning style={styles.warningIcon} />}
      <ThemeText
        type="body__primary--bold"
        testID={testID + 'Time'}
        style={isTripCancelled && styles.strikethrough}
      >
        {timeWithRealtimePrefix}
      </ThemeText>
    </>
  );
};

function getA11yDeparturesLabel(
  departure: EstimatedCall,
  t: TranslateFunction,
  language: Language,
) {
  let a11yDateInfo = '';
  if (departure.expectedDepartureTime) {
    const a11yClock = formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    );
    const a11yTimeWithRealtimePrefix = departure.realtime
      ? a11yClock
      : t(dictionary.a11yMissingRealTimePrefix) + a11yClock;
    const parsedDepartureTime = parseISO(departure.expectedDepartureTime);
    const a11yDate = !isToday(parsedDepartureTime)
      ? formatToSimpleDate(parsedDepartureTime, language) + ','
      : '';
    a11yDateInfo = `${a11yDate} ${a11yTimeWithRealtimePrefix}`;
  }

  return `${
    departure.cancellation ? t(CancelledDepartureTexts.message) : ''
  } ${getLineA11yLabel(departure, t)} ${a11yDateInfo}`;
}

function getLineA11yLabel(departure: EstimatedCall, t: TranslateFunction) {
  const line = departure.serviceJourney?.line;
  const a11yLine = line?.publicCode
    ? `${t(DeparturesTexts.line)} ${line?.publicCode},`
    : '';
  const a11yFrontText = departure.destinationDisplay?.frontText
    ? `${departure.destinationDisplay?.frontText}.`
    : '';
  return `${a11yLine} ${a11yFrontText}`;
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionableItem: {
    flex: 1,
  },
  estimatedCallItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.xLarge,
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
