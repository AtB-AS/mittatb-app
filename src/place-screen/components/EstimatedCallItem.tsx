import React, {memo} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  CancelledDepartureTexts,
  dictionary,
  FavoriteDeparturesTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  formatLocaleTime,
  formatToClockOrLongRelativeMinutes,
  formatToClockOrRelativeMinutes,
  formatToSimpleDate,
} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCall, Quay, StopPlace} from '@atb/api/types/departures';
import {useFontScale} from '@atb/utils/use-font-scale';
import {StyleSheet, useTheme} from '@atb/theme';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {isToday, parseISO} from 'date-fns';

import {StopPlacesMode} from '@atb/nearby-stop-places';
import {TouchableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {SvgProps} from 'react-native-svg';
import {
  getSituationOrNoticeA11yLabel,
  getSvgForMostCriticalSituationOrNotice,
} from '@atb/situations';
import {
  getNoticesForEstimatedCall,
  getTimeRepresentationType,
} from '@atb/travel-details-screens/utils';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {
  FavouriteDepartureToggle,
  useOnMarkFavouriteDepartures,
} from '@atb/favorites';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
  testID: string;
  quay: Quay;
  stopPlace: StopPlace;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  allowFavouriteSelection: boolean;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
};

export const EstimatedCallItem = memo(function ({
  departure,
  testID,
  quay,
  stopPlace,
  navigateToDetails,
  allowFavouriteSelection,
  addedFavoritesVisibleOnDashboard,
  mode,
}: EstimatedCallItemProps): JSX.Element {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const line = departure.serviceJourney?.line;

  const isTripCancelled = departure.cancellation;

  const lineName = departure.destinationDisplay?.frontText;
  const lineNumber = line?.publicCode;

  const notices = getNoticesForEstimatedCall(departure);
  const {onMarkFavourite, existingFavorite, toggleFavouriteAccessibilityLabel} =
    useOnMarkFavouriteDepartures(
      {...line, lineNumber: lineNumber, lineName: lineName},
      quay,
      stopPlace,
      addedFavoritesVisibleOnDashboard,
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
      <PressableOpacity
        style={styles.actionableItem}
        disabled={!navigateToDetails}
        onPress={
          navigateToDetails && departure?.serviceJourney
            ? () => {
                navigateToDetails(
                  departure.serviceJourney?.id,
                  departure.date,
                  departure.aimedDepartureTime,
                  departure.quay?.id,
                  departure.cancellation,
                );
              }
            : undefined
        }
        accessible={!!navigateToDetails}
        importantForAccessibility={!!navigateToDetails ? 'yes' : 'no'}
        accessibilityHint={
          navigateToDetails
            ? t(DeparturesTexts.a11yViewDepartureDetailsHint)
            : undefined
        }
        accessibilityLabel={
          navigateToDetails
            ? getA11yDeparturesLabel(departure, notices, t, language)
            : undefined
        }
      >
        <View style={styles.estimatedCallItem} testID={testID}>
          <View style={styles.transportInfo}>
            {line && (
              <LineChip
                publicCode={line.publicCode}
                transportMode={line.transportMode}
                transportSubmode={line.transportSubmode}
                icon={
                  mode !== 'Favourite'
                    ? getSvgForMostCriticalSituationOrNotice(
                        departure.situations,
                        notices,
                        departure.cancellation,
                      )
                    : undefined
                }
                testID={testID}
              />
            )}
            <ThemeText style={styles.lineName} testID={testID + 'Name'}>
              {departure.destinationDisplay?.frontText}
            </ThemeText>
          </View>
          {mode === 'Departure' || mode === 'Map' ? (
            <DepartureTime
              isRealtime={departure.realtime}
              isTripCancelled={isTripCancelled}
              expectedTime={departure.expectedDepartureTime}
              aimedTime={departure.aimedDepartureTime}
              testID={testID}
            />
          ) : null}
          {allowFavouriteSelection && (
            <FavouriteDepartureToggle
              existingFavorite={existingFavorite}
              onMarkFavourite={
                mode === 'Departure' ? onMarkFavourite : undefined
              }
              toggleFavouriteAccessibilityLabel={
                mode === 'Departure'
                  ? toggleFavouriteAccessibilityLabel
                  : undefined
              }
            />
          )}
        </View>
      </PressableOpacity>
    </TouchableOpacityOrView>
  );
});

const DepartureTime = ({
  isTripCancelled,
  expectedTime,
  aimedTime,
  testID,
  isRealtime,
}: {
  isTripCancelled: boolean;
  expectedTime: string;
  aimedTime: string;
  testID: string;
  isRealtime: boolean;
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {themeName} = useTheme();

  const timeRepresentationType = getTimeRepresentationType({
    expectedTime: expectedTime,
    aimedTime: aimedTime,
    missingRealTime: !isRealtime,
  });
  const readableExpectedTime = formatToClockOrRelativeMinutes(
    expectedTime,
    language,
    t(dictionary.date.units.now),
  );
  const readableAimedTime = formatLocaleTime(aimedTime, language);
  const ExpectedText = (
    <ThemeText
      type="body__primary--bold"
      testID={testID + 'Time'}
      style={isTripCancelled && styles.strikethrough}
    >
      {readableExpectedTime}
    </ThemeText>
  );
  const RealtimeWithIcon = (
    <View style={styles.realtime}>
      <ThemeIcon
        style={styles.realtimeIcon}
        svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
        size={'small'}
      ></ThemeIcon>
      {ExpectedText}
    </View>
  );
  switch (timeRepresentationType) {
    case 'significant-difference':
      return (
        <View style={styles.delayedRealtime}>
          {RealtimeWithIcon}
          <View style={styles.aimedTimeContainer}>
            <ThemeText
              type="body__tertiary--strike"
              color={'secondary'}
              testID={testID + 'Time'}
              style={styles.aimedTime}
            >
              {readableAimedTime}
            </ThemeText>
          </View>
        </View>
      );
    case 'no-significant-difference':
      return RealtimeWithIcon;
    case 'no-realtime':
      return ExpectedText;
  }
};

function getA11yDeparturesLabel(
  departure: EstimatedCall,
  notices: NoticeFragment[],
  t: TranslateFunction,
  language: Language,
) {
  let a11yDateInfo = '';
  if (departure.expectedDepartureTime) {
    const a11yClockExpected = formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    );
    const a11yClockAimed = formatLocaleTime(
      departure.aimedDepartureTime,
      language,
    );
    const timeRepresentationType = getTimeRepresentationType({
      expectedTime: departure.expectedDepartureTime,
      aimedTime: departure.aimedDepartureTime,
      missingRealTime: !departure.realtime,
    });
    let a11yTimeWithRealtimePrefix;
    switch (timeRepresentationType) {
      case 'significant-difference':
        a11yTimeWithRealtimePrefix =
          t(dictionary.a11yRealTimePrefix) +
          a11yClockExpected +
          ',' +
          t(dictionary.a11yRouteTimePrefix) +
          a11yClockAimed;
        break;
      case 'no-significant-difference':
        a11yTimeWithRealtimePrefix =
          t(dictionary.a11yRealTimePrefix) + a11yClockExpected;
        break;
      case 'no-realtime':
        a11yTimeWithRealtimePrefix =
          t(dictionary.a11yRouteTimePrefix) + a11yClockExpected;
    }
    const parsedDepartureTime = parseISO(departure.expectedDepartureTime);
    const a11yDate = !isToday(parsedDepartureTime)
      ? formatToSimpleDate(parsedDepartureTime, language) + ','
      : '';
    a11yDateInfo = `${a11yDate} ${a11yTimeWithRealtimePrefix}`;
  }

  const a11yWarning = getSituationOrNoticeA11yLabel(
    departure.situations,
    notices,
    departure.cancellation,
    t,
  );

  return `${
    departure.cancellation ? t(CancelledDepartureTexts.message) : ''
  } ${getLineA11yLabel(departure, t)} ${
    a11yWarning ? a11yWarning + ',' : ''
  } ${a11yDateInfo}`;
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
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  icon?: (props: SvgProps) => JSX.Element;
  testID?: string;
};

function LineChip({
  publicCode,
  transportMode,
  transportSubmode,
  icon,
  testID,
}: LineChipProps): JSX.Element {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme} = useTheme();
  const {svg} = getTransportModeSvg(transportMode, transportSubmode);
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
      <ThemeIcon
        fill={transportTextColor}
        style={{marginRight: publicCode ? theme.spacings.small : 0}}
        svg={svg}
      />
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
      {icon && <ThemeIcon svg={icon} style={styles.lineChipIcon} />}
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
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.medium,
    minWidth: '30%',
  },
  realtimeIcon: {
    marginRight: theme.spacings.xSmall,
  },
  lineChip: {
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
    flexDirection: 'row',
  },
  lineChipIcon: {
    position: 'absolute',
    top: -theme.spacings.small,
    left: -theme.spacings.small,
  },
  lineChipText: {
    color: theme.static.background.background_accent_3.text,
    textAlign: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  delayedRealtime: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  realtime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aimedTimeContainer: {
    flexDirection: 'row',
  },
  aimedTime: {
    flexGrow: 1,
    textAlign: 'right',
  },
  warningIcon: {
    marginRight: theme.spacings.small,
  },
}));
