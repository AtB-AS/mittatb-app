import {EstimatedCall} from '@atb/api/types/departures';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  FavouriteDepartureToggle,
  StoredFavoriteDeparture,
} from '@atb/favorites';
import {
  getSituationOrNoticeA11yLabel,
  getSvgForMostCriticalSituationOrNotice,
} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  CancelledDepartureTexts,
  DeparturesTexts,
  dictionary,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {getNoticesForEstimatedCall} from '@atb/travel-details-screens/utils';
import {
  formatLocaleTime,
  formatToClockOrLongRelativeMinutes,
  formatToClockOrRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';
import {useFontScale} from '@atb/utils/use-font-scale';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import React, {memo} from 'react';
import {View} from 'react-native';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {isDefined} from '@atb/utils/presence';
import {StopPlacesMode} from '@atb/nearby-stop-places';

export type EstimatedCallItemProps = {
  secondsUntilDeparture: number;
  mode: StopPlacesMode;
  departure: EstimatedCall;
  existingFavorite?: StoredFavoriteDeparture;
  onPressDetails: (departure: EstimatedCall) => void;
  onPressFavorite: (
    departure: EstimatedCall,
    existingFavorite?: StoredFavoriteDeparture,
  ) => void;
  showBottomBorder: boolean;
  testID?: string;
};

export const EstimatedCallItem = memo(
  ({
    departure,
    mode,
    onPressDetails,
    onPressFavorite,
    existingFavorite,
    showBottomBorder,
  }: EstimatedCallItemProps): JSX.Element => {
    const styles = useStyles();
    const {t, language} = useTranslation();
    const testID = 'estimatedCallItem';

    const onPress =
      mode === 'Favourite'
        ? () => onPressFavorite(departure, existingFavorite)
        : () => onPressDetails(departure);

    const a11yLabel =
      mode === 'Favourite'
        ? getLineA11yLabel(departure, t)
        : getLineAndTimeA11yLabel(departure, t, language);

    const a11yHint =
      mode === 'Favourite'
        ? t(DeparturesTexts.a11yMarkFavouriteHint)
        : t(DeparturesTexts.a11yViewDepartureDetailsHint);

    return (
      <GenericClickableSectionItem
        radius={showBottomBorder ? 'bottom' : undefined}
        onPress={onPress}
        accessible={true}
        accessibilityLabel={a11yLabel}
        accessibilityHint={a11yHint}
      >
        <View style={styles.container} testID={testID}>
          <View style={styles.estimatedCallItem}>
            <View style={styles.transportInfo}>
              <LineChip departure={departure} mode={mode} testID={testID} />
              <ThemeText style={styles.lineName} testID={`${testID}FrontText`}>
                {departure.destinationDisplay?.frontText}
              </ThemeText>
            </View>
            {mode !== 'Favourite' && <DepartureTime departure={departure} />}
            {mode !== 'Map' && (
              <FavouriteDepartureToggle
                existingFavorite={existingFavorite}
                onMarkFavourite={() =>
                  onPressFavorite(departure, existingFavorite)
                }
              />
            )}
          </View>
        </View>
      </GenericClickableSectionItem>
    );
  },
  (prev, next) => {
    const prevMinutesUntilDeparture = prev.secondsUntilDeparture % 60;
    const nextMinutesUntilDeparture = next.secondsUntilDeparture % 60;
    if (
      nextMinutesUntilDeparture < 10 &&
      prevMinutesUntilDeparture !== nextMinutesUntilDeparture
    ) {
      // Rerender the item if the relative departure time is changed
      return false;
    }

    if (prev.departure.situations.length !== next.departure.situations.length)
      return false;
    if (prev.existingFavorite?.id !== next.existingFavorite?.id) return false;
    if (prev.showBottomBorder !== next.showBottomBorder) return false;
    if (
      prev.departure.expectedDepartureTime !==
      next.departure.expectedDepartureTime
    )
      return false;
    if (
      prev.departure.destinationDisplay?.frontText !==
      next.departure.destinationDisplay?.frontText
    )
      return false;
    if (prev.departure.realtime !== next.departure.realtime) return false;
    if (prev.departure.cancellation !== next.departure.cancellation)
      return false;
    return true;
  },
);

const DepartureTime = ({departure}: {departure: EstimatedCall}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {themeName} = useTheme();

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {departure.realtime && (
          <ThemeIcon
            style={styles.realtimeIcon}
            svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
            size={'small'}
          />
        )}
        <ThemeText
          type="body__primary--bold"
          style={departure.cancellation && styles.strikethrough}
        >
          {formatToClockOrRelativeMinutes(
            departure.expectedDepartureTime,
            language,
            t(dictionary.date.units.now),
          )}
        </ThemeText>
      </View>
      {isMoreThanOneMinuteDelayed(departure) && (
        <ThemeText
          type="body__tertiary--strike"
          color={'secondary'}
          style={styles.aimedTime}
        >
          {formatLocaleTime(departure.aimedDepartureTime, language)}
        </ThemeText>
      )}
    </View>
  );
};

export function getLineAndTimeA11yLabel(
  departure: EstimatedCall,
  t: TranslateFunction,
  language: Language,
) {
  return [
    departure.cancellation ? t(CancelledDepartureTexts.message) : undefined,
    getLineA11yLabel(departure, t),
    getSituationOrNoticeA11yLabel(
      departure.situations,
      getNoticesForEstimatedCall(departure),
      departure.cancellation,
      t,
    ),
    departure.realtime
      ? t(dictionary.a11yRealTimePrefix)
      : t(dictionary.a11yRouteTimePrefix),
    formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    ),
    isMoreThanOneMinuteDelayed(departure)
      ? t(dictionary.a11yRouteTimePrefix) +
        formatLocaleTime(departure.aimedDepartureTime, language)
      : undefined,
  ]
    .filter(isDefined)
    .join(screenReaderPause);
}

export function getLineA11yLabel(
  departure: EstimatedCall,
  t: TranslateFunction,
) {
  const line = departure.serviceJourney?.line;
  const a11yLine = line?.publicCode
    ? `${t(DeparturesTexts.line)} ${line?.publicCode},`
    : '';
  const a11yFrontText = departure.destinationDisplay?.frontText
    ? `${departure.destinationDisplay?.frontText}.`
    : '';
  return `${a11yLine} ${a11yFrontText}`;
}

function LineChip({
  departure,
  mode,
  testID = '',
}: Pick<EstimatedCallItemProps, 'departure' | 'mode' | 'testID'>) {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme} = useTheme();
  const {publicCode, transportMode, transportSubmode} =
    departure.serviceJourney.line;
  const {svg} = getTransportModeSvg(transportMode, transportSubmode);
  const transportColor = useTransportationColor(
    transportMode,
    transportSubmode,
  );
  const transportTextColor = useTransportationColor(
    transportMode,
    transportSubmode,
    'text',
  );

  const icon =
    mode !== 'Favourite' &&
    getSvgForMostCriticalSituationOrNotice(
      departure.situations,
      getNoticesForEstimatedCall(departure),
      departure.cancellation,
    );

  if (!publicCode && !transportMode) return null;

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
          type="body__primary--bold"
          testID={`${testID}PublicCode`}
        >
          {publicCode}
        </ThemeText>
      )}
      {icon && <ThemeIcon svg={icon} style={styles.lineChipIcon} />}
    </View>
  );
}

const isMoreThanOneMinuteDelayed = (departure: EstimatedCall) =>
  secondsBetween(
    departure.aimedDepartureTime,
    departure.expectedDepartureTime,
  ) >= 60;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  strikethrough: {textDecorationLine: 'line-through'},
  realtimeAndText: {flexDirection: 'row', alignItems: 'center'},
  realtime: {flexDirection: 'row', alignItems: 'center'},
  aimedTime: {textAlign: 'right'},
  warningIcon: {marginRight: theme.spacings.small},
}));
