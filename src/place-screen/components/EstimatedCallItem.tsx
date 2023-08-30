import {EstimatedCall} from '@atb/api/types/departures';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {
  AnyMode,
  AnySubMode,
  getTransportModeSvg,
} from '@atb/components/icon-box';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  FavoriteDeparture,
  FavouriteDepartureToggle,
  StoredFavoriteDeparture,
} from '@atb/favorites';
import {StoredType} from '@atb/favorites/storage';
import {
  getSituationOrNoticeA11yLabel,
  getSvgForMostCriticalSituationOrNotice,
} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  CancelledDepartureTexts,
  dictionary,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {
  getNoticesForEstimatedCall,
  getTimeRepresentationType,
} from '@atb/travel-details-screens/utils';
import {
  formatLocaleTime,
  formatToClockOrLongRelativeMinutes,
  formatToClockOrRelativeMinutes,
  formatToSimpleDate,
} from '@atb/utils/date';
import {useFontScale} from '@atb/utils/use-font-scale';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {isToday, parseISO} from 'date-fns';
import React, {memo} from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
  accessibilityLabel: string;
  accessibilityHint: string;
  onPress: (
    departure: EstimatedCall,
    existingFavorite?: StoredFavoriteDeparture,
  ) => void;
  testID: string;
  showFavorite: boolean;
  existingFavorite: StoredType<FavoriteDeparture> | undefined;
  favoriteAccessibilityLabel?: string;
  onPressFavorite?: (
    departure: EstimatedCall,
    existing?: StoredFavoriteDeparture,
  ) => void;
  showNotices?: boolean;
};

export const EstimatedCallItem = memo(
  ({
    departure,
    accessibilityLabel,
    accessibilityHint,
    onPress,
    testID,
    showFavorite,
    existingFavorite,
    favoriteAccessibilityLabel,
    onPressFavorite,
    showNotices,
  }: EstimatedCallItemProps): JSX.Element => {
    const styles = useStyles();

    const linePublicCode = departure.serviceJourney.line.publicCode;
    const transportMode = departure.serviceJourney.line.transportMode;
    const transportSubmode = departure.serviceJourney.line.transportSubmode;
    const aimedTime = departure.aimedDepartureTime;
    const expectedTime = departure.expectedDepartureTime;
    const isRealtime = departure.realtime;

    return (
      <PressableOpacity
        onPress={() => onPress(departure, existingFavorite)}
        style={styles.container}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <View style={styles.estimatedCallItem} testID={testID}>
          <View style={styles.transportInfo}>
            {(linePublicCode || transportMode) && (
              <LineChip
                publicCode={linePublicCode}
                transportMode={transportMode}
                transportSubmode={transportSubmode}
                icon={
                  showNotices
                    ? getSvgForMostCriticalSituationOrNotice(
                        departure.situations,
                        getNoticesForEstimatedCall(departure),
                        departure.cancellation,
                      )
                    : undefined
                }
                testID={testID}
              />
            )}
            <ThemeText style={styles.lineName} testID={testID + 'Name'}>
              {departure.destinationDisplay?.frontText ?? ''}
            </ThemeText>
          </View>
          {aimedTime && expectedTime && isRealtime !== undefined ? (
            <DepartureTime
              isRealtime={isRealtime}
              isTripCancelled={departure.cancellation}
              expectedTime={expectedTime}
              aimedTime={aimedTime}
              testID={testID}
            />
          ) : null}
          {showFavorite && (
            <FavouriteDepartureToggle
              existingFavorite={existingFavorite}
              onMarkFavourite={
                onPressFavorite
                  ? () => onPressFavorite(departure, existingFavorite)
                  : undefined
              }
              toggleFavouriteAccessibilityLabel={favoriteAccessibilityLabel}
            />
          )}
        </View>
      </PressableOpacity>
    );
  },
  (prev, next) => {
    if (prev.departure.serviceJourney.id !== next.departure.serviceJourney.id)
      return false;
    if (
      prev.departure.expectedDepartureTime !==
      next.departure.expectedDepartureTime
    )
      return false;
    if (prev.departure.aimedDepartureTime !== next.departure.aimedDepartureTime)
      return false;
    if (prev.accessibilityLabel !== next.accessibilityLabel) return false;
    if (prev.accessibilityHint !== next.accessibilityHint) return false;
    if (prev.onPress !== next.onPress) return false;
    if (prev.showFavorite !== next.showFavorite) return false;
    if (prev.existingFavorite?.id !== next.existingFavorite?.id) return false;
    if (prev.favoriteAccessibilityLabel !== next.favoriteAccessibilityLabel)
      return false;
    if (prev.onPressFavorite !== next.onPressFavorite) return false;
    if (prev.showNotices !== next.showNotices) return false;
    return true;
  },
);

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

export function getA11yDeparturesLabel(
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

type LineChipProps = {
  publicCode?: string;
  transportMode?: AnyMode;
  transportSubmode?: AnySubMode;
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
    transportMode,
    transportSubmode,
  );
  const transportTextColor = useTransportationColor(
    transportMode,
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
